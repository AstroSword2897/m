import React, { useState } from 'react';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizBuilderProps {
  onSaveQuiz: (questions: Question[]) => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ onSaveQuiz }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentOptions, setCurrentOptions] = useState<string>(''); // Comma-separated options
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState('');

  const addQuestion = () => {
    if (currentQuestionText.trim() === '' || currentCorrectAnswer.trim() === '') {
      alert('Please enter a question and a correct answer.');
      return;
    }

    const optionsArray = currentOptions.split(',').map(option => option.trim()).filter(option => option !== '');
    if (optionsArray.length > 0 && !optionsArray.includes(currentCorrectAnswer)) {
      alert('Correct answer must be one of the options if options are provided.');
      return;
    }

    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        questionText: currentQuestionText,
        options: optionsArray,
        correctAnswer: currentCorrectAnswer,
      },
    ]);
    setCurrentQuestionText('');
    setCurrentOptions('');
    setCurrentCorrectAnswer('');
  };

  const handleSave = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before saving.');
      return;
    }
    onSaveQuiz(questions);
    setQuestions([]); // Clear questions after saving
  };

  return (
    <div className="quiz-builder">
      <h3>Build Your Quiz</h3>
      <div className="question-input-group">
        <textarea
          placeholder="Enter question text"
          value={currentQuestionText}
          onChange={(e) => setCurrentQuestionText(e.target.value)}
          rows={3}
        />
        <input
          type="text"
          placeholder="Enter options (comma-separated, e.g., A, B, C)"
          value={currentOptions}
          onChange={(e) => setCurrentOptions(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter correct answer"
          value={currentCorrectAnswer}
          onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
        />
        <button onClick={addQuestion}>Add Question</button>
      </div>

      <div className="current-questions">
        <h4>Current Questions:</h4>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul>
            {questions.map((q) => (
              <li key={q.id}>
                <p><strong>Q:</strong> {q.questionText}</p>
                {q.options.length > 0 && <p><strong>Options:</strong> {q.options.join(', ')}</p>}
                <p><strong>A:</strong> {q.correctAnswer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="save-quiz-button" onClick={handleSave}>Save Quiz</button>
    </div>
  );
};

export default QuizBuilder; 