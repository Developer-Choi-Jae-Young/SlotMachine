import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsers, saveCurrentUser } from '../context/UtilsContext';
import './Login.css'

const Login = ({setUser}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const users = getUsers();
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        saveCurrentUser(user); // 세션 스토리지에 저장 (새로고침 대비)
        setUser(user);         // <--- App.jsx의 상태를 즉시 업데이트 (가장 중요)
        navigate('/');         // 메인 페이지로 이동
      } else {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    };
  
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">🎰 로그인</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">아이디</label>
              <input
                type="text"
                className="form-input"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">로그인</button>
          </form>
          <div className="auth-links">
            <Link to="/signup" className="auth-link">회원가입</Link>
            <span style={{color: 'rgba(255,255,255,0.3)'}}>|</span>
            <Link to="/find" className="auth-link">아이디/비밀번호 찾기</Link>
          </div>
        </div>
      </div>
    );
  };

  export default Login;