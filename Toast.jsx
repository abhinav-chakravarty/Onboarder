import {  useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
} from 'lucide-react';
import './App.css'

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'Pass';
  
  return (
    <div className={`toast-popup ${isSuccess ? 'pass' : 'fail'}`}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <div>
        <div style={{fontWeight: 'bold', fontSize: '0.875rem'}}>{isSuccess ? 'Success' : 'Failed'}</div>
        <div style={{fontSize: '0.875rem', opacity: 0.9}}>{message}</div>
      </div>
      <button onClick={onClose} style={{marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}}>×</button>
    </div>
  );
};


export default Toast;