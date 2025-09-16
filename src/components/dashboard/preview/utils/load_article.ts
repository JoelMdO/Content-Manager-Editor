import { convertHtmlToMarkdownAPI } from "@/services/api/convert_html_to_markdown";
import replaceSrcWithImagePlaceholders from "../../menu/button_menu/utils/images_edit/replace_src_on_img";
import matter from "gray-matter";
import errorAlert from "@/components/alerts/error";
import { ProcessedArticle } from "../types/previewed_article";

const loadArticle = async ({
  language,
}: {
  language: string;
}): Promise<ProcessedArticle | undefined> => {
  let title: string = "";
  let body: string = "";
  //
  const dbName = sessionStorage.getItem("db");
  const idiom = language === "en" ? "" : "es-";
  const articleLocal = localStorage.getItem(`draft-articleContent-${dbName}`);
  const parsedDataLocal = articleLocal ? JSON.parse(articleLocal) : null;
  console.log("articleLocal", articleLocal);

  //
  ///--------------------------------------------------------
  // Check if article is already in markdown format at localStorage
  ///--------------------------------------------------------
  if (parsedDataLocal) {
    console.log("parsedDataLocal", parsedDataLocal);

    const isMarkdown = parsedDataLocal.some(
      (item: any) => item.type === `markdown-${idiom}title`
    );
    console.log("isMarkdown", isMarkdown);

    if (isMarkdown !== false) {
      console.log("isMarkdown found");

      return {
        title: parsedDataLocal.find(
          (item: any) => item.type === `markdown-${idiom}title`
        ).content,
        readTime: parsedDataLocal.find(
          (item: any) => item.type === `markdown-${idiom}readTime`
        ).content,
        content: parsedDataLocal.find(
          (item: any) => item.type === `markdown-${idiom}content`
        ).content,
        images: parsedDataLocal.find(
          (item: any) => item.type === "markdown-image"
        ).content,
      };
    }
    ///--------------------------------------------------------
    ///--------------------------------------------------------
    // If no article found, create the article structure
    ///--------------------------------------------------------
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
    const article = sessionStorage.getItem(`articleContent-${dbName}`);
    const parsedData = article ? JSON.parse(article) : null;
    const articleTitle = parsedData.find((item: any) => item.type === title);
    const articleBody = parsedData.find((item: any) => item.type === body);
    const images = parsedData.filter((item: any) => item.type === "image");
    //
    console.log("articleTitle", articleTitle);
    console.log("articleBody", articleBody);

    //
    ///--------------------------------------------------------
    // Add images if any to the body
    ///--------------------------------------------------------
    const updatedArticleBody = replaceSrcWithImagePlaceholders(
      articleBody.content! as string,
      images
    );
    console.log("updatedArticleBody", updatedArticleBody);

    ///--------------------------------------------------------
    // Convert to Markdown
    ///--------------------------------------------------------
    const articleBodyMarkdown = await convertHtmlToMarkdownAPI(
      `<h1>${articleTitle.content}</h1>\n${updatedArticleBody}`
    );
    console.log("articleBodyMarkdown", articleBodyMarkdown);

    //
    ///--------------------------------------------------------
    // Parses the article, separates the body text into content
    // separates the metadata into data.
    ///--------------------------------------------------------
    if (articleBodyMarkdown && articleBodyMarkdown.status === 200) {
      const { data, content } = matter(articleBodyMarkdown.body as string);
      console.log("data from matter", data);
      console.log("content from matter", content);
      //
      //--------------------------------------------------------
      // Validate Cloudinary image URL
      //--------------------------------------------------------
      function isValidCdnImageUrl(url: string): boolean {
        return /^https:\/\/cdn\.cloudinary\.com\//.test(url);
      }
      const image = isValidCdnImageUrl(data.image) ? data.image : "";
      //
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
      parsedData.push({ type: "markdown-image", content: image });
      sessionStorage.setItem(
        `articleContent-${dbName}`,
        JSON.stringify(parsedData)
      );
      //--------------------------------------------------------
      return {
        title: articleTitle.content || "Untitled",
        readTime: data.readTime || Math.ceil(content.split(" ").length / 200),
        content: content,
        image: image,
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

export default loadArticle;
