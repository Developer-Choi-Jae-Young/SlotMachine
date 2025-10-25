import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

function Header({ user, setUser }) {
    const [isLogin] = useState(false);
    
    const navigate = useNavigate();
    useEffect(() => {
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          navigate('/login');
        }
      }, [])

    const updateUserData = (updatedUser) => {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u) => u.username === updatedUser.username)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
        }
      }
    
    const handleLogin = () => {
        setIsLogin(true);
    }

    const handleLogout = () => {
        setIsLogin(false);
    }   

    return (
    <div className="header">
      <div className="header-container">
        <div className="header-title">
          <Link to="/"><h1>🎰 과일 슬롯 게임</h1></Link>
        </div>
        
        {isLogin ? (
          <div className="header-buttons">
            <Link to="/mypage" className="header-button">마이페이지</Link>
            <button className="header-button">로그아웃</button>
          </div>
        ) : (
          <Link to="/login" className="header-button">로그인</Link>
        )}
      </div>
    </div>
    )
}

export default Header;