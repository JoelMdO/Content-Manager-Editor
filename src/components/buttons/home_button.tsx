import { SquareChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation";

interface HomeButtonProps {
    type?: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({type}) => {
    //
    const router = useRouter();
    let size: number = 34;
    if(type === "mobile"){
       size = 20; 
    }
    //
    return (
        <>
        <button type="button" className="flex flex-row md:mt-8 items-center" onClick={() => router.push("/home")}>
        <SquareChevronLeft className="text-gray-600" size={size} />
        <span className="text-gray-500 ml-1 xs:text-xs md:text-normal">Home</span>
        </button>
        </>
    )
}

export default HomeButton;