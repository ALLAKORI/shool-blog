import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext';

const ChatPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      content: message,
      user: user._id
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      const data = await response.json();
      setMessages([data, ...messages]); // Ajoute le nouveau message
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chat</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <ListGroup>
            {messages.map(msg => (
              <ListGroup.Item key={msg._id}>
                <strong>{msg.user.name}</strong>: {msg.content}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {isAuthenticated && (
            <Form onSubmit={handleSubmit} className="mt-3">
              <Form.Control
                type="text"
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" variant="primary" className="mt-2">
                Send
              </Button>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default ChatPage;
