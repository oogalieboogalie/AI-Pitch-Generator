
import React, { useState, useCallback } from 'react';
import { generatePitch } from './services/geminiService';
import { PITCH_QUESTIONS } from './constants';
import { type PitchAnswer } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import QuestionCard from './components/QuestionCard';
import { RobotIcon } from './components/icons/RobotIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [productDescription, setProductDescription] = useState<string>('');
  const [pitchData, setPitchData] = useState<PitchAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePitch = useCallback(async () => {
    if (!productDescription.trim()) {
      setError('Please provide a description of your product or business.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPitchData([]);

    try {
      const answers = await generatePitch(productDescription);
      if (answers.length === PITCH_QUESTIONS.length) {
        const combinedData = PITCH_QUESTIONS.map((question, index) => ({
          question,
          answer: answers[index],
        }));
        setPitchData(combinedData);
      } else {
        throw new Error('AI response was incomplete. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [productDescription]);

  const handleDownload = () => {
    if (pitchData.length === 0) return;

    let content = 'My Business Pitch\n\n';
    content += `Based on description: ${productDescription}\n\n`;
    content += '====================================\n\n';

    pitchData.forEach((item, index) => {
      content += `Q${index + 1}: ${item.question}\n`;
      content += `A: ${item.answer}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-pitch.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <section id="input-section" className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">1. Describe Your Business Idea</h2>
            <p className="text-slate-600 mb-4">
              Provide a detailed description of your product, service, or business. The more detail you provide, the better the AI-generated pitch will be.
            </p>
            <textarea
              className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
              placeholder="e.g., 'A mobile app that connects local farmers directly with consumers to sell fresh, organic produce...'"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleGeneratePitch}
              disabled={isLoading || !productDescription.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Generating...
                </>
              ) : (
                <>
                  <RobotIcon />
                  Generate Pitch
                </>
              )}
            </button>
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          </section>

          <section id="output-section" className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-dark">2. Your Generated Pitch</h2>
              {pitchData.length > 0 && (
                 <button
                 onClick={handleDownload}
                 className="flex items-center gap-2 bg-white text-brand-primary font-semibold py-2 px-4 border border-brand-primary rounded-lg hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition duration-200"
               >
                 <DownloadIcon />
                 Download
               </button>
              )}
            </div>
            
            <div className="space-y-4">
              {isLoading && (
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
                  <p className="text-slate-600">AI is crafting your pitch... this may take a moment.</p>
                </div>
              )}

              {!isLoading && pitchData.length === 0 && (
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
                  <p className="text-slate-500">Your answers to the "Twelve Questions to a Good Pitch" will appear here once generated.</p>
                </div>
              )}

              {pitchData.map((item, index) => (
                <QuestionCard key={index} index={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
