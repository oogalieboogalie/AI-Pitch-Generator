
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Pitch Generator. Built for brilliant ideas.</p>
      </div>
    </footer>
  );
};

export default Footer;
