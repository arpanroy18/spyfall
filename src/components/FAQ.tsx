import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    question: "What is Spyfall?",
    answer: "Spyfall is a social deduction game where one player is a spy trying to figure out the location, while other players try to identify the spy through careful questioning."
  },
  {
    question: "How many players do I need?",
    answer: "You need 4-12 players. Each player needs their own device to play."
  },
  {
    question: "How does a round work?",
    answer: "Each round lasts 8 minutes. All players except the spy know the location. Players take turns asking each other questions about the location, while the spy tries to blend in and guess the location."
  },
  {
    question: "How do I question other players?",
    answer: "When it's your turn, select another player and ask them a question about the location. After they answer, it becomes their turn to question someone else. You cannot ask a follow-up question or question someone who just questioned you."
  },
  {
    question: "How do I win as a non-spy?",
    answer: "Non-spy players win by successfully voting to indict the spy. The vote must be unanimous. Each player can only initiate one vote per round."
  },
  {
    question: "How do I win as the spy?",
    answer: "As the spy, you can win by either: avoiding detection until time runs out, correctly guessing the location, or having a non-spy player incorrectly indicted as the spy."
  },
  {
    question: "How does scoring work?",
    answer: "Spy: 2 points for avoiding detection, 4 points for correct location guess or if a non-spy is indicted. Non-spy: 1 point for spy detection, 2 points for the player who initiated the successful vote."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">How to Play</h2>
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-gray-200">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 text-gray-300 bg-gray-800 border-t border-gray-700">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}