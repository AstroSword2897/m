import React, { useState, useEffect } from 'react';

interface DailyChallengeProps {
  challengeText: string;
  durationInSeconds: number; // e.g., 180 for 3 minutes
  onChallengeComplete: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({
  challengeText,
  durationInSeconds,
  onChallengeComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onChallengeComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onChallengeComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationInSeconds);
  };

  return (
    <div className="daily-challenge">
      <h3>Daily Mini-Challenge</h3>
      <p className="challenge-text">{challengeText}</p>
      <div className="timer-display">
        Time Left: {formatTime(timeLeft)}
      </div>
      <div className="challenge-controls">
        <button onClick={handleStartStop}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {timeLeft === 0 && !isRunning && <p className="challenge-complete-message">Challenge Completed!</p>}
    </div>
  );
};

export default DailyChallenge; 