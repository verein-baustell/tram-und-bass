const changeFaviconToLine = (line: Line) => {
  const lineNumber = line.number;
  const backgroundColor = line.color;
  const foregroundColor = line.isInverted ? "black" : "white";

  // Create new favicon data
  const faviconData = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <rect x='0.5' y='0.5' width='15' height='15' rx='2.5' fill='${encodeURIComponent(
          backgroundColor
        )}'/>
        <rect x='0.5' y='0.5' width='15' height='15' rx='2.5' stroke='${encodeURIComponent(
          foregroundColor
        )}'/>
        <text x='50%' y='55%' font-size='10' fill='
        ${encodeURIComponent(foregroundColor)}
        ' text-anchor='middle' dominant-baseline='middle' font-family='Helvetica, Arial, sans-serif' font-weight='bold'>
          ${lineNumber}
        </text>
      </svg>`;

  // Check if a favicon already exists
  let link: HTMLLinkElement | null = document.querySelector(
    "head link[rel*='icon']"
  );
  if (!link) {
    // Create new favicon link element if it doesn't exist
    link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    document.querySelector("head")?.appendChild(link);
  }

  // Update the favicon href
  link.href = faviconData;
};
export default changeFaviconToLine;
