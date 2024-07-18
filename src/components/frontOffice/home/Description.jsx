// "use client";

// import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
// import {
//   TypewriterEffect,
//   TypewriterEffectSmooth,
// } from "@/components/ui/typewriter-effect";

// export default function Description() {
//   const about = `Understanding and effectively navigating the intricacies of human dynamics stands as the most enduring competitive advantage in today's landscape. At JOBSNAVIGATOR, our primary goal is to recruit individuals who not only align seamlessly with businesses but also bring about positive transformations. We cater to diverse manpower needs across various sectors such as Banking & Financial Services, IT-ITES, Oil-Gas & Energy, Telecom, KPO-BPO, and more.`;
//   const locations = `With office locations in the US, UAE, India, and soon in Africa, JOBSNAVIGATOR offers staffing solutions that transcend geographical boundaries.`;

//   return (
//     <div className="">
//       <TextGenerateEffect words={about} />
//       <TextGenerateEffect words={locations} />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function Description() {
  const about = `Understanding and effectively navigating the intricacies of human dynamics stands as the most enduring competitive advantage in today's landscape. At JOBSNAVIGATOR, our primary goal is to recruit individuals who not only align seamlessly with businesses but also bring about positive transformations. We cater to diverse manpower needs across various sectors such as Banking & Financial Services, IT-ITES, Oil-Gas & Energy, Telecom, KPO-BPO, and more.`;
  const locations = `With office locations in the US, UAE, India, and soon in Africa, JOBSNAVIGATOR offers staffing solutions that transcend geographical boundaries.`;

  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);

  const handleFirstEffectComplete = () => {
    setFirstEffectCompleted(true);
  };

  return (
    <div className="">
      <TextGenerateEffect
        words={about}
        onCompletion={handleFirstEffectComplete}
      />
      <br />
      {firstEffectCompleted && <TextGenerateEffect words={locations} />}
    </div>
  );
}
