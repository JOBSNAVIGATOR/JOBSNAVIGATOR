"use client";
import { Pencil, StarIcon, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Timeline from "../ui/Timeline";

export default function CandidateHistory({ candidateId }) {
  const [openModal, setOpenModal] = useState(false);
  const [amendments, setAmendments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch amendments from the backend
  useEffect(() => {
    const fetchAmendments = async () => {
      if (openModal) {
        setLoading(true);
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
          const response = await fetch(
            `${baseUrl}/api/assessment?candidateId=${candidateId}`
          );
          const data = await response.json();
          setAmendments(data);
        } catch (error) {
          console.error("Error fetching amendments:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAmendments();
  }, [openModal, candidateId]);
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

  return (
    <div className="flex items-center justify-end">
      <Button
        color="primary"
        onClick={() => setOpenModal(!openModal)}
        variant="contained"
      >
        Candidate History
      </Button>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
      >
        <Modal.Header>
          <div className="flex items-center justify-center w-full h-full text-center">
            <span className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200 text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold">
              Candidate History
            </span>
          </div>
        </Modal.Header>
        <Modal.Body className="bg-gray-700">
          {loading ? (
            <p className="text-center text-white">Loading history...</p>
          ) : candidateHistory.length > 0 ? (
            <Timeline />
          ) : (
            <p className="text-center text-white">No history found.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
