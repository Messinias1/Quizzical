import React from "react";
import Quiz from "./Quiz";

import './App.css';

export default function App() {

  const [started, setStarted] = React.useState(false);

  function handleStartClick() {
    setStarted(true);
  }

  return (
    <>
      {started ? <Quiz /> : (
        <div className="App">
          <h1 className="quizzical-title">Quizzical</h1>
          <p className="description">Some description if needed</p>
          <button onClick={handleStartClick} className="start-quiz-button">Start quiz</button>
        </div>
      )}
    </>
  );
}
