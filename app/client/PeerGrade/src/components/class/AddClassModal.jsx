import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const AddClassModal = ({ show, onClose, onAddClass }) => {
    const [classname, setClassname] = useState('');
    const [description, setDescription] = useState('');
    const [term, setTerm] = useState('');
    const [size, setSize] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onAddClass({
        classname,
        description,
        term,
        size: parseInt(size, 10),
      });
      onClose();
    };
  
    if (!show) {
      return null;
    }
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Add a New Class</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <input
                type="text"
                value={classname}
                onChange={(e) => setClassname(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Term</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">Add Class</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddClassModal;
