import { useState, useEffect, Fragment } from "react";
import { resultInitalState } from "./constants";
import toast, { Toaster } from 'react-hot-toast';
const notify = () => toast.success('CORRECT ANS');
const notify2 = () => toast.error('WRONG ANS');
const notify3 = () => toast('NONE SELECTED🚫');



const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitalState);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Initial time of 60 seconds
  const [feedback, setFeedback] = useState("");
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore") || 0);

  const { question, choices, correctAnswer } = questions[currentQuestion];

  const shuffleQuestions = () => {
    // Shuffle the questions and reset the quiz state
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    setCurrentQuestion(0);
    setAnswerIdx(null);
    setAnswer(null);
    setFeedback("");
    setTimeLeft(60);
    setResult(resultInitalState);
    setShowResult(false);
    setQuestions(shuffledQuestions);
  };

  const onAnswerClick = (choice, index) => {
    setAnswerIdx(index);
    if (choice === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = () => 
  {
    setResult((prev) =>
      answer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
            
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );
    if(answer)
    {
      notify()
    }
    else if(answer ===false)
    {
      notify2()
    }

    console.log(answer)
    console.log(feedback)

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswerIdx(null);
      setAnswer(null);
      if(answer == null)
      {
        notify3()
      }
      setFeedback(""); // Clear feedback for the next question
      setTimeLeft(10); // Reset time for the next question
    } else {
      setShowResult(true);
      if(result.score>highScore)
      {
        setHighScore(result.score)
        localStorage.setItem("highScore",result.score)
      }
    }
  };

  const setQuestions = (shuffledQuestions) => {
    // Update the state with the shuffled questions
    // setQuestionsState(shuffledQuestions);
  };

  const onTryAgain = () => {
    setResult(resultInitalState);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswerIdx(null);
    setAnswer(null);
    setFeedback("");
    setTimeLeft(60); // Reset time for the first question
    shuffleQuestions(); // Shuffle questions when trying again
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (!showResult && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft, showResult]);

  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      handleTimeOut();
    }
  }, [timeLeft, showResult]);

  const handleTimeOut = () => {
    setAnswer(false);
    onClickNext();
  };

  return (
    <Fragment>

    <div className="quiz-container">
      {!showResult ? (
        <>
          <span className="active-question-no">{currentQuestion + 1}</span>
          <span className="total-question">/{questions.length}</span>
          <h2>{question}</h2>
          <span className="timer">
            &#x23F0; Time Left: {timeLeft} seconds
          </span>
          <ul>
            {choices.map((choice, index) => (
              <li
                onClick={() => onAnswerClick(choice, index)}
                key={choice}
                className={
                  answerIdx === index
                    ? answer
                      ? "selected-answer correct-answer"
                      : "selected-answer wrong-answer"
                    : null
                }
              >
                {choice}
              </li>
            ))}
          </ul>
          <div className="footer">
            <button
              onClick={onClickNext}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="result">
          <h3>Result</h3>
          <p>
            Total Questions: <span>{questions.length}</span>
          </p>
          <p>
            HIGH SCORE: <span>{highScore}</span>
          </p>
          <p>
            Total Score: <span>{result.score}</span>
          </p>
          <p>
            Correct Answers: <span>{result.correctAnswers}</span>
          </p>
          <p>
            Wrong Answers:{" "}
            <span>{questions.length - result.correctAnswers}</span>
          </p>
          <button onClick={onTryAgain}>Try again</button>
        </div>
      )}
    </div>
    <div className="feedback">{feedback}</div>
    <Toaster />
    </Fragment>
  );
};

export default Quiz;
