import React, { useState, useContext, useEffect } from 'react';
import PostContext from '../../context/post/postContext';
import Post from '../posts/Post';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

const Home = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  const { posts, getPosts, loading, addPost } = postContext;
  const { isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;

  // State for new post form
  const [newPost, setNewPost] = useState({
    title: '',
    summary: '',
    content: '',
    image: null
  });

  const { title, summary, content, image } = newPost;

  useEffect(() => {
    if (localStorage.token) {
      authContext.loadUser();
    }
    getPosts();
    // eslint-disable-next-line
  }, []);

  if (loading && posts.length === 0) {
    return <Spinner />;
  }

  const onChange = e => setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const onFileChange = e => setNewPost({ ...newPost, image: e.target.files[0] });

  const onSubmit = e => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '' || !image) {
      setAlert('Please fill in all fields including image', 'danger');
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('image', image);

      addPost(formData); // API call to add post
      setAlert('Post Created Successfully', 'success');
      setNewPost({ title: '', summary: '', content: '', image: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a New Post</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Post title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Summary"
                  name="summary"
                  value={summary}
                  onChange={onChange}
                  rows="2"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Write your post content here..."
                  name="content"
                  value={content}
                  onChange={onChange}
                  rows="4"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  name="image"
                  onChange={onFileChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h1>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts to display. Be the first to create one!</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-600 mt-2">{post.summary}</p>
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-blue-500 hover:underline mt-4 inline-block"
                  >
                    Voir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
