"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: string;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = "40px",
  className = "",
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [once, threshold]);

  const getTransform = () => {
    if (isVisible) return "translate(0, 0)";
    switch (direction) {
      case "up": return `translateY(${distance})`;
      case "down": return `translateY(-${distance})`;
      case "left": return `translateX(${distance})`;
      case "right": return `translateX(-${distance})`;
      default: return "none";
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
}
