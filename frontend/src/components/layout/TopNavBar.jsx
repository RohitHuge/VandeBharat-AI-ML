import React from 'react';

const TopNavBar = () => {
  return (
    <header className="bg-surface/70 dark:bg-surface-container-highest/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin h-16">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-primary text-2xl icon-fill">train</span>
        <h1 className="text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
          AI Railway Inspection System
        </h1>
      </div>
      
      <div className="flex-1 max-w-md mx-8 flex items-center bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
        <input 
          className="bg-transparent border-none outline-none w-full text-body-compact text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 p-0" 
          placeholder="Search track IDs, defect logs..." 
          type="text"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button className="hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        
        {/* <button className="bg-gradient-to-b from-primary to-[#004ca3] text-on-primary text-title-sm font-semibold px-6 py-2 rounded-lg shadow-sm border-t border-white/20 hover:shadow-md transition-all active:scale-95 duration-200">
          Live Monitor
        </button> */}
        
        <img 
          alt="Inspector Profile" 
          className="w-10 h-10 rounded-full border-2 border-outline-variant/30 object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKB07pGhsjuOy_ymqkZyKxX_0ytGegG47ypw4ehL3XYxsqqe4shstdvX2OH1O8ahkX4bOD0r6e_pcVrNdIP3U8vA8H-YnTEa9dg2HDb-kUlG8olkQNNqK40TvIdJsioUMmfTlTSgWsUBBHPKdgYV5fMGumtOd9Nkls1PsMRnYvX0PiG4-NGBex5AXKMfDaJf0T2dkqaKf-THWPFlJcJaJXCc7aVoh07ezNHUlND1vItLyOMkhRxO3Vrx6D8jcB4ilfIcZ3QOksILU"
        />
      </div>
    </header>
  );
};

export default TopNavBar;
