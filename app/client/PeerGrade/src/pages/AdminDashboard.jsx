// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import Overview from '@/components/admin/Overview';
import Users from '@/components/admin/Users';
import Classes from '@/components/admin/Classes';
import Assignments from '@/components/admin/Assign';
import PeerReviews from '@/components/admin/PRassign';
import Interactions from '@/components/admin/Interactions';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('stats');

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <Users />;
      case 'classes':
        return <Classes />;
      case 'assignments':
        return <Assignments />;
      case 'peer-reviews':
        return <PeerReviews />;
      case 'interactions':
        return <Interactions />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="main-container mx-auto p-6">
      <Menubar>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('overview')}>Overview</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('users')}>Users</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('classes')}>Classes</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('assignments')}>Assignments</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('peer-reviews')}>Peer-reviews</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
        <MenubarTrigger onClick={() => setSelectedTab('interactions')}>Interactions</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
