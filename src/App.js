import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const questionsData = [
  {
    id: 1,
    question: "紹介状はお持ちですか？",
    options: [
      { text: "なし", nextQuestionId: 2 },
      { text: "あり", nextQuestionId: 2, hasInput: true }
    ]
  },
  {
    id: 2,
    question: "なにか資料はお持ちですか？",
    options: [
      { text: "なし", nextQuestionId: 3 },
      { text: "あり", nextQuestionId: 3, hasInput: true }
    ]
  },
  {
    id: 3,
    question: "身体所見についておしえてください。",
    subQuestions: [
      { id: "3-1", question: "身長を教えてください", input: true },
      { id: "3-2", question: "体重を教えてください", input: true },
      { id: "3-3", question: "血圧を教えてください", input: true },
      { id: "3-4", question: "脈拍を教えてください", input: true },
      { id: "3-5", question: "利き手はどちらでしょうか", options: ["右", "左"] }
    ],
    nextQuestionId: 4
  },
  {
    id: 4,
    question: "主訴をおしえてください",
    input: true,
    nextQuestionId: 5
  },
  {
    id: 5,
    question: "現病歴をおしえてください",
    input: true,
    nextQuestionId: 6
  },
  {
    id: 6,
    question: "既往歴についておしえてください。",
    subQuestions: [
      {
        id: "6-1",
        question: "高血圧と診断されたことはありますか？",
        options: [
          { text: "なし", nextQuestionId: "6-2" },
          { text: "あり", nextQuestionId: "6-2", hasInput: true }
        ]
      },
      {
        id: "6-2",
        question: "糖尿病と診断されたことはありますか？",
        options: [
          { text: "なし", nextQuestionId: "6-3" },
          { text: "あり", nextQuestionId: "6-3", hasInput: true }
        ]
      },
      {
        id: "6-3",
        question: "脂質異常と診断されたことはありますか？",
        options: [
          { text: "なし", nextQuestionId: "6-4" },
          { text: "あり", nextQuestionId: "6-4", hasInput: true }
        ]
      },
      {
        id: "6-4",
        question: "その他の既往歴があれば教えてください",
        input: true,
        nextQuestionId: 7
      }
    ]
  },
  {
    id: 7,
    question: "家族歴についておしえてください。",
    subQuestions: [
      {
        id: "7-1",
        question: "脳卒中の家族歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: "7-2" },
          { text: "あり", nextQuestionId: "7-2" }
        ]
      },
      {
        id: "7-2",
        question: "脳梗塞の家族歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: "7-3" },
          { text: "あり", nextQuestionId: "7-3", hasInput: true }
        ]
      },
      {
        id: "7-3",
        question: "脳出血の家族歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: "7-4" },
          { text: "あり", nextQuestionId: "7-4", hasInput: true }
        ]
      },
      {
        id: "7-4",
        question: "クモ膜下出血の家族歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: "7-5" },
          { text: "あり", nextQuestionId: "7-5", hasInput: true }
        ]
      },
      {
        id: "7-5",
        question: "脳動脈瘤の家族歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: 8 },
          { text: "あり", nextQuestionId: 8, hasInput: true }
        ]
      }
    ]
  },
  {
    id: 8,
    question: "家族構成について教えてください",
    options: [
      { text: "独居", nextQuestionId: 9 },
      { text: "家族同居", nextQuestionId: 9, hasInput: true }
    ]
  },
  {
    id: 9,
    question: "内服薬について教えてください",
    subQuestions: [
      {
        id: "9-1",
        question: "抗血小板薬・抗凝固薬を服用していますか？",
        options: [
          { text: "なし", nextQuestionId: "9-2" },
          { text: "あり", nextQuestionId: "9-2", hasInput: true }
        ]
      },
      {
        id: "9-2",
        question: "糖尿病薬・甲状腺治療薬を服用していますか？",
        options: [
          { text: "なし", nextQuestionId: "9-3" },
          { text: "あり", nextQuestionId: "9-3", hasInput: true }
        ]
      },
      {
        id: "9-3",
        question: "その他になにか服用している薬はありますか？",
        input: true,
        nextQuestionId: 10
      }
    ]
  },
  {
    id: 10,
    question: "アレルギーについて教えてください",
    subQuestions: [
      {
        id: "10-1",
        question: "内服薬でアレルギーはありますか？",
        options: [
          { text: "なし", nextQuestionId: "10-2" },
          { text: "あり", nextQuestionId: "10-2", hasInput: true }
        ]
      },
      {
        id: "10-2",
        question: "食べ物でアレルギーはありますか？",
        options: [
          { text: "なし", nextQuestionId: "10-3" },
          { text: "あり", nextQuestionId: "10-3", hasInput: true }
        ]
      },
      {
        id: "10-3",
        question: "造影剤でアレルギーはありますか？",
        options: [
          { text: "なし", nextQuestionId: "10-4" },
          { text: "あり", nextQuestionId: "10-4", hasInput: true }
        ]
      },
      {
        id: "10-4",
        question: "金属でアレルギーはありますか？",
        options: [
          { text: "なし", nextQuestionId: "10-5" },
          { text: "あり", nextQuestionId: "10-5", hasInput: true }
        ]
      },
      {
        id: "10-5",
        question: "喘息アレルギーはありますか？",
        options: [
          { text: "なし", nextQuestionId: "10-6" },
          { text: "あり", nextQuestionId: "10-6", hasInput: true }
        ]
      },
      {
        id: "10-6",
        question: "その他のアレルギーはありますか？",
        input: true,
        nextQuestionId: 11
      }
    ]
  },
  {
    id: 11,
    question: "飲酒歴について教えてください",
    subQuestions: [
      {
        id: "11-1",
        question: "アルコールは飲みますか？",
        options: [
          { text: "なし", nextQuestionId: 12 },
          { text: "あり", nextQuestionId: "11-2" }
        ]
      },
      {
        id: "11-2",
        question: "普段はビールをどのくらい飲みますか？",
        input: true,
        nextQuestionId: "11-3"
      },
      {
        id: "11-3",
        question: "普段は日本酒をどのくらい飲みますか？",
        input: true,
        nextQuestionId: "11-4"
      },
      {
        id: "11-4",
        question: "普段は焼酎をどのくらい飲みますか？",
        input: true,
        nextQuestionId: "11-5"
      },
      {
        id: "11-5",
        question: "その他に飲むお酒はありますか？",
        input: true,
        nextQuestionId: 12
      }
    ]
  },
  {
    id: 12,
    question: "喫煙歴について教えてください",
    subQuestions: [
      {
        id: "12-1",
        question: "喫煙歴はありますか？",
        options: [
          { text: "なし", nextQuestionId: 13 },
          { text: "あり", nextQuestionId: "12-2" }
        ]
      },
      {
        id: "12-2",
        question: "現在は禁煙されていますか？",
        options: [
          { text: "していない", nextQuestionId: 13 },
          { text: "している", nextQuestionId: 13 }
        ]
      }
    ]
  },
  {
    id: 13,
    question: "その他になにか伝えたいことはありますか？",
    input: true,
    nextQuestionId: null // 最後の質問なのでnull
  }
];

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState(null);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const speechSynthesisRef = useRef(null);

  const currentQuestion = questionsData.find(q => q.id === currentQuestionId);

  useEffect(() => {
    if (mode === 'voice' && currentQuestion) {
      speakQuestion(getCurrentQuestionText());
    }
  }, [currentQuestion, mode]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && mode === 'voice') {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceInput(speechResult);
      };

      recognition.onend = () => {
        setRecognitionActive(false);
      };

      const startRecognition = () => {
        if (!recognitionActive) {
          setRecognitionActive(true);
          recognition.start();
        }
      };

      const recognitionButton = document.querySelector('#start-recognition');
      if (recognitionButton) {
        recognitionButton.addEventListener('click', startRecognition);
      }

      return () => {
        if (recognitionButton) {
          recognitionButton.removeEventListener('click', startRecognition);
        }
      };
    }
  }, [recognitionActive, mode]);

  const getCurrentQuestionText = () => {
    if (currentQuestion.subQuestions) {
      return `${currentQuestion.question} ${currentQuestion.subQuestions[0].question}`;
    }
    return currentQuestion.question;
  };

  const handleVoiceInput = (input) => {
    const normalizedInput = input.trim().toLowerCase();
    if (currentQuestion.options) {
      const matchedOption = currentQuestion.options.find(option => 
        normalizedInput.includes(option.text.toLowerCase())
      );
      if (matchedOption) {
        handleAnswer(matchedOption.text, matchedOption.nextQuestionId);
      } else {
        speakText("すみません、はっきりと聞き取れませんでした。もう一度お答えください。");
      }
    } else if (currentQuestion.input || (currentQuestion.subQuestions && currentQuestion.subQuestions[0].input)) {
      handleAnswer(input, currentQuestion.nextQuestionId);
    }
  };

  const handleAnswer = (answerText, nextQuestionId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionId]: answerText
    }));

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    } else {
      completeDiagnosis();
    }
  };

  const completeDiagnosis = () => {
    // 問診完了時の処理
    if (mode === 'voice') {
      speakText("問診が完了しました。結果を画面に表示しています。");
    }
    // 結果表示ページへの遷移などを実装
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP' && voice.name.includes('Female'));
        if (japaneseVoice) {
          utterance.voice = japaneseVoice;
        }
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      speechSynthesisRef.current = utterance;
    }
  };

  const speakQuestion = (question) => {
    speakText(question);
  };

  const startDiagnosis = (selectedMode) => {
    setMode(selectedMode);
    setCurrentQuestionId(1);
    setAnswers({});
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.subQuestions) {
      return (
        <div>
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.subQuestions.map((subQ, index) => (
            <div key={subQ.id}>
              <h3>{subQ.question}</h3>
              {renderQuestionContent(subQ)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <h2>{currentQuestion.question}</h2>
        {renderQuestionContent(currentQuestion)}
      </div>
    );
  };

  const renderQuestionContent = (question) => {
    if (question.options) {
      return question.options.map((option, index) => (
        <div key={index}>
          <button onClick={() => handleAnswer(option.text, option.nextQuestionId)}>
            {option.text}
          </button>
          {option.hasInput && <input type="text" onChange={(e) => handleAnswer(e.target.value, option.nextQuestionId)} />}
        </div>
      ));
    } else if (question.input) {
      return <input type="text" onChange={(e) => handleAnswer(e.target.value, question.nextQuestionId)} />;
    }
  };

  if (mode === null) {
    return (
      <div className="App">
        <h1>AI問診アプリ</h1>
        <div className="mode-selection">
          <button onClick={() => startDiagnosis('voice')}>音声モード</button>
          <button onClick={() => startDiagnosis('selection')}>選択モード</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>AI問診アプリ</h1>
      {renderQuestion()}
      {mode === 'voice' && (
        <button id="start-recognition" className="voice-button">
          音声で答える
        </button>
      )}
    </div>
  );
}

export default App;
