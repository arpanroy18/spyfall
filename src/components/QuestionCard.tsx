import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';

const INSPIRATION_QUESTIONS = [
  "What brought you to this location today?",
  "How often do you come to places like this?",
  "What's your favorite thing about being here?",
  "Do you feel comfortable in this environment?",
  "What would you normally be doing right now?",
  "Have you been somewhere similar recently?",
  "What's the most interesting thing you've seen here?",
  "Do you come here alone or with others usually?",
  "What time of day do you usually visit places like this?",
  "What's your role in this situation?",
  "Are you here for work or pleasure?",
  "What's the weather like for this kind of activity?",
  "Do you need any special equipment for this?",
  "How did you learn about this place?",
  "What's the dress code here?",
  "Do you interact with staff members here?",
  "What sounds do you typically hear in this environment?",
  "Is this a place you'd bring your family?",
  "What's the busiest time at a place like this?",
  "Do you need to make reservations for this?",
  "What's the age range of people who come here?",
  "Is this an indoor or outdoor activity?",
  "What do you do while waiting here?",
  "Do you tip anyone for their services here?",
  "What safety precautions do you take here?"
];

export function QuestionCard() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * INSPIRATION_QUESTIONS.length);
    return INSPIRATION_QUESTIONS[randomIndex];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const refreshQuestion = useCallback(() => {
    setIsRefreshing(true);
    setCountdown(60); // Reset countdown
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setIsRefreshing(false);
    }, 300); // Small delay for animation effect
  }, []);

  // Initialize with random question
  useEffect(() => {
    setCurrentQuestion(getRandomQuestion());
  }, []);

  // Countdown timer (ticks every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          refreshQuestion();
          return 60; // Reset to 60 after refresh
        }
        return prev - 1;
      });
    }, 1000); // 1 second

    return () => clearInterval(timer);
  }, [refreshQuestion]);

  return (
    <div className="relative">
      {/* Sticky note design */}
      <div className="bg-yellow-200 border-l-4 border-yellow-400 p-4 shadow-lg transform rotate-1 relative">
        {/* Tape effect at top */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-300 border border-gray-400 opacity-60 rounded-sm"></div>
        
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-900 mb-2 font-mono">
              QUESTION INSPIRATION
            </h3>
            <p className="text-yellow-800 text-sm leading-relaxed font-medium">
              {currentQuestion}
            </p>
          </div>
          <button
            onClick={refreshQuestion}
            className={`p-1 text-yellow-700 hover:text-yellow-900 transition-all duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Get new question"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-yellow-600 font-mono flex items-center justify-between">
          <span>Click to refresh now</span>
          <span className={`px-2 py-1 rounded font-bold transition-colors duration-300 ${
            countdown <= 10 
              ? 'bg-red-300 text-red-800 animate-pulse' 
              : countdown <= 30 
                ? 'bg-orange-300 text-orange-800' 
                : 'bg-yellow-300 text-yellow-800'
          }`}>
            Next: {formatTime(countdown)}
          </span>
        </div>
      </div>
    </div>
  );
}