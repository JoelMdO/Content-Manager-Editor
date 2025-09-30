import React, { useContext, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import { visit } from "unist-util-visit";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import previewArticleStyles from "./style/preview_article_styles";
import MenuContext from "../menu/button_menu/context/menu_context";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import LanguageSwitcher from "../language_switcher/language_switcher";
import replaceSrcWithImagePlaceholders from "../menu/button_menu/utils/images_edit/replace_src_on_img";
import rehypeRaw from "rehype-raw";
//
const PreviewArticle = () => {
  //
  const { language, article } = useContext(MenuContext) as ButtonProps;
  const timeToReadText =
    language === "en" ? "Time to Read: " : "Tiempo de lectura: ";
  const minutesToReadText = language === "en" ? " minutes" : " minutos";
  const toReadInText = language === "en" ? "Read in " : "Leer en ";
  const [updatedContent, setUpdatedContent] = React.useState<string>("");
  //
  console.log("article at Preview Article", article);
  //
  useEffect(() => {
    console.log("doing useEffect in PreviewArticle");

    if (article?.content) {
      const updatedContent = replaceSrcWithImagePlaceholders(
        article?.content as string
      );
      console.log("updatedContent at useEffect", updatedContent);
      setUpdatedContent(updatedContent);
    }
  }, [article?.content]);
  // Custom remark plugin to unwrap images from paragraphs
  //
  function remarkUnwrapImages() {
    return (tree: any) => {
      visit(tree, "paragraph", (node, index, parent) => {
        // Check if paragraph contains only an image
        const onlyImages =
          node.children.length > 0 &&
          node.children.every((child: any) => child.type === "image");
        if (onlyImages) {
          // Replace paragraph with all its image children
          parent.children.splice(index!, 1, ...node.children);
        }
      });
    };
  }
  //
  return (
    <>
      {/*TITLE AND TIME TO READ*/}
      <article>
        <header className={`flex flex-col w-full h-[45%] overflow-hidden`}>
          <div
            className={`${previewArticleStyles.title_container} flex flex-col`}
          >
            <h1 className={`${previewArticleStyles.title}`}>
              {article!.title}
            </h1>
            <p className={`${previewArticleStyles.time_to_read}`}>
              {timeToReadText}
              {article!.readTime}
              {minutesToReadText}
            </p>
          </div>
          {/*LANGUAGE SWITCHER*/}
          <div className={`${previewArticleStyles.language_switch} flex`}>
            <div
              className={`flex flex-col md:flex-row md:gap-2  ${previewArticleStyles.language_switch}`}
            >
              {toReadInText}
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <div
          className={`h-3 border-t-2 dark:border-green border-amber-500 w-[85%] self-center mt-1 `}
        ></div>
        {/*BODY*/}
        <section
          aria-labelledby="post-title"
          className="flex flex-col w-[90%] md:w-full h-[55%] overflow-auto  max-w-full text-justify font-lexend"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkUnwrapImages]}
            rehypePlugins={[rehypeRaw]}
            urlTransform={(uri, key, node) => {
              if (uri?.startsWith("data:")) return uri; // allow base64
              return uri;
            }}
            components={{
              h1: ({ children, ...props }) => (
                <h1 className={`${previewArticleStyles.h}`} {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className={`${previewArticleStyles.h}`} {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className={`${previewArticleStyles.h}`} {...props}>
                  {children}
                </h3>
              ),

              h4: ({ children, ...props }) => (
                <h4 className={`${previewArticleStyles.h}`} {...props}>
                  {children}
                </h4>
              ),
              p: ({ children, ...props }) => {
                const hasOnlyImages = React.Children.toArray(children).every(
                  (child) =>
                    React.isValidElement(child) && child.type === "image"
                );
                console.log("hasOnlyImages", hasOnlyImages);

                if (hasOnlyImages) {
                  return <div className="image-container my-1">{children}</div>;
                }

                return (
                  <p className={`${previewArticleStyles.paragraph}`} {...props}>
                    {children}
                  </p>
                );
              },
              img: ({ src = "", alt = "" }) => {
                return (
                  <figure className="flex flex-col mt-2 justify-center items-center transition-all duration-500 transform hover:scale-[1.02]">
                    {/* <div
                    className={`flex relative justify-center items-center overflow-hidden ${previewArticleStyles.image_container}`}
                  > */}
                    <Image
                      width={500}
                      height={500}
                      src={src as string}
                      alt={alt as string}
                      unoptimized={true}
                      className="self-center object-contain"
                      loading="lazy"
                    />
                    {/* </div> */}

                    {alt && (
                      <p
                        className={`text-[10px] md:text-base text-center text-gray-500 dark:text-gray-400 mt-0 italic font-medium mb-2`}
                      >
                        {alt}
                      </p>
                    )}
                  </figure>
                );
              },
              ol: ({ children, ...props }) => (
                <ol
                  className={`${previewArticleStyles.list} list-decimal list-inside text-black space-y-1`}
                  {...props}
                >
                  {children}
                </ol>
              ),

              li: ({ children, ...props }) => {
                const childrenArray = React.Children.toArray(children);

                // Check if this list item contains a checkbox
                const hasCheckbox = childrenArray.some(
                  (child) =>
                    React.isValidElement(child) &&
                    child.type === "input" &&
                    child.props === "checkbox"
                );

                if (hasCheckbox) {
                  // Find the checkbox and other content
                  const checkbox = childrenArray.find(
                    (child) =>
                      React.isValidElement(child) &&
                      child.type === "input" &&
                      child.props === "checkbox"
                  );

                  const textContent = childrenArray.filter(
                    (child) =>
                      !(
                        React.isValidElement(child) &&
                        child.type === "input" &&
                        child.props === "checkbox"
                      )
                  );

                  const isChecked =
                    React.isValidElement(checkbox) && checkbox.props;

                  return (
                    <li className="items-start gap-2" {...props}>
                      <input
                        type="checkbox"
                        aria-label="Task completed"
                        checked={isChecked as boolean}
                        disabled
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue focus:ring-blue dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span
                        className={`${
                          isChecked
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-700"
                        }`}
                      >
                        {textContent}
                      </span>
                    </li>
                  );
                }

                // Regular list item
                return (
                  <li
                    className={`${previewArticleStyles.list} text-black`}
                    {...props}
                  >
                    {children}
                  </li>
                );
              },

              //
              ul: ({ children, ...props }) => {
                const childrenArray = React.Children.toArray(children);

                // Check if this is a task list by looking for checkbox inputs in any child
                const isTaskList = childrenArray.some((child) => {
                  if (React.isValidElement(child) && child.props) {
                    const grandChildren = React.Children.toArray(children);
                    return grandChildren.some(
                      (grandChild) =>
                        React.isValidElement(grandChild) &&
                        grandChild.type === "input" &&
                        grandChild.props === "checkbox"
                    );
                  }
                  return false;
                });

                if (isTaskList) {
                  return (
                    <ul
                      className={`text-base text-black mt-2 mb-1 self-center list-disc space-y-2 w-full`}
                      {...props}
                    >
                      {children}
                    </ul>
                  );
                }

                // Regular unordered list
                return (
                  <ul
                    className={`${previewArticleStyles.list} list-disc text-black space-y-2 `}
                    {...props}
                  >
                    {children}
                  </ul>
                );
              },
              //
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className={`${previewArticleStyles.blockquote_container}`}
                  {...props}
                >
                  {children}
                </blockquote>
              ),

              // Code blocks with syntax highlighting
              code: ({
                inline,
                className,
                children,
                ...props
              }: React.PropsWithChildren<
                {
                  inline?: boolean;
                  className?: string;
                } & React.HTMLAttributes<HTMLElement>
              >) => {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";

                if (!inline && language) {
                  //
                  return (
                    <div className="overflow-hidden my-6 ml-7 rounded-lg shadow-lg self-center w-[85%] md:w-[75%]">
                      <div
                        className={`text-xs md:text-base px-4 py-2 bg-black text-green-400 font-mono uppercase tracking-wide border-b border-gray-700 `}
                      >
                        {language}
                      </div>
                      <div className={`${previewArticleStyles.code}`}>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  );
                }

                return (
                  <code
                    className={`text-xs md:text-base bg-gray-300 dark:bg-gray-800 text-red-700 font-mono px-1.5 py-0.5 rounded-lg shadow-lg self-center w-[75%]`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              a: ({ children, href, ...props }) => (
                <a
                  href={href}
                  className={`${previewArticleStyles.paragraph}text-black underline decoration-2 underline-offset-2 hover:decoration-wavy transition-all duration-300 `}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  {...props}
                >
                  {children}
                </a>
              ),
              table: ({ children, ...props }) => (
                <div className="flex flex-col w-full max-w-full overflow-x-auto my-6 rounded-lg shadow-lg">
                  <table
                    className="min-w-full bg-white dark:bg-gray-800 border-collapse border border-gray-200 dark:border-gray-700"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children, ...props }) => (
                <thead className="bg-gray-50 dark:bg-gray-700" {...props}>
                  {children}
                </thead>
              ),
              tbody: ({ children, ...props }) => (
                <tbody
                  className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  {...props}
                >
                  {children}
                </tbody>
              ),
              tr: ({ children, ...props }) => (
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  {...props}
                >
                  {children}
                </tr>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-black border-b border-gray-200 dark:border-gray-600"
                  {...props}
                >
                  {children}
                </td>
              ),
              // Horizontal rule
              hr: ({ ...props }) => (
                <hr
                  className="my-12 border-0 h-1 bg-gradient-to-r from-transparent via-blue to-transparent"
                  {...props}
                />
              ),
              // Strong and emphasis
              strong: ({ children, ...props }) => (
                <strong
                  className={`${previewArticleStyles.paragraph} font-bold  text-black`}
                  {...props}
                >
                  {children}
                </strong>
              ),

              em: ({ children, ...props }) => (
                <em className="italic  text-black" {...props}>
                  {children}
                </em>
              ),
              u: ({ children, ...props }) => {
                const childrenArray = React.Children.toArray(children);
                const isStrong = childrenArray.some((child) => {
                  if (React.isValidElement(child)) {
                    if (child.type === "strong") {
                      return true;
                    }
                  }
                  return false;
                });

                const isItalic = childrenArray.some((child) => {
                  if (React.isValidElement(child)) {
                    if (child.type === "em") {
                      return true;
                    }
                  }
                  return false;
                });
                console.log("isItalic", isItalic);
                console.log("isStrong", isStrong);

                if (isStrong && isItalic) {
                  return (
                    <u
                      className="ml-6 underline decoration-2 font-bold italic underline-offset-1 text-black"
                      {...props}
                    >
                      {children}
                    </u>
                  );
                }

                if (!isStrong && isItalic) {
                  return (
                    <u
                      className="ml-6 underline italic decoration-2 underline-offset-1 text-black"
                      {...props}
                    >
                      {children}
                    </u>
                  );
                }

                return (
                  <u
                    className="underline decoration-2 underline-offset-1 text-black"
                    {...props}
                  >
                    {children}
                  </u>
                );
              },
            }}
          >
            {updatedContent}
          </ReactMarkdown>
        </section>
      </article>
    </>
  );
};

export default PreviewArticle;
