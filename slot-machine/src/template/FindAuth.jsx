import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, validatePassword, saveUsers } from '../context/UtilsContext';
import './FindAuth.css'

const FindAuth = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('username');
    const [findData, setFindData] = useState({
      nickname: '',
      email: '',
      phone: '',
      username: ''
    });
    const [result, setResult] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  
    const handleFindUsername = (e) => {
      e.preventDefault();
      const users = getUsers();
      const user = users.find(u => 
        u.nickname === findData.nickname && 
        u.email === findData.email && 
        u.phone === findData.phone
      );
  
      if (user) {
        setResult(`회원님의 아이디는 "${user.username}" 입니다.`);
      } else {
        setResult('일치하는 회원 정보가 없습니다.');
      }
    };
  
    const handleFindPassword = (e) => {
      e.preventDefault();
      const users = getUsers();
      const user = users.find(u => 
        u.username === findData.username &&
        u.nickname === findData.nickname && 
        u.email === findData.email && 
        u.phone === findData.phone
      );
  
      if (user) {
        setFoundUser(user);
        setResult('회원 정보가 확인되었습니다. 새로운 비밀번호를 설정해주세요.');
      } else {
        setResult('일치하는 회원 정보가 없습니다.');
        setFoundUser(null);
      }
    };
  
    const handleResetPassword = (e) => {
      e.preventDefault();
      
      if (!validatePassword(newPassword)) {
        alert('비밀번호는 특수문자, 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
        return;
      }
  
      if (newPassword !== newPasswordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
  
      const users = getUsers();
      const userIndex = users.findIndex(u => u.username === foundUser.username);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
        alert('비밀번호가 변경되었습니다.');
        navigate('/login');
      }
    };
  
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">🔍 아이디/비밀번호 찾기</h2>
          
          <div className="tab-container">
            <button 
              className={`tab-button ${activeTab === 'username' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('username');
                setResult('');
                setFoundUser(null);
              }}
            >
              아이디 찾기
            </button>
            <button 
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('password');
                setResult('');
                setFoundUser(null);
              }}
            >
              비밀번호 찾기
            </button>
          </div>
  
          {activeTab === 'username' ? (
            <form onSubmit={handleFindUsername}>
              <div className="form-group">
                <label className="form-label">닉네임</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="닉네임"
                  value={findData.nickname}
                  onChange={(e) => setFindData({...findData, nickname: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@email.com"
                  value={findData.email}
                  onChange={(e) => setFindData({...findData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">휴대폰 번호</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="010-1234-5678"
                  value={findData.phone}
                  onChange={(e) => setFindData({...findData, phone: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-button">아이디 찾기</button>
            </form>
          ) : (
            <>
              {!foundUser ? (
                <form onSubmit={handleFindPassword}>
                  <div className="form-group">
                    <label className="form-label">아이디</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="아이디"
                      value={findData.username}
                      onChange={(e) => setFindData({...findData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">닉네임</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="닉네임"
                      value={findData.nickname}
                      onChange={(e) => setFindData({...findData, nickname: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">이메일</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="example@email.com"
                      value={findData.email}
                      onChange={(e) => setFindData({...findData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">휴대폰 번호</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010-1234-5678"
                      value={findData.phone}
                      onChange={(e) => setFindData({...findData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">회원 정보 확인</button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label className="form-label">새 비밀번호</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <p className="password-hint">특수문자, 영문, 숫자 포함 8자 이상</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">새 비밀번호 확인</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="새 비밀번호 확인"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">비밀번호 변경</button>
                </form>
              )}
            </>
          )}
  
          {result && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {result}
            </div>
          )}
  
          <div className="auth-links">
            <Link to="/login" className="auth-link">로그인으로 돌아가기</Link>
          </div>
        </div>
      </div>
    );
  };

  export default FindAuth;