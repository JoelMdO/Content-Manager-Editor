import React from "react";
import Image from "next/image";
import emailMe from "./utils/email_me";
import text from "../../constants/buttons_data_text.json";

//
interface LogoButtonProps {
  type: string;
}
//
const LogoButton: React.FC<LogoButtonProps> = ({ type }) => {
  //
  ///========================================================
  // Logo button to allow the user to contact me
  ///========================================================

  let image: string = "/byJoel.png";
  let width = 90;
  let height = 90;
  const pt = "pt-0";
  //
  switch (type) {
    case "home-web":
      image = "/JLogo.webp";
      break;
    case "home-mobile":
      image = "/JLogo.webp";
      width = 60;
      height = 60;
      break;
    case "playbook-footer":
      image = image;
      break;
    default:
      break;
  }
  //
  return (
    <>
      <div className={`relative group ${pt}`}>
        <button
          type="button"
          className={
            " text-black text-[0.60rem] md:text-base font-light rounded flex items-center justify-center md:gap-2 gap-1"
          }
          onClick={() => {
            setTimeout(() => {
              emailMe();
            }, 500);
          }}
        >
          <Image
            src={image}
            style={{ display: "block" }}
            className={`cursor-pointer`}
            width={width}
            height={height}
            alt={"logoJoel"}
            priority={true}
          />
          <p className="text-xs text-white">{text.buttons.year}</p>
        </button>
      </div>
    </>
  );
};

export default LogoButton;
