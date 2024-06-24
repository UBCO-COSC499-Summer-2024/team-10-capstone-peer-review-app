// src/pages/AdminDashboard.jsx
import React from 'react';
import Overview from '@/components/admin/Overview';
import Users from '@/components/admin/Users';
import Search from './Search';
import Assignments from '@/components/admin/Assign';
import Interactions from '@/components/admin/Interactions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PRassign from '@/components/admin/PRassign';

const AdminDashboard = () => {
  return (
    <div className="main-container">
      <Tabs defaultValue="overview ">
        <TabsList className="w-auto flex mb-5 ">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="peer-reviews">Peer-reviews</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="classes">
          <Search />
        </TabsContent>
        <TabsContent value="assignments">
          <Assignments />
        </TabsContent>
        <TabsContent value="peer-reviews">
          <PRassign />
        </TabsContent>
        <TabsContent value="interactions">
          <Interactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
