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
    "Economics and Finance in Aviation",
    "Simulators",
    "Technology in Aviation",
    "Safety in Aviation",
    "General, Private, and Diplomatic Aviation Operations",
    "Flight Dispatch and Planning",
    "Ramp and Airport Operations",
    "Permits, Migration, and Customs",
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
    { label: "Economics and Finance in Aviation", code: "-EFA-" },
    { label: "Simulators", code: "-SIM-" },
    { label: "Technology in Aviation", code: "-TEC-" },
    { label: "Safety in Aviation", code: "-SAF-" },
    {
      label: "General, Private, and Diplomatic Aviation Operations",
      code: "-GPD-",
    },
    { label: "Flight Dispatch and Planning", code: "-FDP-" },
    { label: "Ramp and Airport Operations", code: "-RAP-" },
    { label: "Permits, Migration, and Customs", code: "PMC" },
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
      "Economics and Finance in Aviation",
      "Simulators",
      "Technology in Aviation",
      "Safety in Aviation",
      "General, Private, and Diplomatic Aviation Operations",
      "Flight Dispatch and Planning",
      "Ramp and Airport Operations",
      "Permits, Migration, and Customs",
    ],
    es: [
      "Operaciones de Vuelo",
      "Crónicas de Aviación",
      "Seguridad Aérea",
      "Aviación de Negocios",
      "Operaciones con Drones",
      "Economía y Finanzas en Aviación",
      "Simuladores",
      "Tecnología en la Aviación",
      "Seguridad en Aviación",
      "Operaciones de Aviación General, Privada y Diplomática",
      "Despacho y Planificación de Vuelos",
      "Operaciones en Rampa y Aeropuertos",
      "Permisos, Migración y Aduanas",
    ],
  },
  joe: {
    en: [],
    es: [],
  },
};
