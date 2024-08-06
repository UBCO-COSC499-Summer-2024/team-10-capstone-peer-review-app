import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ViewAllReviews from '@/pages/ViewAllReviews';
import reviewAPI from '@/api/reviewApi';
import { useUser } from '@/contexts/contextHooks/useUser';
import { toast } from '@/components/ui/use-toast';

jest.mock('@/api/reviewApi');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/components/ui/use-toast');

const mockUser = {
  user: { role: 'STUDENT' },
};

const mockInstructorReview = {
  data: {
    reviewer: { firstname: 'John', lastname: 'Doe' },
    criterionGrades: [{ grade: 80 }],
    submission: {
      assignment: {
        rubric: { totalMarks: 100 },
      },
    },
  },
};

const mockPeerReviews = {
  data: [
    {
      reviewer: { firstname: 'Jane', lastname: 'Smith' },
      criterionGrades: [{ grade: 70 }],
      submission: {
        assignment: {
          isPeerReviewAnonymous: false,
          rubric: { totalMarks: 100 },
        },
      },
    },
  ],
};

describe('ViewAllReviews Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue(mockUser);
    reviewAPI.getInstructorReview.mockResolvedValue(mockInstructorReview);
    reviewAPI.getPeerReviews.mockResolvedValue(mockPeerReviews);
    toast.mockImplementation(jest.fn());
  });

  it('renders correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Review Details')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays instructor review', async () => {
    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Instructor Review from John Doe')).toBeInTheDocument();
    });
  });

  it('fetches and displays peer reviews', async () => {
    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Peer Review from Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles errors correctly', async () => {
    reviewAPI.getInstructorReview.mockRejectedValue(new Error('Failed to fetch'));
    reviewAPI.getPeerReviews.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to fetch',
        variant: 'destructive',
      });
    });
  });

  it('calculates and displays grade summary correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/reviews/1']}>
        <Routes>
          <Route path="/reviews/:submissionId" element={<ViewAllReviews />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Instructor Grade')).toBeInTheDocument();
      expect(screen.getByText('80.00%')).toBeInTheDocument();
      expect(screen.getByText('Average Peer Grade')).toBeInTheDocument();
      expect(screen.getByText('70.00%')).toBeInTheDocument();
    });
  });
});