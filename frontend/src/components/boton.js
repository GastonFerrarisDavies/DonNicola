import React from 'react';
import "../app/globals.css"; 

const Boton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  // Estilos base predefinidos
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variantes de estilo usando colores personalizados
  const variants = {
    primary: 'cursor-pointer bg-primary hover:bg-secondary text-white focus:ring-primary',
    secondary: 'cursor-pointer bg-secondary hover:bg-primary text-white focus:ring-secondary',
    tertiary: 'cursor-pointer bg-tertiary hover:bg-background2 text-quaternary focus:ring-tertiary',
    quaternary: 'cursor-pointer bg-quaternary hover:bg-quinary text-white focus:ring-quaternary',
    quinary: 'cursor-pointer bg-quinary hover:bg-quaternary text-white focus:ring-quinary',
    outline: 'cursor-pointer border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    outlineSecondary: 'cursor-pointer border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary',
    outlineQuaternary: 'cursor-pointer border-2 border-quaternary text-quaternary hover:bg-quaternary hover:text-primary focus:ring-quaternary',
    ghost: 'cursor-pointer text-primary hover:bg-primary/10 focus:ring-primary',
    ghostSecondary: 'cursor-pointer text-secondary hover:bg-secondary/10 focus:ring-secondary',
    ghostQuaternary: 'cursor-pointer text-quaternary hover:bg-quaternary/10 focus:ring-quaternary',
    danger: 'cursor-pointer bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'cursor-pointer bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500'
  };
  
  // Tamaños predefinidos
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
    xlarge: 'px-8 py-4 text-lg'
  };
  
  // Combinar estilos
  const buttonStyles = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.medium}
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Boton;
