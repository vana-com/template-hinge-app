import React, { useRef, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  PanInfo,
  MotionValue,
  useMotionValue,
} from "framer-motion";
import normalizeWheel from "normalize-wheel";
import { useRafLoop } from "react-use";
import { useWindowSize } from "@react-hook/window-size";

const prompts = [
  {
    prompt: "This year, I really want to...",
    response: "finally learn how to fold a fitted sheet – adulting level 100.",
  },
  {
    prompt: "I recently discovered that...",
    response: "I can say 'no' to a second coffee. But why would I?",
  },
  {
    prompt: "I'm looking for...",
    response: "my other sock. It's a solo journey.",
  },
  {
    prompt: "A shower thought I recently had...",
    response: "If I were a superhero, my power would be drying off instantly.",
  },
  {
    prompt: "My most irrational fear is...",
    response: "that autocorrect will expose my poor spelling in a group chat.",
  },
  {
    prompt: "A perfect day for me looks like...",
    response: "24 hours of no battery low notifications.",
  },
  {
    prompt: "My go-to karaoke song is...",
    response: "anything by Queen – guaranteed crowd pleaser.",
  },
  {
    prompt: "On Sundays, you can usually find me...",
    response:
      "pretending to have plans but really just recharging my social battery.",
  },
  {
    prompt: "I get along best with people who...",
    response: "can appreciate a good dad joke.",
  },
  {
    prompt: "The last book I read and loved was...",
    response: "a cookbook. I’m now a three-recipe wonder.",
  },
  {
    prompt: "I'm weirdly attracted to...",
    response: "people who use the correct your/you're.",
  },
  {
    prompt: "If I could travel anywhere, I'd go to...",
    response: "a place where my phone auto-connects to WiFi.",
  },
  {
    prompt: "An underrated pleasure of mine is...",
    response: "perfectly timing the microwave to stop at 1 second.",
  },
  {
    prompt: "Something that's non-negotiable for me is...",
    response: "coffee in the morning, or I'm basically a zombie.",
  },
  {
    prompt: "The best gift I've ever received was...",
    response: "a plant I haven't managed to kill yet. It's a miracle.",
  },
  {
    prompt: "My favorite family tradition is...",
    response: "overcooking the turkey every Thanksgiving.",
  },
  {
    prompt: "A skill I want to master this year is...",
    response: "not killing houseplants. It's harder than it looks.",
  },
  {
    prompt: "The way to win me over is...",
    response: "with a good pun. I'm all about that pun life.",
  },
  {
    prompt: "Something that makes me laugh out loud...",
    response: "is when dogs have human names like Gary.",
  },
  {
    prompt: "I'm secretly really good at...",
    response: "giving life advice. I'm basically a fortune cookie.",
  },
  {
    prompt: "A random fact I love is...",
    response: "that otters hold hands while sleeping so they don't drift away.",
  },
  {
    prompt: "The best adventure I've been on...",
    response: "was finding my way back home without GPS.",
  },
  {
    prompt: "My ideal weekend includes...",
    response: "a little bit of adventure and a lot of doing nothing.",
  },
  {
    prompt: "I feel most empowered when...",
    response: "I fix something without Googling it.",
  },
  {
    prompt: "One thing I'll never do again is...",
    response: "eat a whole pizza by myself. I still feel it.",
  },
  {
    prompt: "My greatest accomplishment so far is...",
    response: "remembering all my passwords without a reset.",
  },
  {
    prompt: "If I had one superpower, it would be...",
    response: "to refill things – my bank account, my coffee, my patience.",
  },
  {
    prompt: "The most spontaneous thing I've done is...",
    response: "book a trip based on the next flight out.",
  },
  {
    prompt: "A cause I'm passionate about is...",
    response: "saving the bees. It's the buzz I can't ignore.",
  },
  {
    prompt: "The quirkiest thing about me is...",
    response: "I can name every state in alphabetical order.",
  },
];

