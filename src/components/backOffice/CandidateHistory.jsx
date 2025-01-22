"use client";
import "react-vertical-timeline-component/style.min.css";
import React, { useState } from "react";
import { BottomGradient } from "../ui/BottomGradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { StarIcon, User2 } from "lucide-react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

// Sample Data (Replace with API data)
const candidateHistory = [
  {
    title: "Creative Director",
    subtitle: "Miami, FL",
    date: "2011 - present",
    description:
      "Creative Direction, User Experience, Visual Design, Project Management, Team Leading",
  },
  {
    title: "Art Director",
    subtitle: "San Francisco, CA",
    date: "2010 - 2011",
    description:
      "Creative Direction, User Experience, Visual Design, SEO, Online Marketing",
  },
  {
    title: "Web Designer",
    subtitle: "Los Angeles, CA",
    date: "2008 - 2010",
    description: "User Experience, Visual Design",
  },
];

export default function CandidateHistory() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative group/btn w-80 h-10 font-bold text-white bg-gradient-to-br from-black to-neutral-600 dark:from-lime-200 dark:to-lime-900 rounded-xl shadow-md">
          Candidate History
          <BottomGradient />
        </button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto sm:max-w-[425px] bg-slate-200 dark:bg-zinc-800 rounded-xl">
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle>View Candidate History</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="overflow-y-auto h-full">
          <VerticalTimeline lineColor="black">
            {candidateHistory.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element"
                date={item.date}
                contentStyle={{
                  background: "rgb(228, 8, 10)",
                  color: "#fff",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid rgb(33, 150, 243)",
                }}
                iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                icon={<User2 />}
              >
                <h3 className="vertical-timeline-element-title">
                  {item.title}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {item.subtitle}
                </h4>
                <p>{item.description}</p>
              </VerticalTimelineElement>
            ))}
            <VerticalTimelineElement
              iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
              icon={<StarIcon />}
            />
          </VerticalTimeline>
        </div>
      </DialogContent>
    </Dialog>
  );
}
