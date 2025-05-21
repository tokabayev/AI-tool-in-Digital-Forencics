import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} <span className="text-white font-semibold">Media Analysis</span>. All rights reserved.</p>
        <p className="text-xs mt-2">Empowering safety through intelligent media analysis.</p>
      </div>
    </footer>
  );
}

export default Footer;
