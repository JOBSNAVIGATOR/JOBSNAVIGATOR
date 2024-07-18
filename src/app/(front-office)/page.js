import Description from "@/components/frontOffice/home/Description";
import { HoverEffect } from "@/components/ui/card-hover-effext";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import LampDemo from "@/components/ui/Lamp";
import Image from "next/image";

export const services = [
  {
    title: "Top",
    description: "Top Executive Search",
    link: "https://stripe.com",
  },
  {
    title: "Mid",
    description: "Mid and Front-line Recruitment",
    link: "https://stripe.com",
  },
  {
    title: "Reference",
    description: "Reference Checks",
    link: "https://stripe.com",
  },
  {
    title: "Salary",
    description: "Salary Negotiation",
    link: "https://stripe.com",
  },
  {
    title: "Career",
    description: "Career Guidancee to Candidates",
    link: "https://stripe.com",
  },
];
const bankingPartners = [
  {
    title: "Acuity Bank",
    src: "/bankLogo/acuitybank.png",
  },
  {
    title: "ADCB Bank",
    src: "/bankLogo/adcbbank.jpeg",
  },
  {
    title: "AU Small Bank",
    src: "/bankLogo/ausmallbank.jpeg",
  },
  {
    title: "DCB Bank",
    src: "/bankLogo/dcbbank.jpeg",
  },
  {
    title: "Fitch India Bank",
    src: "/bankLogo/fitchindiabank.jpeg",
  },
  {
    title: "ICRA Bank",
    src: "/bankLogo/icrabank.jpeg",
  },
  {
    title: "Indusland Bank",
    src: "/bankLogo/induslandbank.jpeg",
  },
  {
    title: "Kotak Mahindra Bank",
    src: "/bankLogo/kotakbank.png",
  },
  {
    title: "SBI Bank",
    src: "/bankLogo/sbibank.jpeg",
  },
  {
    title: "Woori Bank",
    src: "/bankLogo/wooribank.png",
  },
  {
    title: "Yes Bank",
    src: "/bankLogo/yesbank.png",
  },
];

export default function Home() {
  return (
    <>
      {/* lamp and title */}
      <div className="">
        <LampDemo title="Empowering - Corporate | Careers" />
      </div>
      {/* content section */}
      <div className="flex flex-col md:flex-row  gap-5 p-5 max-w-7xl mx-auto">
        <Description className="order-2 md:order-1" />
        <Image
          src="/interview.jpeg"
          width={800}
          height={800}
          alt="interview image"
          className="order-1 md:order-2 w-full h-auto md:w-[400px] md:h-[500px] lg:w-[600px] lg:h-auto rounded-xl shadow-lg shadow-blue-500 border border-black"
        />
      </div>

      {/* Services cards */}
      <div>
        <HoverEffect items={services} />
      </div>
      {/* partners */}
      <div className="h-[40rem] rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={bankingPartners}
          direction="right"
          speed="slow"
        />
      </div>
    </>
  );
}
