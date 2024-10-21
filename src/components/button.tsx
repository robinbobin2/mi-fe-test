import type { ButtonHTMLAttributes } from 'react';

import styles from './button.module.css';

type ButtonProps = {
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  neutral?: boolean;
  classes?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ primary, secondary, danger, neutral, classes, ...props }: ButtonProps) => {
  let className = styles.button;

  // todo - introduce variant prop 
  if (primary) className += ` btn-primary `;
  if (secondary) className += ` btn-secondary `;
  if (danger) className += ` btn-error `;
  if (neutral) className += ` btn-neutral `;
  return <button className={`btn ${className} ${classes}`} {...props} />;
};
