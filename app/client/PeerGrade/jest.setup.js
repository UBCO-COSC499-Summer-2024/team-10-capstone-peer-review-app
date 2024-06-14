// jest.setup.js
import '@testing-library/jest-dom/';
// setupTests.js or a similar setup file
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  