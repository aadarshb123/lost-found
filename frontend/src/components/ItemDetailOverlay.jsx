import React, { useState } from 'react';
import MessageModal from './MessageModal';
import './ItemDetailOverlay.css';

const ItemDetailOverlay = ({ item, onClose }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  if (!item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="overlay-backdrop">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="item-details">
          <h2>{item.type === 'lost' ? 'Lost Item' : 'Found Item'}</h2>
          
          <div className="detail-row">
            <strong>Description:</strong>
            <p>{item.description}</p>
          </div>

          <div className="detail-row">
            <strong>Category:</strong>
            <p>{item.category}</p>
          </div>

          <div className="detail-row">
            <strong>Date:</strong>
            <p>{formatDate(item.date)}</p>
          </div>

          <div className="detail-row">
            <strong>Location:</strong>
            <p>{item.location.building}</p>
          </div>

          <div className="detail-row">
            <strong>Status:</strong>
            <p>{item.status}</p>
          </div>

          <button 
            className="message-button"
            onClick={() => setIsMessageModalOpen(true)}
          >
            Message Owner
          </button>
        </div>
      </div>

      {isMessageModalOpen && (
        <MessageModal
          itemId={item._id}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ItemDetailOverlay; 