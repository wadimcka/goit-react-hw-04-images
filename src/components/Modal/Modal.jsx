import { ModalOverlay, ModalWin } from './Modal.styled';
import React, { useEffect } from 'react';

export const Modal = ({ closeModal, largeImageURL, tags }) => {
  useEffect(() => {
    const handlePressEsc = event => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handlePressEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handlePressEsc);
      document.body.style.overflow = 'auto';
    };
  }, [closeModal]);

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalWin>
        <img src={largeImageURL} alt={tags} />
      </ModalWin>
    </ModalOverlay>
  );
};

export default Modal;
