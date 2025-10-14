
import React from 'react';
import { PROJECT_CATEGORIES } from '../../constants';

const Projects: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-indigo-400 pb-2">
        Projects & Works
      </h2>
      <div className="space-y-10">
        {PROJECT_CATEGORIES.map((category, index) => (
          <div key={index}>
            <h3 className="text-2xl font-semibold text-cyan-300">{category.title}</h3>
            <p className="text-sm italic text-slate-400 mb-4">{category.meta}</p>
            <div className="space-y-6">
              {category.projects.map((project, pIndex) => (
                <div key={pIndex}>
                  <h4 className="text-lg font-medium text-slate-100">{project.title}</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-slate-300">
                    {project.description.map((desc, dIndex) => (
                      <li key={dIndex}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
