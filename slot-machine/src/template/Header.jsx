import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header({ user, onLogout }) {
    return (
    <div className="header">
      <div className="header-container">
        <div className="header-title">
          <Link to="/"><h1>🎰 과일 슬롯 게임</h1></Link>
        </div>
        
        {user ? (
          <div className="header-buttons">
            <span 
              className="header-button" 
              style={{ color: '#fde047', cursor: 'default', backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              {user.nickname}님 ({user.points} P)
            </span>
            <Link to="/mypage" className="header-button">마이페이지</Link>
            <button className="header-button" onClick={onLogout}>로그아웃</button>
          </div>
        ) : (
          <Link to="/login" className="header-button">로그인</Link>
        )}
      </div>
    </div>
    )
}

export default Header;