import { useRouter } from "next/navigation";

interface RouteButtonProps {
  type?: string;
  "data-cy"?: string;
}

const RouteButton: React.FC<RouteButtonProps> = ({
  type,
  "data-cy": dataCity,
}) => {
  //
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_url_api;
  let path: string = "";
  let label: string = "";
  let features: string = "bg-gray-500 text-white";
  //
  // Define the button type
  switch (type) {
    case "playbook":
      path = "/playbook";
      label = "Create New";
      break;
    case "read-playbook":
      path = "/readPlaybook";
      label = "Read Playbook";
      break;
    case "with-item-playbook":
      path = "/playbook";
      label = "Continue Editing";
      features = "flex bg-yellow-button text-black w-[38vw] self-center";
      break;
    default:
      path = "/dashboard";
      label = "New Article";
  }
  //
  const handleClick = () => {
    if (type === "with-item-playbook") {
      router.push(`${url}${path}?modal=true`);
    } else {
      router.push(`${url}${path}`);
    }
  };
  //
  return (
    <button
      className={`${features} py-3 px-4 rounded mt-2`}
      data-cy={dataCity}
      type="button"
      onClick={() => handleClick()}
    >
      {label}
    </button>
  );
};
export default RouteButton;
