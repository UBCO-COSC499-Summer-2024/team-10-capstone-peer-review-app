// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { Menubar, MenubarList, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar';
import Stats from '@/components/admin/Stats';
import Users from '@/components/admin/Users';
import Classes from '@/components/admin/Classes';
import Assignments from '@/components/admin/Assignments';
import PeerReviews from '@/components/admin/PeerReviews';
import Interactions from '@/components/admin/Interactions';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('stats');

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'stats':
        return <Stats />;
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
        return <Stats />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Menubar>
        <MenubarList>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('stats')}>Stats</MenubarTrigger>
          </MenubarItem>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('users')}>Users</MenubarTrigger>
          </MenubarItem>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('classes')}>Classes</MenubarTrigger>
          </MenubarItem>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('assignments')}>Assignments</MenubarTrigger>
          </MenubarItem>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('peer-reviews')}>Peer-reviews</MenubarTrigger>
          </MenubarItem>
          <MenubarItem>
            <MenubarTrigger onClick={() => setSelectedTab('interactions')}>Interactions</MenubarTrigger>
          </MenubarItem>
        </MenubarList>
      </Menubar>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
