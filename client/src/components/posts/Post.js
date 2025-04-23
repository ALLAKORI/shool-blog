import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import CommentContext from '../../context/comment/commentContext';
import PostContext from '../../context/post/postContext';

const Post = ({ post }) => {
  const authContext = useContext(AuthContext);
  const commentContext = useContext(CommentContext);
  const postContext = useContext(PostContext);
  
  const { isAuthenticated, user } = authContext;
  const { comments } = commentContext;
  const { deletePost, likePost, unlikePost } = postContext;

  const { _id, title, content, date, author, likes, image } = post;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get comment count for this post
  const commentCount = comments.filter(comment => comment.post === _id).length;
  
  // Check if the current user has liked this post
  const hasLiked = user && likes ? likes.some(like => like.user === user._id) : false;
  
  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(_id);
    }
  };
  
  const onLike = () => {
    if (hasLiked) {
      unlikePost(_id);
    } else {
      likePost(_id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative p-6">
        {isAuthenticated && user && author && user._id === author._id && (
          <button 
            onClick={onDelete}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
        
        <Link to={`/posts/${_id}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600">{title}</h2>
        </Link>

        {/* Affichage de l'image si elle existe */}
        {image && (
          <img src={image} alt={title} className="w-full h-64 object-cover mb-4" />
        )}
        
        <div className="prose prose-sm max-w-none text-gray-700 mb-4">
          <p>{content.length > 200 ? content.substring(0, 200) + '...' : content}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-2">
              {author && author.name ? author.name.charAt(0).toUpperCase() : '?'}
            </div>
            <span>{author ? author.name : 'Unknown'}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button 
                onClick={onLike} 
                className={`flex items-center space-x-1 ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <i className={`${hasLiked ? 'fas' : 'far'} fa-heart`}></i>
                <span>{likes ? likes.length : 0}</span>
              </button>
            )}
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;
