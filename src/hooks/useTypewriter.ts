import { useState, useEffect, useRef } from 'react';

const PHRASES = [
  'Search for a brand, platform or category...',
  'eg. Myntra',
  'eg. Swiggy 50% off',
  'eg. Amazon Electronics',
  'eg. Zomato Food',
  'eg. BigBasket Grocery',
];

const TYPE_SPEED = 55;
const DELETE_SPEED = 30;
const PAUSE_AFTER_TYPE = 1600;
const PAUSE_AFTER_DELETE = 400;

export function useTypewriter() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);

    function tick() {
      const phrase = PHRASES[phraseIndex.current];

      if (!isDeleting.current) {
        // Typing
        charIndex.current += 1;
        setDisplayText(phrase.slice(0, charIndex.current));

        if (charIndex.current === phrase.length) {
          // Done typing — pause then delete
          isDeleting.current = true;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        timeoutRef.current = setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting
        charIndex.current -= 1;
        setDisplayText(phrase.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          // Done deleting — move to next phrase
          isDeleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % PHRASES.length;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);
          return;
        }
        timeoutRef.current = setTimeout(tick, DELETE_SPEED);
      }
    }

    timeoutRef.current = setTimeout(tick, 800);

    return () => {
      clearInterval(cursorInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { displayText, showCursor };
}
