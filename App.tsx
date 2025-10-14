import React, { useState, useEffect } from 'react';
import Dock from './components/Dock';
import Window from './components/Window';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';
import { DOCK_ITEMS } from './constants';
import type { SectionId } from './types';


const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isWindowVisible, setWindowVisible] = useState(false);

  const currentTitle = DOCK_ITEMS.find(item => item.id === activeSection)?.label || 'Portfolio';

  const handleSectionChange = (sectionId: SectionId) => {
    setWindowVisible(false);
    setTimeout(() => {
      setActiveSection(sectionId);
      setWindowVisible(true);
    }, 300); // Corresponds to the fade-out duration
  };

  useEffect(() => {
    // Initial fade-in
    const timer = setTimeout(() => setWindowVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'experience':
        return <Experience />;
      case 'projects':
        return <Projects />;
      case 'education':
        return <Education />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80')"}}>
      <div className={`transition-opacity duration-300 ${isWindowVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Window title={currentTitle}>
          {renderSection()}
        </Window>
      </div>

      <Dock activeSection={activeSection} setActiveSection={handleSectionChange} />
    </div>
  );
};

export default App;