# AUTOSAVE AND SAVE BUTTON

## use of saveArticle()

- From currentTitle gets the editorRefs current Title.
- From currentBody gets the editorRefs current Body.
- If contains the placeholders "Title", "Article" does not save.
- Retrieve the localStorage title and body.
- Retrieve the sessionStorage title and body.

### Comparison Title and Body:

_Title_:

- Remove the
  ```.replace(/<span class="text-gray-400">.*?</span>/g, "")
  .replace(/<[^>]*>/g, "")
  ```
- Compare sessionStorage and LocalStorage, sessionStorage must be the most updated as is the one which change on user inputs.

_Body_:

- Remove the

  ```
  .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
    .replace(/<img[^>]*?>/gi, "")
  ```

- Compare sessionStorage and LocalStorage, sessionStorage must be the most updated as is the one which change on user inputs.

**_If equal does not make any change_**

### Images comparison:

- Get the images from sessionStorage and localStorage and compare if they are equal using:

  ```
  const areArraysEqual = JSON.stringify(sessionStoredImages.sort()) ===
    JSON.stringify(localStoredImages.sort());
  ```

- If are different will save from sessionStorage the Images to localStorage.

### Final steps.

- Get the id from sessionStorage.
- RemoveBase64 from Img Tags, save spot for images by changing to:

```
'<img src="{image_url_placeholder}">'
```

- Save according to the language, for example is:

  ```
  articleData = [
    { type: "es-title", content: currentTitle },
    { type: "es-body", content: htmlCleanedBody },
    ...images,
    ...id,
  ];

  const articleJson = JSON.stringify(articleData);
  ```
