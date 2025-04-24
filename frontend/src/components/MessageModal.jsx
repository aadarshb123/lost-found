import React, { useState } from 'react';
import { startItemConversation } from '../utils/api';
import './MessageModal.css';

const MessageModal = ({ itemId, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setError('');

    try {
      await startItemConversation(itemId, message);
      onClose(true);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="message-modal">
      <div className="message-modal-content">
        <button className="close-button" onClick={() => onClose(false)}>×</button>
        <h3>Send Message to Item Owner</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows="4"
            disabled={isSending}
          />
          
          <button 
            type="submit" 
            className="send-button"
            disabled={isSending || !message.trim()}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal; 