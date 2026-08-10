import { useEffect, useState } from "react";
import algo from "../assets/images/algo21.png";

export default function HomePage() {
  const [alturaScroll, setAlturaScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setAlturaScroll(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    const progress = Math.min(1, alturaScroll / 1000);

    const corInicial = { r: 130, g: 86, b: 86 };
    const corFinal = { r: 5, g: 12, b: 31 };

    const r = Math.round(corInicial.r + (corFinal.r - corInicial.r) * progress);
    const g = Math.round(corInicial.g + (corFinal.g - corInicial.g) * progress);
    const b = Math.round(corInicial.b + (corFinal.b - corInicial.b) * progress);
    
  return (
    <main
        style={{
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        }}
      className="min-h-[200vh] px-6 py-20"
    >
      <img
        src={algo}
        alt="Algo"
        className="w-full h-auto"
      />

      <section className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold">
          :P
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          wawawawawa
        </p>

        {/* <p className="mt-4 text-xl font-bold">
          Distância de Scroll {alturaScroll}px
        </p> */}

        {/* <p className="text-xl text-gray-500 font-bold">
          Opacidade {(opacity * 100).toFixed(0)}%
        </p> */}

        <div className="mt-8">
          <a
            href="/auth/login"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Entrar
          </a>
        </div>
      </section>
    </main>
  );
}