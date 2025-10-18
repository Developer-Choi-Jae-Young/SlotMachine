import React, { useState, useEffect, useRef } from 'react'
import './Contents.css'

const images = ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍒'];
const fruitPoints = {
    '🍎': [20, 50],
    '🍊': [25, 60],
    '🍌': [30, 80],
    '🍇': [35, 100],
    '🍓': [50, 150],
    '🥝': [75, 250],
    '🍒': [100, 500],
  };
  
const calculateReward = (results) => {
    const counts = {};
    results.forEach(fruit => {
      counts[fruit] = (counts[fruit] || 0) + 1;
    });
    console.log(counts);
    let reward = 0;
    for (const [fruit, count] of Object.entries(counts)) {
      if (count === 2) reward += fruitPoints[fruit]?.[0] || 0;
      if (count === 3) reward += fruitPoints[fruit]?.[1] || 0;
    }
    return reward;
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
  

function Contents() {
    const [isRolling, setIsRolling] = useState(false);
    const [stopIndexes, setStopIndexes] = useState([0, 0, 0]);
    const [points, setPoints] = useState(100); // 시작 포인트
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const listClassName = `item-list ${isScrolling ? 'is-scrolling' : ''}`;
    const items = ['1.a', '2.b', '3.c', '4.d', '5.e', '6.f'];

    useEffect(() => {
      const container = containerRef.current;
      const list = listRef.current;
  
      if (container && list) {
        const originalContentHeight = list.scrollHeight / 2;
        const containerHeight = container.clientHeight;
        setIsScrolling(originalContentHeight > containerHeight);
      }
    }, [items]);    

    const startSpin = () => {
        if (isRolling || points < 10) return;
        setIsRolling(true);
        setPoints(prev => prev - 10); // 10포인트 차감
      
        const newIndexes = [
          Math.floor(Math.random() * images.length),
          Math.floor(Math.random() * images.length),
          Math.floor(Math.random() * images.length),
        ];
        setStopIndexes(newIndexes);
      
        // 롤링 끝나고 보상 처리
        setTimeout(() => {
          setIsRolling(false);
          const results = newIndexes.map(i => images[i]);
          const reward = calculateReward(results);
          setPoints(prev => prev + reward);
        }, 2500);
      };

    return (
        <div className='contents'>
            <div className='contents-left'>
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
                <button className='btn-spin' onClick={startSpin} disabled={isRolling}>
                    {isRolling ? '굴리는 중...' : '스핀!'}
                </button>
                <div className='contents-left-content-result'>
                {stopIndexes.map((index, i) => (
                    <span key={i}>{images[index]}</span>
                ))}
                </div>
                <div className="contents-left-points">
                    현재 포인트: {points}
                </div>
            </div>

            <div className='contents-right'>
                <div className="contents-right-top">
                  <div className="scroll-container" ref={containerRef}>
                    <ul className={listClassName} ref={listRef}>
                      {items.map((item, index) => (
                        <li key={`original-${index}`}>{item}</li>
                      ))}

                      {isScrolling && items.map((item, index) => (
                        <li key={`clone-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className='contents-right-bottom'>
                  <table>
                    <tbody>
                      {images.map((item) => {
                        const fruitRows = fruitPoints[item].map((score, idx) => {
                          const fruitCount = idx + 2;
                          return (
                            <tr key={`${item}-${idx}`}>
                              <td>
                                {Array.from({ length: fruitCount }, () => item)}
                              </td>
                              <td>{score} point</td>
                            </tr>
                          );
                        });
                        return fruitRows;
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
    )
}

export default Contents;