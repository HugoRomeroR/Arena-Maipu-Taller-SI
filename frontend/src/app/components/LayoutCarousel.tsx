import React, { useState } from 'react';

interface LayoutCarouselProps {
  layouts: React.ReactNode[];
  onSelect?: (index: number) => void;
}

export default function LayoutCarousel({ layouts, onSelect }: LayoutCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + layouts.length) % layouts.length;
    setCurrentIndex(newIndex);
    onSelect?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % layouts.length;
    setCurrentIndex(newIndex);
    onSelect?.(newIndex);
  };

  return (
    <div style={styles.carouselWrapper}>
      <button onClick={handlePrev} style={styles.button}>
        ◀
      </button>

      <div style={styles.layoutContainer}>
        {layouts[currentIndex]}
      </div>

      <button onClick={handleNext} style={styles.button}>
        ▶
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  carouselWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  layoutContainer: {
    width: 'auto',
    height: 'auto',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
  },
  button: {
    fontSize: '24px',
    padding: '4px 12px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'black',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
    fontFamily: '"Helvetica Neue", sans-serif',
    textAlign: 'center', // horizontal
    border: 'none',
    borderRadius: '4px',
  },
};