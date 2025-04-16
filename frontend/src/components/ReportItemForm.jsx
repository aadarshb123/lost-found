import React, { useState, useRef, useEffect } from 'react';
import './ReportItemForm.css';

const ReportItemForm = ({ onSubmit, selectedLocation, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'lost',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other',
    status: 'open'
  });
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      location: selectedLocation
    });
  };

  return (
    <div className="report-form-container">
      <div className="report-form" ref={formRef}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide detailed description of the item..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Date {formData.type === 'lost' ? 'Lost' : 'Found'}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={selectedLocation.building}
              disabled
              className="location-display"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportItemForm; 