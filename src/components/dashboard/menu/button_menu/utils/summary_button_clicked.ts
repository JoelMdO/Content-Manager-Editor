import { ButtonProps } from "../type/type_menu_button";
import createSummary from "./create_summary";

const summaryButtonClicked = async ({
  setSummaryContent,
}: Partial<ButtonProps>) => {
  ///--------------------------------------------------------
  // Retrieve the summary from local storage and sent it to the api/summary
  ///--------------------------------------------------------
  try {
    // First get English summary
    const en_summary = await createSummary({ language: "en" });

    if (en_summary.status === 200) {
      setSummaryContent!(en_summary.body as string);

      // Get Spanish summary after English succeeds
      createSummary({ language: "es" });
      // Return success even if Spanish fails, as we have English
      return { status: 200, summary: "Summary Created" };
    } else {
      // Explicitly return error if English summary fails
      return {
        status: en_summary.status || 500,
        summary: "Failed to create English summary",
      };
    }
  } catch (error) {
    return {
      status: 500,
      summary: "Error Creating Summary",
      error,
    };
  }
};
export default summaryButtonClicked;
