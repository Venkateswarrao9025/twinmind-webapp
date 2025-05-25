import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './meeting.css';

export default function Meeting() {
  // Timer logic
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Tabs
  const [tab, setTab] = useState('Searches');

  // SpeechRecognition API
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('SpeechRecognition API is not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(final + interim);
    };
    recognition.onerror = (event) => {
      setTranscript('Error: ' + event.error);
    };
    if (isRecording) {
      recognition.start();
    }
    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line
  }, [isRecording]);

  const navigate = useNavigate();
  const handleStop = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    navigate('/dashboard');
  };

  return (
    <div className="meeting-bg">
      <div className="meeting-container">
        {/* Header */}
        <div className="meeting-header">
          <button className="meeting-back" onClick={() => navigate('/dashboard')}>Home</button>
          <div className="meeting-timer">{formatTime(seconds)}</div>
          <button className="meeting-share">Share</button>
        </div>
        {/* Title & Details */}
        <div className="meeting-title">Here is a really, really long title</div>
        <div className="meeting-details">November 24, 2025 • 12:10PM • San Francisco</div>
        <div className="meeting-participants">
          <span role="img" aria-label="avatar">👩‍💼</span> Bean +2
        </div>
        <a href="#" className="meeting-link">See details</a>
        {/* Tabs */}
        <div className="meeting-tabs">
          <button className={tab === 'Searches' ? 'active' : ''} onClick={() => setTab('Searches')}>Searches</button>
          <button className={tab === 'Notes' ? 'active' : ''} onClick={() => setTab('Notes')}>Notes</button>
          <button className={tab === 'Transcript' ? 'active' : ''} onClick={() => setTab('Transcript')}>Transcript</button>
        </div>
        {/* Tab Content */}
        <div className="meeting-tab-content">
          {tab === 'Searches' && (
            <div className="meeting-searches">
              <div className="meeting-pull">↓ Pull down to get suggested searches</div>
            </div>
          )}
          {tab === 'Notes' && (
            <div className="meeting-notes">
              <div className="meeting-empty">No notes yet.</div>
            </div>
          )}
          {tab === 'Transcript' && (
            <div className="meeting-transcript">
              {transcript.trim() === '' ? (
                <div className="meeting-empty">Transcript will appear here.</div>
              ) : (
                <div className="meeting-note">{transcript}</div>
              )}
            </div>
          )}
        </div>
        {/* Listening Section */}
        <div className="meeting-listening">
          <div className="meeting-mic-icon">🎤</div>
          <div className="meeting-listening-title">TwinMind is listening in the background</div>
          <div className="meeting-listening-desc">
            Leave it on during your <span className="meeting-highlight">meeting</span> or conversations.
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="meeting-bottom-bar">
          <button className="meeting-answer">★ Tap to Get Answer</button>
          <button className="meeting-chat">Chat with Transcript</button>
          <button className="meeting-stop" onClick={handleStop}>Stop</button>
        </div>
      </div>
    </div>
  );
} 