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
    question: "Which action should be performed first in a v2 frame?",
    options: [
      "sdk.actions.addFrame()",
      "sdk.actions.start()",
      "sdk.actions.ready()",
      "sdk.actions.go()"
    ],
    correctAnswer: 2,
    explanation: "The sdk.actions.ready() function must be the first call after rendering the frame. It signals that the frame is loaded and ready."
  },
  {
    id: 2,
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
    question: "Which onchain action can be performed with frames v2?",
    options: [
      "Send transactions.",
      "Sign typed data.",
      "Sign messages.",
      "All of them."
    ],
    correctAnswer: 3,
    explanation: "Frames v2 can ask to sign messages, typed data and transactions from your eth wallet."
  }, 
  {
    id: 5,
    question: "How to set up an event listener with frames v2?",
    options: [
      "sdk.actions.setEventListener()",
      "sdk.eventListeners.new()",
      "sdk.on()",
      "sdk.setEventListener()"
    ],
    correctAnswer: 2,
    explanation: "Use sdk.on() to set up listeners for adding, removing frames, enable or disable notifications."
  },  
  {
    id: 6,
    question: "What is the frames v2 manifest?",
    options: [
      "A call to action for builders to stay united and break their chains.",
      "A document with info about the frame and its builder.",
      "A document with info about the passengers of the frame.",
      "None of them is right."
    ],
    correctAnswer: 1,
    explanation: "The manifest located in /.well-known/farcaster.json is a document with info about the frame and signed by the builder."
  },  
  {
    id: 7,
    question: "What are right context locations?",
    options: [
      "Frame, channel and message.",
      "Launcher, notification, channel and cast.",
      "Channel, cast and notification.",
      "None of them is right."
    ],
    correctAnswer: 2,
    explanation: "A frame can be launched from the launcher, a notification, a channel or from cast."
  }, 
  {
    id: 8,
    question: "What is the frame playground?",
    options: [
      "A new gaming frame.",
      "Basic frame builder.",
      "Where frame devs have fun.",
      "Developer tools for frame builders."
    ],
    correctAnswer: 3,
    explanation: "The frame playground is a tool created by warpcast for frame developers."
  },    
  {
    id: 8,
    question: "Which is not a feature to be improved with frames v2?",
    options: [
      "Interactivity.",
      "User Retention.",
      "Connectivity.",
      "Interesting content."
    ],
    correctAnswer: 3,
    explanation: "Farcaster frames are not enough interesting content."
  },   
  {
    id: 10,
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
          <pre className="bg-gray-800 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap break-words overflow-x-">
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
