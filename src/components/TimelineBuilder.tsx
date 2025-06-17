import React, { useState, useEffect, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline/esnext';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

interface TimelineEvent {
  id: number;
  content: string;
  start: string; // ISO date string
  end?: string; // ISO date string
}

const TimelineBuilder: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: 1, content: 'World War I Begins', start: '1914-07-28' },
    { id: 2, content: 'World War II Begins', start: '1939-09-01' },
    { id: 3, content: 'First Moon Landing', start: '1969-07-20' },
  ]);
  const [newContent, setNewContent] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  useEffect(() => {
    if (timelineRef.current) {
      const items = new DataSet<any>(events.map(event => ({
        id: event.id,
        content: event.content,
        start: event.start,
        end: event.end,
      })));

      const options = {
        stack: false, // Stack events if they overlap
        showCurrentTime: true,
      };

      const timeline = new Timeline(timelineRef.current, items, options);

      // Clean up on component unmount
      return () => {
        timeline.destroy();
      };
    }
  }, [events]);

  const addEvent = () => {
    if (newContent.trim() === '' || newStartDate.trim() === '') {
      alert('Please enter event content and a start date.');
      return;
    }
    const newId = events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1;
    setEvents(prevEvents => [
      ...prevEvents,
      { id: newId, content: newContent, start: newStartDate, end: newEndDate || undefined },
    ]);
    setNewContent('');
    setNewStartDate('');
    setNewEndDate('');
  };

  return (
    <div className="timeline-builder">
      <h3>Historical Timeline Builder</h3>
      <div className="event-input-group">
        <input
          type="text"
          placeholder="Event content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date (optional)"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>
      <div className="timeline-container" ref={timelineRef} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default TimelineBuilder; 