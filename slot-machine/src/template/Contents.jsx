import React, { useState, useEffect, useRef } from 'react'
import './Contents.css'
import { updateUserInStorage } from '../context/UtilsContext';

const images = ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍒'];
const outcomes = [
  { name: '사과 2개', prize: '🍎', count: 2, reward: 20, weight: 10 },
  { name: '사과 3개', prize: '🍎', count: 3, reward: 50, weight: 2 }, 
  { name: '오렌지 2개', prize: '🍊', count: 2, reward: 25, weight: 8 },
  { name: '오렌지 3개', prize: '🍊', count: 3, reward: 60, weight: 1.5 },
  { name: '바나나 2개', prize: '🍌', count: 2, reward: 30, weight: 6 },
  { name: '바나나 3개', prize: '🍌', count: 3, reward: 80, weight: 0.7 },
  { name: '포도 2개', prize: '🍇', count: 2, reward: 35, weight: 4 },
  { name: '포도 3개', prize: '🍇', count: 3, reward: 100, weight: 0.1 },
  { name: '딸기 2개', prize: '🍓', count: 2, reward: 50, weight: 2 },
  { name: '딸기 3개', prize: '🍓', count: 3, reward: 150, weight: 0.05 },
  { name: '키위 2개', prize: '🥝', count: 2, reward: 75, weight: 1 },
  { name: '키위 3개', prize: '🥝', count: 3, reward: 250, weight: 0.01 },
  { name: '체리 2개', prize: '🍒', count: 2, reward: 100, weight: 0.1 },
  { name: '체리 3개', prize: '🍒', count: 3, reward: 500, weight: 0.001 },
  { name: '미당첨', prize: null, count: 0, reward: 0, weight: 64.539 },
];
const fruitPoints = {
    '🍎': [20, 50],
    '🍊': [25, 60],
    '🍌': [30, 80],
    '🍇': [35, 100],
    '🍓': [50, 150],
    '🥝': [75, 250],
    '🍒': [100, 500],
  };

