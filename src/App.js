import React, { useState, useEffect } from "react";

function App() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(120);  // Start with 60 balls
  const [wickets, setWickets] = useState(1); // Start with 1 wicket
  const [runsHistory, setRunsHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [hitType, setHitType] = useState("");
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", avatar: "👦", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0  },
    { id: 2, name: "Player 2", avatar: "👧", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 3, name: "Player 3", avatar: "👩‍🦱", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 4, name: "Player 4", avatar: "👨‍🦳", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0 },
    { id: 5, name: "Player 5", avatar: "🧑‍🦱", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 6, name: "Player 6", avatar: "👩‍🦳", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 7, name: "Player 7", avatar: "🧑‍🦰", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 8, name: "Player 8", avatar: "👦", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 9, name: "Player 9", avatar: "👩", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 10, name: "Player 10", avatar: "👧", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0},
    { id: 11, name: "Player 11", avatar: "👨‍🦳", score: 0, wickets: 1, ballsFaced: 0 ,fours: 0, sixes: 0}
  ]);
  const [leaderboard, setLeaderboard] = useState([]);  // <-- Add this line to initialize the leaderboard

  useEffect(() => {
    // Load leaderboard from localStorage
    const savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(savedLeaderboard);
  }, []);

  const startGame = () => {
    setScore(0);
    setBalls(120);  // reset balls count
    setWickets(1); // reset wickets count
    setRunsHistory([]);
    setGameOver(false);
    setHitType("");
    setCurrentPlayer(1);
    setPlayers(players.map((p) => ({ ...p, score: 0, wickets: 1, ballsFaced: 0 })));
  };

  const switchPlayer = () => {
    if (currentPlayer < players.length) {
      const nextPlayer = currentPlayer + 1;
      setCurrentPlayer(nextPlayer);  // Move to next player
      setScore(players[nextPlayer - 1].score);  // Set score of next player
      setWickets(players[nextPlayer - 1].wickets);  // Set wickets of next player
      setHitType(""); // reset hit type for the new player
    } else {
      setGameOver(true);  // If all players are out, game ends
      updateLeaderboard();
      alert("Game Over! All players are out.");
    }
  };

  const updateLeaderboard = () => {
    // Save score to leaderboard
    const newLeaderboard = [...leaderboard, { player: players[currentPlayer - 1].name, score }];
    newLeaderboard.sort((a, b) => b.score - a.score); // Sort by highest score
    const topLeaderboard = newLeaderboard.slice(0, 5); // Keep top 5 players

    // Save the updated leaderboard to localStorage
    localStorage.setItem("leaderboard", JSON.stringify(topLeaderboard));
    setLeaderboard(topLeaderboard);
  };

  const shootBall = () => {
    let randomOutcome = Math.random();
    let runs = 0;
    let newHitType = "";
  
    if (randomOutcome < 0.1) {
      newHitType = "Out";
      setWickets((prevWickets) => prevWickets - 1);
      runs = "Out";
      updatePlayerScore(score, true);
    } else if (randomOutcome < 0.3) {
      newHitType = "Miss";
      runs = "Miss";
    } else if (randomOutcome < 0.5) {
      newHitType = "1";
      runs = 1;
    } else if (randomOutcome < 0.7) {
      newHitType = "2";
      runs = 2;
    } else if (randomOutcome < 0.9) {
      newHitType = "4";
      runs = 4;
      updatePlayerFoursAndSixes(4);  // Track 4 hit
    } else {
      newHitType = "6";
      runs = 6;
      updatePlayerFoursAndSixes(6);  // Track 6 hit
    }
  
    setHitType(newHitType);
    setRunsHistory((prevHistory) => [...prevHistory, runs]);
  
    if (typeof runs === "number") {
      const newScore = score + runs;
      setScore(newScore);
      updatePlayerScore(newScore);
    }
  
    setBalls((prevBalls) => prevBalls - 1);
  
    if ((wickets - 1 <= 0 && runs === "Out") || balls - 1 <= 0) {
      if (wickets - 1 <= 0) {
        alert(`Player ${currentPlayer} is out!`);
      }
      switchPlayer();
    }
  };

  const updatePlayerScore = (newScore, isOut = false) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === currentPlayer
          ? {
              ...player,
              score: newScore,
              wickets: isOut ? player.wickets - 1 : player.wickets,
              ballsFaced: player.ballsFaced + 1,  // Track balls faced
            }
          : player
      )
    );
  };



  const handleNameChange = (event) => {
    const newName = event.target.value;
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === currentPlayer
          ? { ...player, name: newName }
          : player
      )
    );
  };

  const calculateTotalScore = () => {
    return players.reduce((total, player) => total + player.score, 0);
  };

  // Function to update player’s 4s and 6s count
