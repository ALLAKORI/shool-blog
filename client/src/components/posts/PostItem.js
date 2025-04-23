import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PostContext from '../../context/post/postContext';
import AuthContext from '../../context/auth/authContext';

const PostItem = ({ post }) => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  
  const { deletePost } = postContext;
  const { isAuthenticated, user } = authContext;
  
  const { _id, title, content, date, author, image } = post;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate content for preview
  const truncateContent = (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(_id);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>
          <LinkContainer to={`/posts/${_id}`}>
            <a href={`/posts/${_id}`} className="text-decoration-none">{title}</a>
          </LinkContainer>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Posted by {author ? author.name : 'Unknown User'} on {formatDate(date)}
        </Card.Subtitle>

        {/* Affichage de l'image du post si elle existe */}
        {image && (
          <Card.Img variant="top" src={image} alt={title} className="mb-3" />
        )}
        
        <Card.Text>
          {truncateContent(content)}
        </Card.Text>
        
        <LinkContainer to={`/posts/${_id}`}>
          <Button variant="primary" size="sm" className="me-2">Read More</Button>
        </LinkContainer>

        {isAuthenticated && user && author && author._id === user._id && (
          <Button onClick={onDelete} variant="danger" size="sm">
            <i className="fas fa-trash"></i> Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired
};

export default PostItem;
