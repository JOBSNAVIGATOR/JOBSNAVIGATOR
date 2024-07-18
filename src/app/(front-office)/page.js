import Description from "@/components/frontOffice/home/Description";
import { HoverEffect } from "@/components/ui/card-hover-effext";
import LampDemo from "@/components/ui/Lamp";
import Image from "next/image";

export const projects = [
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

      {/* cards */}
      <div>
        <HoverEffect items={projects} />
      </div>
    </>
  );
}
