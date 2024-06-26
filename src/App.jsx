import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import toast from 'react-hot-toast';

const colors = [
  '#f22828', '#ff9400', '#2d96ff', '#4bc421', '#c12eee',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

const sectors = (namesArray) => namesArray.map((name, index) => ({
  color: colors[index % colors.length],
  label: name
}));

const Spinner = ({ namesArray, rotation, isSpinning, winnerIndex }) => {
  const canvasRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const anglePerSegment = (2 * Math.PI) / namesArray.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // spinner text, rotation and sector color style given here
    namesArray.forEach((sector, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = sector.color;
      ctx.fill();
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(sector.label, radius - 10, 10);
      ctx.restore();
    });

    // Draw arrow for winner indicator
    if (winnerIndex !== null && !isSpinning) {
      const arrowAngle = winnerIndex * anglePerSegment + (anglePerSegment / 2);
      const arrowLength = radius + 20;
      const arrowX = centerX + Math.cos(arrowAngle) * arrowLength;
      const arrowY = centerY + Math.sin(arrowAngle) * arrowLength;

      // Position arrow beside the canvas
      const arrowElement = arrowRef.current;
      arrowElement.style.left = `${arrowX}px`;
      arrowElement.style.top = `${arrowY}px`;
      arrowElement.style.transform = `translate(-50%, -50%) rotate(${arrowAngle}rad)`;
      arrowElement.classList.add('visible');
    } else {
      const arrowElement = arrowRef.current;
      arrowElement.classList.remove('visible');
    }
  }, [namesArray, winnerIndex, isSpinning]);

  return (
    <div className="relative w-72 h-72">
      <canvas ref={canvasRef} width="300" height="300" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)' }} />
      <div ref={arrowRef} className="arrow invisible">
        <span className="arrow-indicator"></span>
      </div>
    </div>
  );
};

function App() {
  const [ names, setNames ] = useState( 'Jisan, Rifat, Teebro, Jasim, Ibrahim' );
  const [ winner, setWinner ] = useState( null );
  const [ isSpinning, setIsSpinning ] = useState( false );
  const [ rotation, setRotation ] = useState( 0 );
  const [ winnerIndex, setWinnerIndex ] = useState( null );

  const handleInputChange = ( event ) => {
    setNames( event.target.value );
  };

  const pickWinner = () => {
    //pick the winner here
    const namesArray = names.split(',').map(name => name.trim()).filter(name => name !== '');
    if (namesArray.length > 0) {
      setIsSpinning(true);
      const randomIndex = Math.floor(Math.random() * namesArray.length);
      const degrees = randomIndex * (360 / namesArray.length) + 360 * 4; 
      setRotation(rotation + degrees);
      setTimeout(() => {
        setWinner(namesArray[randomIndex]);
        setWinnerIndex(randomIndex);
        setIsSpinning(false);
      }, 5000);
    } 
    // Error message for empty textarea.
    else {
      toast.error("Enter some name before click 'spin it!' button.")
    }
  };

  const closePopup = () => {
    setWinner(null);
    setWinnerIndex(null);
  };

  const namesArray = sectors(names.split(',').map(name => name.trim()).filter(name => name !== ''));

  return (
    // Input names and clickable "spin it! button here".
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className='border-b-2 border-black mb-3'>
        <h1 className="text-3xl font-bold my-2 text-center">Add Names</h1>
      </div>
      <textarea
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        rows="3"
        placeholder="Enter names separated by commas"
        value={names}
        onChange={handleInputChange}
      />
      <div>
        <p className='text-center mt-5 text-3xl font-bold'>Pick A Winner!</p>
      </div>
      <div className="relative mt-3 flex flex-col items-center">
        <Spinner namesArray={namesArray} rotation={rotation} isSpinning={isSpinning} winnerIndex={winnerIndex} />
        <button className="bg-red-500 text-white w-32 mt-4 py-2 rounded-full flex items-center justify-center cursor-pointer" onClick={pickWinner} disabled={isSpinning}>
          Spin it!
        </button>
      </div>

      {/* Popup: popup with the winner person here.*/}
      {winner && (
        <div className="fixed flex items-center justify-center bg-opacity-50">
          <div className="bg-[#272727] text-white p-6 rounded-xl shadow-lg relative">
            <button className="absolute top-0 right-0 m-2 text-2xl" onClick={closePopup}>
              x
            </button>
            <p className="text-xl mr-5">"<span className="font-bold">{winner}</span>" is Winner!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
