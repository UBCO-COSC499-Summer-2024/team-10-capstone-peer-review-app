import { useEffect, useRef, useState, useCallback } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from "@/components/ui/button";
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

const PDFViewer = ({ url, scale = 1 }) => {
  const canvasRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [inputPageNumber, setInputPageNumber] = useState(pageNumber);

  const renderPage = useCallback(async (page, viewport, canvas, context) => {
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;
  }, []);

  const loadPdf = useCallback(async () => {
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    setNumPages(pdf.numPages); // Set the number of pages to those of the PDF

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;

    // Check if canvas and its context are defined
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before rendering
        await renderPage(page, viewport, canvas, context);
      }
    }
  }, [url, pageNumber, scale, renderPage]);

  useEffect(() => {
    loadPdf();
  }, [url, pageNumber, scale, loadPdf]);

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setInputPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      setInputPageNumber(pageNumber + 1);
    }
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setInputPageNumber(1);
    } else if (value > numPages) {
      setInputPageNumber(numPages);
    } else {
      setInputPageNumber(value);
    }
  };

  const goToPage = () => {
    const pageNum = parseInt(inputPageNumber);
    if (pageNum >= 1 && pageNum <= numPages) {
      setPageNumber(pageNum);
    }
  };

  return (
    <div className='flex justify-center items-center flex-col'>
      <canvas ref={canvasRef} className="w-full mx-auto rounded-md"></canvas>
      <div className='w-full flex justify-between items-center flex-row p-3 max-w-sm'>
        <Button variant="outline" onClick={goToPreviousPage} disabled={pageNumber === 1}>Previous</Button>
        {numPages !== null && (
          <div>
            <input
              type="number"
              value={inputPageNumber}
              onChange={handleInputChange}
              onBlur={goToPage}
              className="border border-gray-300 rounded-md p-1 mr-2 appearance-none hide-arrows"
              style={{ width: `${(numPages.toString().length || 1) + 1}ch` }}
            />
            / {numPages}
          </div>
        )}
        <Button variant="outline" onClick={goToNextPage} disabled={pageNumber === numPages}>Next</Button>
      </div>
    </div>
  );
};

export default PDFViewer;
