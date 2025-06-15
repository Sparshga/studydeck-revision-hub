
import React, { useEffect, useRef } from "react";

// Colorful palettes for light/dark mode
const pastelColors = [
  "rgba(255, 180, 120, 0.55)", // orange
  "rgba(150, 200, 255, 0.55)", // light blue
  "rgba(190, 255, 170, 0.53)", // green
  "rgba(255, 170, 230, 0.45)", // pink-purple
  "rgba(220, 250, 160, 0.45)", // yellow-green
];
const darkColors = [
  "rgba(20,20,30,0.7)",
  "rgba(44,44,60,0.6)",
  "rgba(25,25,50,0.5)",
  "rgba(40,40,80,0.38)",
  "rgba(65,65,90,0.42)"
];

const numBubbles = 5;
const baseSize = 170;

// Bubbles pulse in size when clicked
const Bubble = ({
  x,
  y,
  color,
  pulsed,
  style,
}: {
  x: number;
  y: number;
  color: string;
  pulsed?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    className="absolute rounded-full pointer-events-none mix-blend-lighten transition-all duration-300"
    style={{
      left: x - baseSize / 2,
      top: y - baseSize / 2,
      width: baseSize,
      height: baseSize,
      background: color,
      filter: `blur(14px) opacity(0.54) drop-shadow(0 0 42px ${color})`,
      boxShadow: "0 0 80px 0 rgba(0,0,0,0.12)",
      transform: pulsed ? "scale(1.18)" : "scale(1)",
      ...style,
    }}
  />
);

const ReactiveBackground: React.FC = () => {
  const [bubbles, setBubbles] = React.useState(
    Array.from({ length: numBubbles }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      pulsed: false,
    }))
  );

  // Hold animation frame
  const requestRef = useRef<number>();
  // Track targets for each bubble
  const targets = useRef(
    Array.from({ length: numBubbles }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }))
  );

  // Use system theme or html class for mode
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  useEffect(() => {
    const updateTheme = () => {
      // Use html class as main source
      const isDark = document.documentElement.classList.contains("dark");
      setMode(isDark ? "dark" : "light");
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Mouse moves make bubbles follow with offsets for parallax
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      for (let i = 0; i < numBubbles; i++) {
        // Circular offsets for distributed motion
        const angle = (i / numBubbles) * Math.PI * 2;
        const offsetX = Math.cos(angle) * 110 + Math.sin(e.clientY * 0.001 + i) * 18;
        const offsetY = Math.sin(angle) * 110 + Math.cos(e.clientX * 0.001 + i) * 14;
        targets.current[i] = {
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        };
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Animate them smoothly toward targets
  useEffect(() => {
    const animate = () => {
      setBubbles((prev) =>
        prev.map((b, i) => {
          const tx = targets.current[i].x;
          const ty = targets.current[i].y;
          return {
            ...b,
            x: b.x + (tx - b.x) * (0.09 + 0.02 * i),
            y: b.y + (ty - b.y) * (0.09 + 0.01 * i),
          };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Responsive center
  useEffect(() => {
    function handleResize() {
      setBubbles(
        Array.from({ length: numBubbles }, () => ({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          pulsed: false,
        }))
      );
      targets.current = Array.from({ length: numBubbles }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pulse effect on click: All bubbles scale up for 250ms
  useEffect(() => {
    function handleClick() {
      setBubbles((prev) => prev.map((b) => ({ ...b, pulsed: true })));
      setTimeout(() => {
        setBubbles((prev) => prev.map((b) => ({ ...b, pulsed: false })));
      }, 250);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Pick palette based on mode
  const palette = mode === "dark" ? darkColors : pastelColors;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden="true"
    >
      {bubbles.map((bubble, i) => (
        <Bubble
          key={i}
          x={bubble.x}
          y={bubble.y}
          color={palette[i % palette.length]}
          pulsed={bubble.pulsed}
          style={{
            filter: `blur(${15 + i * 3}px) opacity(${
              0.35 + i * 0.14
            }) drop-shadow(0 0 62px ${palette[i % palette.length]})`,
            transition: "filter 0.44s, box-shadow 0.43s, transform 0.26s",
          }}
        />
      ))}
    </div>
  );
};

export default ReactiveBackground;
