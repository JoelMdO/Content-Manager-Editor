const routeButtonConfig = {
  playbook: {
    path: "/playbook",
    label: "Create New",
    features: "bg-gray-500 text-white",
  },
  "read-playbook": {
    path: "/readPlaybook",
    label: "Read Playbook",
    features: "bg-gray-500 text-white",
  },
  "with-item-playbook": {
    path: "/playbook",
    label: "Continue Editing",
    features: "flex bg-yellow-button text-black w-[38vw] self-center",
  },
  "dashboard-draft": {
    path: "/dashboard",
    label: "No Draft Available",
    features: "bg-gray-500 text-white",
  },
  default: {
    path: "/dashboard",
    label: "New Article",
    features: "bg-blue-500 text-white",
  },
};
export default routeButtonConfig;

export type RouteButtonConfig = typeof routeButtonConfig;
