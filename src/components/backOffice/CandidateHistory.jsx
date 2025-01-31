"use client";
import { Button } from "@mui/material";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Timeline from "../ui/Timeline";

export default function CandidateHistory({ candidateId }) {
  const [openModal, setOpenModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  const handleOpenModal = async () => {
    if (!candidateId) {
      console.error("Candidate ID is undefined!");
      return; // Return early if candidateId is not defined
    }
    setLoading(true);
    setOpenModal(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidateHistory/${candidateId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setHistory(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error Fetching History:", error);
      setError("Failed to fetch candidate history."); // Set error message
    } finally {
      setLoading(false);
    }
  };
  // console.log(history);

  return (
    <div className="flex items-center justify-end">
      <Button
        color="primary"
        // onClick={() => setOpenModal(!openModal)}
        onClick={handleOpenModal}
        variant="contained"
      >
        Candidate History
      </Button>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md min-w-fit"
      >
        <div className="flex flex-col h-[500px] ">
          {" "}
          {/* Fixed modal height */}
          <Modal.Header className="h-[80px] sticky top-0">
            <p className="mx-auto text-[30px] font-medium text-purple-700 relative mb-20 after:absolute after:content-[''] after:w-1/2 after:h-1 after:left-1/2 after:-bottom-1 after:bg-gradient-to-r after:from-purple-700 after:to-pink-500 after:-translate-x-1/2 dark:text-[#BA68C8]">
              Candidate History
            </p>
          </Modal.Header>
          <Modal.Body className="bg-gray-700 flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-center text-white">Loading history...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p> // Display error message
            ) : history.length > 0 ? (
              <Timeline history={history} /> // Pass history data to Timeline component
            ) : (
              <p className="text-center text-white">No history found.</p>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}
