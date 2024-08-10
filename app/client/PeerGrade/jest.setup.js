// jest.setup.js
import '@testing-library/jest-dom/';

// Mocking window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

window.scrollTo = jest.fn();

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}

global.IntersectionObserver = IntersectionObserver;