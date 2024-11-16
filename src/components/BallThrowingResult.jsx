import React from "react";

function BallThrowingResult({ result }) {
  return (
    <div className="result">
      {result === "Out" && <p>You are out!</p>}
      {result === "Miss" && <p>You missed!</p>}
      {result === "1" && <p>You scored 1 run!</p>}
      {result === "2" && <p>You scored 2 runs!</p>}
      {result === "4" && <p>You hit a four!</p>}
      {result === "6" && <p>You hit a six!</p>}
    </div>
  );
}

export default BallThrowingResult;
