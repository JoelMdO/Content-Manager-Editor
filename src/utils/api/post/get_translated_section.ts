import { sectionsToTranslate } from "@/constants/sections";

interface SectionsTranslationsType {
  db: string;
  langFrom: string;
  langTo: string;
  value: string | undefined;
}
export const getTranslatedSection = ({
  db,
  langFrom,
  langTo,
  value,
}: SectionsTranslationsType) => {
  const sections = sectionsToTranslate[db];
  if (!sections) return undefined;

  const index = sections[langFrom as string]?.indexOf(value!);
  if (index === -1 || index === undefined) return undefined;

  return sections[langTo as string]?.[index];
};
