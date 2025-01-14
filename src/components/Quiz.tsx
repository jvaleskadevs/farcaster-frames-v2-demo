import React, { useCallback, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import sdk from "@farcaster/frame-sdk";
import { Button } from '~/components/ui/Button'; 
//import { questions, type Question } from '~/lib/questions';

type Question = {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 1,
    question: "What will be the output of this code?",
    code: `await sdk.actions.viewProfile({ fid: context?.user?.fid ?? 3 });`,
    options: [
      "It will open the dwr.eth profile with fid 3.",
      "Error: viewProfile is not a function.",
      "It will open the connected user profile extracted from the context.",
      "A and C are right."
    ],
    correctAnswer: 3,
    explanation: "The viewProfile action from the sdk opens the profile of the selected fid. In this case, the connected user or dwr profiles."
  },
  {
    id: 2,
    question: "Which action should be performed first in a v2 frame?",
    options: [
      "sdk.actions.addFrame()",
      "sdk.actions.start()",
      "sdk.actions.ready()",
      "sdk.actions.go()"
    ],
    correctAnswer: 2,
    explanation: "sdk.actions.ready() should be called first to load the frame."
  },
  {
    id: 3,
    question: "Which is the right notification flow with v2 frames?",
    options: [
      "Add frame, then notify.",
      "Enable notifications, then notify.",
      "Just notify it.",
      "There aren't notifications in v2."
    ],
    correctAnswer: 0,
    explanation: "A frame must be added by the user and the frame must receive the user notification details before sending any notification."
  },  
  {
    id: 4,
    question: "What is a farcaster frame v2?",
    options: [
      "Just a normal webapp.",
      "A frame with superpowers.",
      "It is an app embedded in a sufficiently decentralized network.",
      "All of them."
    ],
    correctAnswer: 3,
    explanation: "Farcaster frames got superpowers and evolved into complex webapps that operate embedded in the context of a sufficiently decentralized network."
  },
];

export default function Quiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const question = questions[currentQuestion];
  
  const restartQuiz = () => {
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(0);
  }
  
  const openGithub = useCallback(() => {
    sdk.actions.openUrl("https://github.com/jvaleskadevs/farcaster-frames-v2-demo/blob/main/src/components/Quiz.tsx");
  }, []);
  
  const backToHome = () => {
    router.push("/");
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Quiz</h1>
      <h3 className="text-sm">
        Question {currentQuestion + 1} of {questions.length}
      </h3>

      <div className="space-y-4">
        <p className="text-lg">{question.question}</p>
        
        {question.code && (
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{question.code}</code>
          </pre>
        )}

        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showExplanation}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                showExplanation
                  ? index === question.correctAnswer
                    ? 'bg-green-100 border-green-500 dark:bg-green-800 dark:border-green-600'
                    : selectedAnswer === index
                    ? 'bg-red-100 border-red-500 dark:bg-red-800 dark:border-red-600'
                    : 'bg-gray-800'
                  : 'bg-gray-800 hover:bg-gray-600'
              } border border-gray-700 hover:border-gray-500`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showExplanation && index === question.correctAnswer && (
                  <Check className="text-green-500" size={20} />
                )}
                {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                  <X className="text-red-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-purple-800 rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p>{question.explanation}</p>
          </div>
        )}

        {showExplanation && currentQuestion < questions.length - 1 && (
          <button
            onClick={nextQuestion}
            className="w-full py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Next Question
          </button>
        )}

        {showExplanation && currentQuestion === questions.length - 1 && (
         <>
          <div className="text-center p-4 bg-green-700 rounded-lg">
            <p className="font-bold">You have completed the quiz! Congrats!</p>
            <p>Your score: {score} out of {questions.length}</p>
          </div>
          
          <div className="mb-8">
            <Button onClick={restartQuiz}>Restart</Button>
          </div>
          </>
        )}
      </div>
      
      <div className="my-8">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            Open this component in github
          </pre>
        </div>
        <Button onClick={openGithub}>View Code</Button>
      </div>
      
      <div className="mb-4">
        <Button onClick={backToHome}>Back</Button>
      </div>
    </div>
  );
};
