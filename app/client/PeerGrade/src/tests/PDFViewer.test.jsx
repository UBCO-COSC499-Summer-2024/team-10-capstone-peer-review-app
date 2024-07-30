import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PDFViewer from '@/components/assign/PDFViewer';

describe('PDFViewer Component', () => {
  test('renders download button for non-PDF URL', () => {
    render(<PDFViewer url="https://example.com/document.txt" />);
    const downloadButton = screen.getByText(/Download Assignment/i);
    expect(downloadButton).toBeInTheDocument();
  });

  test('renders PDF viewer for PDF URL', () => {
    render(<PDFViewer url="https://example.com/document.pdf" />);
    expect(screen.queryByText('Download Assignment')).toBeNull();
  });
});