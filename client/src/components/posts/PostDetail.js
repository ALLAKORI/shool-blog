import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PostContext from '../../context/post/postContext';
import AuthContext from '../../context/auth/authContext';
import Comments from '../comments/Comments';
import Spinner from '../layout/Spinner';

const PostDetail = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const { getPost, current, loading, deletePost, clearCurrent, likePost, unlikePost } = postContext;
  const { isAuthenticated, user } = authContext;
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id);

    // Clear current post when component unmounts
    return () => {
      clearCurrent();
    };
    // eslint-disable-next-line
  }, [id]);

  if (loading || !current) {
    return <Spinner />;
  }

  const { title, content, date, author, likes, imageUrl, summary } = current;

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

  // Check if the current user has liked this post
  const hasLiked = user && likes ? likes.some(like => like.user === user._id) : false;

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      navigate('/');
    }
  };
  
  const onLike = () => {
    if (hasLiked) {
      unlikePost(id);
    } else {
      likePost(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {isAuthenticated && user && author && author._id === user._id && (
          <button
            onClick={onDelete}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
        
        <div className="p-6">
          {/* Affichage de l'image du post */}
          {imageUrl && (
            <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded-lg mb-4" />
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
          
          {/* Affichage du résumé (Summary) */}
          {summary && (
            <p className="text-gray-600 mb-6">{summary}</p>
          )}

          {/* Affichage du contenu détaillé */}
          <div className="prose max-w-none mb-8 text-gray-700">
            {content}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mt-8 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-3">
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
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 mb-8">
        <Link 
          to="/" 
          className="text-gray-600 hover:text-gray-900 inline-flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Posts
        </Link>
      </div>
      
      <Comments postId={id} />
    </div>
  );
};

export default PostDetail;
