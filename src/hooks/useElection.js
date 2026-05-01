import { useContext } from "react";
import { ElectionContext } from "../context/ElectionContext";

export const useElection = () => useContext(ElectionContext);
