import { useState, useEffect } from 'react';
import { X, Save, Activity } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [provider, setProvider] = useState('ollama');
  const [endpoint, setEndpoint] = useState('http://localhost:11434');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemma3:4b');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('llm_config');
    if (saved) {
      const config = JSON.parse(saved);
      setProvider(config.provider || 'ollama');
      setEndpoint(config.endpoint || 'http://localhost:11434');
      setApiKey(config.apiKey || '');
      setModel(config.model || 'gemma3:4b');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('llm_config', JSON.stringify({ provider, endpoint, apiKey, model }));
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('Testing...');
    try {
      const res = await fetch('http://localhost:3001/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: { provider, endpoint, apiKey, model } })
      });
      const data = await res.json();
      setTestStatus(data.message);
    } catch (err: any) {
      setTestStatus('Connection failed: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>LLM Provider Settings</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <h3>Configuration</h3>
            <div className="form-group">
              <label>Provider</label>
              <select className="glass-input" value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="ollama">Ollama (Local)</option>
                <option value="lmstudio">LM Studio (Local)</option>
                <option value="groq">Groq (Cloud)</option>
                <option value="openai">OpenAI (Cloud)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Model Name</label>
              <input type="text" className="glass-input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gemma3:4b" />
            </div>

            {(provider === 'ollama' || provider === 'lmstudio') && (
              <div className="form-group">
                <label>Endpoint</label>
                <input type="text" className="glass-input" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
              </div>
            )}

            {(provider === 'groq' || provider === 'openai') && (
              <div className="form-group">
                <label>API Key</label>
                <input type="password" className="glass-input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." />
              </div>
            )}
          </div>
          
          {testStatus && (
            <div className="text-muted" style={{ padding: '0 24px', fontSize: '0.85rem' }}>
              {testStatus}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="glass-button outline text-warning" onClick={handleTestConnection}>
            <Activity size={16} /> Test Connection
          </button>
          <button className="glass-button primary" onClick={handleSave}>
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
