import { useState, useEffect } from 'react';

export function SettingsView() {
  const [providerConfigs, setProviderConfigs] = useState({
    ollamaUrl: 'http://localhost:11434',
    groqKey: '',
    openaiKey: '',
    claudeKey: '',
    activeProvider: 'ollama'
  });
  const [testStatuses, setTestStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('llm_configs');
    if (saved) {
      setProviderConfigs(JSON.parse(saved));
    } else {
      const oldSaved = localStorage.getItem('llm_config');
      if (oldSaved) {
        const old = JSON.parse(oldSaved);
        setProviderConfigs(prev => ({
          ...prev,
          ollamaUrl: old.provider === 'ollama' ? old.endpoint : prev.ollamaUrl,
          openaiKey: old.provider === 'openai' ? old.apiKey : prev.openaiKey,
          groqKey: old.provider === 'groq' ? old.apiKey : prev.groqKey,
          activeProvider: old.provider || 'ollama'
        }));
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('llm_configs', JSON.stringify(providerConfigs));
    localStorage.setItem('llm_config', JSON.stringify({
      provider: providerConfigs.activeProvider,
      endpoint: providerConfigs.ollamaUrl,
      apiKey: providerConfigs.activeProvider === 'groq' ? providerConfigs.groqKey : 
              providerConfigs.activeProvider === 'openai' ? providerConfigs.openaiKey : 
              providerConfigs.claudeKey,
      model: providerConfigs.activeProvider === 'ollama' ? 'gemma3:4b' : ''
    }));
    alert('Settings saved successfully!');
  };

  const handleTest = async (provider: string) => {
    setTestStatuses(prev => ({ ...prev, [provider]: 'Testing...' }));
    try {
      const res = await fetch('http://localhost:3001/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          endpoint: providerConfigs.ollamaUrl,
          apiKey: provider === 'groq' ? providerConfigs.groqKey : 
                  provider === 'openai' ? providerConfigs.openaiKey : 
                  providerConfigs.claudeKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestStatuses(prev => ({ ...prev, [provider]: 'Success' }));
      } else {
        setTestStatuses(prev => ({ ...prev, [provider]: 'Failed' }));
      }
    } catch (e) {
      setTestStatuses(prev => ({ ...prev, [provider]: 'Error' }));
    }
  };

  return (
    <main className="settings-main">
      <div className="settings-panel glass-panel">
        <div className="settings-header-row">
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>LLM Provider Settings</h2>
            <p className="subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure your local and cloud AI providers here.</p>
          </div>
          <button className="save-btn" onClick={handleSave}>Save Settings</button>
        </div>

        <div className="settings-body">
           <div className="provider-row">
             <label className="provider-label">Ollama API URL</label>
             <div className="input-group">
               <input 
                 type="text" 
                 className="settings-input" 
                 value={providerConfigs.ollamaUrl} 
                 onChange={e => setProviderConfigs({...providerConfigs, ollamaUrl: e.target.value})}
               />
               <button className="test-btn" onClick={() => handleTest('ollama')}>Test</button>
             </div>
             {testStatuses['ollama'] && <span className="status-text">{testStatuses['ollama']}</span>}
           </div>

           <div className="provider-row">
             <label className="provider-label">Groq API Key</label>
             <div className="input-group">
               <input 
                 type="password" 
                 className="settings-input" 
                 value={providerConfigs.groqKey}
                 placeholder="gsk_..."
                 onChange={e => setProviderConfigs({...providerConfigs, groqKey: e.target.value})}
               />
               <button className="test-btn" onClick={() => handleTest('groq')}>Test</button>
             </div>
             {testStatuses['groq'] && <span className="status-text">{testStatuses['groq']}</span>}
           </div>

           <div className="provider-row">
             <label className="provider-label">OpenAI API Key</label>
             <div className="input-group">
               <input 
                 type="password" 
                 className="settings-input" 
                 value={providerConfigs.openaiKey}
                 placeholder="sk-..."
                 onChange={e => setProviderConfigs({...providerConfigs, openaiKey: e.target.value})}
               />
               <button className="test-btn" onClick={() => handleTest('openai')}>Test</button>
             </div>
             {testStatuses['openai'] && <span className="status-text">{testStatuses['openai']}</span>}
           </div>

           <div className="provider-row">
             <label className="provider-label">Anthropic Claude API Key</label>
             <div className="input-group">
               <input 
                 type="password" 
                 className="settings-input" 
                 value={providerConfigs.claudeKey}
                 placeholder="sk-ant-..."
                 onChange={e => setProviderConfigs({...providerConfigs, claudeKey: e.target.value})}
               />
               <button className="test-btn" onClick={() => handleTest('claude')}>Test</button>
             </div>
             {testStatuses['claude'] && <span className="status-text">{testStatuses['claude']}</span>}
           </div>

           <div className="provider-row" style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
             <label className="provider-label">Active Generation Provider</label>
             <div className="input-group">
               <select 
                 className="settings-input" 
                 value={providerConfigs.activeProvider} 
                 onChange={e => setProviderConfigs({...providerConfigs, activeProvider: e.target.value})}
               >
                 <option value="ollama">Ollama</option>
                 <option value="groq">Groq</option>
                 <option value="openai">OpenAI</option>
                 <option value="claude">Claude</option>
               </select>
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}
