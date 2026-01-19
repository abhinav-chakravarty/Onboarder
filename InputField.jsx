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

const InputField = ({ label, value, onChange, placeholder, id }) => (
  <div className="input-group">
    <label htmlFor={id} className="input-label">
      
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-control"
      placeholder={placeholder}
    />
  </div>
);


export default InputField;