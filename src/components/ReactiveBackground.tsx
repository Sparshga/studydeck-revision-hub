
import React from "react";

// Simple vivid bubble colors for best visibility
const colors = [
  "#FF6B6B", // red
  "#6BCB77", // green
  "#4D96FF", // blue
  "#FFD93D", // yellow
  "#FF6BAA", // pink
  "#6B6BFF", // purple-blue
  "#FFB26B", // orange
];

// How long the bubble persists (ms)
const DURATION = 1000;
const SIZE = 120;

type Bubble = {
  id: number;
  x: number;
  y: number;
  color: string;
  born: number;
};

const Bubble: React.FC<{ x: number; y: number; color: string; fading: boolean }> = ({
  x,
  y,
  color,
  fading,
}) => (
  <div
    className={`absolute rounded-full pointer-events-none transition-all duration-700`}
    style={{
      left: x - SIZE / 2,
      top: y - SIZE / 2,
      width: SIZE,
      height: SIZE,
      background: color,
      opacity: fading ? 0 : 0.7,
      zIndex: 9999,
      boxShadow: `0 0 32px 0 ${color}`,
      transform: fading ? "scale(1.2)" : "scale(1)",
      transition: "opacity 0.6s, transform 0.6s",
    }}
  />
);

const ReactiveBackground: React.FC = () => {
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const idRef = React.useRef(0);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Ignore click if on form input/button/select/textarea
      if (
        typeof (e.target as HTMLElement)?.closest === "function" &&
        (e.target as HTMLElement).closest(
          "input, textarea, button, select, [data-ignore-background-bubble]"
        )
      ) {
        return;
      }
      // Pick a random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      const id = idRef.current++;
      setBubbles((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          color,
          born: Date.now(),
        },
      ]);
      // Remove after DURATION+100ms for fade out
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, DURATION + 100);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const now = Date.now();
  const display = bubbles.map((b) => ({
    ...b,
    fading: now - b.born > DURATION * 0.7,
  }));

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {display.map((b) => (
        <Bubble
          key={b.id}
          x={b.x}
          y={b.y}
          color={b.color}
          fading={b.fading}
        />
      ))}
    </div>
  );
};

export default ReactiveBackground;

