import React, { useRef, useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  function getAllMemories() {
    const memories = [
      { date: 'Mon, May 12', time: '9:11 PM', title: 'TwinMind App Development Discussion and Public Speaking Practice', duration: '1h 42m' },
      { date: 'Sat, May 10', time: '10:32 AM', title: "TwinMind AI App Overview: Founder's Conversation About Product Features, Gfkalkflak l kalk lak lak lakl.", duration: '21m' },
      { date: 'Fri, May 9', time: '9:25 PM', title: 'TwinMind Feature Discussion: Audio Saving Options, UI Simplification, and Co...', duration: '27m' },
    ];
    return memories;
  }

  // Group memories by date
  const memories = getAllMemories();
  const grouped = memories.reduce((acc, mem) => {
    if (!acc[mem.date]) acc[mem.date] = [];
    acc[mem.date].push(mem);
    return acc;
  }, {});

  // Audio transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Start recording
  const startRecording = async () => {
    setTranscripts([]);
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      // Placeholder: send audioBlob to transcription API
      const transcript = await transcribeAudio(audioBlob);
      setTranscripts((prev) => [...prev, transcript]);
      audioChunksRef.current = [];
    };

    mediaRecorder.start();
    // Stop and restart every 30 seconds
    intervalRef.current = setInterval(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.start();
      }
    }, 30000);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(intervalRef.current);
  };

  // Placeholder for transcription API call
  async function transcribeAudio(audioBlob) {
    // TODO: Send audioBlob to OpenAI Whisper or Google Gemini API and return transcript
    // For now, just return a placeholder
    return '[Transcribed text will appear here]';
  }

  // Handler for Capture button
  const handleCaptureClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="dashboard-bg">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <img className="dashboard-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" />
        <div className="dashboard-title">
          TwinMind <span className="dashboard-pro">PRO</span>
        </div>
        <a className="dashboard-help" href="#">Help</a>
      </nav>

      {/* Progress Card */}
      <div className="dashboard-progress-card">
        <div className="dashboard-progress-header">
          <span className="dashboard-progress-unlock">Capture 100 Hours to Unlock Features</span>
          <span className="dashboard-progress-title">Building Your Second Brain</span>
        </div>
        <div className="dashboard-progress-bar-bg">
          <div className="dashboard-progress-bar" style={{ width: '80%' }} />
        </div>
        <div className="dashboard-progress-info">
          <span>159 / 100 hours</span>
          <span role="img" aria-label="brain">🧠</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className="active">Memories</button>
        <button>Calendar</button>
        <button>Questions</button>
      </div>

      {/* Memory List */}
      <div className="dashboard-memories-list">
        {Object.entries(grouped).map(([date, mems]) => (
          <React.Fragment key={date}>
            <div className="dashboard-memories-date">{date}</div>
            {mems.map((mem, idx) => (
              <div className="dashboard-memory-card" key={idx}>
                <div className="dashboard-memory-time">{mem.time}</div>
                <div className="dashboard-memory-content">
                  <div className="dashboard-memory-title">{mem.title}</div>
                  <div className="dashboard-memory-duration">{mem.duration}</div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="dashboard-bottom-bar">
        <input className="dashboard-search" placeholder="Ask All Memories" />
        <button className="dashboard-capture" onClick={() => navigate('/meeting')}>
          Capture
        </button>
      </div>
    </div>
  );
} 