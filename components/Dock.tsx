import React from 'react';
import { DOCK_ITEMS } from '../constants';
import type { SectionId } from '../types';

interface DockProps {
  activeSection: SectionId;
  setActiveSection: (sectionId: SectionId) => void;
}

const Dock: React.FC<DockProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2">
      <ul className="flex items-end h-16 p-2 space-x-2 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
        {DOCK_ITEMS.map((item) => (
          <li key={item.id} className="relative group">
            <button
              onClick={() => setActiveSection(item.id)}
              className="w-12 h-12 transition-transform duration-200 ease-in-out hover:scale-150 hover:-translate-y-3 focus:outline-none"
              aria-label={item.label}
            >
              {item.icon}
            </button>
            {activeSection === item.id && (
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs font-semibold rounded-md opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 whitespace-nowrap">
               {item.label}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Dock;