import Description from "@/components/frontOffice/home/Description";
import { HoverEffect } from "@/components/ui/card-hover-effext";
import LampDemo from "@/components/ui/Lamp";

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
      <div className=" text-center">
        <Description />
      </div>
      {/* cards */}
      <div>
        <HoverEffect items={projects} />
      </div>
    </>
  );
}
