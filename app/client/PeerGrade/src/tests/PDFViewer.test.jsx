import { render, fireEvent, act } from '@testing-library/react';
import PDFViewer from '@/components/assign/PDFViewer';

// Mock pdfjs
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 10,
      getPage: () => ({
        getViewport: () => ({
          width: 500,
          height: 500,
        }),
        render: () => ({
          promise: Promise.resolve(),
          cancel: jest.fn(),
        }),
      }),
    }),
  }),
}));

describe('PDFViewer', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(<PDFViewer url="test.pdf" scale={1} />);
    
    // Wait for useEffect to complete
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
  });

  it('handles page navigation', async () => {
    const { getByText, getByDisplayValue } = render(<PDFViewer url="test.pdf" scale={1} />);
    
    // Wait for useEffect to complete
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.click(getByText('Next'));
    expect(getByDisplayValue('2')).toBeInTheDocument();
  
    fireEvent.click(getByText('Previous'));
    expect(getByDisplayValue('1')).toBeInTheDocument();
  });
});
