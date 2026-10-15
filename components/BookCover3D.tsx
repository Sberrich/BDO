"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  cover: string;
  size: [number, number];
  children: ReactNode;
};

/** Pages edge: thin cream stripes so the book reads as a stack of sheets. */
function pagesTexture(THREE: typeof import("three")) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f4f1ea";
  g.fillRect(0, 0, c.width, c.height);
  for (let x = 0; x < c.width; x += 2) {
    g.fillStyle = x % 4 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.6)";
    g.fillRect(x, 0, 1, c.height);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function BookCover3D({ cover, size, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const [w, h] = size;
      const aspect = w / h;
      const bookH = aspect >= 1 ? 2.2 / aspect : 2.6;
      const bookW = bookH * aspect;
      const depth = 0.14;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.className = "book3d__canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0, 7.2);

      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(-2.5, 3, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x9fc3ff, 1.4);
      rim.position.set(3, -1, -2);
      scene.add(rim);
      const glint = new THREE.PointLight(0xffffff, 0, 6);
      glint.position.set(0, 0, 2.2);
      scene.add(glint);

      const loader = new THREE.TextureLoader();
      const front = loader.load(cover, () => {
        if (!disposed) setLive(true);
      });
      front.colorSpace = THREE.SRGBColorSpace;
      front.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const pages = pagesTexture(THREE);
      const pagesV = pages.clone();
      pagesV.center.set(0.5, 0.5);
      pagesV.rotation = Math.PI / 2;
      const navy = new THREE.MeshStandardMaterial({ color: 0x0b2a4d, roughness: 0.55, metalness: 0.1 });
      const mats = [
        new THREE.MeshStandardMaterial({ map: pages, roughness: 0.9 }),
        navy,
        new THREE.MeshStandardMaterial({ map: pagesV, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ map: pagesV, roughness: 0.9 }),
        new THREE.MeshPhysicalMaterial({ map: front, roughness: 0.38, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
        navy,
      ];
      const geo = new THREE.BoxGeometry(bookW, bookH, depth, 1, 1, 1);
      const book = new THREE.Mesh(geo, mats);

      const pivot = new THREE.Group();
      pivot.add(book);
      scene.add(pivot);

      const resize = () => {
        const host = el.getBoundingClientRect();
        const r = renderer.domElement.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / Math.max(r.height, 1);
        const fit = Math.max(
          (bookH * r.height) / Math.max(host.height, 1),
          (bookW * r.width) / Math.max(host.width, 1) / camera.aspect,
        );
        camera.position.z = fit / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const target = { x: 0, y: 0 };
      const cur = { x: 0, y: 0 };
      let hover = 0;
      let hoverTarget = 0;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 1.5)));
        target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.5)));
      };
      const onEnter = () => (hoverTarget = 1);
      const onLeave = () => {
        hoverTarget = 0;
        target.x = target.y = 0;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);

      const start = performance.now();
      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const t = (performance.now() - start) / 1000;
        cur.x += (target.x - cur.x) * 0.06;
        cur.y += (target.y - cur.y) * 0.06;
        hover += (hoverTarget - hover) * 0.08;

        const float = Math.sin(t * 1.1) * 0.06;
        pivot.position.y = float + hover * 0.05;
        pivot.rotation.y = -0.42 + Math.sin(t * 0.55) * 0.1 + cur.x * 0.55 + hover * 0.22;
        pivot.rotation.x = 0.06 + cur.y * 0.3 + Math.sin(t * 0.8) * 0.02;
        pivot.rotation.z = -0.02 + Math.sin(t * 0.45) * 0.015;

        glint.intensity = 1.6 * hover;
        glint.position.x = cur.x * 2;
        glint.position.y = -cur.y * 2;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        geo.dispose();
        mats.forEach((m) => m.dispose());
        front.dispose();
        pages.dispose();
        pagesV.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [cover, size]);

  return (
    <div ref={host} className={`book3d${live ? " is-live" : ""}`}>
      {children}
    </div>
  );
}
