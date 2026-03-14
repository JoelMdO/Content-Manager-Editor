import { cleanNestedDivs } from "../../utils/clean_content";
import { hydrateImagesInHTML } from "@/lib/imageStore/hydrateImages";

export interface IContentProcessor {
  processHtml(html: string): Promise<string>;
}

export class ContentProcessor implements IContentProcessor {
  async processHtml(html: string): Promise<string> {
    if (!html) return "";
    let s = html.replace(/<div>/g, "").replace(/<\/div>/g, "");
    s = cleanNestedDivs(s);
    try {
      return await hydrateImagesInHTML(s);
    } catch (e) {
      console.warn("[ContentProcessor] hydrateImagesInHTML failed", e);
      return s;
    }
  }
}
