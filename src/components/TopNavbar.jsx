import React, { useState } from "react";
import { AlignJustify } from "lucide-react";
import NavOverlay from "./Nav";
import { use } from "react";

const TopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="self-start absolute top-0 left-0 w-full bg-gradient-to-r from-blue-950 via-black to-blue-900 h-[7%] flex justify-between items-center px-6 py-4 shadow-md">
      <div className="relative flex-1">
        <div className="absolute inset-0 z-40">
          <NavOverlay isOpen={isOpen} setIsOpen={(isopen) => {setIsOpen(isopen)}} />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="relative z-50">
          <AlignJustify className={isOpen ? "text-white" : "text-white"}/>
        </button>
      </div>
      <h1 className="flex-1 text-2xl font-bold text-indigo-300 font-sans tracking-wide text-center">
        Tech Nova
      </h1>
      <div className="flex-1 flex justify-end text-white space-x-2 font-semibold">
    <h2 className="opacity-80">Team Name:</h2>
    <p className="text-indigo-300">Tech Nova</p>
      </div>
    </div>
  );
};

export default TopNavbar;
