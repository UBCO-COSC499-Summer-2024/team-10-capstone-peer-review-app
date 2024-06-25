import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import PeerReview from '@/pages/PeerReview';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock assignmentsData and classesData for testing
jest.mock('@/utils/dbData', () => ({
    assignment: [
      {
        assignment_id: 1,
        evaluation_type: 'peer',
        class_id: 1,
        title: 'Assignment 1',
        description: 'Description 1',
        due_date: new Date(),
      },
      {
        assignment_id: 2,
        evaluation_type: 'peer',
        class_id: 2,
        title: 'Assignment 2',
        description: 'Description 2',
        due_date: new Date(),
      },
      {
        assignment_id: 3,
        evaluation_type: 'peer',
        class_id: 1,
        title: 'Assignment 3',
        description: 'Description 3',
        due_date: new Date(),
      },
    ],
    iClass: [
      { class_id: 1, classname: 'Class A' },
      { class_id: 2, classname: 'Class B' },
    ],
    submission: [
      {
        submission_id: 1,
        assignment_id: 1,
        student_id: 1, // foreign key of user id
        file_path: "path/to/file1.pdf",
        submission_date: new Date(2025, 2, 13),
        feedback: "Good work!",
        marks: 90
      },
      {
        submission_id: 2,
        assignment_id: 2,
        student_id: 2, // foreign key of user id
        file_path: "path/to/file2.pdf",
        submission_date: new Date(2025, 2, 14),
        feedback: "Well done!",
        marks: 85
      },
      {
        submission_id: 3,
        assignment_id: 1,
        student_id: 3, // foreign key of user id
        file_path: "path/to/file3.pdf",
        submission_date: new Date(2025, 2, 15),
        feedback: "Great effort!",
        marks: 88
      },
    ],
    PeerReview: [
      {
        review_id: 1,
        submission_id: 1,
        reviewer_id: 2, // foreign key of user id
        review: "Well done!",
        review_date: new Date(2025, 2, 20),
        rating: 5
      },
      {
        review_id: 2,
        submission_id: 2,
        reviewer_id: 1, // foreign key of user id
        review: "Needs more details.",
        review_date: new Date(2025, 2, 21),
        rating: 3
      },
      {
        review_id: 3,
        submission_id: 3,
        reviewer_id: 1, // foreign key of user id
        review: "Good effort.",
        review_date: new Date(2025, 2, 22),
        rating: 4
      },
    ],
  }));
  
  
  describe('PeerReview component', () => {
    beforeEach(() => {
      render(
        <Router>
            <PeerReview />
        </Router>
      );
    });
  
    it('renders Peer Review title correctly', () => {
      expect(screen.getByText('Peer Reviews')).toBeInTheDocument();
    });
  
    it('renders filter dropdown with correct initial text', () => {
      expect(screen.getByText('Filter by class')).toBeInTheDocument();
    });
  
    it('displays assignment cards', () => {
      expect(screen.getByText('Assignment 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Assignment 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  
    // it('allows switching between document and list view', () => {
    //     // TODO
    // });
  
    // it('filters assignments by class', async () => {
    //   fireEvent.click(screen.getByText('Filter by class'));
    //   console.log(document.body.innerHTML);
    //   const classOption = await screen.getByRole('button', { name: 'Class A' });
    //   fireEvent.click(classOption);
    //   const filteredAssignmentTitle = screen.getByText('Class A: Assignment 1');
    //   expect(filteredAssignmentTitle).toBeInTheDocument();
    // });
    // TODO: SHOULD WORK BUT I DONT KNOW WHY ITS NOT WORKINGGAGAKJNDKJASNJKD
  
    it('searches assignments by title or class name', () => {
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Assignment 1' } });
      expect(screen.getByText('Assignment 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.queryByText('Assignment 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Assignment 2')).not.toBeInTheDocument();
    });
  
    // it('navigates to assignment details when "Open" link is clicked', async () => {
    //     const openLink = screen.getAllByText('Open')[0];
    //     fireEvent.click(openLink);
      
    //     // Wait for the new page to load
    //     await waitFor(() => screen.getByText('Comment Box'));
      
    //     // Now you can make assertions about the new page
    //     expect(screen.queryByText("Peer Reviews")).not.toBeInTheDocument();
    //   });
      
  });
  