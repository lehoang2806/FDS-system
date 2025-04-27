import { FC } from 'react';
import { ModalProps } from './type';

const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="mg-r30 modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;