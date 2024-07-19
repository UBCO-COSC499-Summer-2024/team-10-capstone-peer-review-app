import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/contextHooks/useUser";
import { toast } from "@/components/ui/use-toast";

const Grades = ({ classId }) => {


  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center mb-2 bg-muted p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold">Class Grades</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className='text-center text-gray-500 text-sm'> No grades were found. You're safe!</div>
      </CardContent>
    </Card>
  );
};

export default Grades;