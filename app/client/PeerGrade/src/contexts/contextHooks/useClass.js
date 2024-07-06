import { useContext } from "react";
import { classContext } from "@/contexts/classContext";

export const useClass = () => useContext(classContext);
