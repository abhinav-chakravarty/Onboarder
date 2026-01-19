import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Code, 
  Send, 
  Terminal, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import './App.css'

const CodeEditor = ({ code, onChange, errors }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%'}}>
      <div className="editor-header">
        <label className="input-label">
          <Code size={14} />
          Python Configuration
        </label>
        {errors.length > 0 ? (
          <span className="validation-status error">
            <AlertTriangle size={14} />
            {errors.length} Syntax Error{errors.length > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="validation-status valid">
            <CheckCircle size={14} />
            Syntax Valid
          </span>
        )}
      </div>
      
      <div className={`editor-frame ${errors.length > 0 ? 'has-error' : ''}`}>
        <div className="window-controls">
          <div className="dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          {/* <span className="filename">config.py</span> */}
        </div>
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="code-area"
          placeholder={`import my_lib\ndef process(data):\n    my_lib.run(data)`}
          spellCheck="false"
        />
        {errors.length > 0 && (
          <div className="error-console">
            {errors.map((err, i) => (
              <div key={i} className="error-msg">
                <span>•</span>
                {err}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;