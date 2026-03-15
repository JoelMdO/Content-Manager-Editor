import { debouncedUpdateStore } from "./utils/debounceUpdateStore";
import { useEffect } from "react";
//import { useTranslatedArticleDraft } from "../dashboard/hooks/useTranslatedArticleDraft";
import DialogsLoader from "../../components/loaders/dialogs_loader";
import saveArticle from "./utils/save_article";
import DOMPurify from "dompurify";
import { useEditorStore } from "@/store/useEditorStore";
import { useDraftStore } from "@/store/useDraftStore";
import { useUIStore } from "@/store/useUIStore";
import { useTranslationStore } from "@/store/useTranslationStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { all, createLowlight } from "lowlight";
import { CustomImage } from "./extensions/ImageExtension";
import { handleContentChange } from "./utils/handle_content_change";
import FontStyleUI from "./menu/button_menu/font_style_buttons";

const lowlight = createLowlight(all);

const DashboardEditor = () => {
  // Refs — non-reactive
  const { savedTitleRef, savedBodyRef } = useEditorStore.getState();
  const { sectionsDialogRef } = useUIStore.getState();
  //
  // Reactive state subscriptions
  const isMarkdownText = useEditorStore((s) => s.isMarkdownText);
  const { setIsMarkdownText } = useEditorStore.getState();
  //
  const DRAFT_KEY = useDraftStore((s) => s.DRAFT_KEY);
  const dbName = useDraftStore((s) => s.dbName);
  const language = useDraftStore((s) => s.language);
  const article = useDraftStore((s) => s.article);
  const { setText } = useDraftStore.getState();
  //
  const isTranslating = useTranslationStore((s) => s.isTranslating);
  //
  const openDialogNoSection = useUIStore((s) => s.openDialogNoSection);
  const isSummary = useUIStore((s) => s.isSummary);
  const isLoadingPreview = useUIStore((s) => s.isLoadingPreview);
  const { setOpenDialogNoSection, setLastAutoSave } = useUIStore.getState();

  ///--------------------------------------------------------
  // Shared extensions used by both editors
  ///--------------------------------------------------------
  const sharedExtensions = [
    StarterKit.configure({
      // Disable code block from StarterKit so CodeBlockLowlight takes over
      codeBlock: false,
    }),
    Underline,
    Link.configure({ openOnClick: false }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlockLowlight.configure({ lowlight }),
    CustomImage.configure({ inline: true }),
  ];

  ///--------------------------------------------------------
  // Title editor — single paragraph, Enter shifts focus
  ///--------------------------------------------------------
  const titleEditor = useEditor({
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: "Title here..." }),
    ],
    editorProps: {
      attributes: {
        class:
          "h-[10dvh] font-bold p-4 rounded-g shadow-sm focus:outline-none cursor-pointer text-editor-text overflow-hidden",
        "data-cy": "editor-title",
      },
      handleKeyDown(view, event) {
        // Enter in title → focus body editor, do not insert newline
        if (event.key === "Enter") {
          event.preventDefault();
          useEditorStore
            .getState()
            .bodyEditorRef.current?.commands.focus("start");
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      savedTitleRef.current = html;
      handleContentChange(0, html, language, setText, debouncedUpdateStore);
    },
    immediatelyRender: false,
  });

  ///--------------------------------------------------------
  // Body editor — full rich-text
  ///--------------------------------------------------------
  const bodyEditor = useEditor({
    extensions: [
      ...sharedExtensions,
      Placeholder.configure({ placeholder: "Write your Article here..." }),
    ],
    editorProps: {
      attributes: {
        class:
          "h-[70dvh] md:h-[85dvh] overflow-auto p-4 pl-4 rounded-g shadow-sm focus:outline-none cursor-pointer text-editor-text",
        "data-cy": "editor-body",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      if (process.env.NODE_ENV === "development") {
        console.log({ html });
      }

      savedBodyRef.current = html;
      handleContentChange(1, html, language, setText, debouncedUpdateStore);
    },
    immediatelyRender: false,
  });

  ///--------------------------------------------------------
  // Register TipTap instances in store so toolbar + draft
  // helpers can access them without prop-drilling
  ///--------------------------------------------------------
  useEffect(() => {
    if (titleEditor)
      useEditorStore.getState().titleEditorRef.current = titleEditor;
    if (bodyEditor)
      useEditorStore.getState().bodyEditorRef.current = bodyEditor;
  }, [titleEditor, bodyEditor]);

  ///--------------------------------------------------------
  // Get the translated article draft
  ///--------------------------------------------------------
  //useTranslatedArticleDraft();

  ///--------------------------------------------------------
  // Set HTML content from Preview / published article
  ///--------------------------------------------------------
  useEffect(() => {
    if (!article?.content || !article?.title) return;
    if (!titleEditor || !bodyEditor) return;

    try {
      const sanitizedTitle = DOMPurify.sanitize(article.title);
      const sanitizedContent = DOMPurify.sanitize(article.content);

      titleEditor.commands.setContent(sanitizedTitle, { emitUpdate: false });
      bodyEditor.commands.setContent(sanitizedContent, { emitUpdate: false });

      savedTitleRef.current = sanitizedTitle;
      savedBodyRef.current = sanitizedContent;

      setIsMarkdownText(false);
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  ///--------------------------------------------------------
  // Autosave to localStorage every 10 minutes
  ///--------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const { titleEditorRef, bodyEditorRef } = useEditorStore.getState();
      const currentTitle = titleEditorRef.current?.getHTML() ?? "";
      const currentBody = bodyEditorRef.current?.getHTML() ?? "";
      saveArticle({ dbName, currentTitle, currentBody });
      setLastAutoSave(new Date());
    }, 10 * 60_000);

    return () => clearInterval(interval);
  }, [dbName, DRAFT_KEY, language]);

  ///---------------------------------------------------
  //  Cleanup debounce on unmount
  ///---------------------------------------------------
  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, []);

  ///--------------------------------------------------------
  // Open the sections dialog when no section is selected
  ///--------------------------------------------------------
  useEffect(() => {
    if (openDialogNoSection) {
      sectionsDialogRef?.current?.showModal();
    }
    setOpenDialogNoSection(false);
  }, [openDialogNoSection, sectionsDialogRef, setOpenDialogNoSection]);

  ///--------------------------------------------------------
  // UI
  ///--------------------------------------------------------
  return (
    <div className="flex flex-col w-full h-full border-4 border-blue rounded-tl-lg bg-editor-background">
      {isTranslating && <DialogsLoader type={"translation"} />}
      {isSummary && <DialogsLoader type={"summary"} />}
      {isLoadingPreview && <DialogsLoader type={"preview"} />}
      {isMarkdownText && <DialogsLoader type={"load_html"} />}

      <EditorContent editor={titleEditor} />
      <div className="hidden md:flex absolute md:right-[20vw] top-[13dvh] gap-3 items-center">
        <FontStyleUI type={`desktop`} />
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-blue from-[15%] to-transparent" />
      <EditorContent editor={bodyEditor} />
    </div>
  );
};

export default DashboardEditor;
