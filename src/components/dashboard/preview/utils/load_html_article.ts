import errorAlert from "@/components/alerts/error";
import { ProcessedArticle } from "../types/previewed_article";
import replaceImgWithSrc from "../../menu/button_menu/utils/images_edit/replace_img_with_src";
import { ImageItem } from "@/types/image_item";

const loadHTMLArticle = async ({
  language,
}: {
  language: string;
}): Promise<ProcessedArticle | undefined> => {
  let title: string = "";
  let body: string = "";
  //
  const dbName = sessionStorage.getItem("db");
  const article = sessionStorage.getItem(`articleContent-${dbName}`);
  const parsedData = article ? JSON.parse(article) : null;
  //console.log("articleSessionStorage", parsedData);

  //--------------------------------------------------------
  if (parsedData) {
    switch (language) {
      case "es":
        title = "es-title";
        body = "es-body";
        break;
      default:
        title = "title";
        body = "body";
        break;
    }
    //

    const articleTitle = parsedData.find(
      (item: ImageItem) => item.type === title
    );
    const articleBody = parsedData.find(
      (item: ImageItem) => item.type === body
    );
    const images = parsedData.filter((item: ImageItem) =>
      item.type!.startsWith("image")
    );
    //
    //console.log("articleTitle", articleTitle);
    //console.log("articleBody", articleBody);
    //console.log('images"', images);
    //
    ///--------------------------------------------------------
    // Add images src and alt to the body tag
    ///--------------------------------------------------------
    const updatedTagArticleBody = replaceImgWithSrc(
      articleBody.content! as string,
      images,
      "html"
    );
    //console.log("updatedTagArticleBody at load html", updatedTagArticleBody);
    ///--------------------------------------------------------
    //--------------------------------------------------------
    return {
      title: articleTitle.content || "Untitled",
      content: updatedTagArticleBody,
      // image: image,
    };
  } else {
    errorAlert("nonArticle");
  }
  //
  //
};

export default loadHTMLArticle;