export default function LandingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2 fixed bottom-0 left-0 w-full pb-2">
        <InteractiveMarquee direction="forwards">
          {prompts.slice(0, 8).map((prompt) => (
            <HingeCardReadOnly
              key={prompt.prompt}
              prompt={prompt.prompt}
              response={prompt.response}
            />
          ))}
        </InteractiveMarquee>
        <InteractiveMarquee direction="backwards">
          {prompts.slice(8, 16).map((prompt) => (
            <HingeCardReadOnly
              key={prompt.prompt}
              prompt={prompt.prompt}
              response={prompt.response}
            />
          ))}
        </InteractiveMarquee>
        <InteractiveMarquee direction="forwards">
          {prompts.slice(16, 24).map((prompt) => (
            <HingeCardReadOnly
              key={prompt.prompt}
              prompt={prompt.prompt}
              response={prompt.response}
            />
          ))}
          {prompts.slice(24, 30).map((prompt) => (
            <HingeCardReadOnly
              key={prompt.prompt}
              prompt={prompt.prompt}
              response={prompt.response}
            />
          ))}
        </InteractiveMarquee>
        {/* Scrim gradient at bottom */}
        <div className="pointer-events-none absolute bottom-0 w-full h-96 bg-gradient-to-t from-gray-500" />
        <div className="pointer-events-none absolute top-0 w-full h-96 bg-gradient-to-b from-gray-500" />
        <div className="pointer-events-none absolute left-0 w-96 h-full bg-gradient-to-r from-gray-500" />
        <div className="pointer-events-none absolute right-0 w-96 h-full bg-gradient-to-l from-gray-500" />
      </div>
      <div className="z-50 relative text-center flex flex-col bg-white p-12 border-2 border-gray-200 rounded-xl shadow-2xl">
        {/* Absolutely positioned heart */}
        <div className="z-50 absolute top-0 right-0 flex flex-row gap-1 -m-4 rotate-[17deg]">
          <Heart />
        </div>
        <h1 className="font-sans text-5xl font-semibold mb-3">
          Match with your Gotchi
        </h1>
        <h2 className="font-sans text-xl font-normal mb-6">
          Use your{" "}
          <a
            className="underline underline-offset-4"
            href="https://gotchi.vana.com/"
          >
            Vana Gotchi
          </a>{" "}
          to help craft those perfect responses.
        </h2>
        {children}
      </div>
    </div>
  );
}

/**
 * @see https://14islands.com/blog/interactive-marquee-with-framer-motion/
 *
 * @see https://codesandbox.io/s/x3r465?file=/src/App.js
 */

type MarqueeItemProps = {
  children: React.ReactNode;
  speed: MotionValue<any>;
  direction: "forwards" | "backwards";
};

const MarqueeItem: React.FC<MarqueeItemProps> = (props) => {
  const { children, speed, direction } = props;

  const itemRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useRef(0);
  const [width, height] = useWindowSize();

  const setX = () => {
    if (!itemRef.current || !rectRef.current) return;
    const xPercentage = (x.current / rectRef.current.width) * 100;
    if (xPercentage < -100) x.current = 0;
    if (xPercentage > 0) x.current = -rectRef.current.width;
    itemRef.current.style.transform = `translate3d(${
      direction === "forwards" ? -100 - xPercentage : xPercentage
    }%, 0, 0)`;
  };

  useEffect(() => {
    if (itemRef.current) {
      rectRef.current = itemRef.current.getBoundingClientRect();
    }
  }, [width, height]);

  const loop = () => {
    //Substracts the current x from the speed set by useSpring
    x.current -= speed.get();
    setX();
  };

  const [_, loopStart] = useRafLoop(loop, false);

  useEffect(() => {
    loopStart();
  }, []);

  return (
    <motion.div className="flex items-stretch gap-2" ref={itemRef}>
      {children}
    </motion.div>
  );
};

type MarqueeProps = {
  speed?: number;
  threshold?: number;
  wheelFactor?: number;
  dragFactor?: number;
  children: React.ReactNode;
  direction: "forwards" | "backwards";
};

