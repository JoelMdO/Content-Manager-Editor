export function cleanHtml(input: string): string {
  // Replace <br> and <br/> with newlines
  let output = input.replace(/<br\s*\/?>/gi, "___LINE_BREAK___");

  // Replace <span font-style="..."> with markdown-like formatting
  // output = output.replace(
  //   /<span[^>]*font-style=["']?bold["']?[^>]*>(.*?)<\/span>/gi,
  //   "**$1**"
  // );
  // output = output.replace(
  //   /<span[^>]*font-style=["']?italic["']?[^>]*>(.*?)<\/span>/gi,
  //   "_$1_"
  // );
  // output = output.replace(
  //   /<span[^>]*font-style=["']?underline["']?[^>]*>(.*?)<\/span>/gi,
  //   "__$1__"
  // );

  // // Remove all other <span> tags but keep their content
  // output = output.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");

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
