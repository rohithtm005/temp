
import React from 'react';
import { PROFILE_SUMMARY } from '../../constants';

const About: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-indigo-400 pb-2">
        Profile Summary
      </h2>
      <p className="text-xl leading-relaxed text-slate-200">
        {PROFILE_SUMMARY}
      </p>
    </div>
  );
};

export default About;
