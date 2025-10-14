
import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ title, children }) => {
  return (
    <div className="w-[95vw] max-w-4xl h-[70vh] max-h-[700px] bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
      {/* Title Bar */}
      <div className="flex-shrink-0 h-10 bg-slate-700/60 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-grow text-center text-sm font-medium text-slate-200">
          {title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-6 overflow-y-auto text-slate-100">
        {children}
      </div>
    </div>
  );
};

export default Window;
