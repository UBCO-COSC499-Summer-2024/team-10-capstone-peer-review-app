import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PDFViewer = ({ url, scale = 1 }) => {
  // Check if the URL is a PDF
  const isPDF = url && url.toLowerCase().endsWith('.pdf' || '.PDF');

  // Create an instance of the modified toolbar plugin
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar, renderDefaultToolbar } = toolbarPluginInstance;
  const transform = (slots) => {
    return {
        ...slots,
        // Set to null or return empty fragment to exclude specific components
        Open: () => null,
    };
  };

  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {renderDefaultToolbar(transform)}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: (defaultTabs) => [],
  });

  const height = 750 * scale + 'px';

  const handleDownload = () => {
		const link = document.createElement("a");
		link.href = url;
    link.download = "";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

  if (!isPDF) {
    return (
      <div className='flex items-center justify-center rounded-lg p-4'>
        <Button onClick={() => handleDownload()}>
            <Download className="h-4 w-4 mr-1" />
            Download Assignment
        </Button>
      </div>
    );
  }

  return (
    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
      <div style={{ height: height }} className='w-full'>
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]} // Enables the cool new view for the PDF
          theme="dark"
        />
      </div>
    </Worker>
  );
};

export default PDFViewer;
