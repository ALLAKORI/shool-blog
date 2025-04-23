import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import AppNavbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PostDetail from './components/posts/PostDetail';
import NotFound from './components/pages/NotFound';
import NewsPage from './components/pages/NewsPage';
import AnnouncementsPage from './components/pages/AnnouncementsPage';
import ChatPage from './components/pages/ChatPage';

// Context
import AuthState from './context/auth/AuthState';
import authContext from './context/auth/authContext';
import AlertState from './context/alert/AlertState';
import PostState from './context/post/PostState';
import CommentState from './context/comment/CommentState';

// Utils
import setAuthToken from './utils/setAuthToken';

// Set token on initial app load
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Initialize user on app load
const AppInitializer = () => {
  const context = useContext(authContext);

  useEffect(() => {
    if (localStorage.token) {
      context.loadUser();
    }
    // eslint-disable-next-line
  }, []);

  return null;
};

const App = () => {
  return (
    <AuthState>
      <PostState>
        <CommentState>
          <AlertState>
            <Router>
              <AppInitializer />
              <div className="min-h-screen bg-gray-50">
                <AppNavbar />
                <main className="container mx-auto px-4 py-8">
                  <Alerts />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/actualites" element={<NewsPage />} />
                    <Route path="/annonces" element={<AnnouncementsPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </AlertState>
        </CommentState>
      </PostState>
    </AuthState>
  );
};

export default App;
