import {useRouter} from "next/navigation";

interface RouteButtonProps {
  type?: string;
}

const RouteButton: React.FC<RouteButtonProps> = ({type}) => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_url_api;
    // Define the button type
    let path: string = "";
    let label: string = "";
    // Define the button type
    switch (type) {
        case "playbook":
        path = "/playbook";
        label = "Create New";
        break;
        case "read-playbook":
        path = "/read-playbook";
        label = "Read Playbook";
        break;
        default:
        path = "/dashboard";
        label = "New Article";
    }
    // 
  return (
    <button className="bg-gray-500 text-white py-3 px-4 rounded mt-2" type= "button" onClick={()=> router.push(`${url}${path}`)}>{label}</button>
  );
}
export default RouteButton;