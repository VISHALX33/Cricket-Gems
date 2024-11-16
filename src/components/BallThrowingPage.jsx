import React, { useState } from "react";
import BallThrowingGame from "./BallThrowingGame";

function BallThrowingPage() {
  const [isPlaying, setIsPlaying] = useState(true);

  const startNewGame = () => {
    setIsPlaying(true);
  };

  return (
    <div className="ball-throwing-page">
      <h1>Ball Throwing Game</h1>
      {isPlaying ? (
        <BallThrowingGame startNewGame={startNewGame} />
      ) : (
        <div>
          <p>Game Over!</p>
          <button onClick={startNewGame}>Start New Game</button>
        </div>
      )}
    </div>
  );
}

export default BallThrowingPage;
