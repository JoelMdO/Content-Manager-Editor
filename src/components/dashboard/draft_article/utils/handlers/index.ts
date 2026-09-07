import type { IStorageProvider } from "../storage";
import type { IContentProcessor } from "../processor";
import type { IEditorLoader } from "../editorLoader";
import { LocalStorageProvider } from "../storage";
import { ContentProcessor } from "../processor";
import { DraftEditorLoader } from "../editorLoader";
// import loadArticle from "../../../preview/utils/load_markdown_article";
import {
  ArticleItemOrNull,
  StorageArticle,
  // SummaryStorage,
} from "../../../../../types/storage_item";

export type DispatchProps = {
  tag: string;
  newSavedTitleRef?: React.RefObject<string | null>;
  savedTitleRef?: React.RefObject<string | null>;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summary: string) => void;
  setArticle?: (article: ArticleItemOrNull | null) => void;
};

export type HandlerContext = {
  storage: IStorageProvider;
  processor: IContentProcessor;
  editor: IEditorLoader;
  dbName: string;
};

export interface ITagHandler {
  handle(props: DispatchProps, ctx: HandlerContext): Promise<void>;
}

export class TagDispatcher {
  private handlers: Map<string, ITagHandler> = new Map();

  register(tag: string, handler: ITagHandler) {
    this.handlers.set(tag, handler);
  }

  async dispatch(tag: string, props: DispatchProps, ctx: HandlerContext) {
    const h = this.handlers.get(tag);
    if (!h) {
      console.warn(`[TagDispatcher] no handler registered for tag=${tag}`);
      return;
    }
    await h.handle(props, ctx);
  }
}

// --- Handlers ---
class DraftEnHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("en");
    // set title safely
    if (
      props.savedTitleRef &&
      props.newSavedTitleRef &&
      props.newSavedTitleRef.current != null
    ) {
      props.savedTitleRef.current = props.newSavedTitleRef.current;
    }
    props.setArticle?.(null);

    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageArticle[];
    console.log("[DraftEnHandler] readDraft items:", items);
    const article = Object.values(items);
    const title =
      (
        article
          .filter((item) => item.type === "title")
          .map((item) => item.content) as string[]
      )[0] || "";
    if (props.savedTitleRef) props.savedTitleRef.current = title;
    props.setArticle?.(null);
    const body =
      (
        article
          .filter((item) => item.type === "body")
          .map((item) => item.content) as string[]
      )[0] || "";
    console.log("[DraftEnHandler] body content:", body);
    const processed = await ctx.processor.processHtml(body);
    ctx.editor.load(props.savedTitleRef?.current ?? "", processed);
  }
}

class DraftEsHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("es");
    // set saved title from localized title in draft
    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageArticle[];
    const article = Object.values(items);
    const esTitle =
      (
        article
          .filter((item) => item.type === "es_title")
          .map((item) => item.content) as string[]
      )[0] || "";
    if (props.savedTitleRef) props.savedTitleRef.current = esTitle;
    props.setArticle?.(null);

    const body =
      (
        article
          .filter((item) => item.type === "es_body")
          .map((item) => item.content) as string[]
      )[0] || "";
    const processed = await ctx.processor.processHtml(body);
    ctx.editor.load(props.savedTitleRef?.current ?? "", processed);
  }
}

class SummaryEnHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("en");
    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageArticle[];
    const article = Object.values(items);
    let summary =
      (
        article
          .filter((item) => item.type === "summary")
          .map((item) => item.content) as string[]
      )[0] || "";
    if (summary) summary = summary.replace(/<div>|<\/div>/g, "").trim();
    props.setSummaryContent?.(summary);
  }
}
class SummaryEsHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("es");
    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageArticle[];
    let summary =
      (
        items
          .filter((item) => item.type === "es_summary")
          .map((item) => item.content) as string[]
      )[0] || "";
    console.log("[SummaryEsHandler] readDraft items:", items);

    if (summary) summary = summary.replace(/<div>|<\/div>/g, "").trim();
    props.setSummaryContent?.(summary);
  }
}

// class PreviewHandler implements ITagHandler {
//   async handle(props: DispatchProps) {
//     // preview handlers simply call existing loader and setArticle
//     if (props.tag === "preview-en") {
//       props.setLanguage?.("en");
//       const loaded = await loadArticle({ language: props.language ?? "en" });
//       if (loaded) props.setArticle?.(loaded as ArticleItemOrNull);
//     } else if (props.tag === "preview-es") {
//       props.setLanguage?.("es");
//       const loaded = await loadArticle({ language: props.language ?? "es" });
//       if (loaded) props.setArticle?.(loaded as ArticleItemOrNull);
//     }
//   }
// }

// create default dispatcher and register minimal handlers
export const defaultDispatcher = new TagDispatcher();

// concrete providers used for default wiring
const localProvider = new LocalStorageProvider();
const processor = new ContentProcessor();
const editor = new DraftEditorLoader();

defaultDispatcher.register("draft-en", new DraftEnHandler());
defaultDispatcher.register("summary-en", new SummaryEnHandler());
defaultDispatcher.register("draft-es", new DraftEsHandler());
defaultDispatcher.register("summary-es", new SummaryEsHandler());
// defaultDispatcher.register("preview-en", new PreviewHandler());
// defaultDispatcher.register("preview-es", new PreviewHandler());

// helper to create a HandlerContext with defaults
export function defaultHandlerContext(dbName: string): HandlerContext {
  return {
    storage: localProvider,
    processor,
    editor,
    dbName,
  };
}
