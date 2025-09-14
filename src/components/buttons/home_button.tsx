import { SquareChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import text from "../../constants/buttons_data_text.json";

interface HomeButtonProps {
  type?: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({ type }) => {
  //
  const router = useRouter();
  let size: number = 34;
  if (type === "mobile") {
    size = 20;
  }
  //
  return (
    <>
      <button
        type="button"
        className="flex flex-row w-[110px] min-w-[90px] mt-2 ml-4 md:ml-1 md:mt-0 items-center"
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

export default HomeButton;
