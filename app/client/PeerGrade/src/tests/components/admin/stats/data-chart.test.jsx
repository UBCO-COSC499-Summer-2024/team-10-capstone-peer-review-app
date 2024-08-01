import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataChart from '@/components/admin/stats/data-chart';
import { subMonths, format } from 'date-fns';
import userEvent from '@testing-library/user-event';

const mockData = [
  { role: 'ADMIN', dateCreated: format(subMonths(new Date(), 1), 'yyyy-MM-dd') },
  { role: 'USER', dateCreated: format(subMonths(new Date(), 2), 'yyyy-MM-dd') },
  { role: 'USER', dateCreated: format(subMonths(new Date(), 13), 'yyyy-MM-dd') },
];

const filterTypes = ['All', 'Admin', 'User'];

describe('DataChart Component', () => {
  test('renders correctly with given props', () => {
    render(<DataChart data={mockData} title="Test Chart" xAxisLabel="Date" yAxisLabel="Count" filterTypes={filterTypes} />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText(filterTypes[0])).toBeInTheDocument();
  });

//   test('filters data by user type and date', async () => {       // TODO: Test doesn't work
//     render(<DataChart data={mockData} title="Test Chart" xAxisLabel="Date" yAxisLabel="Count" filterTypes={filterTypes} />);

//     // Open the Select dropdown
//     const selectTrigger = screen.getByRole('combobox', { type: 'button' });
//     userEvent.click(selectTrigger);

//     // Wait for and select 'User'
//     const userOption = await screen.findByText('User');
//     userEvent.click(userOption);

//     // Check if the filtered data is correct
//     const filteredData = screen.getAllByText(/202[0-9]-[0-9]{2}/);
//     expect(filteredData.length).toBe(1); // Only one user within the last 12 months
//   });

  test('switches between line and bar charts', () => {
    render(<DataChart data={mockData} title="Test Chart" xAxisLabel="Date" yAxisLabel="Count" filterTypes={filterTypes} />);
    
    // Initially, the line chart should be visible
    expect(screen.getByText('Line Chart')).toBeInTheDocument();
    
    // Switch to bar chart
    userEvent.click(screen.getByText('Bar Chart'));
    expect(screen.getByText('Bar Chart')).toBeInTheDocument();
  });
});
