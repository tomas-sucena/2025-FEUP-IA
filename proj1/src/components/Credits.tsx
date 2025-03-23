import React from 'react';
import './Credits.css';

interface CreditsProps {
  onBackToMenu: () => void;
}

const Credits: React.FC<CreditsProps> = ({ onBackToMenu }) => {
  return (
    <div className="credits-container">
      <div className="credits-panel">
        <h1 className="credits-title">CREDITS</h1>
        
        <div className="credits-content">
          <h2 className="credits-subtitle">Project Creators</h2>
          <div className="credits-creators">
            <div className="creator">
              <h3 className="creator-name">Bruno Drumond</h3>
              <p className="creator-role">Developer</p>
            </div>
            
            <div className="creator">
              <h3 className="creator-name">Tomás Sucena Lopes</h3>
              <p className="creator-role">SIMP && !GAY</p>
            </div>
          </div>
          
          <div className="credits-project">
            <p className="project-name">Ultimate Cock Game</p>
            <p className="project-year">© 2025</p>
          </div>
        </div>
        
        <button className="back-button-credits" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Credits;