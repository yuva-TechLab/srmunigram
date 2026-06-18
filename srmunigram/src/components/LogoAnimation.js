import React, { useEffect, useState } from 'react';
import './LogoAnimation.css';
import srmLogo from '../assets/srm-logo.png';
import unigramLogo from '../assets/unigram-logo.png';
function LogoAnimation({ onComplete }) {
  const [show, setShow] = useState(true);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const startAnimation = setTimeout(() => {
      setAnimate(true);
    }, 1000);
    const endAnimation = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 4000);
    return () => {
      clearTimeout(startAnimation);
      clearTimeout(endAnimation);
    };
  }, [onComplete]);
  if (!show) return null;
  return (
    <div className="logo-animation-container">
      <div className="logos-group">
        <img
          src={srmLogo}
          alt="SRM"
          className={`srm-logo ${animate ? 'animate' : ''}`}
        />
        <img
          src={unigramLogo}
          alt="UNIGRAM"
          className={`unigram-logo ${animate ? 'animate' : ''}`}
        />
      </div>
    </div>
  );
}
export default LogoAnimation;