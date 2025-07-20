import { Ref } from "react";
import { sections, SectionsType } from "../constants/sections";
interface SectionSelectorProps {
  db: string;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}
const SectionSelector = ({
  db,
  selectedSection,
  setSelectedSection,
}: SectionSelectorProps) => {
  //
  const typedSections = sections as SectionsType;
  if (Object.prototype.hasOwnProperty.call(typedSections, db)) {
    db = db;
  }
  //
  //
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("doing handleChange");
    console.log("db sections selector:", db);
    setSelectedSection(e.target.value);
    let articleContent: { type: string; content: string }[] = [];
    //
    articleContent = JSON.parse(
      sessionStorage.getItem(`articleContent-${db}`) || "[]"
    );
    console.log("Selected section:", e.target.value);
    console.log("articleContent before:", articleContent);

    //
    articleContent.push({ type: "section", content: e.target.value });
    sessionStorage.setItem(
      `articleContent-${db}`,
      JSON.stringify(articleContent)
    );
  };
  //
  //
  return (
    <>
      <select
        className={`h-[40px] w-[10em] md:w-[9em] shadow-md shadow-black bg-blue hover:bg-green text-white text-[0.60rem] md:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-4`}
        id="section-selector"
        aria-label="Select article category"
        onChange={handleChange}
        value={selectedSection}
      >
        <option>{selectedSection}</option>
        {typedSections[db].map((section: string, index: number) => (
          <option key={index} value={section}>
            {section}
          </option>
        ))}
      </select>
    </>
  );
};

export default SectionSelector;
