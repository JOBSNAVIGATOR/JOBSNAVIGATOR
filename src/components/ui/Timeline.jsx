import React from "react";
import "./timeline.css";
export default function Timeline({ history }) {
  return (
    <div className="main">
      {/* <h3 className="heading">Responsive Timeline</h3> */}
      <div className="container p-4">
        <ul>
          <li className="transition duration-300 ease-in-out transform hover:-translate-y-4 hover:shadow-2xl">
            <h3 className="title">Frontend Developer</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
              omnis cumque enim doloremque dolore quod! Perferendis maxime
              quibusdam dolore totam.
            </p>
            <a href="#">Read More</a>
            <span className="circle"></span>
            <span className="date">January 2022</span>
          </li>
          <li>
            <h3 className="title">Backend Developer</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
              omnis cumque enim doloremque dolore quod! Perferendis maxime
              quibusdam dolore totam.
            </p>
            <a href="#">Read More</a>
            <span className="circle"></span>
            <span className="date">February 2022</span>
          </li>
          <li>
            <h3 className="title">FullStack Developer</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
              omnis cumque enim doloremque dolore quod! Perferendis maxime
              quibusdam dolore totam.
            </p>
            <a href="#">Read More</a>
            <span className="circle"></span>
            <span className="date">March 2022</span>
          </li>
          <li>
            <h3 className="title">App Developer</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
              omnis cumque enim doloremque dolore quod! Perferendis maxime
              quibusdam dolore totam.
            </p>
            <a href="#">Read More</a>
            <span className="circle"></span>
            <span className="date">April 2022</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
