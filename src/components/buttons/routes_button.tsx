import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import routeButtonConfig from "./utils/route_button.config";

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
  const [isPending, startTransition] = useTransition();
  //ORIGINAL
  // let path: string = "";
  // let label: string = "";
  // let features: string = "bg-gray-500 text-white";
  //
  // Define the button type
  // UPDATED to use a config object for better scalability and maintainability
  const { path, label, features } =
    routeButtonConfig[type as keyof typeof routeButtonConfig] ||
    routeButtonConfig["default"];
  // ORIGINAL
  // const handleClick = () => {
  //   if (type === "with-item-playbook") {
  //     router.push(`${path}?modal=true`);
  //   } else {
  //     router.push(path);
  //   }
  // };

  // UPDATED with startTransition for better UX
  const handleClick = () => {
    startTransition(() => {
      router.push(`${path}?modal=true`);
    });
  };
  //
  return (
    <button
      className={`${isPending ? "bg-lime-600" : features} py-3 px-4 rounded mt-2`}
      data-cy={dataCity}
      type="button"
      onClick={() => handleClick()}
    >
      {isPending ? "Loading..." : label}
    </button>
  );
};
export default RouteButton;
