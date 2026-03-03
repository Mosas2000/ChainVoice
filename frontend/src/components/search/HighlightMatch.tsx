interface HighlightMatchProps {
  text: string;
  query: string;
}

/**
 * Render text with matching portions wrapped in a styled <mark> tag.
 * Uses a case-insensitive split so the original casing of the source
 * text is preserved while the matched segments are highlighted.
 *
 * Returns the text unchanged if the query is empty or absent.
 */
export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-primary/20 text-foreground rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
