import React from 'react';
import { UsersIcon, AcademicCapIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import StatCard from '@/components/admin/stats/StatCard';
import ProgressTable from './stats/ProgressTable';

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const values = [3000, 6000, 4500, 3000, 1500, 2000, 3500, 2500, 4000, 3200, 5000, 5500];

const Overview = () => {
  const users = generateRandomNumber(50, 100);
  const students = generateRandomNumber(30, 50);
  const instructors = generateRandomNumber(2, 5);
  const classes = generateRandomNumber(20, 50);
  const deactivatedClasses = generateRandomNumber(5, 15);
  const assignments = generateRandomNumber(100, 200);
  const peerReviews = generateRandomNumber(200, 400);

  return (
    <div className='flex flex-col'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <StatCard 
          title="Users" 
          value={users} 
          subtitle={`Students - ${students}\nInstructors - ${instructors}`} 
          icon={UsersIcon} 
        />
        <StatCard 
          title="Classes" 
          value={classes} 
          subtitle={`Classes deactivated - ${deactivatedClasses}`} 
          icon={AcademicCapIcon} 
        />
        <StatCard 
          title="Assignments" 
          value={assignments} 
          subtitle={`Assignments completed - ${generateRandomNumber(50, assignments)}`} 
          icon={DocumentTextIcon} 
        />
        <StatCard 
          title="Peer Reviews" 
          value={peerReviews} 
          subtitle={`Reviews completed - ${generateRandomNumber(100, peerReviews)}`} 
          icon={ChatBubbleLeftRightIcon} 
        />
        </div>
      <div>
        <ProgressTable
          title="Overview"
          values={values}
          xAxisLabel="Month"
          yAxisLabel="Revenue"
          chartType="bar"
        />
      </div>
    </div>
  );
};

export default Overview;
