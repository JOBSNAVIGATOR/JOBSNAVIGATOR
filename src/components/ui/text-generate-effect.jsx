// "use client";
// import { useEffect } from "react";
// import { motion, stagger, useAnimate } from "framer-motion";
// import { cn } from "@/lib/utils";

// export const TextGenerateEffect = ({ words, className }) => {
//   const [scope, animate] = useAnimate();
//   let wordsArray = words.split(" ");
//   useEffect(() => {
//     animate(
//       "span",
//       {
//         opacity: 1,
//       },
//       {
//         duration: 2,
//         delay: stagger(0.2),
//       }
//     );
//   }, [scope.current]);

//   const renderWords = () => {
//     return (
//       <motion.div ref={scope}>
//         {wordsArray.map((word, idx) => {
//           return (
//             <motion.span
//               key={word + idx}
//               className="dark:text-white text-black opacity-0"
//             >
//               {word}{" "}
//             </motion.span>
//           );
//         })}
//       </motion.div>
//     );
//   };

//   return (
//     <div className={cn("font-bold", className)}>
//       <div className="mt-4">
//         <div className=" dark:text-white text-black text-xl leading-snug tracking-light">
//           {renderWords()}
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({ words, className, onCompletion }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    ).then(() => {
      if (onCompletion) {
        onCompletion(); // Call the completion callback
      }
    });
  }, [animate, onCompletion]);
  // }, [scope.current, animate, onCompletion]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0"
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-thin", className)}>
      <div className="">
        <div className="max-w-7xl mx-auto text-center dark:text-white text-black text-xl leading-snug tracking-light">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
