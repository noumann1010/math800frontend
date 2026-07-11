type QuestionMarkdownProps = {
  text: string;
  className?: string;
  compact?: boolean;
};

type TextSegment = { type: 'text'; value: string };
type ImageSegment = { type: 'image'; alt: string; src: string };
type Segment = TextSegment | ImageSegment;

const IMAGE_MARKDOWN_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/g;

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function resolveAssetUrl(rawPath: string): string {
  const value = rawPath.trim();
  if (!value) {
    return value;
  }

  if (/^(https?:)?\/\//i.test(value) || /^data:/i.test(value)) {
    return value;
  }

  const normalizedPath = value.replace(/^\.?\//, '').replace(/^\/+/, '');
  const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!rawApiBase) {
    return `/${normalizedPath}`;
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';
    if (!isLocalHost && rawApiBase.includes('.onrender.com')) {
      return `/api-proxy/${normalizedPath}`;
    }
  }

  const trimmedBase = trimTrailingSlash(rawApiBase);
  const assetBase = trimmedBase.endsWith('/api/v1')
    ? trimmedBase.slice(0, -'/api/v1'.length)
    : trimmedBase;

  return `${assetBase}/${normalizedPath}`;
}

function parseSegments(source: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null = null;

  IMAGE_MARKDOWN_PATTERN.lastIndex = 0;
  while ((match = IMAGE_MARKDOWN_PATTERN.exec(source)) !== null) {
    const before = source.slice(cursor, match.index);
    if (before.trim()) {
      segments.push({ type: 'text', value: before.trim() });
    }

    segments.push({
      type: 'image',
      alt: (match[1] || 'Question visual').trim() || 'Question visual',
      src: resolveAssetUrl(match[2] || ''),
    });
    cursor = match.index + match[0].length;
  }

  const tail = source.slice(cursor);
  if (tail.trim()) {
    segments.push({ type: 'text', value: tail.trim() });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', value: source.trim() });
  }

  return segments;
}

export function QuestionMarkdown({ text, className, compact = false }: QuestionMarkdownProps) {
  const value = (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const segments = parseSegments(value);

  return (
    <div className={`question-markdown ${compact ? 'question-markdown--compact' : ''} ${className ?? ''}`.trim()}>
      {segments.map((segment, index) => {
        if (segment.type === 'image') {
          return (
            <img
              key={`img-${index}-${segment.src}`}
              src={segment.src}
              alt={segment.alt}
              className="question-markdown-image"
              loading="lazy"
            />
          );
        }

        return (
          <p key={`text-${index}`} className="question-markdown-text">
            {segment.value}
          </p>
        );
      })}
    </div>
  );
}
