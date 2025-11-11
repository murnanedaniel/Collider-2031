import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false 
}) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

