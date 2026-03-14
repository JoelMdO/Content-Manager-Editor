import { useDraftStore } from "@/store/useDraftStore";

export interface IEditorLoader {
  load(title: string, html: string): void;
}

export class DraftEditorLoader implements IEditorLoader {
  load(title: string, html: string): void {
    useDraftStore.getState().loadDraftIntoEditor(title, html);
  }
}
