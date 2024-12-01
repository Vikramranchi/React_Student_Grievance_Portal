import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode
import Header from './Header'; // Assuming Header component is defined elsewhere

// Left Panel Component
const LeftPanel = () => {
  return (
    <aside className="bg-gray-200 p-4 w-1/4 lg:w-1/5 h-screen overflow-y-auto scrollbar-hidden">
      <h2 className="font-bold text-lg mb-4">Navigation</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/science" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="Science.png" alt="" className="w-5 h-5" /> <span>Science</span>
          </Link>
        </li>
        <li>
          <Link to="/history" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="History.jpg" alt="" className="w-5 h-5" /> <span>History</span>
          </Link>
        </li>
        <li>
          <Link to="/politics" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="Politics.jpg" alt="" className="w-5 h-5" /> <span>Politics</span>
          </Link>
        </li>
        <li>
          <Link to="/sports" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="Sports.jpg" alt="" className="w-5 h-5" /> <span>Sports</span>
          </Link>
        </li>
        <li>
          <Link to="/trending" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="trending.png" alt="" className="w-5 h-5" /> <span>Trending</span>
          </Link>
        </li>
        <li>
          <Link to="/research" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="research.jpg" alt="" className="w-5 h-5" /> <span>Research</span>
          </Link>
        </li>
        <li>
          <Link to="/current-affairs" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <img src="Current affairs.png" alt="" className="w-5 h-5" /> <span>Current Affairs</span>
          </Link>
        </li>
        <li><span className="text-gray-500">MANY MORE...</span></li>
      </ul>
    </aside>
  );
};

// Right Panel Component
const RightPanel = () => {
  return (
    <section className="bg-white p-4 w-1/4 lg:w-1/5 space-y-4 overflow-y-auto h-screen scrollbar-hidden">
      <h2 className="font-bold text-lg">Inspirational Quotes</h2>
      <div>
        <p>"The greatest glory in living lies not in never falling, but in rising every time we fall." - <b>Nelson Mandela</b></p>
      </div>
      <hr />
      <div>
        <p>"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking." - <b>Steve Jobs</b></p>
      </div>
      <hr />
      <div>
        <p>"You may say I'm a dreamer, but I'm not the only one. I hope someday you'll join us. And the world will live as one." - <b>John Lennon</b></p>
      </div>
    </section>
  );
};

// Forum Component
const Forum = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');
  const [userEmail, setUserEmail] = useState(null); // Email state
  const [error, setError] = useState(null); // Error state

  // Load user information from the JWT token
  const loadUserFromToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const decodedToken = jwtDecode(token);
          setUserEmail(decodedToken.email);
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Failed to load user information');
      }
    }
  };

  // Call loadUserFromToken when the component mounts
  useEffect(() => {
    loadUserFromToken();
  }, []);

  // Fetch all questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://react-student-grievance-portal-7.onrender.com/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handlePostQuestion = async () => {
    if (!userEmail) {
      console.error("User email is missing.");
      return;
    }

    if (newQuestion.trim() === '') {
      console.error("Question text is required.");
      return;
    }

    try {
      const response = await axios.post('https://react-student-grievance-portal-7.onrender.com/api/questions', {
        email: userEmail, // Use email from decoded token
        questionText: newQuestion,
      });

      setQuestions([response.data, ...questions]);
      setNewQuestion('');
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  const handlePostAnswer = async (questionId) => {
    if (!answer.trim()) {
      console.error("Answer text is required.");
      return;
    }

    if (!userEmail) {
      console.error("User email is missing.");
      return;
    }

    try {
      const response = await axios.post('https://react-student-grievance-portal-7.onrender.com/api/answers', {
        questionId,
        email: userEmail, // Use email from decoded token
        answerText: answer,
      });

      setQuestions(questions.map(q =>
        q._id === questionId ? { ...q, answers: [...q.answers, response.data] } : q
      ));
      setAnswer('');
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  };

  return (
    <section className="bg-white p-4 mt-4 flex-grow overflow-y-auto scrollbar-hidden">
      <h2 className="font-bold text-lg">Discussion Forum</h2>
      <div>
        <textarea
          value={newQuestion}
          onChange={handleQuestionChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Ask your question here..."
        />
        <button
          onClick={handlePostQuestion}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Post Question
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {questions.map((question) => (
          <div key={question._id} className="border p-4 rounded-md">
            <p className="font-semibold">{question.questionText}</p>
            <p className="text-sm text-gray-500">Posted by: {question.email} at {new Date(question.timestamp).toLocaleString()}</p>

            <div className="mt-4">
              {question.answers && question.answers.length > 0 ? (
                <div className="space-y-4">
                  {question.answers.map((ans) => (
                    <div key={ans._id} className="p-2 border border-gray-300 rounded-md">
                      <p>{ans.answerText}</p>
                      <p className="text-sm text-gray-500">Answered by: {ans.email} at {new Date(ans.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No answers yet.</p>
              )}
            </div>

            <div className="mt-4">
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Write your answer here..."
              />
              <button
                onClick={() => handlePostAnswer(question._id)}
                className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Post Answer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="flex">
      <LeftPanel />
      <main className="flex-grow p-4">
        <Header />
        <Forum />
      </main>
      <RightPanel />
    </div>
  );
};

export default App;