const updatePlayerFoursAndSixes = (runs) => {
  setPlayers((prevPlayers) =>
    prevPlayers.map((player) =>
      player.id === currentPlayer
        ? {
            ...player,
            fours: runs === 4 ? player.fours + 1 : player.fours,
            sixes: runs === 6 ? player.sixes + 1 : player.sixes
          }
        : player
    )
  );
};

const [isDayMode, setIsDayMode] = useState(true);  // Default is Day Mode

const toggleMode = () => {
  setIsDayMode((prevMode) => !prevMode);  // Toggle between Day and Night mode
};

const modeClasses = isDayMode
  ? "bg-gray-100 text-black"  // Day Mode styles
  : "bg-gray-900 text-white";  // Night Mode styles



return (
  <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${modeClasses}`}>
    {/* Info Bar */}
    <div className="w-full max-w-4xl p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center">
    
    
    
      {/* Mode Toggle Button */}
      <button
        onClick={toggleMode}
        className={`bg-blue-500 px-6 py-2 rounded-full text-lg mt-4 md:mt-0 ${isDayMode ? "text-black" : "text-white"}`}
      >
        {isDayMode ? " Night Mode" : " Day Mode"}
      </button>
      
      {/* Info */}
      <div className="flex flex-wrap gap-4 items-center">
        <p className="text-lg font-semibold">Player: {players[currentPlayer - 1].name}</p>
        <p className="text-lg font-semibold">Balls Left: {balls}</p>
        <p className="text-lg font-semibold">Score: {score}</p>
        <p className="text-lg font-semibold">Wickets Left: {wickets}</p>
      </div>
      <button
        onClick={startGame}
        className="bg-blue-500 px-6 py-2 rounded-full text-lg mt-4 md:mt-0"
      >
        Restart Game
      </button>
    </div>

    <h1 className="mt-10 text-6xl font-serif" >Cricket Gems</h1>

    {/* Game Area */}
    <div className="flex flex-col items-center justify-center flex-grow w-full max-w-3xl mt-6">
      {/* Game Over or Active Game */}
      {gameOver ? (
        <div className="text-2xl font-bold text-red-500 text-center">
          Game Over! Final Scores:
          <div className="mt-2">
            {players.map((player) => (
              <p key={player.id}>
                {player.name}: {player.score} Runs
              </p>
            ))}
            <p className="mt-4 font-semibold text-xl">
              Total Score: {calculateTotalScore()} Runs
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Other Game UI Components */}
          <div className="mt-4">
            <input
              type="text"
              value={players[currentPlayer - 1].name}
              onChange={handleNameChange}
              className="bg-gray-700 text-white rounded-lg p-2"
              placeholder="Change Player Name"
            />
          </div>

          {/* Last Hit */}
          <div className={`text-lg font-semibold mt-4 ${isDayMode ? "text-black" : "text-white"}`}>
  {hitType && (
    <p>
      {hitType === "Miss"
        ? "You missed!"
        : hitType === "Out"
        ? "You are out!"
        : `You hit ${hitType} runs!`}
    </p>
  )}
</div>


          {/* Runs History */}
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-12 gap-4">
            {runsHistory.map((run, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-sm sm:text-base ${
                  run === "Miss"
                    ? "bg-gray-600 text-white"
                    : run === "Out"
                    ? "bg-red-600 text-white"
                    : run === 6
                    ? "bg-green-600 text-white"
                    : run === 4
                    ? "bg-yellow-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {run}
              </div>
            ))}
          </div>

          {/* Shoot Button */}
          <div
            className="w-32 h-12 bg-yellow-500 rounded-lg text-lg text-white flex items-center justify-center cursor-pointer mt-6"
            onMouseDown={shootBall}
          >
            Shoot Ball
          </div>
        </>
      )}
    </div>

    {/* Scoreboard */}
    <div className="w-full max-w-4xl bg-gray-800 p-4 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Scoreboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Runs</th>
              <th className="px-4 py-2 text-left">Wickets Left</th>
              <th className="px-4 py-2 text-left">Balls Faced</th>
              <th className="px-4 py-2 text-left">4s</th> {/* New Column for 4s */}
              <th className="px-4 py-2 text-left">6s</th> {/* New Column for 6s */}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.score}</td>
                <td className="px-4 py-2">{player.wickets}</td>
                <td className="px-4 py-2">{player.ballsFaced}</td>
                <td className="px-4 py-2">{player.fours}</td> {/* Display 4s */}
                <td className="px-4 py-2">{player.sixes}</td> {/* Display 6s */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 font-semibold text-lg">
        Total Score: {calculateTotalScore()} Runs
      </div>
    </div>
  </div>
);

}

export default App;
