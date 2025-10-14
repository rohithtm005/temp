
import React from 'react';
import { EDUCATION_HISTORY, CERTIFICATIONS } from '../../constants';

const Education: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-indigo-400 pb-2">
        Education
      </h2>
      <div className="space-y-6 mb-10">
        {EDUCATION_HISTORY.map((edu, index) => (
          <div key={index}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-cyan-300">{edu.institution}</h3>
              <p className="text-sm text-slate-400">{edu.duration}</p>
            </div>
            <p className="text-lg text-slate-200">{edu.degree}</p>
            {edu.details && <p className="text-md text-slate-300 italic">{edu.details}</p>}
            <p className="text-md text-slate-300">{edu.grade}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-indigo-400 pb-2">
        Certifications
      </h2>
      <div className="space-y-4">
        {CERTIFICATIONS.map((cert, index) => (
          <div key={index}>
             <p className="text-lg text-slate-200">{cert.name} - <span className="text-cyan-400">{cert.issuer}</span> {cert.status && <span className="italic text-slate-400 text-sm">({cert.status})</span>}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
