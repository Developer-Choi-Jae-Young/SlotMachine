import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers, updateUserInStorage } from '../context/UtilsContext';
import './MyPage.css'

// ========== 마이페이지 ==========
const MyPage = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('info');
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({...user});
    const [chargeAmount, setChargeAmount] = useState(0);
  
    const history = JSON.parse(sessionStorage.getItem(`history_${user.username}`) || '[]');
    const winRecords = JSON.parse(sessionStorage.getItem(`wins_${user.username}`) || '[]');
  
    const totalCharged = history
      .filter(h => h.type === '포인트 충전')
      .reduce((sum, h) => sum + h.amount, 0);
  
    const totalUsed = history
      .filter(h => h.type === '게임 참여')
      .reduce((sum, h) => sum + Math.abs(h.amount), 0);
  
    const handleUpdateInfo = () => {
      if (editMode) {
        const updatedUser = {...user, ...editData};
        setUser(updatedUser);
        updateUserInStorage(updatedUser);
        alert('정보가 업데이트되었습니다.');
      }
      setEditMode(!editMode);
    };
  
    const handleCharge = () => {
      if (chargeAmount <= 0) {
        alert('충전할 금액을 선택해주세요.');
        return;
      }
  
      const updatedUser = {...user, points: user.points + chargeAmount};
      setUser(updatedUser);
      updateUserInStorage(updatedUser);
  
      const newHistory = JSON.parse(sessionStorage.getItem(`history_${user.username}`) || '[]');
      newHistory.unshift({
        date: new Date().toLocaleString('ko-KR'),
        type: '포인트 충전',
        amount: chargeAmount,
        balance: updatedUser.points
      });
      sessionStorage.setItem(`history_${user.username}`, JSON.stringify(newHistory));
  
      alert(`${chargeAmount} 포인트가 충전되었습니다!`);
      setChargeAmount(0);
    };
  
    const handleDeleteAccount = () => {
      if (window.confirm('정말로 회원탈퇴 하시겠습니까? 모든 데이터가 삭제됩니다.')) {
        const users = getUsers();
        const filteredUsers = users.filter(u => u.username !== user.username);
        saveUsers(filteredUsers);
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem(`history_${user.username}`);
        sessionStorage.removeItem(`wins_${user.username}`);
        alert('회원탈퇴가 완료되었습니다.');
        navigate('/login');
      }
    };
  
    return (
      <div className="mypage-container">
        <div className="mypage-layout">
          {/* 사이드바 */}
          <div className="mypage-sidebar">
            <div className="sidebar-title">📋 메뉴</div>
            <ul className="sidebar-menu">
              <li 
                className={`sidebar-item ${activeMenu === 'info' ? 'active' : ''}`}
                onClick={() => setActiveMenu('info')}
              >
                기본 정보
              </li>
              <li 
                className={`sidebar-item ${activeMenu === 'points' ? 'active' : ''}`}
                onClick={() => setActiveMenu('points')}
              >
                포인트 관리
              </li>
              <li 
                className={`sidebar-item ${activeMenu === 'wins' ? 'active' : ''}`}
                onClick={() => setActiveMenu('wins')}
              >
                당첨 기록
              </li>
              <li 
                className={`sidebar-item ${activeMenu === 'delete' ? 'active' : ''}`}
                onClick={() => setActiveMenu('delete')}
              >
                회원 탈퇴
              </li>
            </ul>
          </div>
  
          {/* 메인 컨텐츠 */}
          <div className="mypage-content">
            {/* 1. 기본 정보 탭 */}
            {activeMenu === 'info' && (
              <>
                <h2 className="content-title">👤 기본 정보</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">아이디</span>
                    <span className="info-value">{user.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">닉네임</span>
                    {editMode ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{width: '200px', padding: '8px'}}
                        value={editData.nickname}
                        onChange={(e) => setEditData({...editData, nickname: e.target.value})}
                      />
                    ) : (
                      <span className="info-value">{user.nickname}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">이메일</span>
                    {editMode ? (
                      <input
                        type="email"
                        className="form-input"
                        style={{width: '200px', padding: '8px'}}
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    ) : (
                      <span className="info-value">{user.email}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">휴대폰</span>
                    {editMode ? (
                      <input
                        type="tel"
                        className="form-input"
                        style={{width: '200px', padding: '8px'}}
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    ) : (
                      <span className="info-value">{user.phone}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">가입일</span>
                    <span className="info-value">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
                <button 
                  className="submit-button" 
                  style={{marginTop: '24px'}}
                  onClick={handleUpdateInfo}
                >
                  {editMode ? '저장하기' : '정보 수정'}
                </button>
              </>
            )}
  
            {/* 2. 포인트 관리 탭 */}
            {activeMenu === 'points' && (
              <>
                <h2 className="content-title">💰 포인트 관리</h2>
                
                {/* 포인트 요약 */}
                <div className="point-summary">
                  <div className="point-card">
                    <div className="point-card-title">현재 포인트</div>
                    <div className="point-card-value">{user.points}</div>
                  </div>
                  <div className="point-card">
                    <div className="point-card-title">총 충전</div>
                    <div className="point-card-value">{totalCharged}</div>
                  </div>
                  <div className="point-card">
                    <div className="point-card-title">총 사용</div>
                    <div className="point-card-value">{totalUsed}</div>
                  </div>
                </div>
  
                {/* 포인트 충전 섹션 */}
                <div className="charge-section">
                  <h3 className="charge-title">💳 포인트 충전</h3>
                  <div className="charge-options">
                    {[1000, 5000, 10000, 50000].map(amount => (
                      <div
                        key={amount}
                        className={`charge-option ${chargeAmount === amount ? 'selected' : ''}`}
                        onClick={() => setChargeAmount(amount)}
                      >
                        <div style={{fontSize: '18px', fontWeight: 'bold'}}>{amount}</div>
                        <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)'}}>포인트</div>
                      </div>
                    ))}
                  </div>
                  <button className="charge-button" onClick={handleCharge}>
                    {chargeAmount > 0 ? `${chargeAmount} 포인트 충전하기` : '금액을 선택하세요'}
                  </button>
                </div>
  
                {/* 포인트 사용 내역 */}
                <h3 className="charge-title" style={{marginTop: '24px'}}>📊 포인트 내역</h3>
                <div style={{overflowX: 'auto'}}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>구분</th>
                        <th>금액</th>
                        <th>잔액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(0, 20).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.date}</td>
                          <td>{item.type}</td>
                          <td className={item.amount > 0 ? 'positive' : 'negative'}>
                            {item.amount > 0 ? '+' : ''}{item.amount}
                          </td>
                          <td>{item.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
  
            {/* 3. 당첨 기록 탭 */}
            {activeMenu === 'wins' && (
              <>
                <h2 className="content-title">🎉 당첨 기록</h2>
                <div style={{overflowX: 'auto'}}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>당첨 결과</th>
                        <th>보상</th>
                      </tr>
                    </thead>
                    <tbody>
                      {winRecords.length > 0 ? (
                        winRecords.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.date}</td>
                            <td>{item.result}</td>
                            <td className="positive">+{item.reward}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{textAlign: 'center', padding: '40px'}}>
                            아직 당첨 기록이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
  
            {/* 4. 회원 탈퇴 탭 */}
            {activeMenu === 'delete' && (
              <>
                <h2 className="content-title">⚠️ 회원 탈퇴</h2>
                <div className="danger-zone">
                  <h3 className="danger-title">회원 탈퇴</h3>
                  <p className="danger-description">
                    회원 탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                    신중하게 결정해주세요.
                  </p>
                  <button className="danger-button" onClick={handleDeleteAccount}>
                    회원 탈퇴하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

export default MyPage;