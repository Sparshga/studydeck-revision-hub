
import React from "react";

// Colorful palettes for light/dark mode
const pastelColors = [
  "rgba(255, 180, 120, 0.7)",    // orange
  "rgba(150, 200, 255, 0.7)",    // light blue
  "rgba(190, 255, 170, 0.68)",   // green
  "rgba(255, 170, 230, 0.62)",   // pink-purple
  "rgba(220, 250, 160, 0.6)",    // yellow-green
  "rgba(255,215,100, 0.72)",     // gold
  "rgba(110,255,230,0.62)",      // turquoise
  "rgba(250,165,200,0.66)",      // rose
  "rgba(170,230,255,0.63)",      // baby blue
];

const baseSize = 110;

type ClickBubble = {
  id: number;
  x: number;
  y: number;
  color: string;
  created: number;
};

const Bubble: React.FC<{ x: number; y: number; color: string; remove: boolean }> = ({
  x,
  y,
  color,
  remove,
}) => (
  <div
    className={`absolute rounded-full pointer-events-none transition-all duration-700 ease-out`}
    style={{
      left: x - baseSize / 2,
      top: y - baseSize / 2,
      width: baseSize,
      height: baseSize,
      background: color,
      opacity: remove ? 0 : 1,
      filter: `blur(10px) opacity(0.78) drop-shadow(0 0 32px ${color})`,
      boxShadow: `0 0 64px 0 ${color}`,
      transform: remove ? "scale(1.26)" : "scale(1)",
      transition:
        "opacity 0.7s, transform 0.7s, filter 0.7s, box-shadow 0.7s",
      zIndex: 1,
    }}
  />
);

const ReactiveBackground: React.FC = () => {
  const [bubbles, setBubbles] = React.useState<ClickBubble[]>([]);
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const idRef = React.useRef(0);

  // Watch for dark mode
  React.useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setMode(isDark ? "dark" : "light");
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Add a bubble on click (anywhere)
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Limit target to window/document only (not forms/inputs)
      if (
        // @ts-ignore
        typeof e.target?.closest === "function" &&
        // @ts-ignore
        e.target.closest("input, textarea, button, select, [data-ignore-background-bubble]")
      ) {
        return;
      }
      const palette = pastelColors;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const id = idRef.current++;
      setBubbles((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          color,
          created: Date.now(),
        },
      ]);
      // Remove after 1.05s for fade-out animation
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, 1050);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Compute which bubbles should remove (fade out) based on time
  const now = Date.now();
  const rendered = bubbles.map((bubble) => ({
    ...bubble,
    remove: now - bubble.created > 700,
  }));

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" aria-hidden="true">
      {rendered.map((b) => (
        <Bubble key={b.id} x={b.x} y={b.y} color={b.color} remove={b.remove} />
      ))}
    </div>
  );
};

export default ReactiveBackground;

