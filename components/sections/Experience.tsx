
import React from 'react';
import { EXPERIENCES } from '../../constants';

const Experience: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-indigo-400 pb-2">
        Professional Experience
      </h2>
      <div className="space-y-8">
        {EXPERIENCES.map((exp, index) => (
          <div key={index}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-cyan-300">{exp.role}</h3>
              <p className="text-sm text-slate-400">{exp.duration}</p>
            </div>
            <p className="text-lg text-slate-200">{exp.company}</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300">
              {exp.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
