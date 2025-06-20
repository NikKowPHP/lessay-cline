export default function ErrorHighlight({ text, errors }: { text: string, errors: string[] }) {
  const segments = text.split(/(\s+)/).map((word, i) => 
    errors.includes(word.trim()) ? (
      <span key={i} className="underline decoration-red-500 decoration-wavy">{word}</span>
    ) : (
      <span key={i}>{word}</span>
    )
  );

  return <div className="inline">{segments}</div>;
}