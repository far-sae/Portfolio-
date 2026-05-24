'use client';
import styles from './ScrollIndicator.module.css';

type Props = {
  targetId: string;
};

export default function ScrollIndicator({ targetId }: Props) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={handleClick}
      aria-label={`Scroll to ${targetId}`}
    >
      <span className={styles.dot} />
    </button>
  );
}
