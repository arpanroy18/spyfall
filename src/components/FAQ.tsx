import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    question: "What is the mission objective?",
    answer: "A covert social deduction operation where one enemy operative attempts to identify the classified location, while loyal agents work to expose the infiltrator through strategic interrogation."
  },
  {
    question: "How many agents are required?",
    answer: "Mission requires 4-12 operatives. Each agent must use a secure individual device for communication."
  },
  {
    question: "How does an operation cycle work?",
    answer: "Each mission has an 8-minute window. All agents except the enemy spy receive location intelligence. Operatives take turns conducting interrogations while the spy attempts to blend in and identify the location."
  },
  {
    question: "How do I interrogate other agents?",
    answer: "During your turn, select a target agent and conduct tactical questioning about the location. After their response, control transfers to them. No follow-up interrogations or questioning your interrogator permitted."
  },
  {
    question: "How do loyal agents achieve victory?",
    answer: "Success requires unanimous vote to eliminate the enemy operative. Each agent may initiate only one elimination vote per mission cycle."
  },
  {
    question: "How does the enemy spy win?",
    answer: "Enemy operative achieves victory by: maintaining cover until mission timeout, correctly identifying the classified location, or manipulating agents into eliminating an innocent operative."
  },
  {
    question: "How does the scoring system work?",
    answer: "Enemy Spy: 2 points for successful infiltration, 4 points for location identification or misdirection. Loyal Agents: 1 point for spy elimination, 2 points for the agent who initiated successful counter-intelligence."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono tracking-wider">OPERATIONAL BRIEFING</h2>
        <div className="text-xs text-amber-400 font-mono">CLASSIFIED TACTICAL MANUAL</div>
        <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"></div>
      </div>
      
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="bg-gray-900/80 border border-gray-700 overflow-hidden shadow-lg"
        >
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800/50 transition-all duration-300 border-l-4 border-red-800 hover:border-red-600"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium text-gray-200 font-mono text-sm tracking-wide uppercase">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-red-400 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-red-400 transition-transform duration-300" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 text-gray-300 bg-black/20 border-t border-gray-700 border-l-4 border-amber-700">
              <div className="text-xs text-amber-400 font-mono mb-2">INTELLIGENCE BRIEFING:</div>
              <div className="text-sm leading-relaxed">{item.answer}</div>
              <div className="text-xs text-gray-500 font-mono mt-3 text-right">CLEARANCE: AUTHORIZED</div>
            </div>
          )}
        </div>
      ))}
      
      <div className="text-center mt-8 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 font-mono">
          END OF BRIEFING • DESTROY AFTER READING
        </div>
      </div>
    </div>
  );
}