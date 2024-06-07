// src/components/AssignmentRow.jsx
import React from 'react';
import { Button } from "@/components/ui/button";

function AssignmentRow({ name, className, dueDate }) {
  return (
    <div className="flex items-center gap-5 p-2 justify-between border border-gray-200">
      <div>
        <div className="font-medium text-lg">{name}</div>
        <div className="text-sm text-gray-500">{className}</div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-sm text-gray-500 "><p className='p-4 bg-red-100 rounded-full'>{dueDate}</p></div>
        <Button variant="ghost">
            <p className='p-4 bg-blue-100 rounded-full'>OPEN</p>
        </Button>
      </div>
    </div>
  );
}

export default AssignmentRow;