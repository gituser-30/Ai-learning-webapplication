import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Interview() {
  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [started, setStarted] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null); // 🔥 persistent mic object

  /* ---------------- LOAD VOICES ---------------- */
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ---------------- INIT SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;
  }, []);

  /* ---------------- START INTERVIEW ---------------- */
  const startInterview = async () => {
    if (!voicesLoaded) {
      alert("Voice engine loading... click again");
      return;
    }

    setStarted(true);

    const res = await axios.post("/interview/start", {
      domain: "Web Developer",
    });

    setSessionId(res.data.sessionId);
    setQuestion(res.data.question);

    speak(res.data.question);
  };

  /* ---------------- SPEAK FUNCTION ---------------- */
  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speakNow = () => {
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return setTimeout(speakNow, 200);

      const utterance = new SpeechSynthesisUtterance(text);

      const preferred =
        voices.find(v => v.name.includes("Google US English")) ||
        voices.find(v => v.name.includes("Google UK English")) ||
        voices.find(v => v.lang === "en-US") ||
        voices[0];

      utterance.voice = preferred;
      utterance.rate = 0.95;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    };

    speakNow();
  };

  /* ---------------- LISTEN ---------------- */
  const startListening = () => {
  const recognition = recognitionRef.current;

  if (!recognition) {
    alert("Speech recognition not supported");
    return;
  }

  setListening(true);
  setTranscript("");

  let finalTranscript = "";
  let silenceTimer;
  let stoppedByUs = false;

  recognition.continuous = true;
  recognition.interimResults = true;

  const restartRecognition = () => {
    if (!stoppedByUs) {
      try { recognition.start(); } catch {}
    }
  };

  recognition.onresult = (event) => {
    let interim = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += text + " ";
      } else {
        interim += text;
      }
    }

    setTranscript(finalTranscript + interim);

    // silence detection (user finished speaking)
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      stoppedByUs = true;
      recognition.stop();
      setListening(false);

      if (finalTranscript.trim().length > 0) {
        sendAnswer(finalTranscript);
      }
    }, 2000); // wait 2 sec silence
  };

  recognition.onend = () => {
    // browser stopped automatically → restart
    if (!stoppedByUs) restartRecognition();
  };

  recognition.onerror = () => {
    restartRecognition();
  };

  stoppedByUs = false;
  recognition.start();
};


  /* ---------------- SEND ANSWER ---------------- */
 const sendAnswer = async (answer) => {
  const res = await axios.post("/interview/answer", {
    sessionId,
    answer,
  });

  if (res.data.stage === "end") {
    finishInterview();
    return;
  }

  setQuestion(res.data.question);
  speak(res.data.question);
};

const finishInterview = async () => {
  const res = await axios.get(`/interview/result/${sessionId}`);

  alert(
    `Result:
Technical: ${res.data.technicalScore}/10
Communication: ${res.data.communicationScore}/10
Confidence: ${res.data.confidenceScore}/10
Verdict: ${res.data.finalVerdict}`
  );
};

  return (
    <div className="interview-page">
  <div className="interview-card">

    {/* HEADER */}
    <div className="interview-header">
      <div className="brand">
        <img src="/logo.png" alt="logo" />
        <div>
          <h2>AI Technical Interview</h2>
          <span>Virtual Hiring Assistant</span>
        </div>
      </div>

      {started && (
        <div className="status">
          <div className={`dot ${listening ? "live" : ""}`}></div>
          {listening ? "Recording..." : "Waiting"}
        </div>
      )}
    </div>


    {/* START SCREEN */}
    {!started && (
      <div className="start-screen">
        <img src="/interviewer.png" className="avatar-large" />
        <h3>Your interviewer is ready</h3>
        <p>Click below to begin your technical interview</p>
        <button className="start-btn" onClick={startInterview}>
          Start Interview 🎤
        </button>
      </div>
    )}


    {/* INTERVIEW MODE */}
    {started && (
      <div className="chat-box">

        {/* AI QUESTION */}
        <div className="message ai">
          <img src="/interviewer.png" className="avatar" />
          <div className="bubble">
            <b>AI Interviewer</b>
            <p>{question}</p>
          </div>
        </div>

        {/* USER ANSWER */}
        {transcript && (
          <div className="message user">
            <div className="bubble">
              <b>You</b>
              <p>{transcript}</p>
            </div>
          </div>
        )}

        {/* MIC BUTTON */}
        <div className="controls">
          <button
            className={`mic-btn ${listening ? "active" : ""}`}
            onClick={startListening}
            disabled={listening}
          >
            {listening ? "Listening..." : "Answer 🎤"}
          </button>
        </div>

      </div>
    )}
  </div>
</div>

  );
}
