import React, { useEffect, useRef, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from "@/components/ui/Button";
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

const pdfviewer = ({ url }) => {
  const canvasRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1); // State to keep track of current page number
  const [numPages, setNumPages] = useState(null); // State to store the total number of pages
  const [inputPageNumber, setInputPageNumber] = useState(pageNumber); // State to store input page number

  useEffect(() => {
    let renderTask = null;
  
    const loadPdf = async () => {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages); // Set the total number of pages
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
  
      // Check if canvas and its context are defined
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
  
          // Cancel the previous render task if it exists
          if (renderTask) {
            renderTask.cancel();
            await renderTask.promise.catch(() => {}); // Ignore errors from cancellation
          }
  
          // Start a new render task
          renderTask = page.render(renderContext);
          await renderTask.promise;
        }
      }
    };
  
    loadPdf();
  
    return () => {
      // Cancel ongoing render task on cleanup
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [url, pageNumber, canvasRef.current]); // Reload PDF when URL or pageNumber changes
  

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
    if (value < 1) {
      setInputPageNumber(1);
    } else if (value > numPages) {
      // Doesn't change input box value if input is greater than total number of pages
    }
    else {
      setInputPageNumber(value);
    }
  };

  const goToPage = () => {
    if (isNaN(inputPageNumber)) {
      setInputPageNumber(pageNumber);
      return;
    }
    const pageNum = parseInt(inputPageNumber);
    if (pageNum >= 1 && pageNum <= numPages) {
      setPageNumber(pageNum);
      setInputPageNumber(pageNum);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} className="w-full max-w-md mx-auto"></canvas>
      <div className='w-full flex justify-between items-center flex-row p-3'>
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

export default pdfviewer;
