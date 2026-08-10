import createFormData from "../create_formData";
import { blobToBase64, getBlob } from "@/lib/imageStore/imageStore";
import { FormDataItem } from "../../../type/formData";

jest.mock("@/lib/imageStore/imageStore", () => ({
  getBlob: jest.fn(),
  blobToBase64: jest.fn(),
}));

const mockedGetBlob = jest.mocked(getBlob);
const mockedBlobToBase64 = jest.mocked(blobToBase64);

describe("createFormData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem("db", "DeCav");
  });

  it("hydrates image base64 from IndexedDB blobs when building post FormData", async () => {
    const blob = new Blob(["image-bytes"], { type: "image/png" });
    mockedGetBlob.mockResolvedValue(blob);
    mockedBlobToBase64.mockResolvedValue("data:image/png;base64,aW1hZ2UtYnl0ZXM=");

    const data: FormDataItem[] = [
      { type: "title", content: "Title" },
      { type: "id", content: "title" },
      { type: "body", content: "<p>Body</p>" },
      { type: "section", content: "Intro" },
      {
        type: "image-img-123",
        imageId: "img-123",
        fileName: "photo.png",
        blobUrl: "blob:http://localhost/photo",
        base64: "",
      },
    ];

    const formData = await createFormData("post", data);
    const images = JSON.parse(formData.get("images") as string);

    expect(mockedGetBlob).toHaveBeenCalledWith("img-123");
    expect(mockedBlobToBase64).toHaveBeenCalledWith(blob);
    expect(images).toEqual([
      {
        type: "image-img-123",
        imageId: "img-123",
        fileName: "photo.png",
        blobUrl: "blob:http://localhost/photo",
        base64: "data:image/png;base64,aW1hZ2UtYnl0ZXM=",
      },
    ]);
  });
});
