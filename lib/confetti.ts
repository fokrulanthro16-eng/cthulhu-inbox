import confetti from "canvas-confetti";

/**
 * Procedural eldritch tentacle particle wave.
 * Emits dark-green and luminescent phosphor ribbons that drift and curve
 * across the CRT viewport simulating writhing abyssal tendrils.
 * Uses exact requested palette: #00ff66, #1a5c2d, #052e16
 */
export function fireEldritchTentacles(): void {
  if (typeof window === "undefined") return;

  const tentacleColors = ["#00ff66", "#1a5c2d", "#052e16"];

  // Left tentacle eruption curving right
  confetti({
    particleCount: 55,
    angle: 65,
    spread: 38,
    origin: { x: 0.05, y: 0.95 },
    colors: tentacleColors,
    startVelocity: 55,
    gravity: 0.65,
    drift: 1.5,
    ticks: 240,
    scalar: 1.35,
  });

  // Right tentacle eruption curving left
  confetti({
    particleCount: 55,
    angle: 115,
    spread: 38,
    origin: { x: 0.95, y: 0.95 },
    colors: tentacleColors,
    startVelocity: 55,
    gravity: 0.65,
    drift: -1.5,
    ticks: 240,
    scalar: 1.35,
  });

  // Center writhing tendril burst with slight delay
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 90,
      spread: 65,
      origin: { x: 0.5, y: 0.98 },
      colors: tentacleColors,
      startVelocity: 62,
      gravity: 0.55,
      drift: 0.25,
      ticks: 260,
      scalar: 1.45,
    });
  }, 130);
}
