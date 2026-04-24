export function generateTorusFrames({ count = 80, size = 600 } = {}) {
  const frames = [];
  const R = size * 0.22;
  const r = size * 0.09;

  for (let f = 0; f < count; f++) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const cx = size / 2;
    const cy = size / 2;
    const angleY = (f / count) * Math.PI * 2;
    const angleX = Math.PI * 0.28;

    const points = [];
    const thetaSteps = 28;
    const phiSteps = 70;

    for (let i = 0; i < thetaSteps; i++) {
      for (let j = 0; j < phiSteps; j++) {
        const theta = (i / thetaSteps) * Math.PI * 2;
        const phi = (j / phiSteps) * Math.PI * 2;

        let x = (R + r * Math.cos(theta)) * Math.cos(phi);
        let y = (R + r * Math.cos(theta)) * Math.sin(phi);
        let z = r * Math.sin(theta);

        const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
        const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
        y = y1;
        z = z1;

        const x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
        const z2 = -x * Math.sin(angleY) + z * Math.cos(angleY);
        x = x1;
        z = z2;

        const persp = 500 / (500 + z);
        points.push({
          px: cx + x * persp,
          py: cy + y * persp,
          z,
          phi,
          persp,
        });
      }
    }

    points.sort((a, b) => a.z - b.z);

    ctx.fillStyle = "rgba(5, 5, 12, 0.0)";
    ctx.clearRect(0, 0, size, size);

    for (const p of points) {
      const depth = (p.z + r * 1.5) / (r * 3);
      const d = Math.max(0, Math.min(1, depth));
      const hue = (p.phi / (Math.PI * 2)) * 360;
      const alpha = 0.25 + d * 0.75;
      ctx.fillStyle = `hsla(${hue}, 95%, ${40 + d * 45}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.px, p.py, 1.8 + d * 2.2 * p.persp, 0, Math.PI * 2);
      ctx.fill();
    }

    frames.push(canvas);
  }

  return frames;
}
