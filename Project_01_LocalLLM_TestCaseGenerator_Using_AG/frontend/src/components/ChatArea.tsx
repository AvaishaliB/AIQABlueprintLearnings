import { useState } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatAreaProps {
  messages: {role: 'user' | 'bot', content: string}[];
  setMessages: React.Dispatch<React.SetStateAction<{role: 'user' | 'bot', content: string}[]>>;
}

export function ChatArea({ messages, setMessages }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('ollama');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    // We add the user message to the UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const saved = localStorage.getItem('llm_configs');
      const configs = saved ? JSON.parse(saved) : {};
      
      const config = {
        provider: selectedProvider,
        endpoint: selectedProvider === 'ollama' ? (configs.ollamaUrl || 'http://localhost:11434') : '',
        apiKey: selectedProvider === 'groq' ? configs.groqKey : 
                selectedProvider === 'openai' ? configs.openaiKey : 
                selectedProvider === 'claude' ? configs.claudeKey : '',
        model: selectedProvider === 'ollama' ? 'gemma3:4b' : 
               selectedProvider === 'groq' ? 'llama3-70b-8192' : 
               selectedProvider === 'openai' ? 'gpt-4o' : 'claude-3-opus'
      };

      // Initialize empty bot message that will be populated via stream
      setMessages(prev => [...prev, { role: 'bot', content: '' }]);

      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, jiraRequirement: userMsg })
      });

      if (!res.ok) throw new Error('API Request Failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No stream available');

      let currentReply = '';
      let buffer = '';

      const processLines = (text: string, isLast: boolean = false) => {
        buffer += text;
        const lines = buffer.split('\n');
        buffer = isLast ? '' : (lines.pop() || '');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          const dataStr = trimmedLine.replace('data: ', '').trim();
          if (dataStr === '[DONE]') {
            setLoading(false);
            continue;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              currentReply += parsed.text;
              setMessages(prev => {
                const newMsgs = [...prev];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg && lastMsg.role === 'bot') {
                  lastMsg.content = currentReply;
                }
                return newMsgs;
              });
            } else if (parsed.error) {
              currentReply += '\nError: ' + parsed.error;
              setMessages(prev => {
                const newMsgs = [...prev];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg && lastMsg.role === 'bot') {
                  lastMsg.content = currentReply;
                }
                return newMsgs;
              });
            }
          } catch (e) {
            console.error('SSE Parse Error:', e, dataStr);
          }
        }
      };
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          processLines('', true);
          break;
        }
        processLines(decoder.decode(value, { stream: true }));
      }
    } catch (err: any) {
      setLoading(false);
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection Error: ' + err.message }]);
    }
  };

  return (
    <main className="chat-area">
      <div className="chat-messages">
        {messages.map((msg, i) => {
          if (i === 0 && msg.role === 'bot') {
            return (
              <div key={i} className="centered-pill-message">
                {msg.content}
              </div>
            );
          }

          return (
            <div key={i} className={`message-bubble ${msg.role} animate-fade-in`}>
              <div className="avatar">
                {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="content">
                {msg.role === 'bot' && i > 0 ? (
                  <div className="markdown-body text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
                {msg.role === 'bot' && i > 0 && (
                  <button 
                    className="glass-button text-sm mt-3" 
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.05)' }}
                  >
                    Copy Format
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="message-bubble bot animate-fade-in">
            <div className="avatar"><Bot size={20} /></div>
            <div className="content flex items-center gap-2 text-muted">
              Generating Test Cases...
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-wrapper">
        <div className="input-header-row">
          <span className="input-label">Requirements</span>
          <select 
            className="model-dropdown"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="ollama">Ollama (Local)</option>
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
          </select>
        </div>
        <div className="input-container-box">
          <textarea 
            className="clean-input" 
            placeholder="Ask here or paste TC for Requirement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="input-footer">
            <button className="generate-btn" onClick={handleSend} disabled={loading}>
              Generate Test Cases
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
