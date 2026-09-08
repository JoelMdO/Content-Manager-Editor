import replaceSrcWithImagePlaceholdersAtPost from "../replace_src_on_img_at_post";

describe("replaceSrcWithImagePlaceholdersAtPost", () => {
  it("replaces every matching image for the current fileId", () => {
    const htmlContent = [
      '<p>Before</p>',
      '<img src="/media/article_images/first-photo.webp" />',
      '<img src="/media/article_images/second-photo.webp" />',
      '<img src="/media/article_images/first-photo.webp" />',
    ].join("");

    const result = replaceSrcWithImagePlaceholdersAtPost(htmlContent, {
      url: "https://res.cloudinary.com/demo/image/upload/first-photo.webp",
      fileId: "first-photo.webp",
    });

    expect(result).toBe(
      '<div><p>Before</p><img src="https://res.cloudinary.com/demo/image/upload/first-photo.webp" alt="first-photo.webp"/><img src="/media/article_images/second-photo.webp" /><img src="https://res.cloudinary.com/demo/image/upload/first-photo.webp" alt="first-photo.webp"/></div>',
    );
  });
});
