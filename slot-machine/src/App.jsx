import React, { useEffect, useState } from 'react'
import './App.css'
import Header from './template/Header'
import Footer from './template/Footer'
import Contents from './template/Contents'
import Signup from './template/Signup'
import Login from './template/Login'
import FindAuth from './template/FindAuth'
import MyPage from './template/MyPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { getCurrentUser } from './context/UtilsContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
       <div className='container'>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Contents user={user} setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )
            } 
          />
          
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find" element={<FindAuth />} />
          <Route 
            path="/mypage" 
            element={
              user ? (
                <MyPage user={user} setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App
