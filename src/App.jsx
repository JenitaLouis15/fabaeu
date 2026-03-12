import { useState, useRef, useEffect } from "react";

const SESSION_ID = `session_${Date.now()}`;
const BOT_WELCOME = "Hi! I'm FABAEU, your AI Learning Assistant. Ask me anything — I'm here to help you learn and grow. 😊";
const API_BASE = "";

const SUGGESTIONS = [
  "Explain quantum computing",
  "How does the brain learn?",
  "What is machine learning?",
  "Teach me about black holes",
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: BOT_WELCOME, time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef();
  const inputRef = useRef();
  const lastMsgRef = useRef();

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || typing) return;
    setShowSuggestions(false);

    const userMsg = { id: Date.now(), sender: "user", text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setMsgCount((c) => c + 1);
    setInput("");
    setTyping(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, sessionId: SESSION_ID }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: res.ok ? data.reply : `⚠️ ${data.error || "Something went wrong."}`,
        time: new Date(),
        isError: !res.ok,
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: "⚠️ Something went wrong. Please try again.",
        time: new Date(),
        isError: true,
      }]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: 1, sender: "bot", text: BOT_WELCOME, time: new Date() }]);
    setMsgCount(0);
    setShowSuggestions(true);
  };

  const d = dark;
  const bg = d ? "#1a1a1a" : "#faf9f7";
  const surface = d ? "#111" : "#f5f0e8";
  const border = d ? "#2a2a2a" : "#e8e2d9";
  const text = d ? "#f0ebe3" : "#1a1a1a";
  const textMid = d ? "#9d9590" : "#6b6560";
  const textSoft = "#9d9590";
  const card = d ? "#222" : "#fff";
  const cardBorder = d ? "#333" : "#e8e2d9";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes landFloat {
          0%,100% { transform: translateY(0); box-shadow: 0 8px 32px rgba(204,120,92,0.3); }
          50% { transform: translateY(-10px); box-shadow: 0 18px 40px rgba(204,120,92,0.22); }
        }
        @keyframes arrowBounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(1);opacity:0.3} 40%{transform:scale(1.4);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes appEnter { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }

        .toggle {
          width: 44px; height: 24px; border-radius: 12px;
          border: none; cursor: pointer; position: relative;
          transition: background 0.3s; flex-shrink: 0; padding: 0;
        }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; transition: transform 0.3s;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; pointer-events: none;
        }

        .landing {
          height: 100vh; height: 100dvh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 24px;
          transition: background 0.3s;
        }
        .landing::before {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 700px 500px at 20% 10%, rgba(204,120,92,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 600px 400px at 80% 90%, rgba(204,120,92,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .land-toggle { position: absolute; top: 20px; right: 24px; z-index: 10; }
        .landing-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          max-width: 600px; width: 100%;
        }
        .land-icon {
          width: 80px; height: 80px; border-radius: 22px; background: #cc785c;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; color: #fff; margin-bottom: 32px;
          box-shadow: 0 8px 32px rgba(204,120,92,0.3);
          animation: landFloat 4s ease-in-out infinite;
        }
        .land-greeting {
          font-size: 15px; font-weight: 600; letter-spacing: 3px;
          text-transform: uppercase; color: #cc785c; margin-bottom: 16px;
          opacity: 0; animation: fadeSlideUp 0.7s ease 0.2s forwards;
        }
        .land-title {
          font-size: clamp(36px, 7vw, 64px); font-weight: 700; line-height: 1.15;
          margin-bottom: 8px; opacity: 0; animation: fadeSlideUp 0.7s ease 0.4s forwards;
        }
        .land-title span { color: #cc785c; position: relative; display: inline-block; }
        .land-title span::after {
          content: ''; position: absolute; bottom: 2px; left: 0; right: 0;
          height: 3px; background: rgba(204,120,92,0.3); border-radius: 2px;
        }
        .land-sub {
          font-size: 17px; font-weight: 400; line-height: 1.7; max-width: 460px;
          margin: 16px auto 40px; opacity: 0; animation: fadeSlideUp 0.7s ease 0.6s forwards;
        }
        .land-cursor {
          display: inline-block; width: 2px; height: 18px; background: #cc785c;
          margin-left: 2px; vertical-align: middle; animation: blink 1s step-end infinite;
        }
        .land-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 14px; background: #cc785c;
          border: none; cursor: pointer; font-family: 'Inter', sans-serif;
          font-size: 16px; font-weight: 600; color: #fff;
          box-shadow: 0 6px 24px rgba(204,120,92,0.35); transition: all 0.2s;
          opacity: 0; animation: fadeSlideUp 0.7s ease 0.8s forwards;
        }
        .land-btn:hover { background: #b8654a; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(204,120,92,0.4); }
        .land-btn-arrow { font-size: 18px; animation: arrowBounce 1.5s ease-in-out infinite; }
        .land-features {
          display: flex; gap: 24px; margin-top: 48px; flex-wrap: wrap; justify-content: center;
          opacity: 0; animation: fadeSlideUp 0.7s ease 1s forwards;
        }
        .land-feat { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 500; }
        .land-feat-dot { width: 6px; height: 6px; border-radius: 50%; background: #cc785c; opacity: 0.6; }
        .dots-grid { position: absolute; z-index: 0; opacity: 0.4; }
        .dots-grid.tl { top: 40px; left: 40px; }
        .dots-grid.br { bottom: 60px; right: 40px; }
        .dot-g { display: inline-block; width: 4px; height: 4px; border-radius: 50%; margin: 5px; }

        .app {
          height: 100vh; height: 100dvh; display: flex; overflow: hidden;
          animation: appEnter 0.5s ease both;
        }

        .sidebar {
          width: 260px; flex-shrink: 0;
          display: flex; flex-direction: column; height: 100vh;
          transition: width 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
          overflow: hidden;
        }
        .sidebar.closed { width: 0; opacity: 0; pointer-events: none; }

        .sidebar-overlay {
          display: none; position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.25);
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 41;
            width: 260px !important; opacity: 1 !important;
            transform: translateX(-100%);
          }
          .sidebar.open-mobile { transform: translateX(0); }
          .sidebar.closed { transform: translateX(-100%); }
          .sidebar-overlay.open { display: block; }
        }

        .sidebar-top { padding: 20px 18px 16px; flex-shrink: 0; }
        .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .brand-icon {
          width: 32px; height: 32px; border-radius: 8px; background: #cc785c;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #fff; flex-shrink: 0;
        }
        .brand-text { font-size: 16px; font-weight: 600; }
        .close-sidebar-btn {
          margin-left: auto; background: transparent; border: none;
          cursor: pointer; font-size: 16px; padding: 4px 6px; border-radius: 6px;
          transition: background 0.15s; line-height: 1;
        }
        .new-chat-btn {
          width: 100%; padding: 9px 14px; background: transparent;
          border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 8px; transition: all 0.15s;
        }
        .sidebar-scroll { flex: 1; overflow-y: auto; }
        .sidebar-scroll::-webkit-scrollbar { width: 0; }
        .sidebar-section { padding: 16px 18px 8px; }
        .sidebar-section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .stat-item {
          display: flex; justify-content: space-between; padding: 7px 10px;
          border-radius: 7px; font-size: 13px; margin-bottom: 2px; transition: background 0.15s;
        }
        .s-divider { height: 1px; margin: 12px 18px; }
        .prompt-section { padding: 0 18px; }
        .prompt-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .prompt-item {
          padding: 8px 10px; border-radius: 7px; cursor: pointer;
          font-size: 13px; transition: background 0.15s; margin-bottom: 2px; line-height: 1.4;
        }
        .sidebar-footer { padding: 16px 18px; font-size: 11px; line-height: 1.8; flex-shrink: 0; }

        .main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; }
        .topbar {
          flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px;
        }
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .menu-btn {
          width: 34px; height: 34px; border-radius: 8px; background: transparent;
          border: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 20px; transition: background 0.15s; flex-shrink: 0;
        }
        .topbar-title { font-size: 15px; font-weight: 600; }
        .topbar-sub { font-size: 12px; margin-top: 1px; display: flex; align-items: center; gap: 5px; }
        .online-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4caf7d; box-shadow: 0 0 6px #4caf7d; animation: pulse 2s infinite;
        }
        .topbar-right { display: flex; align-items: center; gap: 8px; }
        .counter-badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
        .clear-btn {
          padding: 6px 14px; border-radius: 8px; background: transparent;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s;
          white-space: nowrap;
        }

        .chat-area { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 24px 0 12px; }
        .chat-area::-webkit-scrollbar { width: 5px; }
        .chat-area::-webkit-scrollbar-thumb { background: #d4cdc4; border-radius: 10px; }
        .chat-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 24px; }

        .welcome-block { text-align: center; padding: 24px 0 8px; }
        .welcome-icon {
          width: 56px; height: 56px; border-radius: 16px; background: #cc785c;
          margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: #fff; box-shadow: 0 4px 20px rgba(204,120,92,0.25);
        }
        .welcome-title { font-size: 22px; font-weight: 600; margin-bottom: 6px; }
        .welcome-sub { font-size: 14px; line-height: 1.6; }

        .date-div {
          display: flex; align-items: center; gap: 12px;
          font-size: 11px; font-weight: 500; color: #b0a9a0;
        }
        .date-div::before, .date-div::after { content: ''; flex: 1; height: 1px; }

        .msg-row { display: flex; gap: 12px; animation: fadeUp 0.3s ease both; }
        .msg-row.user { flex-direction: row-reverse; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; margin-top: 2px;
        }
        .msg-body { max-width: 80%; display: flex; flex-direction: column; gap: 4px; }
        .msg-row.user .msg-body { align-items: flex-end; }
        .msg-name { font-size: 12px; font-weight: 600; color: #9d9590; padding: 0 4px; }
        .bubble { padding: 12px 16px; border-radius: 18px; font-size: 14.5px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; }
        .bubble.user { background: #cc785c; color: #fff; border-radius: 18px 4px 18px 18px; box-shadow: 0 2px 8px rgba(204,120,92,0.25); }
        .bubble.error { background: #fef2f0 !important; border: 1px solid #fcd4cc !important; color: #c0503a !important; }
        .msg-time { font-size: 11px; color: #b0a9a0; padding: 0 4px; }

        .typing-row { display: flex; gap: 12px; animation: fadeUp 0.3s ease; }
        .typing-bubble { border-radius: 4px 18px 18px 18px; padding: 14px 18px; display: flex; gap: 5px; align-items: center; }
        .tdot { width: 7px; height: 7px; border-radius: 50%; background: #cc785c; opacity: 0.4; animation: bounce 1.2s infinite ease-in-out; }
        .tdot:nth-child(2) { animation-delay: 0.15s; }
        .tdot:nth-child(3) { animation-delay: 0.3s; }

        .suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 24px; max-width: 720px; margin: 0 auto; width: 100%; }
        @media (max-width: 480px) { .suggestions { grid-template-columns: 1fr; } }
        .sug-card { padding: 14px 16px; border-radius: 12px; cursor: pointer; transition: all 0.15s; font-size: 13.5px; font-weight: 500; line-height: 1.4; text-align: left; }
        .sug-icon { font-size: 18px; margin-bottom: 6px; display: block; }

        .input-wrap { flex-shrink: 0; padding: 10px 24px 18px; max-width: 720px; margin: 0 auto; width: 100%; }
        .input-box { display: flex; align-items: center; gap: 8px; border-radius: 14px; padding: 10px 10px 10px 16px; transition: border-color 0.2s, box-shadow 0.2s; }
        .chat-input { flex: 1; border: none; outline: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 14.5px; caret-color: #cc785c; min-width: 0; padding: 4px 0; }
        .send-btn {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: #cc785c; border: none; cursor: pointer; color: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; box-shadow: 0 2px 8px rgba(204,120,92,0.3);
        }
        .send-btn:hover { background: #b8654a; transform: scale(1.05); }
        .send-btn:active { transform: scale(0.96); }
        .send-btn:disabled { background: #d4cdc4; box-shadow: none; cursor: not-allowed; transform: none; }
        .input-hint { text-align: center; font-size: 11px; color: #b0a9a0; margin-top: 8px; }
      `}</style>

      {/* ══ LANDING ══ */}
      {!started && (
        <div className="landing" style={{background: bg, color: text}}>
          <div className="dots-grid tl">{[...Array(16)].map((_,i)=><span key={i} className="dot-g" style={{background: d?"#444":"#d4cdc4"}}/>)}</div>
          <div className="dots-grid br">{[...Array(16)].map((_,i)=><span key={i} className="dot-g" style={{background: d?"#444":"#d4cdc4"}}/>)}</div>

          <div className="land-toggle">
            <button className="toggle" style={{background: d?"#cc785c":"#d4cdc4"}} onClick={()=>setDark(o=>!o)}>
              <div className="toggle-thumb" style={{transform: d?"translateX(20px)":"translateX(0)"}}>
                {d?"🌙":"☀️"}
              </div>
            </button>
          </div>

          <div className="landing-inner">
            <div className="land-icon">✦</div>
            <div className="land-greeting">Welcome to</div>
            <h1 className="land-title" style={{color: text}}>
              Meet <span>FABAEU</span><br/>Your AI Tutor
            </h1>
            <p className="land-sub" style={{color: textMid}}>
              I'm here to help you understand anything — from quantum physics to everyday questions.
              Ask me anything and I'll explain it clearly.<span className="land-cursor"/>
            </p>
            <button className="land-btn" onClick={()=>setStarted(true)}>
              Start Conversation <span className="land-btn-arrow">→</span>
            </button>
            <div className="land-features">
              {["Powered by Groq","Llama 3.3 70B","Instant Responses","100% Free"].map((f,i)=>(
                <div key={i} className="land-feat" style={{color: textSoft}}>
                  <span className="land-feat-dot"/>&nbsp;{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ CHAT APP ══ */}
      {started && (
        <div className="app" style={{background: bg}}>

          <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={()=>setSidebarOpen(false)} />

          <div className={`sidebar ${sidebarOpen ? "open-mobile" : "closed"}`} style={{background: surface, borderRight: `1px solid ${border}`}}>
            <div className="sidebar-top" style={{borderBottom:`1px solid ${border}`}}>
              <div className="brand">
                <div className="brand-icon">✦</div>
                <span className="brand-text" style={{color: text}}>FABAEU</span>
                <button className="close-sidebar-btn" style={{color: textSoft}}
                  onMouseEnter={e=>e.currentTarget.style.background=d?"#222":"#ede8e0"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>setSidebarOpen(false)}>✕</button>
              </div>
              <button className="new-chat-btn" style={{border:`1px solid ${cardBorder}`, color: textMid}}
                onMouseEnter={e=>e.currentTarget.style.background=d?"#222":"#ede8e0"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                onClick={clearChat}>✏️&nbsp; New conversation</button>
            </div>

            <div className="sidebar-scroll">
              <div className="sidebar-section">
                <div className="sidebar-section-label" style={{color: textSoft}}>Session</div>
                {[["Messages", msgCount],["Model","Llama 3.3"],["Engine","Groq"]].map(([k,v])=>(
                  <div key={k} className="stat-item" style={{color: textMid}}
                    onMouseEnter={e=>e.currentTarget.style.background=d?"#222":"#ede8e0"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span>{k}</span><span style={{color:"#cc785c",fontWeight:600}}>{v}</span>
                  </div>
                ))}
                <div className="stat-item" style={{color: textMid}}>
                  <span>Status</span><span style={{color:"#4caf7d",fontWeight:600}}>● Online</span>
                </div>
              </div>
              <div className="s-divider" style={{background: border}}/>
              <div className="prompt-section">
                <div className="prompt-label" style={{color: textSoft}}>Quick prompts</div>
                {SUGGESTIONS.map((s,i)=>(
                  <div key={i} className="prompt-item" style={{color: textMid}}
                    onMouseEnter={e=>e.currentTarget.style.background=d?"#222":"#ede8e0"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    onClick={()=>sendMessage(s)}>💬&nbsp; {s}</div>
                ))}
              </div>
            </div>

            <div className="sidebar-footer" style={{borderTop:`1px solid ${border}`, color: d?"#444":"#b0a9a0"}}>
              FABAEU AI v2.0<br/>Powered by Groq<br/>© 2025 FABAEU
            </div>
          </div>

          <div className="main" style={{background: bg}}>
            <div className="topbar" style={{background: bg, borderBottom:`1px solid ${border}`}}>
              <div className="topbar-left">
                <button className="menu-btn" style={{color: textMid}}
                  onMouseEnter={e=>e.currentTarget.style.background=d?"#222":"#ede8e0"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>setSidebarOpen(o=>!o)}>☰</button>
                <div>
                  <div className="topbar-title" style={{color: text}}>FABAEU</div>
                  <div className="topbar-sub" style={{color: textSoft}}>
                    <span className="online-dot"/> AI Learning Assistant
                  </div>
                </div>
              </div>
              <div className="topbar-right">
                <span className="counter-badge" style={{background:d?"#222":"#ede8e0", color: textSoft}}>{msgCount} messages</span>
                <button className="toggle" style={{background: d?"#cc785c":"#d4cdc4"}} onClick={()=>setDark(o=>!o)}>
                  <div className="toggle-thumb" style={{transform: d?"translateX(20px)":"translateX(0)"}}>
                    {d?"🌙":"☀️"}
                  </div>
                </button>
                <button className="clear-btn" style={{border:`1px solid ${cardBorder}`, color: textMid}}
                  onMouseEnter={e=>{e.currentTarget.style.background=d?"#2a1a1a":"#fce8e2";e.currentTarget.style.color="#cc785c";e.currentTarget.style.borderColor="#cc785c";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=textMid;e.currentTarget.style.borderColor=cardBorder;}}
                  onClick={clearChat}>Clear chat</button>
              </div>
            </div>

            <div className="chat-area" ref={scrollRef}>
              <div className="chat-inner">
                {showSuggestions && (
                  <div className="welcome-block">
                    <div className="welcome-icon">✦</div>
                    <div className="welcome-title" style={{color: text}}>How can I help you learn today?</div>
                    <div className="welcome-sub" style={{color: textSoft}}>Ask me anything — I'll explain it clearly and simply.</div>
                  </div>
                )}

                <div className="date-div">
                  <style>{`.date-div::before,.date-div::after{background:${border}}`}</style>
                  {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                </div>

                {/* ✅ CHANGE 3: added index + lastMsgRef */}
                {messages.map((msg, index)=>(
                  <div
                    key={msg.id}
                    className={`msg-row ${msg.sender}`}
                    ref={index === messages.length - 1 ? lastMsgRef : null}
                  >
                    <div className="avatar" style={{
                      background: msg.sender==="bot" ? "#cc785c" : d?"#2a2a2a":"#e8e2d9",
                      color: msg.sender==="bot" ? "#fff" : d?"#9d9590":"#4a4540",
                      fontSize: msg.sender==="bot" ? "13px" : "11px"
                    }}>{msg.sender==="bot"?"✦":"You"}</div>

                    <div className="msg-body">
                      <div className="msg-name">{msg.sender==="bot"?"FABAEU":"You"}</div>
                      {msg.sender==="bot" ? (
                        <div className={`bubble ${msg.isError?"error":""}`} style={{
                          background: card, color: text,
                          border: `1px solid ${cardBorder}`,
                          borderRadius:"4px 18px 18px 18px",
                          boxShadow: d?"none":"0 1px 4px rgba(0,0,0,0.05)"
                        }}>{msg.text}</div>
                      ) : (
                        <div className={`bubble user ${msg.isError?"error":""}`}>{msg.text}</div>
                      )}
                      <div className="msg-time">{formatTime(msg.time)}</div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="typing-row">
                    <div className="avatar" style={{background:"#cc785c",color:"#fff",fontSize:"13px"}}>✦</div>
                    <div className="typing-bubble" style={{background:card, border:`1px solid ${cardBorder}`, boxShadow:d?"none":"0 1px 4px rgba(0,0,0,0.05)"}}>
                      <div className="tdot"/><div className="tdot"/><div className="tdot"/>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showSuggestions && (
              <div className="suggestions">
                {[["⚛️",0],["🧠",1],["🤖",2],["🌌",3]].map(([icon,i])=>(
                  <div key={i} className="sug-card"
                    style={{background:card, border:`1px solid ${cardBorder}`, color: d?"#9d9590":"#4a4540", boxShadow:d?"none":"0 1px 4px rgba(0,0,0,0.04)"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#cc785c";e.currentTarget.style.color="#cc785c";e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=cardBorder;e.currentTarget.style.color=d?"#9d9590":"#4a4540";e.currentTarget.style.transform="translateY(0)";}}
                    onClick={()=>sendMessage(SUGGESTIONS[i])}>
                    <span className="sug-icon">{icon}</span>{SUGGESTIONS[i]}
                  </div>
                ))}
              </div>
            )}

            <div className="input-wrap">
              <div className="input-box" style={{background: card, border:`1px solid ${d?"#444":"#d4cdc4"}`, boxShadow: d?"none":"0 2px 12px rgba(0,0,0,0.06)"}}>
                <input ref={inputRef} className="chat-input" style={{color: text}}
                  placeholder="Message FABAEU..."
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
                />
                <button className="send-btn" onClick={()=>sendMessage()} disabled={!input.trim()||typing}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <div className="input-hint">↵ Enter to send</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
