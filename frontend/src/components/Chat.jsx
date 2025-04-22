import React, { useState, useEffect, useRef } from 'react';
import { getConversations, getMessages, sendMessage } from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';
import './Chat.css';

const Chat = ({ onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = connectSocket();

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      if (selectedConversation && 
          (message.senderId === selectedConversation.userId || 
           message.receiverId === selectedConversation.userId)) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update conversations list with new message
      setConversations(prev => prev.map(conv => {
        if (conv.userId === message.senderId || conv.userId === message.receiverId) {
          return {
            ...conv,
            lastMessage: message
          };
        }
        return conv;
      }));
    });

    // Initial fetch
    fetchConversations();

    // Cleanup
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await getMessages(userId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const data = await sendMessage(selectedConversation.userId, newMessage);
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      
      // Update the last message in conversations list
      setConversations(prev => prev.map(conv => {
        if (conv.userId === selectedConversation.userId) {
          return {
            ...conv,
            lastMessage: data
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-overlay">
      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-top-bar">
          <h2>Messages</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-main-content">
          <div className="conversations-list">
            {isLoading ? (
              <div className="loading-state">Loading conversations...</div>
            ) : conversations.length > 0 ? (
              conversations.map(conv => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-info">
                    <h3>{conv.name}</h3>
                    {conv.lastMessage && (
                      <p className="last-message">
                        {conv.lastMessage.text.substring(0, 50)}
                        {conv.lastMessage.text.length > 50 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <p>No conversations yet</p>
                <p className="hint">Start a conversation by clicking "Message Owner" on an item</p>
              </div>
            )}
          </div>

          <div className="chat-area">
            {selectedConversation ? (
              <>
                <div className="chat-header">
                  <h3>{selectedConversation.name}</h3>
                </div>
                
                <div className="messages-container">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === localStorage.getItem('userId');
                    const showTimestamp = index === 0 || 
                      new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000;

                    return (
                      <div key={message._id || index}>
                        {showTimestamp && (
                          <div className="message-timestamp">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className={`message ${isCurrentUser ? 'sent' : 'received'}`}>
                          <div className="message-content">
                            <p>{message.text}</p>
                            <span className="message-time">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="message-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit">Send</button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 