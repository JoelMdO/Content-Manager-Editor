import React, { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import LogOutButtonConfig, {
  LogOutButtonConfigType,
} from "./utils/logout_button.config";

interface LogoButtonProps {
  type?: keyof LogOutButtonConfigType;
}
//
const LogOutButton: React.FC<LogoButtonProps> = ({ type }) => {
  ///========================================================
  // To log out the user.
  ///========================================================
  //

  // States
  const [isClicked, setIsClicked] = useState(false);
  // ORIGINAL — replaced by: fixed destructuring and removed duplicate identifier
  // const { icon, icon_mobile, mt, mb } = LogOutButtonConfig[type as keyof LogOutButtonConfigType],
  //   [type],
  // UPDATED — fixed destructuring and typing
  const { icon_mobile, mt, mb } = LogOutButtonConfig[type ?? "default"];
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2024-06-10
  // Reason     : Fixed destructuring and removed duplicate identifier 'type', properly typed 'type' prop.
  // Impact     : No more TypeScript errors, callers passing 'type' must use a valid key from LogOutButtonConfigType.
  ///--------------------------------------------------------
  // UI logout button
  ///--------------------------------------------------------
  //
  return (
    <>
      <button
        type="button"
        className={`${mt} ${mb} flex flex-col w-[40px] items-center md:mt-2`}
        onClick={() => {
          signOut({ callbackUrl: "/" });
          setIsClicked(true);
        }}
      >
        {/* Mobile Icon */}
        <Image
          src={icon_mobile}
          className="cursor-pointer"
          width={40}
          height={50}
          alt="logout-button"
        />
        {/* Desktop Icon
        <Image
          src={icon}
          className="hidden md:block cursor-pointer"
          width={widthSet}
          height={heightSet}
          alt="logout-button"
        />*/}
      </button>
      {type == "playbook" ? null : (
        <>
          <span className="hidden md:inline">{isClicked ? "Bye!" : ""}</span>
          <span className="md:hidden">{isClicked ? "Bye!" : ""}</span>
        </>
      )}
    </>
  );
};

export default LogOutButton;
