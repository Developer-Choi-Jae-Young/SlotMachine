import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getUsers, validatePassword, saveUsers } from '../context/UtilsContext';
import './Signup.css'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      email: '',
      phone: ''
    });
    const [checks, setChecks] = useState({
      username: false,
      nickname: false
    });
    const [errors, setErrors] = useState({});
    const [agreeTerms, setAgreeTerms] = useState(false);
  
    const checkDuplicate = (field) => {
      const users = getUsers();
      const value = formData[field];
      
      if (!value) {
        setErrors({...errors, [field]: '값을 입력해주세요.'});
        return;
      }
  
      const isDuplicate = users.some(u => u[field] === value);
      if (isDuplicate) {
        setErrors({...errors, [field]: '이미 사용 중입니다.'});
        setChecks({...checks, [field]: false});
      } else {
        setErrors({...errors, [field]: ''});
        setChecks({...checks, [field]: true});
      }
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!checks.username || !checks.nickname) {
        alert('아이디와 닉네임 중복확인을 해주세요.');
        return;
      }
  
      if (!validatePassword(formData.password)) {
        alert('비밀번호는 특수문자, 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
        return;
      }
  
      if (formData.password !== formData.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
  
      if (!agreeTerms) {
        alert('약관에 동의해주세요.');
        return;
      }
  
      const users = getUsers();
      const newUser = {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        points: 100,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      saveUsers(users);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    };
  
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">📝 회원가입</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">아이디</label>
              <div className="input-with-button">
                <input
                  type="text"
                  className="form-input"
                  placeholder="아이디"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({...formData, username: e.target.value});
                    setChecks({...checks, username: false});
                  }}
                  required
                />
                <button 
                  type="button" 
                  className={`check-button ${checks.username ? 'checked' : ''}`}
                  onClick={() => checkDuplicate('username')}
                >
                  {checks.username ? '✓ 확인' : '중복확인'}
                </button>
              </div>
              {errors.username && <p className="error-message">{errors.username}</p>}
              {checks.username && <p className="success-message">사용 가능한 아이디입니다.</p>}
            </div>
  
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <p className="password-hint">특수문자, 영문, 숫자 포함 8자 이상</p>
            </div>
  
            <div className="form-group">
              <label className="form-label">비밀번호 확인</label>
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호 확인"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                required
              />
              {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                <p className="error-message">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
  
            <div className="form-group">
              <label className="form-label">닉네임</label>
              <div className="input-with-button">
                <input
                  type="text"
                  className="form-input"
                  placeholder="닉네임"
                  value={formData.nickname}
                  onChange={(e) => {
                    setFormData({...formData, nickname: e.target.value});
                    setChecks({...checks, nickname: false});
                  }}
                  required
                />
                <button 
                  type="button" 
                  className={`check-button ${checks.nickname ? 'checked' : ''}`}
                  onClick={() => checkDuplicate('nickname')}
                >
                  {checks.nickname ? '✓ 확인' : '중복확인'}
                </button>
              </div>
              {errors.nickname && <p className="error-message">{errors.nickname}</p>}
              {checks.nickname && <p className="success-message">사용 가능한 닉네임입니다.</p>}
            </div>
  
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                className="form-input"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
  
            <div className="form-group">
              <label className="form-label">휴대폰 번호</label>
              <input
                type="tel"
                className="form-input"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
  
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms">이용약관 및 개인정보처리방침에 동의합니다.</label>
            </div>
  
            <button type="submit" className="submit-button">회원가입</button>
          </form>
        </div>
      </div>
    );
  };

  export default Signup;