import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import algo from "../assets/images/algo21.png";
import clouds from "../assets/images/clouds.png";
import { StarSky } from "../components/StarSky";

type Fanart = {
  src?: string;
  title: string;
  artist: string;
  description: string;
};

const fanarts: Fanart[] = [
  {
    src: algo,
    title: "Montanhas de Insonia",
    artist: "Comunidade",
    description: "Paisagem das terras de Insonia.",
  },
  {
    title: "Nova fanart",
    artist: "Em breve",
    description: "Espaco reservado para a proxima arte da comunidade.",
  },
  {
    title: "Outra fanart",
    artist: "Em breve",
    description: "Mais um espaco para novas artes.",
  },
];

const credits = [
  {
    role: "Desenvolvedores",
    names: "furry e rafinha gameplays",
  },
  {
    role: "Criador do RPG",
    names: "A definir",
  },
];

export default function HomePage() {
  const [alturaScroll, setAlturaScroll] = useState(0);
  const [fanartIndex, setFanartIndex] = useState(0);

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

    const corInicial = { r: 161, g: 195, b: 255 };
    const corFinal = { r: 1, g: 0, b: 17,  };

    const r = Math.round(corInicial.r + (corFinal.r - corInicial.r) * progress);
    const g = Math.round(corInicial.g + (corFinal.g - corInicial.g) * progress);
    const b = Math.round(corInicial.b + (corFinal.b - corInicial.b) * progress);

    const opacidadeInicial = 0.99;
    const opacidadeFinal = 0.01;

    const alpha = opacidadeInicial + (opacidadeFinal - opacidadeInicial) * progress;
    const activeFanart = fanarts[fanartIndex];

    const goToPreviousFanart = () => {
      setFanartIndex((currentIndex) =>
        currentIndex === 0 ? fanarts.length - 1 : currentIndex - 1,
      );
    };

    const goToNextFanart = () => {
      setFanartIndex((currentIndex) =>
        currentIndex === fanarts.length - 1 ? 0 : currentIndex + 1,
      );
    };
    
    return (
    <div
        className="min-h-[200vh]"
        style={{
        backgroundColor: "#010011",
        }}
    >
        <StarSky>
        <main
            className="min-h-[200vh] px-6 py-20"
            style={{
            backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
            }}
        >
            <section className="fixed top-0 right-0 z-50 p-6 px-4 py-2">
            <div className="mt-8">
                <a
                href="/auth/login"
                className="rounded-lg bg-black px-6 py-3 text-white"
                >
                Entrar
                </a>
            </div>
            </section>
            <h1 className="text-vaccinePurple font-myFont items-center justify-center text-center text-9xl pt-10">
                Insonia
            </h1>
            <section className="relative left-1/2 w-screen -translate-x-1/2">
                <img
                src={clouds}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-[-18px] z-0 h-[clamp(280px,45vw,640px)] w-full max-w-none object-fill"
                />
                <img
                src={algo}
                alt="Algo"
                className="relative z-10 h-[clamp(280px,45vw,640px)] w-full max-w-none object-fill"
                />
                <div
                aria-hidden="true"
                className="relative z-20 h-24 w-full bg-gradient-to-b from-black via-black/70 to-transparent"
                />
            </section>
            <h1 className="text-white">
                fanart
            </h1>
            <section className="mx-auto mt-8 w-full max-w-6xl">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {fanarts.map((fanart) => (
                        <article
                            key={fanart.title}
                            className="overflow-hidden rounded-md border border-white/15 bg-vaccineBlueTones-1000/70 shadow-lg shadow-black/30"
                        >
                            <img
                                src={fanart.src}
                                alt={`Fanart ${fanart.title}`}
                                className="h-64 w-full object-cover"
                            />
                            <div className="border-t border-white/10 p-4">
                                <h2 className="font-trajanPBold text-xl text-white">
                                    {fanart.title}
                                </h2>
                                <p className="mt-1 text-sm text-vaccineGray-300">
                                    {fanart.artist}
                                </p>
                            </div>
                        </article>
                    ))}

                    <article className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20 p-4 text-center text-vaccineGray-300">
                        Espaço para nova fanart
                    </article>
                </div>
            </section>
            <h1 className="flex flex-col justify-end items-center text-white">
                Desenvolvedores: furry e rafinha gameplays
            </h1>

        </main>
        </StarSky>
    </div>
    );
}
