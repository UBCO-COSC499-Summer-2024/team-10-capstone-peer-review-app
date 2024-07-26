import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ url, scale = 1 }) => {

  // Create an instance of the modified toolbar plugin
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar, renderDefaultToolbar } = toolbarPluginInstance;
  const transform = (slots) => {
    // Exclude elements by returning null for them
    return {
        ...slots,
        // Set to null or return empty fragment to exclude specific components
        Open: () => null,
        // Add any other components you want to exclude here
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
