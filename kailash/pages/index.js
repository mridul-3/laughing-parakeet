import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [step, setStep] = useState(0); // 0: Create Quiz, 1: Start Quiz, 2: Show Result
  const [quizData, setQuizData] = useState({ title: '', description: '', no_of_questions: '' });
  const [message, setMessage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [QuizID, setQuizID] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setQuizData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Quiz created successfully!');
        setQuizID(data.quiz_id);
        setStep(1);
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/start_quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_id: QuizID }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentQuestion(data.question);
        setStep(2);
        setMessage('');
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  }

  const handleAnswerSubmit = async (selectedOption) => {
    try {
      console.log(currentQuestion);
      const response = await fetch('http://localhost:8000/api/submit_answer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: currentQuestion.session_id,
          ques_id: currentQuestion.ques_id,
          selected_option: selectedOption,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.question) {
          setCurrentQuestion(data.question);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setStep(3);
          setScore(data.score);
        }
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.card}>
        {step === 0 && (
          <>
            <h1 className={styles.title}>Create a Quiz</h1>
            <div className="flex flex-wrap -mx-3 mb-6 w-4/5">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
                  Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="title"
                  type="text"
                  value={quizData.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6 w-4/5">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="description"
                  type="text"
                  value={quizData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6 w-4/5">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="numQuestions">
                  Number of Questions
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="no_of_questions"
                  type="number"
                  value={quizData.numQuestions}
                  onChange={handleInputChange}x
                />
              </div>
            </div>
            <button
              className="w-4/5 px-3 shadow bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <p>{message}</p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className={styles.title}>Quiz Created !!</h1>
            <div className="flex flex-col">
              <button
                className="bg-blue-600 hover:bg-blue-700 border rounded py-2 px-4 my-2 text-white"
                onClick={() => handleStartQuiz()}
              >
                Start Quiz
              </button>
            </div>
            <p>{message}</p>
          </>
        )}

        {step === 2 && (
          <>
            <div className=' w-full h-1/2'>
              <h1 className={styles.title}>Quiz in Progress</h1>
              <p>Question {currentQuestionIndex} of {quizData.no_of_questions}</p>
              <p>{currentQuestion.question}</p>
              <div className="flex flex-col justify-center items-center">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <button
                    className="bg-gray-200 border rounded py-2 px-4 my-2 w-4/5 hover:bg-gray-300"
                    onClick={() => handleAnswerSubmit(key)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p>{message}</p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className={styles.title}>Quiz Complete!</h1>
            <p>Your Score: {score}</p>
            <button
              className="w-4/5 shadow bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setStep(0);
                setQuizData({ title: '', description: '', no_of_questions: '' });
                setMessage('');
                setScore(0);
              }}
            >
              Create New Quiz
            </button>
          </>
        )}
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
