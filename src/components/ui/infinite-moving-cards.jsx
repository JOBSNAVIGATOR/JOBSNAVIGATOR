// "use client";

// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import React, { useEffect, useState, useRef } from "react";

// export const InfiniteMovingCards = ({
//   items,
//   direction = "left",
//   speed = "fast",
//   pauseOnHover = true,
//   className,
// }) => {
//   const containerRef = useRef(null);
//   const scrollerRef = useRef(null);

//   useEffect(() => {
//     addAnimation();
//   }, []);
//   const [start, setStart] = useState(false);
//   function addAnimation() {
//     if (containerRef.current && scrollerRef.current) {
//       const scrollerContent = Array.from(scrollerRef.current.children);

//       scrollerContent.forEach((item) => {
//         const duplicatedItem = item.cloneNode(true);
//         if (scrollerRef.current) {
//           scrollerRef.current.appendChild(duplicatedItem);
//         }
//       });

//       getDirection();
//       getSpeed();
//       setStart(true);
//     }
//   }
//   const getDirection = () => {
//     if (containerRef.current) {
//       if (direction === "left") {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "forwards"
//         );
//       } else {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "reverse"
//         );
//       }
//     }
//   };
//   const getSpeed = () => {
//     if (containerRef.current) {
//       if (speed === "fast") {
//         containerRef.current.style.setProperty("--animation-duration", "20s");
//       } else if (speed === "normal") {
//         containerRef.current.style.setProperty("--animation-duration", "40s");
//       } else {
//         containerRef.current.style.setProperty("--animation-duration", "80s");
//       }
//     }
//   };
//   return (
//     <div
//       ref={containerRef}
//       className={cn(
//         "scroller relative z-10  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
//         className
//       )}
//     >
//       <ul
//         ref={scrollerRef}
//         className={cn(
//           " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
//           start && "animate-scroll ",
//           pauseOnHover && "hover:[animation-play-state:paused]"
//         )}
//       >
//         {items.map((item) => (
//           <li
//             className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 md:w-[450px]"
//             style={{
//               background:
//                 "linear-gradient(180deg, var(--slate-100), var(--slate-200)",
//             }}
//             key={item.title}
//           >
//             <div className="relative w-full h-[200px]">
//               <Image
//                 src={item.src}
//                 alt={item.title}
//                 layout="fill"
//                 objectFit="cover"
//                 objectPosition="center"
//                 className="rounded-2xl"
//               />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// "use client";

// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import React, { useEffect, useState, useRef, useCallback } from "react";

// export const InfiniteMovingCards = ({
//   items,
//   direction = "left",
//   speed = "fast",
//   pauseOnHover = true,
//   className,
// }) => {
//   const containerRef = useRef(null);
//   const scrollerRef = useRef(null);
//   const [start, setStart] = useState(false);

//   // Memoize addAnimation so it doesn't get redefined on every render
//   const addAnimation = useCallback(() => {
//     if (containerRef.current && scrollerRef.current) {
//       const scrollerContent = Array.from(scrollerRef.current.children);

//       scrollerContent.forEach((item) => {
//         const duplicatedItem = item.cloneNode(true);
//         if (scrollerRef.current) {
//           scrollerRef.current.appendChild(duplicatedItem);
//         }
//       });

//       getDirection();
//       getSpeed();
//       setStart(true);
//     }
//   }, [direction, speed]);

//   const getDirection = () => {
//     if (containerRef.current) {
//       if (direction === "left") {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "forwards"
//         );
//       } else {
//         containerRef.current.style.setProperty(
//           "--animation-direction",
//           "reverse"
//         );
//       }
//     }
//   };

//   const getSpeed = () => {
//     if (containerRef.current) {
//       if (speed === "fast") {
//         containerRef.current.style.setProperty("--animation-duration", "20s");
//       } else if (speed === "normal") {
//         containerRef.current.style.setProperty("--animation-duration", "40s");
//       } else {
//         containerRef.current.style.setProperty("--animation-duration", "80s");
//       }
//     }
//   };

//   useEffect(() => {
//     addAnimation();
//   }, [addAnimation]); // Add addAnimation to the dependency array

//   return (
//     <div
//       ref={containerRef}
//       className={cn(
//         "scroller relative z-10 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
//         className
//       )}
//     >
//       <ul
//         ref={scrollerRef}
//         className={cn(
//           "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
//           start && "animate-scroll",
//           pauseOnHover && "hover:[animation-play-state:paused]"
//         )}
//       >
//         {items.map((item) => (
//           <li
//             className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 md:w-[450px]"
//             style={{
//               background:
//                 "linear-gradient(180deg, var(--slate-100), var(--slate-200))",
//             }}
//             key={item.title}
//           >
//             <div className="relative w-full h-[200px]">
//               <Image
//                 src={item.src}
//                 alt={item.title}
//                 layout="fill"
//                 objectFit="cover"
//                 objectPosition="center"
//                 className="rounded-2xl"
//               />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  // Memoize getDirection to avoid re-creation on every render
  const getDirection = useCallback(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  }, [direction]);

  // Memoize getSpeed to avoid re-creation on every render
  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  }, [speed]);

  // Memoize addAnimation so it doesn't get redefined on every render
  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [getDirection, getSpeed]); // Include getDirection and getSpeed as dependencies

  useEffect(() => {
    addAnimation();
  }, [addAnimation]); // Add addAnimation to the dependency array

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-10 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-100), var(--slate-200))",
            }}
            key={item.title}
          >
            <div className="relative w-full h-[200px]">
              <Image
                src={item.src}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="rounded-2xl"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
