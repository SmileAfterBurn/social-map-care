
import React, { useState } from 'react';

interface CreatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

const CreatorLoginModal: React.FC<CreatorLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginClick = () => {
    if (password === 'TIGUAN') {
      onLogin(password);
      onClose();
      setPassword('');
      setError('');
    } else {
      setError('Неправильний пароль. Спробуйте ще раз.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Вхід для Творця</h2>
        <p className="mb-4 text-center text-gray-600">Будь ласка, введіть пароль для доступу до функцій адміністратора.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Скасувати
          </button>
          <button onClick={handleLoginClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Увійти
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorLoginModal;
