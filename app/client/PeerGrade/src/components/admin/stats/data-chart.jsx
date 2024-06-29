import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { subMonths, format } from 'date-fns';

const DataChart = ({ data, title, xAxisLabel, yAxisLabel, filterTypes }) => {
  const [chartType, setChartType] = useState('line');
  const [userType, setUserType] = useState(filterTypes[0]);

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by user type
    if (userType !== 'All') {
      filtered = filtered.filter(user => user.role === userType.toUpperCase());
    }

    // Filter by time period (last 12 months)
    const now = new Date();
    const startDate = subMonths(now, 12);

    filtered = filtered.filter(user => new Date(user.dateCreated) >= startDate);

    // Format data for chart
    const formattedData = filtered.reduce((acc, user) => {
      const date = format(new Date(user.dateCreated), 'yyyy-MM');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {});

    return Object.keys(formattedData).map(date => ({
      date,
      count: formattedData[date],
    }));
  }, [data, userType]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex items-center justify-between mb-4">
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger>
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            {filterTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: xAxisLabel, position: 'insideBottomRight', offset: 0 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="bar">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: xAxisLabel, position: 'insideBottomRight', offset: 0 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataChart;
