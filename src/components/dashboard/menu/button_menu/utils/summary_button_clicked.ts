import { StorageArticle } from "@/types/storage_item";
import { ButtonProps } from "../type/type_menu_button";
import createSummary from "./create_summary";

const summaryButtonClicked = async ({
  setSummaryContent,
}: Partial<ButtonProps>) => {
  ///--------------------------------------------------------
  // Retrieve the summary from local storage and sent it to the api/summary
  ///--------------------------------------------------------
  try {
    //===================================================
    // Check if the summary has been already created.
    //===================================================
    console.log("at SummaryButtonClicked");
    const dbName = sessionStorage.getItem("db");
    console.log("dbName at SummaryButtonClicked", dbName);

    const existingStorage = localStorage.getItem(
      `draft-articleContent-${dbName}`,
    );
    console.log("Existing storage found:", existingStorage);
    const parsedStorage = existingStorage ? JSON.parse(existingStorage) : [];
    const existingItems = Array.isArray(parsedStorage) ? parsedStorage : [];
    console.log("Existing items found:", existingItems);
    const existingSummary = existingItems.find(
      (item: StorageArticle) => item?.type === "summary",
    )?.content;
    const existingEsSummary = existingItems.find(
      (item: StorageArticle) => item?.type === "es_summary",
    )?.content;
    console.log("Existing summary found:", existingSummary);
    // Check if the summary exists
    if (
      existingSummary !== "" &&
      existingSummary !== null &&
      existingSummary !== undefined &&
      existingEsSummary !== "" &&
      existingEsSummary !== null &&
      existingEsSummary !== undefined
    ) {
      console.log("Summary already exists, using existing summary.");
      setSummaryContent!(existingSummary);
      return { status: 200, summary: "Summary Created" };
    } else {
      //===================================================
      // Create the summaryconfirm
      // First get English summary
      //===================================================
      if (
        existingSummary == "" ||
        existingSummary == null ||
        existingSummary == undefined ||
        existingEsSummary == "" ||
        existingEsSummary == null ||
        existingEsSummary == undefined
      ) {
        console.log("Creating Both summary at summary button clicked...");
        console.log(
          "Existing items to send for summary creation:",
          existingItems,
        );
        const en_summary = await createSummary({
          language: "en",
          article: existingItems,
        });

        if (en_summary.status === 200) {
          setSummaryContent!(
            (en_summary.body as StorageArticle)?.content || "",
          );

          // Get Spanish summary after English succeeds
          const newArticleAfterEnSummary = localStorage.getItem(
            `draft-articleContent-${dbName}`,
          );
          const articleAfterEnSummary = Object.values(
            JSON.parse(newArticleAfterEnSummary || "[]") as StorageArticle[],
          );
          await createSummary({
            language: "es",
            article: articleAfterEnSummary,
          });
          // Return success even if Spanish fails, as we have English
          return { status: 200, summary: "Summary Created" };
        } else {
          // Explicitly return error if English summary fails
          return {
            status: en_summary.status || 500,
            summary: "Failed to create English summary",
          };
        }
      } else if (
        existingSummary != "" &&
        existingSummary != null &&
        existingSummary != undefined &&
        (existingEsSummary == "" ||
          existingEsSummary == null ||
          existingEsSummary == undefined)
      ) {
        console.log(
          "Summary EN found, Creating Spanish summary at summary button clicked...",
        );
        await createSummary({
          language: "es",
          article: existingItems,
        });
        // Return success even if Spanish fails, as we have English
        return { status: 200, summary: "Summary Created" };
      }
    }
  } catch (error) {
    console.error("Error in summaryButtonClicked:", error);
    return {
      status: 500,
      summary: "Error Creating Summary",
      error,
    };
  }
};
export default summaryButtonClicked;
