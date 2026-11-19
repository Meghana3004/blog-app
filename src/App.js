import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllPosts from './pages/AllPosts/AllPosts.js';
import Home from './pages/Home/Home.js';
import New from './pages/New/New.js';
// import ArchiveAGGrid from './pages/AGGrid/ArchiveAGGrid.js';
// import Documentation from './pages/ChatbotDoc/Documentation.js';
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget.js';
import 'react-chatbot-kit/build/main.css';
import './components/ChatbotWidget/ChatbotWidget.css';
import NavbarExample from './components/Navbar/navbar.js';
import CarouselExample from './components/Carousel/Carousel.js';
import LoginSignupPage from './pages/LoginSignup/LoginSignupPage.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import FullPostPage from './pages/FullPost/FullPostPage.js';
import Profile from './pages/Profile/Profile.js';
import EditPost from './pages/EditPage/EditPost.js';


const App = () => {
  const isAuthenticated = () => {
    const username = sessionStorage.getItem('username');
    return username !== null && username !== undefined && username !== '';
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/Home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <CarouselExample />
              <Home />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AllPosts"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <AllPosts />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/:index"  
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <FullPostPage />
              <ChatbotWidget />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/New"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <New />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <Profile />
              <ChatbotWidget />
            </ProtectedRoute>
            }
          />

          <Route 
            path="/EditPost" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <EditPost />
              <ChatbotWidget />
              </ProtectedRoute>
            } 
          />
    
          {/* <Route
            path="/Archive"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <ArchiveAGGrid />
              <ChatbotWidget />
            </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path="/Documentation"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NavbarExample />
              <Documentation />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/Login"
            element={<>
              <LoginSignupPage />
            </>}
          />
          <Route
            path=""
            element={<>
              <LoginSignupPage />
            </>}
          />
        </Routes>
      </div>
    </Router>
  );
};

// localStorage.clear();
export default App;




