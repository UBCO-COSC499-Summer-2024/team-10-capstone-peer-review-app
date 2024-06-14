import { render, fireEvent } from '@testing-library/react';
import Groups from '@/pages/classNav/Groups';

// Mock the groupsData
jest.mock('../lib/data', () => ({
  groupsData: [
    {
      id: '1',
      name: 'Group 1',
      members: [
        { id: '1', name: 'Member 1' },
        { id: '2', name: 'Member 2' },
      ],
    },
    {
      id: '2',
      name: 'Group 2',
      members: [
        { id: '3', name: 'Member 3' },
        { id: '4', name: 'Member 4' },
      ],
    },
  ],
}));

describe('Groups', () => {
  it('renders without crashing', () => {
    render(<Groups />);
  });

  it('filters groups based on search term', () => {
    const { getByPlaceholderText, queryByText } = render(<Groups />);
    const searchInput = getByPlaceholderText('Search groups');

    // Initially, both groups should be visible
    expect(queryByText('Group 1')).toBeInTheDocument();
    expect(queryByText('Group 2')).toBeInTheDocument();

    // When we type 'Group 1' into the search box, only 'Group 1' should be visible
    fireEvent.change(searchInput, { target: { value: 'Group 1' } });
    expect(queryByText('Group 1')).toBeInTheDocument();
    expect(queryByText('Group 2')).not.toBeInTheDocument();
  });
});
