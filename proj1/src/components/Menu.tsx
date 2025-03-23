import React, { useState } from 'react';
import './Menu.css';

interface MenuProps {
  onNewGame: () => void;
  onCredits: () => void;
}

const Menu: React.FC<MenuProps> = ({ onNewGame, onCredits }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  const menuItems = [
    { id: 1, label: 'New Game', action: onNewGame },
    { id: 2, label: 'Continue', action: () => console.log('Continue clicked') },
    { id: 3, label: 'Customize', action: () => console.log('Customize clicked') },
    { id: 4, label: 'Difficulty', action: () => console.log('Difficulty clicked') },
    { id: 5, label: 'Credits', action: onCredits },
  ];
  
  const handleMenuClick = (item: typeof menuItems[0]) => {
    item.action();
  };
  
  return (
    <div className="menu-container">
      <div className="menu-panel">
        <h1 className="menu-title">ULTIMATE<br/>COCK GAME</h1>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${hoveredItem === item.id ? 'menu-item-active' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleMenuClick(item)}
            >
              {hoveredItem === item.id}
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="menu-footer">
          Press any menu item to select
        </div>
      </div>
    </div>
  );
};

export default Menu;