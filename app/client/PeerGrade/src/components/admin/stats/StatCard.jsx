import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <Card className="w-full p-4 bg-white shadow-md rounded-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-600">{title}</CardTitle>
        {Icon && <Icon className="w-6 h-6 text-gray-400" />}
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <div className="text-3xl font-bold text-black">{value}</div>
        <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">{subtitle}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
