'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './GlassButton.module.css';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const GlassButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={clsx(styles.button, className)}
      {...rest}
    >
      {children}
    </button>
  )
);

GlassButton.displayName = 'GlassButton';
export default GlassButton;
