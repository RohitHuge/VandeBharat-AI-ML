import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-main antialiased">
      <TopNavBar />
      <div className="flex">
        <SideNavBar />
        <main className="ml-[280px] mt-[64px] p-gutter w-full min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
