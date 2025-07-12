import React from 'react';
import "../app/globals.css";

const Tarjeta = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  className = '', 
  hover = true,
  shadow = true,
  padding = true,
  onClick,
  ...props 
}) => {
  // Estilos base predefinidos
  const baseStyles = 'bg-tertiary rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variantes de estilo usando colores personalizados
  const variants = {
    default: 'border border-background1',
    elevated: 'shadow-lg border border-background1',
    outlined: 'border-2 border-quaternary',
    filled: 'bg-background2 border border-background1',
    primary: 'border-2 border-primary bg-tertiary',
    secondary: 'border-2 border-secondary bg-tertiary',
    tertiary: 'border-2 border-tertiary bg-background2',
    quaternary: 'border-2 border-quaternary bg-tertiary',
    quinary: 'border-2 border-quinary bg-tertiary',
    success: 'border-2 border-green-200 bg-green-50',
    warning: 'border-2 border-yellow-200 bg-yellow-50',
    danger: 'border-2 border-red-200 bg-red-50'
  };
  
  // Tamaños predefinidos
  const sizes = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-10'
  };
  
  // Efectos de hover
  const hoverEffects = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  
  // Sombras
  const shadowStyles = shadow ? 'shadow-md' : '';
  
  // Padding
  const paddingStyles = padding ? (sizes[size] || sizes.medium) : '';
  
  // Combinar estilos
  const cardStyles = `
    ${baseStyles}
    ${variants[variant] || variants.default}
    ${shadowStyles}
    ${paddingStyles}
    ${hoverEffects}
    ${className}
  `.trim();
  
  return (
    <div
      className={cardStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tarjeta;
