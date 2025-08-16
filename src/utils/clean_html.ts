export function cleanHtml(input: string): string {
  let output = input.replace(/<br\s*\/?>/gi, "___LINE_BREAK___");
  // Add space before and after <img> tags, keep the tag
  // output = output.replace(/<img[^>]*>/gi, " $& ");
  output = output.replace(/<img[^>]*>/gi, "___LINE_BREAK___");

  // Add space before and after <a> or <link> tags, keep the tag
  // output = output.replace(/<(a|link)[^>]*>(.*?)<\/\1>/gi, " <$1>$2</$1> ");
  output = output.replace(/<(a|link)[^>]*>(.*?)<\/\1>/gi, "___LINE_BREAK___");

  // Remove all other HTML tags except <img>, <a>, <link>
  output = output.replace(/<(?!img|a|link)[^>]+>/gi, "");

  // Optionally, collapse multiple spaces/newlines
  // output = output.replace(/\n{2,}/g, "\n\n").replace(/ {2,}/g, " ");
  // Replace custom line break placeholder with actual newlines
  output = output.replace(/___LINE_BREAK___/g, "<br>");

  return output.trim();
}
