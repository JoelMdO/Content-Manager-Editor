import { useRouter } from "next/navigation";
import { useTransition } from "react";
import routeButtonConfig from "./utils/route_button.config";
import { useDraftStore } from "@/store/useDraftStore";

interface RouteButtonProps {
  type?: string;
  "data-cy"?: string;
  draft: { dbName: string; content: string } | "No Draft Available";
}

const RouteButton: React.FC<RouteButtonProps> = ({
  type,
  "data-cy": dataCity,
  draft,
}) => {
  //
  const router = useRouter();
  const setUsingDraft = useDraftStore((state) => state.setUsingDraft);
  const [isPending, startTransition] = useTransition();
  const { path, label, features } =
    routeButtonConfig[type as keyof typeof routeButtonConfig] ||
    routeButtonConfig["default"];
  let buttonLabel: string = "";
  //console.log("Draft prop received:", draft);

  switch (type) {
    case "dashboard-draft":
      buttonLabel =
        draft !== "No Draft Available"
          ? `${"Draft: " + draft.content} `
          : label;
      break;
    default:
      buttonLabel = label;
      break;
  }

  const handleClick = () => {
    //console.log("Using Draft from:", draft);
    startTransition(() => {
      router.push(
        draft !== "No Draft Available"
          ? `${path}?modal=false`
          : `${path}?modal=true`,
      );
    });
    if (draft !== "No Draft Available") {
      setUsingDraft(true);
    }
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
