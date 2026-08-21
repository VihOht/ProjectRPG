import { useEffect, useState } from "react";
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
    // src: algo,
    title: "#1",
    artist: "Em breve",
    description: "espaço reservado para artes.",
  },
  {
    title: "#2",
    artist: "Em breve",
    description: "espaço reservado para artes.",
  },
  {
    title: "#3",
    artist: "Em breve",
    description: "espaço reservado para artes",
  },
];

function FanartPicture({
  fanart,
  className,
}: {
  fanart: Fanart;
  className: string;
}) {
  if (fanart.src) {
    return (
      <img
      src={fanart.src}
      alt={`Fanart ${fanart.title}`}
      className={`${className} object-cover`}
      />
    );
  }

  return (
    <div
    className={`${className} flex items-center justify-center bg-vaccineBlueTones-1000/40 px-4 text-center`}
    >
      <p className="text-2xl font-semibold text-vaccineGray-600">Em breve</p>
    </div>
  );
}

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFanartIndex((currentIndex) =>
        currentIndex === fanarts.length - 1 ? 0 : currentIndex + 1,
      );
    }, 6000);

    return () => {
      window.clearInterval(intervalId);
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
    const previousFanartIndex =
      fanartIndex === 0 ? fanarts.length - 1 : fanartIndex - 1;
    const nextFanartIndex =
      fanartIndex === fanarts.length - 1 ? 0 : fanartIndex + 1;
    const previousFanart = fanarts[previousFanartIndex];
    const nextFanart = fanarts[nextFanartIndex];

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
            className="min-h-[200vh] px-6 py-20 font-vollkorn"
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
            <h1 className="text-vaccinePurple font-myFont items-center justify-center text-center sm:text-9xl pt-10 text-6xl">
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
            <section className="mx-auto mt-12 w-full max-w-6xl space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="p-2">
                        <h2 className="text-2xl font-semibold text-vaccineGray-300">
                            Fanarts
                        </h2>
                        <p className="text-vaccineGray-600">
                            Galeria de artes da comunidade de Insonia.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">


                    </div>
                </div>

                <article className="md:p-4 p-2">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)_minmax(0,0.8fr)] md:items-center">
                        <button
                        type="button"
                        onClick={goToPreviousFanart}
                        className="group relative min-h-64 overflow-hidden rounded-md border border-vaccineGray-200/20 bg-vaccineGray-800/20 text-left transition hover:border-vaccinePurple/70 md:min-h-80"
                        >
                            <FanartPicture
                            fanart={previousFanart}
                            className="absolute inset-0 h-full w-full opacity-70 transition group-hover:opacity-90"
                            />
                            <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                                <p className="text-xs text-vaccineGray-600">Anterior</p>
                                <h3 className="mt-1 text-lg font-semibold text-vaccineGray-300">
                                    {previousFanart.title}
                                </h3>
                            </div>
                        </button>

                        <div className="relative min-h-[clamp(340px,46vw,560px)] overflow-hidden rounded-md border">
                            <FanartPicture
                            fanart={activeFanart}
                            className="absolute inset-0 h-full w-full transition duration-700"
                            />
                            <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                            />

                            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                                <p className="text-sm text-vaccinePurple">
                                    {activeFanart.artist}
                                </p>
                                <h3 className="mt-1 text-3xl font-semibold text-white md:text-4xl">
                                    {activeFanart.title}
                                </h3>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-vaccineGray-300">
                                    {activeFanart.description}
                                </p>
                            </div>
                        </div>

                        <button
                        type="button"
                        onClick={goToNextFanart}
                        className="group relative min-h-64 overflow-hidden rounded-md border border-vaccineGray-200/20 bg-vaccineGray-800/20 text-left transition hover:border-vaccinePurple/70 md:min-h-80"
                        >
                            <FanartPicture
                            fanart={nextFanart}
                            className="absolute inset-0 h-full w-full opacity-70 transition group-hover:opacity-90"
                            />
                            <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                                <p className="text-xs text-vaccineGray-600">Proxima</p>
                                <h3 className="mt-1 text-lg font-semibold text-vaccineGray-300">
                                    {nextFanart.title}
                                </h3>
                            </div>
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {fanarts.map((fanart, index) => (
                            <button
                            key={fanart.title}
                            type="button"
                            onClick={() => setFanartIndex(index)}
                            aria-label={`Abrir fanart ${index + 1}`}
                            className={`h-2 flex-1 rounded-md transition ${
                                index === fanartIndex
                                ? ""
                                : ""
                            }`}
                            />
                        ))}
                    </div>
                </article>
            </section>

            <footer className="mx-auto mt-12 w-full max-w-6xl pb-4">
                <p className="text-center text-xs text-vaccineGray-600">
                    Criação de Matheus e desenvolvimento por Robson e Rafaela.
                </p>
            </footer>

        </main>
        </StarSky>
    </div>
    );
}
