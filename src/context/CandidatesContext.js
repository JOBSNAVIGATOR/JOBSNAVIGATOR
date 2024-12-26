"use client";
import { createContext, useContext, useState } from "react";

const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  return (
    <CandidatesContext.Provider
      value={{ selectedCandidates, setSelectedCandidates }}
    >
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = () => useContext(CandidatesContext);