const getWeightedRandomIndex = (weights) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i;
    }
    random -= weights[i];
  }

  return weights.length - 1; 
};

  const Reel = ({ isRolling, stopIndex }) => {
    const itemHeight = 100;
    const visibleItems = 3;
    const visibleIndex = Math.floor(visibleItems / 2);
    const cycles = 10;
    const reelRef = useRef(null);
  
    const offset = Math.floor(Math.random() * images.length);
    const baseList = [];
    for (let i = 0; i < cycles * images.length; i++) {
      baseList.push(images[(offset + i) % images.length]);
    }
  
    const stopItem = images[stopIndex];
    const beforeStop = images[(stopIndex - 1 + images.length) % images.length];
    const afterStop = images[(stopIndex + 1) % images.length];
  
    const finalList = [
      ...baseList,
      beforeStop,
      stopItem,
      afterStop,
    ];
  
    const stopPosition = (baseList.length + 1 - visibleIndex) * itemHeight;
  
    useEffect(() => {
      if (isRolling && reelRef.current) {
        reelRef.current.style.transition = 'none';
        reelRef.current.style.transform = 'translateY(0)';
        requestAnimationFrame(() => {
          reelRef.current.style.transition = 'transform 2.5s cubic-bezier(0.33, 1, 0.68, 1)';
          reelRef.current.style.transform = `translateY(-${stopPosition}px)`;
        });
      }
    }, [isRolling]);
  
    return (
      <div className="reel">
        <div ref={reelRef} className="reel-inner">
          {finalList.map((item, index) => (
            <div key={index} className="reel-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };
  

function Contents({ user, setUser }) {
    const [isRolling, setIsRolling] = useState(false);
    const [stopIndexes, setStopIndexes] = useState([0, 0, 0]);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showWinEffect, setShowWinEffect] = useState(false);
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const winSoundRef = useRef(null);
    const items = ['1.a', '2.b', '3.c'];

    useEffect(() => {
      const container = containerRef.current;
      const list = listRef.current;
  
      if (container && list) {
        const originalContentHeight = list.scrollHeight;
        const containerHeight = container.clientHeight;
        setIsScrolling(originalContentHeight > containerHeight);
      }
    }, [items]);    

    const generateReelSet = (outcome) => {
      const finalSymbols = [];
      const prizeSymbol = outcome.prize;

      if (outcome.count === 3) {
          return [prizeSymbol, prizeSymbol, prizeSymbol];
      }

      if (outcome.count === 2) {
          let otherSymbol;
          do {
              otherSymbol = images[Math.floor(Math.random() * images.length)];
          } while (otherSymbol === prizeSymbol);
          
          const result = [prizeSymbol, prizeSymbol, otherSymbol];
          return result.sort(() => Math.random() - 0.5);
      }

      const shuffled = [...images].sort(() => Math.random() - 0.5);
      return [shuffled[0], shuffled[1], shuffled[2]];
    };

    const startSpin = () => {
        if (isRolling || user.points < 10) return;
        setIsRolling(true);
        const updatedUser = { ...user, points: user.points - 10 };
        setUser(updatedUser);
        updateUserInStorage(updatedUser);
      
        const outcomeWeights = outcomes.map(o => o.weight);
        const resultIndex = getWeightedRandomIndex(outcomeWeights);
        const finalOutcome = outcomes[resultIndex];
        const finalSymbols = generateReelSet(finalOutcome);
        const newIndexes = finalSymbols.map(symbol => images.indexOf(symbol));
        setStopIndexes(newIndexes);

        setTimeout(() => {
          // 당첨되었을 경우, 이펙트와 사운드를 재생합니다.
          if (finalOutcome.reward > 0) {
              setShowWinEffect(true);
              winSoundRef.current?.play();
              setTimeout(() => {
                  setShowWinEffect(false);
                  setIsRolling(false);
                  if (winSoundRef.current) {
                    winSoundRef.current.pause();
                    winSoundRef.current.currentTime = 0;
                  }
              }, 3000); // 1.5초 후 이펙트 끄기
          } else {
            setIsRolling(false);
          }
          
          const finalUser = { ...updatedUser, points: updatedUser.points + finalOutcome.reward };
          setUser(finalUser);
          updateUserInStorage(finalUser);
      }, 3000);
    };

    return (
        <div className='contents'>
            <audio ref={winSoundRef} src="/win-sound.mp3" preload="auto"></audio>
            <div className={`contents-left ${showWinEffect ? 'win-effect' : ''}`}>
                <div className='contents-left-title'>
                    <h1>SUPER SLOT</h1>
                    <span>10 포인트로 게임을 시작하세요!</span>
                </div>
                <div className='contents-left-content'>
                    <div className="contents-left-content-item reel-container">
                        <Reel isRolling={isRolling} stopIndex={stopIndexes[0]} />
                        <Reel isRolling={isRolling} stopIndex={stopIndexes[1]} />
                        <Reel isRolling={isRolling} stopIndex={stopIndexes[2]} />
                    </div>
                </div>
                <button 
                  className={`btn-spin ${isRolling || user.points < 10 ? 'disabled' : ''}`}
                  onClick={startSpin}
                  disabled={isRolling || user.points < 10}
                >
                    {isRolling ? '🎰 굴리는 중...' : user.points < 10 ? '포인트 부족' : '🎲 스핀!'}
                </button>
                <div className="contents-left-points">
                    현재 포인트: {user.points}
                </div>
            </div>

            <div className='contents-right'>
                <div className="contents-right-top">
                  <h3 className="section-title">📊 실시간 정보</h3>
                  <div className="scroll-container" ref={containerRef}>
                    <ul className={`item-list ${isScrolling ? 'is-scrolling' : ''}`} ref={listRef}>
                      {items.map((item, index) => (
                        <li key={`original-${index}`}>{item}</li>
                      ))}
                      {isScrolling && items.map((item, index) => (
                        <li key={`clone-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="contents-right-bottom">
                  <h3 className="section-title prize-title">💰 상금 표</h3>
                  <div className="prize-table">
                    {outcomes.map((item, idx) => (
                      <div key={idx} className="prize-item">
                        <div className="prize-symbol">
                          {item.count === 0 ? '❌' : Array.from({ length: item.count }, () => item.prize).join('')}
                        </div>
                        <div className="prize-info">
                          <p className="prize-reward">{item.reward} P</p>
                          <p className="prize-weight">{item.weight}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
        </div>
    )
}

export default Contents;