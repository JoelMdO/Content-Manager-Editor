import { getUploadedImageAttributes } from "../upload_image";

describe("getUploadedImageAttributes", () => {
  it("starts uploaded images at a maximum width of 100 pixels", () => {
    expect(getUploadedImageAttributes("blob:image", "photo.png")).toEqual({
      src: "blob:image",
      alt: "photo.png",
      width: 100,
    });
  });
});
