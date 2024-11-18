import React, { useState } from 'react';

function BowlingPage() {
  const [runsScored, setRunsScored] = useState(0);
  const [wickets, setWickets] = useState(1);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [currentBowler, setCurrentBowler] = useState(1);
  const [bowlingStyle, setBowlingStyle] = useState("Fast");
  const [bowlingSpeed, setBowlingSpeed] = useState("Fast");
  const [accuracy, setAccuracy] = useState(100);
  const [power, setPower] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [weather, setWeather] = useState("Clear");
  const [skillLevel, setSkillLevel] = useState(1); // Skill level of the bowler
  const [mood, setMood] = useState(100); // Mood level of the bowler
  const [specialAbilityUsed, setSpecialAbilityUsed] = useState(false); // Flag for special ability usage
  const [bowlingHistory, setBowlingHistory] = useState([]);

  const styles = ["Fast", "Spin", "Yorker", "Bouncer"];
  const speeds = ["Fast", "Medium", "Slow"];
  const weatherConditions = ["Clear", "Windy", "Rainy"];

  const bowl = () => {
    const outcome = Math.random();
    const fatiguePenalty = fatigue / 100;
    const moodPenalty = mood < 50 ? 0.1 : 0; // Mood affects performance if below 50
    const speedPenalty = bowlingSpeed === "Slow" ? 0.1 : 0;

    let effectiveOutcome = outcome - fatiguePenalty - moodPenalty - speedPenalty;

    // Adjusting power influence
    const powerInfluence = power / 100;
    effectiveOutcome += powerInfluence;

    let resultMessage = `${bowlingStyle} ball with ${bowlingSpeed} speed! `;
    let runs = 0;

    // Special Ability: Super Ball (guaranteed wicket or dot ball)
    if (!specialAbilityUsed && Math.random() < 0.05) {
      resultMessage += "Super Ball! Wicket guaranteed.";
      setSpecialAbilityUsed(true);
      setWickets(wickets + 1);
    } 
    // Inaccurate balls due to fatigue or weather
    else if (Math.random() < 0.05 + (fatigue / 200)) {
      resultMessage += "Wide or No-ball!";
      runs = 1; // Add 1 extra run for no-ball or wide
    } else if (effectiveOutcome < 0.1) {
      // Wicket scenario
      setWickets(wickets + 1);
      resultMessage += "Wicket taken!";
    } else if (effectiveOutcome < 0.5) {
      // Dot ball scenario
      resultMessage += 'Dot ball! No runs scored.';
    } else {
      // Runs scored with weather adjustments
      runs = Math.floor(Math.random() * 6) + 1;
      if (weather === "Windy") {
        runs += 1; // Wind boosts runs
      } else if (weather === "Rainy") {
        runs = Math.max(runs - 1, 0); // Rain slows down the game
      }
      setRunsScored(runsScored + runs);
      resultMessage += `${runs} runs scored.`;
    }

    // Update balls bowled and fatigue
    setBallsBowled(ballsBowled + 1);
    setFatigue(fatigue + 5);

    // Update skill level
    if (outcome < 0.05) { // Successful performance (like wickets) improves skill level
      setSkillLevel(skillLevel + 1);
    }

    // Update mood: Mood worsens with fatigue or poor performance
    setMood(Math.max(0, mood - (fatigue / 10)));

    // Record this ball in history
    setBowlingHistory([...bowlingHistory, resultMessage]);

    if (ballsBowled + 1 >= 6) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setRunsScored(0);
    setWickets(1);
    setBallsBowled(0);
    setFatigue(0);
    setPower(0);
    setAccuracy(100);
    setSkillLevel(1); // Reset skill level
    setMood(100); // Reset mood
    setSpecialAbilityUsed(false); // Reset special ability
    setGameOver(false);
    setCurrentBowler(currentBowler + 1);
    setWeather(weatherConditions[Math.floor(Math.random() * weatherConditions.length)]);
    setBowlingHistory([]);
  };

  const selectBowlingStyle = (style) => {
    setBowlingStyle(style);
  };

  const selectBowlingSpeed = (speed) => {
    setBowlingSpeed(speed);
  };

  const handlePowerChange = (event) => {
    setPower(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 overflow-auto">
      <div className="max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6 overflow-hidden">
        <h1 className="text-4xl font-bold text-center mb-6">Bowling Mode</h1>
        
        {/* Flex container for Game Info and Bowling History */}
        <div className="flex space-x-8">
          <div className="game-info flex-1 space-y-4 mb-8">
            <p className="text-xl">Bowler: <span className="font-semibold">Player {currentBowler}</span></p>
            <p className="text-xl">Runs Scored: <span className="font-semibold">{runsScored}</span></p>
            <p className="text-xl">Wickets: <span className="font-semibold">{wickets}</span></p>
            <p className="text-xl">Balls Bowled: <span className="font-semibold">{ballsBowled}/6</span></p>
            <p className="text-xl">Fatigue Level: <span className="font-semibold">{fatigue}%</span></p>
            <p className="text-xl">Mood: <span className="font-semibold">{mood}%</span></p>
            <p className="text-xl">Skill Level: <span className="font-semibold">{skillLevel}</span></p>
            <p className="text-xl">Weather: <span className="font-semibold">{weather}</span></p>
          </div>

          {/* Bowling History Section */}
          <div className="bowling-history w-64 max-h-80 overflow-y-auto bg-gray-100 text-gray-800  border border-gray-300 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Bowling History</h3>
            <ul className="space-y-2">
              {bowlingHistory.map((entry, index) => (
                <li key={index} className="text-lg">{entry}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Select Bowling Style</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {styles.map((style, index) => (
              <button 
                key={index} 
                onClick={() => selectBowlingStyle(style)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition ease-in-out duration-300"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Select Bowling Speed</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {speeds.map((speed, index) => (
              <button 
                key={index} 
                onClick={() => selectBowlingSpeed(speed)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition ease-in-out duration-300"
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Bowling Power</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={power}
            onChange={handlePowerChange}
            className="w-full mt-4 accent-indigo-500 rounded-lg"
          />
          <p className="text-xl mt-2">Power: <span className="font-semibold">{power}%</span></p>
        </div>

        <div className="mt-6 text-center">
          {!gameOver ? (
            <button 
              onClick={bowl} 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition ease-in-out duration-300"
            >
              Bowl
            </button>
          ) : (
            <button 
              onClick={resetGame} 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-xl shadow-lg transition ease-in-out duration-300"
            >
              Reset Game
            </button>
          )}
        </div>

        {gameOver && (
          <div className="game-over mt-6 text-center text-red-600">
            <h2 className="text-3xl font-semibold">Game Over!</h2>
            <p>The bowler has completed their over.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BowlingPage;
