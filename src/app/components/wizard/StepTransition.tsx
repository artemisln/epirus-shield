"use client";

import { ReactNode, useEffect, useState } from "react";

interface StepTransitionProps {
  children: ReactNode;
  stepKey: string | number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(stepKey);
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (stepKey !== currentKey) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentKey(stepKey);
        setContent(children);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [stepKey, currentKey, children]);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {content}
    </div>
  );
}
