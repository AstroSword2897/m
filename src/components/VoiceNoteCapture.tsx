import React, { useState } from 'react';

interface VoiceNoteCaptureProps {
  onNoteCaptured: (note: string) => void;
}

const VoiceNoteCapture: React.FC<VoiceNoteCaptureProps> = ({ onNoteCaptured }) => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
      setFinalTranscript(final);
    };

    recognition.onend = () => {
      setIsListening(false);
      setNote(prevNote => prevNote + finalTranscript); // Append final transcript to note
      setFinalTranscript(''); // Clear final transcript after appending
      setInterimTranscript(''); // Clear interim as well
      if (finalTranscript.trim() !== '') {
        onNoteCaptured(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      alert(`Speech recognition error: ${event.error}. Please ensure your browser supports Web Speech API and microphone access is granted.`);
    };
  }

  const startListening = () => {
    if (recognition) {
      setNote(''); // Clear previous note when starting new capture
      setFinalTranscript('');
      setInterimTranscript('');
      recognition.start();
    } else {
      alert('Speech Recognition API is not supported in this browser. Please use Chrome or a compatible browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className="voice-note-capture">
      <h3>Voice-to-Text Note Capture</h3>
      <div className="controls">
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div className="note-output">
        <p className="interim-text">{interimTranscript}</p>
        <p className="final-text">{note}</p>
      </div>
    </div>
  );
};

export default VoiceNoteCapture; 