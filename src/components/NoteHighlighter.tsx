import React, { useState, useEffect } from 'react';

interface NoteHighlighterProps {
  initialText?: string;
}

const NoteHighlighter: React.FC<NoteHighlighterProps> = ({ initialText = '' }) => {
  const [noteContent, setNoteContent] = useState(initialText);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [highlightedContent, setHighlightedContent] = useState<React.ReactNode | string>('');

  useEffect(() => {
    applyHighlighting();
  }, [noteContent, keywordsInput]);

  const applyHighlighting = () => {
    if (!noteContent || !keywordsInput) {
      setHighlightedContent(noteContent);
      return;
    }

    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k !== '');
    if (keywords.length === 0) {
      setHighlightedContent(noteContent);
      return;
    }

    let currentContent: React.ReactNode[] = [noteContent];

    keywords.forEach(keyword => {
      const newContent: React.ReactNode[] = [];
      currentContent.forEach(segment => {
        if (typeof segment === 'string') {
          const parts = segment.split(new RegExp(`(${keyword})`, 'gi'));
          parts.forEach((part, index) => {
            if (part.toLowerCase() === keyword.toLowerCase()) {
              newContent.push(<strong key={`${keyword}-${index}`} className="highlight">{part}</strong>);
            } else {
              newContent.push(part);
            }
          });
        } else {
          newContent.push(segment);
        }
      });
      currentContent = newContent;
    });

    setHighlightedContent(currentContent);
  };

  return (
    <div className="note-highlighter">
      <h3>Auto Highlight Notes</h3>
      <div className="input-group">
        <textarea
          placeholder="Paste your notes here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={10}
        />
        <input
          type="text"
          placeholder="Enter keywords (comma-separated)"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
        />
      </div>
      <div className="highlighted-output">
        <h4>Highlighted Notes:</h4>
        <p>{highlightedContent}</p>
      </div>
    </div>
  );
};

export default NoteHighlighter; 