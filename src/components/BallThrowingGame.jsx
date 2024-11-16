import React, { useState } from "react";
import BallThrowingResult from "./BallThrowingResult";

function BallThrowingGame({ startNewGame }) {
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(6);
  const [result, setResult] = useState(null);

  const throwBall = () => {
    if (ballsLeft <= 0) {
      setResult("Game Over");
      return;
    }

    let randomOutcome = Math.random();
    let runs = 0;
    let newResult = "";

    if (randomOutcome < 0.1) {
      newResult = "Out";
      runs = "Out";
    } else if (randomOutcome < 0.3) {
      newResult = "Miss";
      runs = "Miss";
    } else if (randomOutcome < 0.5) {
      newResult = "1";
      runs = 1;
    } else if (randomOutcome < 0.7) {
      newResult = "2";
      runs = 2;
    } else if (randomOutcome < 0.9) {
      newResult = "4";
      runs = 4;
    } else {
      newResult = "6";
      runs = 6;
    }

    setScore((prevScore) => prevScore + (runs === "Out" ? 0 : runs));
    setResult(newResult);
    setBallsLeft((prevBalls) => prevBalls - 1);
  };

  return (
    <div>
      <div>
        <p>Score: {score}</p>
        <p>Balls Left: {ballsLeft}</p>
      </div>
      <button onClick={throwBall}>Throw Ball</button>
      {result && <BallThrowingResult result={result} />}
    </div>
  );
}

export default BallThrowingGame;
