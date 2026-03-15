"use client";
import React, { useEffect, useState } from "react";
import { SquareChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import text from "../../constants/buttons_data_text.json";

interface HomeButtonProps {
  type?: string;
}

// ORIGINAL — replaced by: Prevent server-side access to `window`
// const HomeButton: React.FC<HomeButtonProps> = () => {
//   //
//   const router = useRouter();
//   const size = window.innerWidth > 768 ? 34 : 18;
//   //
//   return (
//     <>
//       <button
//         type="button"
//         className="flex flex-row max-w-[110px] min-w-[55px] ml-1 md:mt-0 items-center"
//         onClick={() => router.push("/home")}
//       >
//         <SquareChevronLeft className="text-gray-600" size={size} />
//         <span className="text-gray-500 ml-1 xs:text-xs md:text-normal">
//           {text.buttons.home}
//         </span>
//       </button>
//     </>
//   );
// };

const HomeButton: React.FC<HomeButtonProps> = () => {
  const router = useRouter();
  const getSize = () =>
    typeof window !== "undefined" && window.innerWidth > 768 ? 34 : 18;
  const [size, setSize] = useState<number>(getSize());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setSize(getSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        type="button"
        className="flex flex-row max-w-[110px] min-w-[55px] ml-1 md:mt-0 items-center"
        onClick={() => router.push("/home")}
      >
        <SquareChevronLeft className="text-gray-600" size={size} />
        <span className="text-gray-500 ml-1 xs:text-xs md:text-normal">
          {text.buttons.home}
        </span>
      </button>
    </>
  );
};

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-15
// Reason     : Avoid ReferenceError by marking component as client and reading `window` safely in effect.
// Impact     : None — component remains visually identical; now safe during SSR/SSG.

export default HomeButton;
