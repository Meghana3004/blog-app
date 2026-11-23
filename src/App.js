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
import { AuthProvider } from './contexts/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
        <Routes>
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
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
              <ProtectedRoute>
              <NavbarExample />
              <AllPosts />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/:index"  
            element={
              <ProtectedRoute>
              <NavbarExample />
              <FullPostPage />
              <ChatbotWidget />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/New"
            element={
              <ProtectedRoute>
              <NavbarExample />
              <New />
              <ChatbotWidget />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
              <NavbarExample />
              <Profile />
              <ChatbotWidget />
            </ProtectedRoute>
            }
          />

          <Route 
            path="/EditPost" 
            element={
              <ProtectedRoute>
              <NavbarExample />
              <EditPost />
              <ChatbotWidget />
              </ProtectedRoute>
            } 
          />
    
          {/* <Route
            path="/Archive"
            element={
              <ProtectedRoute>
              <NavbarExample />
              <ArchiveAGGrid />
              <ChatbotWidget />
            </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path="/Documentation"
            element={
              <ProtectedRoute>
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
    </AuthProvider>
  );
};

// localStorage.clear();
export default App;




