
import React, { useEffect, useRef } from "react";

const blobColors = [
  "rgba(20,20,20,0.7)",
  "rgba(40,40,40,0.6)",
  "rgba(60,60,60,0.4)",
  "rgba(30,30,30,0.5)"
];

const numBlobs = 4;

const blobSize = 380;

const Blob = ({
  x,
  y,
  color,
  style,
}: {
  x: number;
  y: number;
  color: string;
  style?: React.CSSProperties;
}) => (
  <div
    className="absolute rounded-full pointer-events-none mix-blend-lighten blur-3xl transition-transform duration-300"
    style={{
      left: x - blobSize / 2,
      top: y - blobSize / 2,
      width: blobSize,
      height: blobSize,
      background: color,
      boxShadow: "0 0 120px 0 rgba(0,0,0,0.9)",
      ...style,
    }}
  />
);

const ReactiveBackground: React.FC = () => {
  const [blobs, setBlobs] = React.useState(
    Array.from({ length: numBlobs }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }))
  );

  // Store stable movement for smoothness
  const requestRef = useRef<number>();

  // Store target position for each blob
  const targets = useRef(
    Array.from({ length: numBlobs }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }))
  );

  // Mouse tracking
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Each blob targets mouse + slightly different offset for a parallax effect
      for (let i = 0; i < numBlobs; i++) {
        targets.current[i] = {
          x: e.clientX + Math.sin(i * 2) * 120,
          y: e.clientY + Math.cos(i * 2) * 120,
        };
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate the blobs smoothly towards their targets
  useEffect(() => {
    const animate = () => {
      setBlobs((prev) =>
        prev.map((blob, i) => {
          const tx = targets.current[i].x;
          const ty = targets.current[i].y;
          // Lerp for smooth, slightly lagging movement
          return {
            x: blob.x + (tx - blob.x) * (0.06 + 0.025 * i),
            y: blob.y + (ty - blob.y) * (0.06 + 0.018 * i),
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

  // Responsive: center blobs on window resize
  useEffect(() => {
    function handleResize() {
      setBlobs(
        Array.from({ length: numBlobs }, () => ({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }))
      );
      targets.current = Array.from({ length: numBlobs }, () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show in dark mode
  const html = document?.documentElement;
  const isDark = html && html.classList.contains("dark");

  if (!isDark) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <Blob
          key={i}
          x={blob.x}
          y={blob.y}
          color={blobColors[i % blobColors.length]}
          style={{
            filter: `blur(${26 + i * 6}px) opacity(${
              0.23 + i * 0.11
            })`,
            transition: "filter 0.4s, box-shadow 0.4s",
          }}
        />
      ))}
    </div>
  );
};

export default ReactiveBackground;
