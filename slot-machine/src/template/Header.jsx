import React, { useState, useEffect } from 'react'
import './Header.css'

function Header() {
    const [user] = useState({ username: 'Player1', points: 1000 });
    const [isLogin] = useState(false);
    
    useEffect(() => {
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
            //로그인 페이지로
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
          <h1>🎰 과일 슬롯 게임</h1>
        </div>
        
        {isLogin ? (
          <div className="header-buttons">
            <button className="header-button">마이페이지</button>
            <button className="header-button">로그아웃</button>
          </div>
        ) : (
          <button className="header-button">로그인</button>
        )}
      </div>
    </div>
    )
}

export default Header;