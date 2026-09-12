import { useEffect, useRef } from "react";

export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>(".reveal-blur");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in-view", e.isIntersecting)),
      { threshold: 0.25 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
};
