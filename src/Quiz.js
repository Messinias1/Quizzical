import React from "react";
import { useState, useEffect, useCallback } from "react";
import { KEY } from "./api.js";

import { decode } from 'html-entities';

export default function Quiz() {
    const [data, setData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const fetchQuestions = useCallback(() =>{
        fetch(KEY)
            .then(res => res.json())
            .then(json => {
            const results = json.results.map((item) => {
                const allAnswers = shuffleArray([
                ...item.incorrect_answers,
                item.correct_answer,
                ]);
                return { ...item, allAnswers };
            });
            setData({ ...json, results });
            })
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        fetchQuestions()
    }, [fetchQuestions]);

    function shuffleArray(array) {
        const shuffled = [...array]; 

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); 
            // eslint-disable-next-line no-self-assign
            [shuffled[i], shuffled[j]] = [shuffled[i], shuffled[j]]; 
        }

        return shuffled;
    }

    const handleSelect = (questionKey, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionKey]: answer,
        }));
    };

    function checkAllAnswers() {
        let correctCount = 0;
        data.results.forEach((item) => {
            if (selectedAnswers[item.question] === item.correct_answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setShowResults(true);
    }

    function resetGame() {
        setSelectedAnswers({})
        setShowResults(false)
        setScore(0)
        fetchQuestions()
    }

    return (
        <>
            <div className="quiz-container">
                {data?.results?.map((item, qIndex) => {
                    const questionKey = item.question;
                    return(
                    <div key={questionKey} className="question-container">
                        <h2>{decode(item.question, { level: 'html5' })}</h2>
                        <div className="answers-row">
                            {item.allAnswers.map((ans, i) => {
                                const isSelected = selectedAnswers[questionKey] === ans;
                                const isCorrectAnswer = ans === item.correct_answer;

                                let backgroundColor = '';
                                let color = '';

                                if (showResults) {
                                    if (isCorrectAnswer) {
                                        backgroundColor = 'green';
                                        color = 'white';
                                    } else if (isSelected) {
                                        // selected, but wrong
                                        backgroundColor = 'red';
                                        color = 'white';
                                    }
                                } else if (isSelected) {
                                    backgroundColor = '#312e81';
                                    color = 'white';
                                }

                                return (
                                    <p
                                        style={{ backgroundColor, color }}
                                        key={i}
                                        className="answers"
                                        onClick={() => !showResults && handleSelect(questionKey, ans)}
                                    >
                                        {decode(ans, { level: 'html5' })}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                    )
                })}
            </div>
            {!showResults ? <button onClick={checkAllAnswers} className="chk-ans-btn">Check Answers</button> :
            <div className="end-game-container">
                <h3 className="end-game-title">You scored {score}/5 correct answers</h3>
                <button className="play-again-btn" onClick={resetGame}>Play again</button>
            </div>}
        </>
    );
}
