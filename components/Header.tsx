
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          AI Pitch Generator
        </h1>
        <p className="text-brand-light mt-1">
            Answer the Twelve Questions to a Good Pitch with the power of AI.
        </p>
      </div>
    </header>
  );
};

export default Header;
