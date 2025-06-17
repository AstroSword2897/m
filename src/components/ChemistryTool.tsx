import React, { useState } from 'react';

const ChemistryTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('formulas'); // 'formulas' or 'periodic-table'

  const chemistryFormulas = [
    { name: 'Density', formula: '\( \rho = \frac{m}{V} \)' },
    { name: 'Molarity', formula: '\( M = \frac{n}{V_{sol}} \)' },
    { name: 'Ideal Gas Law', formula: '\( PV = nRT \)' },
    { name: 'pH', formula: '\( pH = -log[H^+] \)' },
    { name: 'Gibbs Free Energy', formula: '\( \Delta G = \Delta H - T\Delta S \)' },
  ];

  // A simplified, static representation of some elements for the periodic table
  const periodicTableElements = [
    { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, mass: 1.008 },
    { symbol: 'He', name: 'Helium', atomicNumber: 2, mass: 4.0026 },
    { symbol: 'Li', name: 'Lithium', atomicNumber: 3, mass: 6.94 },
    { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, mass: 9.0122 },
    { symbol: 'B', name: 'Boron', atomicNumber: 5, mass: 10.81 },
    { symbol: 'C', name: 'Carbon', atomicNumber: 6, mass: 12.011 },
    { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, mass: 14.007 },
    { symbol: 'O', name: 'Oxygen', atomicNumber: 8, mass: 15.999 },
    { symbol: 'F', name: 'Fluorine', atomicNumber: 9, mass: 18.998 },
    { symbol: 'Ne', name: 'Neon', atomicNumber: 10, mass: 20.180 },
  ];

  return (
    <div className="chemistry-tool">
      <h3>Chemistry Tool</h3>
      <div className="tabs">
        <button
          className={activeTab === 'formulas' ? 'active' : ''}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
        <button
          className={activeTab === 'periodic-table' ? 'active' : ''}
          onClick={() => setActiveTab('periodic-table')}
        >
          Periodic Table
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'formulas' && (
          <div className="formula-sheet">
            <h4>Common Formulas</h4>
            <ul>
              {chemistryFormulas.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}:</strong> <span dangerouslySetInnerHTML={{ __html: item.formula.replace(/\\\(/g, '(').replace(/\\\)/g, ')') }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'periodic-table' && (
          <div className="periodic-table-display">
            <h4>Periodic Table (Simplified)</h4>
            <div className="elements-grid">
              {periodicTableElements.map((element, index) => (
                <div key={index} className="element-tile">
                  <span className="atomic-number">{element.atomicNumber}</span>
                  <span className="symbol">{element.symbol}</span>
                  <span className="name">{element.name}</span>
                  <span className="mass">{element.mass.toFixed(4)}</span>
                </div>
              ))}
            </div>
            <p className="note">Note: This is a simplified periodic table for demonstration. A full version would require a more comprehensive data set and complex layout.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryTool; 