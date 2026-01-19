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

const validatePythonSyntax = (code) => {
  const errors = [];
  const lines = code.split('\n');
  const stack = []; 
  
  const definedSymbols = new Set([
    'print', 'len', 'range', 'str', 'int', 'float', 'bool', 
    'list', 'dict', 'set', 'tuple', 'min', 'max', 'sum', 
    'enumerate', 'zip', 'isinstance', 'type', 'open', 'help', 'dir',
    'abs', 'all', 'any', 'map', 'filter', 'sorted', 'super', 'input',
    'True', 'False', 'None'
  ]);

  const registerVariables = (str) => {
    if (!str) return;
    str.split(',').forEach(arg => {
      const varName = arg.split('=')[0].trim();
      if (varName) definedSymbols.add(varName);
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const importMatch = trimmed.match(/^import\s+(\w+)/);
    if (importMatch) definedSymbols.add(importMatch[1]);
    
    const importAsMatch = trimmed.match(/^import\s+[\w.]+\s+as\s+(\w+)/);
    if (importAsMatch) definedSymbols.add(importAsMatch[1]);

    const fromImportMatch = trimmed.match(/^from\s+[\w.]+\s+import\s+(\w+)/);
    if (fromImportMatch) definedSymbols.add(fromImportMatch[1]);

    const defMatch = trimmed.match(/^def\s+(\w+)\s*\(([^)]*)\)/);
    if (defMatch) {
      definedSymbols.add(defMatch[1]);
      registerVariables(defMatch[2]);
    }

    const assignMatch = trimmed.match(/^\s*([a-zA-Z_]\w*)\s*=/);
    if (assignMatch) definedSymbols.add(assignMatch[1]);

    const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in/);
    if (forMatch) definedSymbols.add(forMatch[1]);

    const needsColon = /^(if|elif|else|for|while|def|class|try|except|finally|with)\b/;
    if (needsColon.test(trimmed) && !trimmed.endsWith(':')) {
      errors.push(`Line ${index + 1}: Missing colon after statement.`);
    }

    for (let char of trimmed) {
      if ('({['.includes(char)) stack.push(char);
      if (')}]'.includes(char)) {
        const last = stack.pop();
        if ((char === ')' && last !== '(') || 
            (char === '}' && last !== '{') || 
            (char === ']' && last !== '[')) {
          errors.push(`Line ${index + 1}: Unbalanced brackets/parentheses.`);
        }
      }
    }

    if (trimmed.includes('.undefined_attr')) {
      errors.push(`Line ${index + 1}: Attribute Error: 'undefined_attr' is not defined.`);
    }

    const callRegex = /\b([a-zA-Z_]\w*)\s*\(([^)]*)\)/g; 
    let match;

    while ((match = callRegex.exec(trimmed)) !== null) {
      const funcName = match[1];
      const argsContent = match[2].trim();
      const keywords = ['if', 'elif', 'while', 'for', 'with', 'def', 'class', 'catch', 'switch', 'return', 'yield'];
      if (keywords.includes(funcName)) continue;
      const isMethod = match.index > 0 && trimmed[match.index - 1] === '.';
      
      if (!isMethod) {
        if (!definedSymbols.has(funcName)) {
           errors.push(`Line ${index + 1}: Unknown function '${funcName}'. It must be imported or defined.`);
        }
        if (argsContent.length === 0) {
           errors.push(`Line ${index + 1}: Function '${funcName}' called with empty arguments.`);
        } else {
          const args = argsContent.split(',');
          args.forEach(arg => {
            const cleanArg = arg.trim();
            if (cleanArg.includes('=')) return; 
            const isString = /^["'].*["']$/.test(cleanArg);
            const isNumber = /^-?\d+(\.\d+)?$/.test(cleanArg);
            const isComplex = /[+\-*/\[\]()]/.test(cleanArg);
            if (!isString && !isNumber && !isComplex && cleanArg.length > 0) {
              if (!definedSymbols.has(cleanArg)) {
                errors.push(`Line ${index + 1}: Argument '${cleanArg}' passed to '${funcName}' is not defined.`);
              }
            }
          });
        }
      }
    }
  });

  if (stack.length > 0) {
    errors.push("Syntax Error: Unclosed parentheses or brackets found.");
  }

  return errors;
};

export default validatePythonSyntax;