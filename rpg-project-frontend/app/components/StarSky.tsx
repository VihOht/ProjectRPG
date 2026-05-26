import { useEffect, useRef, type ReactNode } from "react";

type Star = {
  id: string;
  left: string;
  top: string;
  size: string;
  opacity: number;
  animationDelay: string;
  animationDuration: string;
};

type StarLayer = {
  key: string;
  className: string;
  stars: Star[];
};

const createRandom = (seed: number) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const createStars = (
  layerKey: string,
  count: number,
  seed: number,
  minSize: number,
  maxSize: number,
  minOpacity: number,
  maxOpacity: number,
) => {
  const random = createRandom(seed);

  return Array.from({ length: count }, (_, index) => {
    const size = minSize + random() * (maxSize - minSize);
    const opacity = minOpacity + random() * (maxOpacity - minOpacity);

    return {
      id: `${layerKey}-${index}`,
      left: `${(random() * 100).toFixed(2)}%`,
      top: `${(random() * 100).toFixed(2)}%`,
      size: `${size.toFixed(2)}px`,
      opacity: Number(opacity.toFixed(2)),
      animationDelay: `${(random() * -5).toFixed(2)}s`,
      animationDuration: `${(3.5 + random() * 4).toFixed(2)}s`,
    };
  });
};

const STAR_LAYERS: StarLayer[] = [
  {
    key: "far",
    className: "star-layer-far",
    stars: createStars("far", 270, 1229, 0.5, 1, 0.3, 0.65),
  },
  {
    key: "mid",
    className: "star-layer-mid",
    stars: createStars("mid", 170, 4583, 0.8, 1.6, 0.45, 0.78),
  },
  {
    key: "near",
    className: "star-layer-near",
    stars: createStars("near", 100, 9137, 1.2, 2.4, 0.62, 0.95),
  },
];

export function StarSky({ children }: { children: ReactNode }) {
  const skyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const skyElement = skyRef.current;

    if (!skyElement) {
      return;
    }

    let animationFrame = 0;

    const updateSkyPosition = () => {
      const scrollY = window.scrollY;

      skyElement.style.setProperty(
        "--star-far-scroll-y",
        `${(scrollY * -0.04).toFixed(2)}px`,
      );
      skyElement.style.setProperty(
        "--star-mid-scroll-y",
        `${(scrollY * -0.1).toFixed(2)}px`,
      );
      skyElement.style.setProperty(
        "--star-near-scroll-y",
        `${(scrollY * -0.18).toFixed(2)}px`,
      );
    };

    const handleScroll = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        updateSkyPosition();
      });
    };

    updateSkyPosition();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={skyRef}
      className="star-sky min-h-screen bg-gradient-to-r from-vaccineDarkBlue to-vaccineBlue"
    >
      {STAR_LAYERS.map((layer) => (
        <div key={layer.key} className={`star-layer ${layer.className}`}>
          {layer.stars.map((star) => (
            <span
              key={star.id}
              className="star-point"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration,
              }}
            />
          ))}
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