const InteractiveMarquee = (props: MarqueeProps) => {
  const {
    speed = 0.5,
    threshold = 0.014,
    wheelFactor = 1.8,
    dragFactor = 1.2,
    children,
    direction,
  } = props;

  const marqueeRef = useRef<HTMLDivElement>(null);
  const slowDown = useRef(false);
  const isScrolling = useRef<NodeJS.Timeout | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const x = useRef(0);
  const [wWidth] = useWindowSize();
  const speedSpring = useSpring(speed, {
    damping: 40,
    stiffness: 90,
    mass: 5,
  });

  const opacity = useTransform(
    speedSpring,
    [-wWidth * 0.05, 0, wWidth * 0.05],
    [1, 0, 1]
  );
  const skewX = useTransform(
    speedSpring,
    [-wWidth * 0.05, 0, wWidth * 0.05],
    [1, 0, 1]
  );

  // const handleOnWheel = (e: React.WheelEvent<HTMLDivElement> | undefined) => {
  //   const normalized = normalizeWheel(e);

  //   // This will use the wheel to speed up the timeline
  //   x.current = normalized.pixelY * wheelFactor;

  //   // reset speed on scroll end
  //   if (isScrolling.current) {
  //     window.clearTimeout(isScrolling.current);
  //   }

  //   isScrolling.current = setTimeout(() => {
  //     speedSpring.set(speed);
  //   }, 30);
  // };

  // const handleDragStart = () => {
  //   slowDown.current = true;
  //   marqueeRef.current.classList.add("drag");
  //   speedSpring.set(0);
  // };

  // const handleOnDrag = (_, info: PanInfo) => {
  //   speedSpring.set(dragFactor * -info.delta.x);
  // };

  // const handleDragEnd = (_) => {
  //   slowDown.current = false;
  //   marqueeRef.current.classList.remove("drag");
  //   //rest to the original speed
  //   x.current = speed;
  // };

  const loop = () => {
    if (slowDown.current || Math.abs(x.current) < threshold) {
      return;
    }

    x.current *= 0.66;

    if (direction === "backwards") {
      x.current = -Math.abs(x.current); // Reverse direction if backwards
    } else {
      x.current = Math.abs(x.current); // Ensure positive value for forwards
    }

    speedSpring.set(speed + x.current);
  };

  useRafLoop(loop);

  return (
    <>
      {/* <motion.div className="bg" style={{ opacity }} ref={constraintsRef} /> */}
      <motion.div
        className="flex items-center gap-2 overflow-x-hidden"
        // ref={marqueeRef}
        // style={{ skewX }}
        // drag="x"
        // dragPropagation={true}
        // dragConstraints={{ left: 0, right: 0 }}
        // onWheel={handleOnWheel}
        // onDragStart={handleDragStart}
        // onDrag={handleOnDrag}
        // onDragEnd={handleDragEnd}
        // dragElastic={0.000001} // needs to be > 0 ¯\_(ツ)_/¯
      >
        <MarqueeItem speed={speedSpring} direction={direction}>
          {children}
        </MarqueeItem>
        <MarqueeItem speed={speedSpring} direction={direction}>
          {children}
        </MarqueeItem>
      </motion.div>
    </>
  );
};

function HingeCardReadOnly({
  prompt,
  response,
}: {
  prompt: string;
  response: string;
}) {
  return (
    <div
      key={prompt}
      className="flex flex-col justify-start gap-2 z-50 p-6 transition-all border-2 border-gray-200 rounded-xl w-[300px]"
    >
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
      <motion.h2
        className="text-gray-800 font-semibold text-2xl font-serif overflow-auto relative pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {response}
      </motion.h2>
      {/* <div
        className={`pointer-events-none absolute bottom-6 w-[calc(100%-3rem)] h-12 bg-gradient-to-t from-gray-100`}
      /> */}
    </div>
  );
}

function Heart() {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
    >
      <path
        d="m93.99 8.97c-21.91 0-29.96 22.39-29.96 22.39s-7.94-22.39-30-22.39c-16.58 0-35.48 13.14-28.5 43.01s58.56 67.08 58.56 67.08 51.39-37.21 58.38-67.08c6.98-29.87-10.56-43.01-28.48-43.01z"
        fill="#f44336"
      />
      <path
        d="m30.65 11.2c17.2 0 25.74 18.49 28.5 25.98.39 1.07 1.88 1.1 2.33.06l2.52-5.89c-3.55-11.34-13.31-22.38-29.97-22.38-6.9 0-14.19 2.28-19.86 7.09 5.01-3.29 10.88-4.86 16.48-4.86z"
        fill="#c33"
      />
      <path
        d="m93.99 8.97c-5.29 0-10.11 1.15-13.87 3.47 2.64-1.02 5.91-1.24 9.15-1.24 16.21 0 30.72 12.29 24.17 40.7-5.62 24.39-38.46 53.98-48.49 65.27-.64.72-.86 1.88-.86 1.88s51.39-37.21 58.38-67.08c6.98-29.86-10.53-43-28.48-43z"
        fill="#c33"
      />
      <g fill="#ff8a80">
        <path d="m17.04 24.82c3.75-4.68 10.45-8.55 16.13-4.09 3.07 2.41 1.73 7.35-1.02 9.43-4 3.04-7.48 4.87-9.92 9.63-1.46 2.86-2.34 5.99-2.79 9.18-.18 1.26-1.83 1.57-2.45.46-4.22-7.48-5.42-17.78.05-24.61z" />
        <path d="m77.16 34.66c-1.76 0-3-1.7-2.36-3.34 1.19-3.02 2.73-5.94 4.58-8.54 2.74-3.84 7.95-6.08 11.25-3.75 3.38 2.38 2.94 7.14.57 9.44-5.09 4.93-11.51 6.19-14.04 6.19z" />
      </g>
    </svg>
  );
}
