import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { filesData } from '../../../../../../team-10-capstone-peer-review-app-70-instructor_assignment_creation_ui/app/client/PeerGrade/src/lib/data';
import Files from '@/pages/classNav/Files';

jest.mock('../lib/data', () => ({
  filesData: [
    { classId: '1', name: 'File1', type: 'pdf', uploadedDate: '2024-06-13' },
    { classId: '1', name: 'File2', type: 'doc', uploadedDate: '2024-06-14' },
  ],
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
      classId: '1',
    }),
  }));

describe('Files Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Router>
        <Files />
      </Router>
    );

    // Check for header
    expect(getByText('Class Files')).toBeInTheDocument();

    // Check for file names
    expect(getByText('File1')).toBeInTheDocument();
    expect(getByText('File2')).toBeInTheDocument();
  });
});
