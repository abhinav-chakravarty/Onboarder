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
import Toast from './Toast'
import validatePythonSyntax from './Validator';
import CodeEditor from './CodeEditor';
import InputField from './InputField';
// import apiService from './apiService';
// import socketClient from './socketClient';

export default function App() {
  const [formData, setFormData] = useState({
    train: '',
    project: '',
    trtFeed: '',
    createFeed: false,
    pythonCode: ''
  });
  
  const [codeErrors, setCodeErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  // const [socketConnected, setSocketConnected] = useState(false);

  // useEffect(() => {
  //   socketClient.connect();
  //   const handleStatus = (status) => setSocketConnected(status === 'connected');
  //   socketClient.on('status', handleStatus);
  //   return () => socketClient.off('status', handleStatus);
  // }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (newCode) => {
    setFormData(prev => ({ ...prev, pythonCode: newCode }));
    const errors = validatePythonSyntax(newCode);
    setCodeErrors(errors);
  };

  const handleSubmit = async () => {
    if (!formData.train || !formData.project || !formData.trtFeed) {
      setToast({ type: 'Fail', message: 'Please fill in all required text fields.' });
      return;
    }
    if (codeErrors.length > 0) {
      setToast({ type: 'Fail', message: 'Please fix python syntax errors before submitting.' });
      return;
    }
    // if (!socketConnected) {
    //   setToast({ type: 'Fail', message: 'Socket disconnected. Cannot submit.' });
    //   return;
    // }

    setIsSubmitting(true);
    
    try {
      const payload = {
        train_id: formData.train,
        project_name: formData.project,
        trt_feed_source: formData.trtFeed,
        create_new_feed: formData.createFeed,
        configuration_script: formData.pythonCode,
        timestamp: new Date().toISOString()
      };
      const response = 'OK'//await apiService.submitConfiguration(payload);
      setToast({ type: response.status, message: response.message });
    } catch (error) {
      setToast({ type: 'Fail', message: 'Network error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="app-container">
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        <div className="dashboard-card">
          {/* Left Panel: Form Inputs */}
          <div className="panel-left">
            <div className="header-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'start'}}>
                <div>
                  <h1>
                    Onboarder
                  </h1>
                  <p>Configure your Stack File.</p>
                </div>
                
                {/* <div className={`status-badge ${socketConnected ? 'online' : 'offline'}`}>
                  {socketConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {socketConnected ? 'ONLINE' : 'OFFLINE'}
                </div> */}
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <InputField 
                id="train"
                label="Train Name" 
                placeholder="e.g. core.qztrades" 
                value={formData.train} 
                onChange={(val) => handleInputChange('train', val)} 
              />
              
              <InputField 
                id="project"
                label="Project Name" 
                placeholder="QzTrades" 
                value={formData.project} 
                onChange={(val) => handleInputChange('project', val)} 
              />

              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <InputField 
                  id="trtFeed"
                  label="TrT Feed" 
                  placeholder="QzTrades" 
                  icon={Database}
                  value={formData.trtFeed} 
                  onChange={(val) => handleInputChange('trtFeed', val)} 
                />
                
                <label className="checkbox-wrapper">
                  <div style={{position: 'relative'}}>
                    <input 
                      type="checkbox" 
                      style={{position:'absolute', opacity: 0, width:0, height:0}}
                      checked={formData.createFeed}
                      onChange={(e) => handleInputChange('createFeed', e.target.checked)}
                    />
                    <div className="toggle-track">
                      <div className="toggle-thumb"></div>
                    </div>
                  </div>
                  <span style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>
                    Create New Feed
                  </span>
                </label>
              </div>
            </div>

            <div className="form-actions">
               <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-submit"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={{width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                    Validating...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Create Stack File
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Code Editor */}
          <div className="panel-right">
            <CodeEditor 
              code={formData.pythonCode} 
              onChange={handleCodeChange} 
              errors={codeErrors} 
            />
            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)'}}>
              <span>Dynamic Syntax Check Active</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}