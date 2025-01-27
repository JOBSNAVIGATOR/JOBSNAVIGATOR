import React, { Fragment } from "react";

export default function Timeline2({ events }) {
  return (
    <div className="flex flex-col gap-y3 w-full my-4">
      <Circle />
      {events.map((event, key) => {
        return (
          <Fragment key={key}>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto">
              {event.direction === "left" ? (
                <EventCard
                  heading={event.heading}
                  subHeading={event.subHeading}
                />
              ) : (
                <div></div>
              )}
              <Pillar />
              {event.direction === "right" ? (
                <EventCard
                  heading={event.heading}
                  subHeading={event.subHeading}
                />
              ) : (
                <div></div>
              )}
            </div>
            {key < events.length - 1 && <Circle />}
          </Fragment>
        );
      })}
      <Circle />
    </div>
  );
}

const Circle = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full w-4 h-4 mx-auto"></div>
  );
};
const Pillar = () => {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-teal-500 rounded-t-full rounded-b-full w-2 h-full mx-auto"></div>
  );
};

const EventCard = ({ heading, subHeading }) => {
  return (
    <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 border shadow-md rounded-xl p-4">
      <div className="text-blue-800 font-bold text-lg border-b">{heading}</div>
      <div className="text-sm text-gray-700">{subHeading}</div>
    </div>
  );
};
