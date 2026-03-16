import type { Request, Response } from 'express';
import axios from 'axios';

export interface ProviderConfig {
  provider: 'ollama' | 'lmstudio' | 'groq' | 'openai' | 'claude' | 'gemini';
  endpoint?: string;
  apiKey?: string;
  model: string;
}

export interface TestConnectionReq {
  config: ProviderConfig;
}

export interface GenerateReq {
  config: ProviderConfig;
  jiraRequirement: string;
}

const SYSTEM_PROMPT = `You are an expert QA Engineer. 
A user will provide a Jira Software Requirement. 
Your task is to analyze it and generate comprehensive Functional and Non-Functional Test Cases for both Web Applications and APIs.
Strictly format your output as a Markdown block specifically tailored for Jira, including:
- Jira Ticket Summary
- TC-ID, Description, Pre-conditions, Steps, Expected Results.
Do NOT output any conversational text. Only output the test cases.`;

export const testConnection = async (req: Request<{}, {}, TestConnectionReq>, res: Response) => {
  const { config } = req.body;
  try {
    if (config.provider === 'ollama') {
      const url = `${config.endpoint || 'http://localhost:11434'}/api/version`;
      const response = await axios.get(url, { timeout: 3000 });
      res.json({ success: true, message: `Connected to Ollama version: ${response.data.version}` });
    } 
    else if (config.provider === 'lmstudio') {
      const url = `${config.endpoint || 'http://localhost:1234'}/v1/models`;
      const response = await axios.get(url, { timeout: 3000 });
      res.json({ success: true, message: 'Connected to LM Studio successfully.', models: response.data.data });
    }
    else if (config.provider === 'groq') {
      await axios.get('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey}` }
      });
      res.json({ success: true, message: 'Connected to Groq API successfully.' });
    }
    else if (config.provider === 'openai') {
      await axios.get('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey}` }
      });
      res.json({ success: true, message: 'Connected to OpenAI API successfully.' });
    }
    else {
      res.status(400).json({ success: false, message: 'Unsupported provider or connection test not implemented.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Connection failed.' });
  }
};

export const generateTestCases = async (req: Request<{}, {}, GenerateReq>, res: Response) => {
  if (!req.body || !req.body.config || !req.body.jiraRequirement) {
    res.status(400).json({ success: false, message: 'Invalid request body' });
    return;
  }

  const { config, jiraRequirement } = req.body;
  try {
    const greetingRegex = /^(hi|hello|hey|hiya|howdy)[\s\W]*$/i;
    if (greetingRegex.test(jiraRequirement.trim())) {
      console.log('Detected greeting, sending conversational response...');
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write(`data: ${JSON.stringify({ text: "Hello! How are you? How can I help you today?" })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    console.log(`Generating test cases for requirement: ${jiraRequirement.substring(0, 50)}...`);

    if (config.provider === 'ollama') {
      const url = `${config.endpoint || 'http://localhost:11434'}/api/generate`;
      const payload = {
        model: config.model || 'gemma3:4b',
        prompt: `${SYSTEM_PROMPT}\n\nUser Requirement:\n${jiraRequirement}`,
        stream: true
      };
      
      try {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });

        console.log('Connecting to Ollama stream...');
        const response = await axios.post(url, payload, { responseType: 'stream' });
        let backendBuffer = '';
        response.data.on('data', (chunk: Buffer) => {
          backendBuffer += chunk.toString();
          const lines = backendBuffer.split('\n');
          backendBuffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                res.write(`data: ${JSON.stringify({ text: parsed.response })}\n\n`);
              }
            } catch (e) {
              console.error('Ollama chunk parse error:', e);
            }
          }
        });
        
        response.data.on('end', () => {
          res.write('data: [DONE]\n\n');
          res.end();
        });
        
        response.data.on('error', (err: any) => {
           res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
           res.end();
        });

      } catch (ollamaErr: any) {
        throw new Error(`Ollama Error: ${ollamaErr.message}`);
      }
    }
    else if (['groq', 'openai', 'lmstudio'].includes(config.provider)) {
      let baseUrl = '';
      if (config.provider === 'groq') baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
      if (config.provider === 'openai') baseUrl = 'https://api.openai.com/v1/chat/completions';
      if (config.provider === 'lmstudio') baseUrl = `${config.endpoint || 'http://localhost:1234'}/v1/chat/completions`;

      const headers: any = { 'Content-Type': 'application/json' };
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

      try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const response = await axios.post(baseUrl, {
          model: config.model,
          stream: true,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: jiraRequirement }
          ]
        }, { headers, responseType: 'stream' });
        
        let backendBuffer = '';
        response.data.on('data', (chunk: Buffer) => {
          backendBuffer += chunk.toString();
          const lines = backendBuffer.split('\n');
          backendBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            if (trimmedLine.startsWith('data: ')) {
               try {
                 const data = trimmedLine.replace('data: ', '');
                 if (data === '[DONE]') continue;
                 const parsed = JSON.parse(data);
                 const text = parsed.choices[0]?.delta?.content || '';
                 if (text) {
                   res.write(`data: ${JSON.stringify({ text })}\n\n`);
                 }
               } catch(e) {}
            }
          }
        });

        response.data.on('end', () => {
          res.write('data: [DONE]\n\n');
          res.end();
        });
        
        response.data.on('error', (err: any) => {
           res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
           res.end();
        });
      } catch (err: any) {
         throw new Error(`API Error: ${err.message}`);
      }
    }
    else {
      res.status(400).json({ success: false, message: 'Provider not yet fully implemented for generation.' });
      return;
    }

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Generation failed.' });
  }
};
