import React from "react";
import { ACContext } from "../providers/ac-provider";

export const useACContext = () => {
  const context = React.useContext(ACContext);
  return context;
};
