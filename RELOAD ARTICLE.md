# RELOAD ARTICLE.

## Use of handleClick()

- Load of localstorage.

### If local storage exists.

- Get the body on preSavedBodyRef.
- Get the images from IndexDB.

### If images exists.

- For each image:
  - create a blobUrl for preshow.
  - change the tag to the blobUrl based on the image.id
    ```
    '<img src="{image_url_placeholder}">'
    ```
  - Using RegEx:
  ```
      const regex = new RegExp(
          `<img\\s+src=["']\\{image_url_placeholder\\}["'][^>]*>\\s*<p[^>]*>${image.id}</p>`,
          "g"
        );
  ```
  - Store the image url on the body:
  ````
        preSavedBodyRef = preSavedBodyRef.replace(
          regex,
          `<img src="${blobUrl}" alt="${image.id}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${image.id}</p>`
        );
        ```
  ````

### Final Steps:

- Replace the rest of the tags to paste it on the DashBoardEditor.

```
preSavedBodyRef = preSavedBodyRef
      .replace(/<\/div>/g, "___LINE_BREAK___")
      .replace(/<br\s*\/?>/g, "___LINE_BREAK___")
      // .replace(/<(?!img|span|a\\b)[^>]*>/g, "")
      .replace(/___LINE_BREAK___/g, "<br>");
```

- Update the saveBodyRef with the preSavedBodyRef

?? check if the image has been saved already.
