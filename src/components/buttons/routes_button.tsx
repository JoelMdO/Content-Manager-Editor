import { useRouter } from "next/navigation";
import { useTransition } from "react";
import routeButtonConfig from "./utils/route_button.config";

interface RouteButtonProps {
  type?: string;
  "data-cy"?: string;
  draft?: string;
}

const RouteButton: React.FC<RouteButtonProps> = ({
  type,
  "data-cy": dataCity,
  draft,
}) => {
  //
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { path, label, features } =
    routeButtonConfig[type as keyof typeof routeButtonConfig] ||
    routeButtonConfig["default"];
  let buttonLabel: string = "";

  switch (type) {
    case "dashboard-draft":
      buttonLabel =
        draft !== "No Draft Available" ? `${"Draft: " + draft} ` : label;
      break;
    default:
      buttonLabel = label;
      break;
  }

  const handleClick = () => {
    console.log("Using Draft from:", draft);
    startTransition(() => {
      router.push(draft ? path : `${path}?modal=true`);
    });
  };
  //
  return (
    <button
      className={`${isPending ? "bg-lime-600" : features} py-3 px-4 rounded mt-2 ml-4`}
      data-cy={dataCity}
      type="button"
      onClick={() => handleClick()}
    >
      {isPending ? "Loading..." : buttonLabel}
    </button>
  );
};
export default RouteButton;
