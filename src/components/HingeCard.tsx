import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PromptAndResponse } from "@/types";

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function HingeCard({
  prompt,
  response,
  type,
}: PromptAndResponse & { type: "smallBig" | "serifSans" }) {
  const [userSwipe, setUserSwipe] = useState<"loved" | "hated" | null>(null);

  return (
    <Tiltable key={prompt}>
      {type === "smallBig" ? (
        <SmallBig
          key={prompt}
          prompt={prompt}
          response={response}
          userSwipe={userSwipe}
          setUserSwipe={setUserSwipe}
        />
      ) : (
        <SerifSans
          key={prompt}
          prompt={prompt}
          response={response}
          userSwipe={userSwipe}
          setUserSwipe={setUserSwipe}
        />
      )}
    </Tiltable>
  );
}

function SerifSans({
  prompt,
  response,
  userSwipe,
  setUserSwipe,
}: {
  prompt: string;
  response: string;
  userSwipe: "loved" | "hated" | null;
  setUserSwipe: (swipe: "loved" | "hated" | null) => void;
}) {
  return (
    <div
      className={classNames(
        "flex flex-col justify-start gap-2 w-full h-full z-50 p-6 transition-all",
        userSwipe === "loved" ? "bg-red-50" : "",
        userSwipe === "hated" ? "bg-gray-100 opacity-70" : ""
      )}
    >
      <p className="h-[55px] text-9xl text-gray-300 font-serif leading-none">
        &ldquo;
      </p>
      <h1 className="text-gray-800 font-serif text-2xl font-semibold">
        {prompt}
      </h1>
      <h2 className="text-gray-400 text-lg italic font-light font-sans">
        {response}
      </h2>
      <div
        className={`pointer-events-none absolute bottom-6 w-[calc(100%-3rem)] h-12 bg-gradient-to-t ${
          !userSwipe
            ? "from-white"
            : userSwipe === "loved"
            ? "from-red-50"
            : "from-gray-100"
        }`}
      />
      <HeartCircle userSwipe={userSwipe} setUserSwipe={setUserSwipe} />
    </div>
  );
}

function SmallBig({
  prompt,
  response,
  userSwipe,
  setUserSwipe,
}: {
  prompt: string;
  response: string;
  userSwipe: "loved" | "hated" | null;
  setUserSwipe: (swipe: "loved" | "hated" | null) => void;
}) {
  return (
    <div
      key={prompt}
      className={classNames(
        "flex flex-col justify-start gap-2 w-full h-full z-50 p-6 transition-all",
        userSwipe === "loved" ? "bg-red-50" : "",
        userSwipe === "hated" ? "bg-gray-100 opacity-70" : ""
      )}
    >
      <AnimatePresence key={prompt}>
        <p className="h-[55px] text-9xl text-gray-300 font-serif leading-none">
          &ldquo;
        </p>
        <motion.h1
          className="relative font-sans text-lg font-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {prompt}
        </motion.h1>
        {/* Scrim gradient to bottom so they know to scroll to read more. */}
        <motion.h2
          className="text-gray-800 font-semibold text-2xl font-serif overflow-auto relative pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {response}
        </motion.h2>
        <div
          className={`pointer-events-none absolute bottom-6 w-[calc(100%-3rem)] h-12 bg-gradient-to-t ${
            !userSwipe
              ? "from-white"
              : userSwipe === "loved"
              ? "from-red-50"
              : "from-gray-100"
          }`}
        />
        <HeartCircle userSwipe={userSwipe} setUserSwipe={setUserSwipe} />
      </AnimatePresence>
    </div>
  );
}

function HeartCircle({
  userSwipe,
  setUserSwipe,
}: {
  userSwipe: "loved" | "hated" | null;
  setUserSwipe: (swipe: "loved" | "hated" | null) => void;
}) {
  return (
    <div className="z-50 absolute top-0 right-0 m-2 flex flex-row gap-1">
      <div
        className="cursor-pointer w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
        onClick={() => setUserSwipe(userSwipe === "hated" ? null : "hated")}
      >
        <h1 className="text-xl pt-1 text-red-500 font-serif font-bold">👎</h1>
      </div>
      <div
        className="cursor-pointer w-12 h-12 rounded-full border border-red-200 bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
        onClick={() => setUserSwipe(userSwipe === "loved" ? null : "loved")}
      >
        <h1 className="text-xl pt-1 text-red-500 font-serif font-bold">❤️</h1>
      </div>
    </div>
  );
}

// Put these anywhere you wish, I personally put them into a dedicated `utils` file.
export function round(num: number, fix = 2) {
  return parseFloat(num.toFixed(fix));
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function Tiltable({ children }: { children: React.ReactNode }) {
  const [rotations, setRotations] = useState({ x: 0, y: 0, z: 0 });
  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingReference = useRef(isAnimating);
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });

  const animate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnimating(true);

    const rect = event.currentTarget.getBoundingClientRect();

    const absolute = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const percent = {
      x: Math.round((100 / rect.width) * absolute.x),
      y: Math.round((100 / rect.height) * absolute.y),
    };

    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    setRotations({
      x: round(((center.x > 50 ? 1 : -1) * center.x) / 12),
      y: round(center.y / 16),
      z: round(distance(percent.x, percent.y, 50, 50) / 20),
    });

    setGlare({
      x: percent.x,
      y: percent.y,
      opacity: 0.25,
    });
  };

  const stopAnimating = () => {
    setAnimating(false);

    setTimeout(() => {
      if (isAnimatingReference.current) return;

      setRotations({ x: 0, y: 0, z: 2 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, 100);
  };

  return (
    <motion.div
      onMouseMove={animate}
      onMouseLeave={stopAnimating}
      animate={{
        rotateY: rotations.x,
        rotateX: rotations.y,
        transformPerspective: rotations.z * 1000,
      }}
      className="relative overflow-hidden border border-solid border-gray-300 rounded-xl flex justify-start flex-col gap-2 aspect-square"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        perspective: "10000px",
      }}
    >
      {/* <motion.div
        style={{
          zIndex: 2,
          mixBlendMode: "overlay",
          position: "absolute",
          transform: "translateZ(1px)",
          width: "100%",
          height: "100%",
          borderRadius: "0.5rem",
          transformStyle: "preserve-3d",
          left: 0,
          top: 0,
          pointerEvents: "none",
          opacity: 0,
        }}
        animate={{
          background: `radial-gradient(
            farthest-corner circle at ${glare.x}% ${glare.y}%,
            rgba(255, 255, 255, 0.2) 10%,
            rgba(255, 255, 255, 0.1) 24%,
            rgba(0, 0, 0, 0.4) 82%
          )`,
          opacity: glare?.opacity ?? 0,
        }}
      /> */}
      {children}
    </motion.div>
  );
}
