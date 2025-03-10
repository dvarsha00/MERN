// src/components/Modal.js
import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
