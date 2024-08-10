import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoButton from '@/components/global/InfoButton';

describe('InfoButton Component', () => {
  const mockContent = {
    title: 'Info Title',
    description: 'This is a description',
  };

  it('renders the InfoButton correctly', () => {
    render(<InfoButton content={mockContent} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the dialog when the button is clicked', () => {
    render(<InfoButton content={mockContent} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Info Title')).toBeInTheDocument();
  });

  it('displays the correct content in the dialog', () => {
    render(<InfoButton content={mockContent} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('closes the dialog when the "Got it" button is clicked', () => {
    render(<InfoButton content={mockContent} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Got it'));
    expect(screen.queryByText('Info Title')).not.toBeInTheDocument();
  });
});