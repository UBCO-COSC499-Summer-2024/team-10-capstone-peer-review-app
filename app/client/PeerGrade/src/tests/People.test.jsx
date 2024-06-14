import { render, fireEvent } from '@testing-library/react';
import People from '@/pages/classNav/People';

// Mock the peopleData
jest.mock('../lib/data', () => ({
  peopleData: {
    instructors: [
      { id: '1', name: 'Instructor 1' },
      { id: '2', name: 'Instructor 2' },
    ],
    students: [
      { id: '3', name: 'Student 1' },
      { id: '4', name: 'Student 2' },
    ],
  },
}));

describe('People', () => {
  it('renders without crashing', () => {
    render(<People />);
  });

  it('filters instructors and students based on search term', () => {
    const { getByPlaceholderText, queryByText } = render(<People />);
    const searchInput = getByPlaceholderText('Search people');

    // Initially, all instructors and students should be visible
    expect(queryByText('Instructor 1')).toBeInTheDocument();
    expect(queryByText('Student 1')).toBeInTheDocument();

    // When we type 'Instructor 1' into the search box, only 'Instructor 1' should be visible
    fireEvent.change(searchInput, { target: { value: 'Instructor 1' } });
    expect(queryByText('Instructor 1')).toBeInTheDocument();
    expect(queryByText('Instructor 2')).not.toBeInTheDocument();
    expect(queryByText('Student 1')).not.toBeInTheDocument();
    expect(queryByText('Student 2')).not.toBeInTheDocument();
  });
});
