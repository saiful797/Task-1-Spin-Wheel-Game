// SpinWheel.jsx
import { useState } from 'react';

const SpinWheelGame = ({ names }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const spinWheel = () => {
    if (names.length > 0) {
      setSpinning(true);
      const randomIndex = Math.floor(Math.random() * names.length);
      setTimeout(() => {
        setWinner(names[randomIndex]);
        setSpinning(false);
      }, 3000); // Adjust spin time as needed
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="relative w-64 h-64">
        <div
          className={`absolute w-full h-full bg-yellow-300 flex justify-center items-center rounded-full ${
            spinning ? 'animate-spin' : ''
          }`}
          style={{ transition: 'transform 3s ease-in-out' }}
        >
          {names.map((name, index) => (
            <div
              key={index}
              className="absolute w-40 h-16 bg-white rounded-lg shadow-lg"
              style={{
                transform: `rotate(${index * (360 / names.length)}deg)`,
                transformOrigin: '100% 50%',
              }}
            >
              <p className="text-center text-lg font-bold mt-3">{name}</p>
            </div>
          ))}
        </div>
        {winner && (
          <div className="absolute w-full h-full flex justify-center items-center text-2xl font-bold text-green-500">
            {winner}
          </div>
        )}
      </div>
      <button
        className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ml-4 ${
          spinning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={spinWheel}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default SpinWheelGame;
