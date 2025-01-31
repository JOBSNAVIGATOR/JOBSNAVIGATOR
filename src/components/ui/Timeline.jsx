import React from "react";
import { format } from "date-fns"; // Import the date-fns library
import "./Timeline.css";
export default function Timeline({ history }) {
  // Function to format the createdAt field
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MM-yyyy, hh:mm a"); // Format as "27 January 2025, 08:17 PM"
  };

  return (
    <div className="main">
      <div className="container p-4">
        <ul>
          {history.map((historyElement, index) => {
            return (
              <li
                key={index}
                className="transition duration-300 ease-in-out transform hover:-translate-y-4 hover:shadow-2xl"
              >
                <h3 className="title">{historyElement.eventType}</h3>
                <p>{historyElement.remarks}</p>
                <span className="circle"></span>
                <span className="date w-fit">
                  {formatDate(historyElement.createdAt)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
