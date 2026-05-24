'use client';
import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import clsx from 'clsx';
import styles from './SoundBadge.module.css';

type Props = {
  onClick: () => void;
  acknowledged: boolean;
};

export default function SoundBadge({ onClick, acknowledged }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (acknowledged) return;
    const inTimer = setTimeout(() => setVisible(true), 2600);
    const outTimer = setTimeout(() => setVisible(false), 8600);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [acknowledged]);

  if (acknowledged) return null;

  return (
    <button
      type="button"
      className={clsx(styles.badge, visible && styles.visible)}
      onClick={onClick}
      aria-label="Tap for sound"
    >
      <Volume2 />
      Tap for sound
    </button>
  );
}
