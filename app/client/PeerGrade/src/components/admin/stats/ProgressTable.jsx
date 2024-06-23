import React from 'react';
// import { Line, Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProgressTable = ({ title, values, xAxisLabel, yAxisLabel, chartType }) => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: yAxisLabel,
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
        beginAtZero: true,
      },
    },
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <Card className="w-full p-4 bg-white shadow-md rounded-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ChartComponent data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTable;
