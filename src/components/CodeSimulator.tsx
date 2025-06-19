import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const CodeSimulator: React.FC = () => {
  const [code, setCode] = useState('console.log(\"Hello, CodeFlow!\");\n// Write your JavaScript code here');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const runCode = useCallback(() => {
    setOutput('');
    setError('');
    try {
      // WARNING: Using eval is generally unsafe in production environments
      // For a real application, you'd want a more secure sandboxed execution environment (e.g., web worker, iframe with sandbox attribute, or backend execution).
      let consoleOutput = '';
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        consoleOutput += args.map(arg => String(arg)).join(' ') + '\n';
      };

      new Function(code)(); // Execute the code

      console.log = originalConsoleLog; // Restore original console.log
      setOutput(consoleOutput);
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    }
  }, [code]);

  return (
    <div className="code-simulator">
      <h3>Code Debugger/Simulator (JavaScript)</h3>
      <div className="code-editor-container">
        <CodeMirror
          value={code}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={(value: string) => setCode(value)}
        />
      </div>
      <button onClick={runCode} className="run-code-button">Run Code</button>
      <div className="output-container">
        <h4>Output:</h4>
        <pre className="code-output">{output}</pre>
        {error && <pre className="code-error">{error}</pre>}
      </div>
    </div>
  );
};

export default CodeSimulator; 