import { MessageSquare, Settings, Plus } from 'lucide-react';

interface SidebarProps {
  currentView: 'chat' | 'settings';
  onChangeView: (view: 'chat' | 'settings') => void;
  onNewReqt: () => void;
}

export function Sidebar({ currentView, onChangeView, onNewReqt }: SidebarProps) {
  return (
    <aside className="sidebar glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
          LLM TestGen
        </h2>
        <button className="icon-btn" onClick={() => { onChangeView('chat'); onNewReqt(); }} title="New Requirement" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Plus size={18} />
        </button>
      </div>
      
      <div className="history" style={{ flex: 1, marginTop: '20px' }}>
        <div className="history-item" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Login Page API Tests</div>
        <div className="history-item" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>User Profile E2E Tests</div>
      </div>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <button 
          className={`nav-item ${currentView === 'chat' ? 'active' : ''}`} 
          onClick={() => onChangeView('chat')}
          style={{ 
            background: 'transparent', border: 'none', 
            color: currentView === 'chat' ? 'var(--accent-color)' : 'var(--text-muted)', 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', 
            cursor: 'pointer', textAlign: 'left', fontWeight: currentView === 'chat' ? '500' : 'normal'
          }}
        >
          <MessageSquare size={18} /> Test Generator
        </button>
        <button 
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} 
          onClick={() => onChangeView('settings')}
          style={{ 
            background: 'transparent', border: 'none', 
            color: currentView === 'settings' ? 'var(--accent-color)' : 'var(--text-muted)', 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', 
            cursor: 'pointer', textAlign: 'left', fontWeight: currentView === 'settings' ? '500' : 'normal'
          }}
        >
          <Settings size={18} /> API Settings
        </button>
      </div>
    </aside>
  );
}
