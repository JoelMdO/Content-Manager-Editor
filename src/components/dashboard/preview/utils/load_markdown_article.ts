import { convertHtmlToMarkdownAPI } from "@/services/api/convert_html_to_markdown";
import matter from "gray-matter";
import errorAlert from "@/components/alerts/error";
import { ProcessedArticle } from "../types/previewed_article";
import replaceImgWithSrc from "../../menu/button_menu/utils/images_edit/replace_img_with_src";
import { ImageItem } from "@/types/image_item";

const loadMarkdownArticle = async ({
  language,
}: {
  language: string;
}): Promise<ProcessedArticle | undefined> => {
  let title: string = "";
  let body: string = "";
  //
  const dbName = sessionStorage.getItem("db");
  const idiom = language === "en" ? "" : "es-";
  const article = sessionStorage.getItem(`articleContent-${dbName}`);
  const parsedData = article ? JSON.parse(article) : null;

  ///--------------------------------------------------------
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
    //console.log("images", images);
    //
    ///--------------------------------------------------------
    // Add images src and alt to the body tag
    ///--------------------------------------------------------
    const updatedTagArticleBody = replaceImgWithSrc(
      articleBody.content! as string,
      images
    );
    //console.log("updatedTagArticleBody", updatedTagArticleBody);
    ///--------------------------------------------------------
    // Convert to Markdown
    ///--------------------------------------------------------
    const articleToMarkDown = `<h1>${articleTitle.content}</h1>\n${updatedTagArticleBody}`;
    const articleBodyMarkdown = await convertHtmlToMarkdownAPI(
      articleToMarkDown
    );
    //console.log("articleBodyMarkdown", articleBodyMarkdown);
    ///--------------------------------------------------------
    // Parses the article, separates the body text into content
    // separates the metadata into data.
    ///--------------------------------------------------------
    if (articleBodyMarkdown && articleBodyMarkdown.status === 200) {
      const { data, content } = matter(articleBodyMarkdown.body as string);
      //console.log("data from matter", data);
      //console.log("content from matter", content);
      ///--------------------------------------------------------
      // Store the markdown in sessionStorage
      ///--------------------------------------------------------
      parsedData.push({
        type: `markdown-${idiom}title`,
        content: articleTitle.content || "",
      });
      parsedData.push({ type: `markdown-${idiom}content`, content: content });
      parsedData.push({
        type: `markdown-${idiom}readTime`,
        content: data.readTime || 0,
      });

      sessionStorage.setItem(
        `articleContent-${dbName}`,
        JSON.stringify(parsedData)
      );
      //--------------------------------------------------------
      return {
        title: articleTitle.content || "Untitled",
        readTime: data.readTime || Math.ceil(content.split(" ").length / 200),
        content: content,
        // image: image,
      };
    } else {
      errorAlert("markdown");
    }
  } else {
    errorAlert("nonArticle");
  }
  //
  //
};

export default loadMarkdownArticle;
