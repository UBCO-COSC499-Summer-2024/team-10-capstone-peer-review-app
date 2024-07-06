import { useContext } from "react";
import { ClassContext } from "@/contexts/classContext";

export const useClass = () => useContext(ClassContext);
