export type SectionsType = {
  [db: string]: string[];
};

export type SectionsCodeType = {
  [db: string]: { label: string; code: string }[];
};

export type SectionsTranslationsType = {
  [db: string]: {
    [lang: string]: string[];
  };
};

export const sections: SectionsType = {
  DeCav: [
    "Flight Operations",
    "Aviation Chronicles",
    "Flight Safety",
    "Business Aviation",
    "Drone Operations",
    "Finance in Aviation",
    "Simulators",
    "Technology in Aviation",
    "Safety in Aviation",
    "General Aviation Operations",
    "Flight Dispatch",
    "Ground Operations",
    "Permits and Customs",
  ],
  joe: [],
};

export const sectionsCode: SectionsCodeType = {
  DeCav: [
    { label: "Flight Operations", code: "-OPS-" },
    { label: "Aviation Chronicles", code: "-AVC-" },
    { label: "Flight Safety", code: "-SAF-" },
    { label: "Business Aviation", code: "-BAV-" },
    { label: "Drone Operations", code: "-DRO-" },
    { label: "Finance in Aviation", code: "-EFA-" },
    { label: "Simulators", code: "-SIM-" },
    { label: "Technology in Aviation", code: "-TEC-" },
    { label: "Safety in Aviation", code: "-SAF-" },
    {
      label: "General Aviation Operations",
      code: "-GPD-",
    },
    { label: "Flight Dispatch", code: "-FDP-" },
    { label: "Ground Operations", code: "-RAP-" },
    { label: "Permits and Customs", code: "PMC" },
  ],
  joe: [],
};

export const sectionsToTranslate: SectionsTranslationsType = {
  DeCav: {
    en: [
      "Flight Operations",
      "Aviation Chronicles",
      "Flight Safety",
      "Business Aviation",
      "Drone Operations",
      "Finance in Aviation",
      "Simulators",
      "Technology in Aviation",
      "Safety in Aviation",
      "General Aviation Operations",
      "Flight Dispatch",
      "Ground Operations",
      "Permits and Customs",
    ],
    es: [
      "Operaciones de Vuelo",
      "Crónicas de Aviación",
      "Seguridad Aérea",
      "Aviación de Negocios",
      "Operaciones con Drones",
      "Finanzas en Aviación",
      "Simuladores",
      "Tecnología en la Aviación",
      "Seguridad en Aviación",
      "Aviación General",
      "Despacho de Vuelos",
      "Operaciones en Tierra",
      "Permisos y Migración",
    ],
  },
  joe: {
    en: [],
    es: [],
  },
};
