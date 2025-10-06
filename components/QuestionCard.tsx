
import React from 'react';

interface QuestionCardProps {
  index: number;
  question: string;
  answer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ index, question, answer }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 transition-all hover:shadow-lg hover:border-brand-primary">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-light text-brand-dark font-bold text-lg flex items-center justify-center rounded-full">
          {index + 1}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-slate-700">{question}</h3>
          <p className="mt-2 text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
