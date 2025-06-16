import React, { useState } from 'react';
import { evaluate } from 'mathjs';

const MathProblemSolver: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleSolve = () => {
    setError(null);
    setResult(null);
    setExplanation(null);
    if (expression.trim() === '') {
      setError('Please enter a mathematical expression.');
      return;
    }

    try {
      const evalResult = evaluate(expression);
      setResult(evalResult.toString());
      // Placeholder for step-by-step explanation
      setExplanation('This is a placeholder for step-by-step explanation. A full implementation would require a symbolic solver.');
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    }
  };

  return (
    <div className="math-problem-solver">
      <h3>Math Problem Solver</h3>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter mathematical expression (e.g., 2 + 3 * (4 - 1))"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSolve(); }}
        />
        <button onClick={handleSolve}>Solve</button>
      </div>
      {result && (
        <div className="result-output">
          <h4>Result:</h4>
          <p>{result}</p>
        </div>
      )}
      {explanation && (
        <div className="explanation-output">
          <h4>Explanation:</h4>
          <p>{explanation}</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MathProblemSolver; 