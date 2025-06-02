import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import text from "../../constants/buttons_data_text.json";

const BackPageButton: React.FC = () => {
  return (
    <>
      <div className="flex items-center ml-2">
        <Link href="/home" className="mr-4">
          <div className="flex items-center text-white hover:text-blue-100">
            <ArrowLeft size={18} className="mr-1" />
            <span>{text.buttons.backHome}</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default BackPageButton;
