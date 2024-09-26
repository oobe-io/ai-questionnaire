import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// 新しい質問データ（紹介状、資料、身体所見を追加）
const questionsData = [
  {
    id: 1,
    question: "紹介状はお持ちですか？",
    options: [
      { text: "はい", nextQuestionId: 2 },
      { text: "いいえ", nextQuestionId: 2 }
    ]
  },
  {
    id: 2,
    question: "資料はお持ちですか？",
    options: [
      { text: "はい", nextQuestionId: 3 },
      { text: "いいえ", nextQuestionId: 3 }
    ]
  },
  {
    id: 3,
    question: "身長を教えてください。（cm）",
    inputType: "number",
    nextQuestionId: 4
  },
  {
    id: 4,
    question: "体重を教えてください。（kg）",
    inputType: "number",
    nextQuestionId: 5
  },
  {
    id: 5,
    question: "血圧の上（収縮期血圧）を教えてください。（mmHg）",
    inputType: "number",
    nextQuestionId: 6
  },
  {
    id: 6,
    question: "血圧の下（拡張期血圧）を教えてください。（mmHg）",
    inputType: "number",
    nextQuestionId: 7
  },
  {
    id: 7,
    question: "脈拍を教えてください。（bpm）",
    inputType: "number",
    nextQuestionId: 8
  },
  {
    id: 8,
    question: "利き手はどちらですか？",
    options: [
      { text: "右手", nextQuestionId: null },
      { text: "左手", nextQuestionId: null }
    ]
  }
];

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [diagnosticHistory, setDiagnosticHistory] = useState([]);
  const [mode, setMode] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fallbackOptions, setFallbackOptions] = useState(null);
  const [inputValue, setInputValue] = useState(''); // 入力値を管理する状態
  const speechSynthesisRef = useRef(null);

  const currentQuestion = questionsData.find(q => q.id === currentQuestionId);

  useEffect(() => {
    if (mode === 'voice' && currentQuestion) {
      speakQuestion(currentQuestion.question);
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
        handleVoiceCommand(speechResult);
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

  const handleVoiceCommand = (speechResult) => {
    const normalizedResult = speechResult.trim().toLowerCase();

    const yesExpressions = ['はい', 'そうです', 'ええ', 'あります', 'はい、です'];
    const noExpressions = ['いいえ', 'ちがいます', 'ありません', 'いいえ、違います'];

    const findMatchingOption = () => {
      return currentQuestion.options?.find(option => {
        const optionText = option.text.toLowerCase();
        if (yesExpressions.includes(optionText)) {
          return yesExpressions.some(expr => normalizedResult.includes(expr));
        } else if (noExpressions.includes(optionText)) {
          return noExpressions.some(expr => normalizedResult.includes(expr));
        } else {
          return normalizedResult.includes(optionText);
        }
      });
    };

    const matchedOption = findMatchingOption();

    if (matchedOption) {
      handleAnswer(matchedOption.text, matchedOption.nextQuestionId);
    } else {
      speakText("すみません、はっきりと聞き取れませんでした。次の選択肢からお選びください。");
      setFallbackOptions(currentQuestion.options);
    }
  };

  const handleOptionClick = (optionText, nextQuestionId) => {
    handleAnswer(optionText, nextQuestionId);
    setFallbackOptions(null);
  };

  const handleAnswer = (answerText, nextQuestionId) => {
    setDiagnosticHistory(prevHistory => [
      ...prevHistory,
      { question: currentQuestion.question, answer: answerText }
    ]);

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
      setInputValue(''); // 次の質問に進む際に入力フィールドをクリア
    } else {
      completeDiagnosis();
    }
  };

  // 身体所見の入力完了ボタンで次へ進む
  const handleInputSubmit = (nextQuestionId) => {
    if (inputValue.trim() !== '') {
      setDiagnosticHistory(prevHistory => [
        ...prevHistory,
        { question: currentQuestion.question, answer: inputValue }
      ]);
      setCurrentQuestionId(nextQuestionId);
      setInputValue(''); // 次の質問に進む際に入力フィールドをクリア
    } else {
      alert("入力を確認してください。");
    }
  };

  const completeDiagnosis = () => {
    setIsCompleted(true);
    if (mode === 'voice') {
      speakText("問診が完了しました。結果を画面に表示しています。");
    }
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
    setDiagnosticHistory([]);
    setIsCompleted(false);
  };

  const resetDiagnosis = () => {
    setMode(null);
    setCurrentQuestionId(0);
    setDiagnosticHistory([]);
    setIsCompleted(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index, newAnswer) => {
    setDiagnosticHistory(prevHistory => 
      prevHistory.map((item, i) => 
        i === index ? { ...item, answer: newAnswer } : item
      )
    );
    setEditingIndex(null);
  };

  const handleRepeat = () => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.question);
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

  if (isCompleted) {
    return (
      <div className="App">
        <h1>問診結果</h1>
        <div className="diagnostic-history">
          <ul>
            {diagnosticHistory.map((item, index) => (
              <li key={index} className="diagnostic-item">
                <div className="question-answer">
                  <strong>{item.question}</strong>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={item.answer}
                      onChange={(e) => handleSave(index, e.target.value)}
                      onBlur={() => setEditingIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <span>{item.answer}</span>
                  )}
                </div>
                <button className="edit-button" onClick={() => handleEdit(index)}>編集</button>
              </li>
            ))}
          </ul>
        </div>
        <button className="return-button" onClick={resetDiagnosis}>トップへ戻る</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>AI問診アプリ</h1>
      {currentQuestion && (
        <div className="container">
          <div className="question-container">
            <h2>{currentQuestion.question}</h2>
            {mode === 'voice' && (
              <button className="repeat-button" onClick={handleRepeat} aria-label="質問を繰り返す">
                繰り返す
              </button>
            )}
          </div>
          <div className="button-container">
            {currentQuestion.options ? (
              (fallbackOptions || currentQuestion.options).map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option.text, option.nextQuestionId)}>
                  {option.text}
                </button>
              ))
            ) : (
              <div>
                <input
                  type={currentQuestion.inputType || 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="入力してください"
                />
                <button onClick={() => handleInputSubmit(currentQuestion.nextQuestionId)}>
                  入力完了
                </button>
              </div>
            )}
            {mode === 'voice' && !fallbackOptions && (
              <button id="start-recognition" className="voice-button">
                音声で答える
              </button>
            )}
          </div>
        </div>
      )}
      <div className="diagnostic-history">
        <h3>問診履歴</h3>
        <ul>
          {diagnosticHistory.map((item, index) => (
            <li key={index}>
              <strong>{item.question}</strong>: {item.answer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
