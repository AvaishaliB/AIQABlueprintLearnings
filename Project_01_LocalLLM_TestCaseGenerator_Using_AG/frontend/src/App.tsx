import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { SettingsView } from './components/SettingsView'

function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'settings'>('chat')
  
  const initialMessages = [
    {
      role: 'bot' as const,
      content: 'Welcome to Local LLM Test Generator'
    }
  ];

  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>(initialMessages);

  const handleNewReqt = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      <Sidebar currentView={currentView} onChangeView={setCurrentView} onNewReqt={handleNewReqt} />
      {currentView === 'chat' ? (
        <ChatArea messages={messages} setMessages={setMessages} />
      ) : (
        <SettingsView />
      )}
    </>
  )
}

export default App
