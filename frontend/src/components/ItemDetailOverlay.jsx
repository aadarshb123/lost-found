import React, { useState, useCallback } from 'react';
import MessageModal from './MessageModal';
import './ItemDetailOverlay.css';

const ItemDetailOverlay = ({ item, onClose, onOpenChat }) => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const handleBackdropClick = useCallback((e) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target.className === 'overlay-backdrop') {
      onClose();
    }
  }, [onClose]);

  const handleMessageModalClose = (shouldOpenChat) => {
    setIsMessageModalOpen(false);
    if (shouldOpenChat) {
      onOpenChat();
    }
  };

  if (!item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="overlay-backdrop" onClick={handleBackdropClick}>
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
          onClose={handleMessageModalClose}
        />
      )}
    </div>
  );
};

export default ItemDetailOverlay; 