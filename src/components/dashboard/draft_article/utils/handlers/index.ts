import type { IStorageProvider } from "../storage";
import type { IContentProcessor } from "../processor";
import type { IEditorLoader } from "../editorLoader";
import { LocalStorageProvider, SessionStorageProvider } from "../storage";
import { ContentProcessor } from "../processor";
import { DraftEditorLoader } from "../editorLoader";
import loadArticle from "../../../preview/utils/load_markdown_article";
import { StorageItem, StorageItemOrNull } from "../../../../../types/storage_item";

export type DispatchProps = {
  tag: string;
  newSavedTitleRef?: React.RefObject<string | null>;
  savedTitleRef?: React.RefObject<string | null>;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summary: string) => void;
  setArticle?: (article: StorageItemOrNull | null) => void;
};

export type HandlerContext = {
  storage: IStorageProvider;
  sessionStorageProvider: IStorageProvider; // for fallback reads
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
    if (props.savedTitleRef && props.newSavedTitleRef && props.newSavedTitleRef.current != null) {
      props.savedTitleRef.current = props.newSavedTitleRef.current;
    }
    props.setArticle?.(null);

    // persist local draft into session so preview/loading uses same source
    const raw = localStorage.getItem(`draft-articleContent-${ctx.dbName}`);
    if (raw) sessionStorage.setItem(`articleContent-${ctx.dbName}`, raw);

    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageItem[];
    const body = items.find((i) => i.type === "body")?.content || "";
    const processed = await ctx.processor.processHtml(body);
    ctx.editor.load(props.savedTitleRef?.current ?? "", processed);
  }
}

class SummaryEnHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("en");
    const local = (await ctx.storage.readDraft(ctx.dbName)) as StorageItem[];
    let summary = local.find((i) => i.type === "summary")?.content || "";
    if (!summary) {
      const session = (await ctx.sessionStorageProvider.readDraft(ctx.dbName)) as StorageItem[];
      summary = session.find((i) => i.type === "summary")?.content || "";
    }
    if (summary) summary = summary.replace(/<div>|<\/div>/g, "").trim();
    props.setSummaryContent?.(summary);
  }
}

class DraftEsHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("es");
    // set saved title from localized title in draft
    const items = (await ctx.storage.readDraft(ctx.dbName)) as StorageItem[];
    const esTitle = items.find((i) => i.type === "es-title")?.content || "";
    if (props.savedTitleRef) props.savedTitleRef.current = esTitle;
    props.setArticle?.(null);

    // persist local draft into session for preview
    const raw = localStorage.getItem(`draft-articleContent-${ctx.dbName}`);
    if (raw) sessionStorage.setItem(`articleContent-${ctx.dbName}`, raw);

    const body = items.find((i) => i.type === "es-body")?.content || "";
    const processed = await ctx.processor.processHtml(body);
    ctx.editor.load(props.savedTitleRef?.current ?? "", processed);
  }
}

class SummaryEsHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    props.setLanguage?.("es");
    const local = (await ctx.storage.readDraft(ctx.dbName)) as StorageItem[];
    let summary = local.find((i) => i.type === "es-summary")?.content || "";
    if (!summary) {
      const session = (await ctx.sessionStorageProvider.readDraft(ctx.dbName)) as StorageItem[];
      summary = session.find((i) => i.type === "es-summary")?.content || "";
    }
    if (summary) summary = summary.replace(/<div>|<\/div>/g, "").trim();
    props.setSummaryContent?.(summary);
  }
}

class PreviewHandler implements ITagHandler {
  async handle(props: DispatchProps, ctx: HandlerContext) {
    // preview handlers simply call existing loader and setArticle
    if (props.tag === "preview-en") {
      props.setLanguage?.("en");
      const loaded = await loadArticle({ language: props.language ?? "en" });
      if (loaded) props.setArticle?.(loaded as StorageItemOrNull);
    } else if (props.tag === "preview-es") {
      props.setLanguage?.("es");
      const loaded = await loadArticle({ language: props.language ?? "es" });
      if (loaded) props.setArticle?.(loaded as StorageItemOrNull);
    }
  }
}

// create default dispatcher and register minimal handlers
export const defaultDispatcher = new TagDispatcher();

// concrete providers used for default wiring
const localProvider = new LocalStorageProvider();
const sessionProvider = new SessionStorageProvider();
const processor = new ContentProcessor();
const editor = new DraftEditorLoader();

defaultDispatcher.register("draft-en", new DraftEnHandler());
defaultDispatcher.register("summary-en", new SummaryEnHandler());
defaultDispatcher.register("draft-es", new DraftEsHandler());
defaultDispatcher.register("summary-es", new SummaryEsHandler());
defaultDispatcher.register("preview-en", new PreviewHandler());
defaultDispatcher.register("preview-es", new PreviewHandler());

// helper to create a HandlerContext with defaults
export function defaultHandlerContext(dbName: string): HandlerContext {
  return {
    storage: localProvider,
    sessionStorageProvider: sessionProvider,
    processor,
    editor,
    dbName,
  };
}
