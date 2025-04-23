import React, { useEffect, useState } from 'react';import { Row, Col, Spinner } from 'react-bootstrap';
import PostItem from './PostItem'; // Composant pour afficher chaque post

const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/news');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Actualités</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {posts.map(post => (
            <Col md={4} key={post._id}>
              <PostItem post={post} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NewsPage;
