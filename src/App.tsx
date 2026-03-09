import { useState, useEffect } from 'react';
import { Zap, Server, User, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fetchJsonp from 'fetch-jsonp';

// Use the exact official local URLs downloaded to the public folder
const GEM_ICON = "/gem.png";
const LOGO_URL = "/logo.svg";


const GEMS_OPTIONS = [80, 170, 360, 2000];

// A high quality, satisfying UI click sound effect for better conversion
const CLICK_SFX = "data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExEAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedGems, setSelectedGems] = useState<number | null>(null);

  const playClickSound = () => {
    const audio = new Audio(CLICK_SFX);
    audio.volume = 0.6; // Make click SFX slightly louder and crisper
    audio.play().catch(() => { });
  };

  const [toastMessage, setToastMessage] = useState<{ name: string, gems: number, time: string } | null>(null);

  // Social Proof Effect
  useEffect(() => {
    const names = ['Alex_Pro', 'Brawler99', 'SniperKing', 'GamerGirl22', 'Toxic_Leon', 'SpikeMain', 'ProPlayer_01', 'ShadowNinja', 'GhostRider', 'Leon_God'];
    const gemsOpts = [80, 170, 360, 2000];
    const times = ['Just now', '1m ago', '2m ago', '5m ago'];

    const showRandomToast = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const gems = gemsOpts[Math.floor(Math.random() * gemsOpts.length)];
      const time = times[Math.floor(Math.random() * times.length)];

      setToastMessage({ name, gems, time });

      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    };

    const initialTimer = setTimeout(showRandomToast, 3000);

    const interval = setInterval(() => {
      showRandomToast();
    }, Math.random() * 6000 + 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Generation Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('iOS');

  // SEO FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
    playClickSound();
  };

  // Locker Timer
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let timer: number;
    if (isFinished && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // CPA Offers State
  const [offers, setOffers] = useState<any[]>([]);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);

  // Fake generation logic
  const handleGenerate = () => {
    playClickSound();
    if (!username || !selectedGems) return;

    setIsGenerating(true);
    setProgress(0);
    setIsFinished(false);

    const steps = [
      { p: 10, text: "Connecting to Brawl Stars servers..." },
      { p: 25, text: "Searching for player tag: " + username },
      { p: 40, text: "Player verified! Securing connection..." },
      { p: 60, text: `Preparing to inject ${selectedGems} Gems...` },
      { p: 80, text: "Bypassing server security protocols..." },
      { p: 95, text: "Finalizing transaction..." },
      { p: 100, text: "Gems successfully added!" }
    ];

    let currentStep = 0;

    const nextStep = () => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);

        let delay = Math.random() * 1000 + 800; // Random delay between 800ms and 1800ms
        if (currentStep === steps.length - 1) delay = 1000;

        setTimeout(() => {
          currentStep++;
          nextStep();
        }, delay);
      } else {
        setIsFetchingOffers(true);
        setStatusText("Loading Human Verification...");

        // Fetch CPA Offers using native JSONP and environment variables to bypass strict CORS policies completely
        const baseUrl = import.meta.env.VITE_CPA_FEED_URL || 'https://d2dzcaq3bhqk1m.cloudfront.net/public/offers/feed.php';
        const userId = import.meta.env.VITE_CPA_USER_ID;
        const apiKey = import.meta.env.VITE_CPA_API_KEY;

        const feedUrl = `${baseUrl}?user_id=${userId}&api_key=${apiKey}&s1=${username}&s2=${selectedGems}`;

        fetchJsonp(feedUrl)
          .then(res => res.json())
          .then(data => {
            // The JSONP feed returns the array of offers directly as the root object
            if (Array.isArray(data)) {
              setOffers(data.slice(0, 4)); // Get top 4 converting offers
            } else if (data && data.offers) {
              setOffers(data.offers.slice(0, 4));
            }
          })
          .catch(err => console.error("Locker Error:", err))
          .finally(() => {
            setTimeout(() => {
              setIsFetchingOffers(false);
              setIsFinished(true); // Triggers Locker UI
            }, 800);
          });
      }
    };

    nextStep();
  };


  return (
    <div className="app-container" style={{ justifyContent: 'flex-start' }}>

      {/* 100vh Hero Section to keep generator perfectly centered with huge margin below */}
      <div className="hero-section">
        {/* Centered Content Wrapper */}
        <div className="content-wrapper">

          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="header"
            style={{ flexDirection: 'column' }}
          >
            <div className="top-badges-container">
              <div className="live-counter">
                <span className="live-dot"></span>
                <span>1,482 Players Online</span>
              </div>
              <div className="updated-badge">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                Updated: Today
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src={LOGO_URL}
                alt="Brawl Stars Logo"
                style={{
                  height: '140px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))',
                  marginBottom: '10px'
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  document.getElementById('fallback-text-logo')!.style.display = 'block';
                }}
              />
              <h1 id="fallback-text-logo" className="logo-text text-stroke" style={{ display: 'none' }}>
                BRAWL <span style={{ color: 'white' }}>STARS</span>
              </h1>
            </div>
          </motion.div>

          {/* Main Panel */}
          <motion.div
            className="panel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* --- STEP 1: Gems Selection --- */}
            {currentStep === 1 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <label className="input-label" style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.4rem' }}>
                  <Zap size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--bs-yellow-btn)' }} />
                  CHOOSE YOUR FREE GEMS
                </label>

                <div className="gem-grid">
                  {GEMS_OPTIONS.map((amount) => (
                    <div
                      key={amount}
                      className={`gem-card ${selectedGems === amount ? 'active' : ''}`}
                      onClick={() => {
                        playClickSound();
                        setSelectedGems(amount);
                      }}
                    >
                      {amount === 2000 && <div className="popular-ribbon">BEST VALUE</div>}
                      <img
                        src={GEM_ICON}
                        alt="Gem"
                        className="gem-icon animate-pulse"
                      />
                      <div className="gem-amount text-stroke">{amount}</div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <p style={{ color: '#ffb82c', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 10px 0', fontFamily: 'var(--font-body)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    ⚡ High demand! Server slots are limited.
                  </p>
                  <button
                    className="btn-primary glow-effect"
                    onClick={() => {
                      playClickSound();
                      setCurrentStep(2);
                    }}
                    disabled={!selectedGems}
                  >
                    NEXT
                  </button>
                </div>

                <div className="trust-badges">
                  <span><ShieldCheck size={14} /> 100% Safe</span>
                  <span><CheckCircle2 size={14} /> Anti-Ban</span>
                  <span><Clock size={14} /> Instant</span>
                </div>
              </motion.div>
            )}

            {/* --- STEP 2: Username & Device Input --- */}
            {currentStep === 2 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="input-group">
                  <label className="input-label">
                    <User size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--bs-yellow-btn)' }} />
                    Where should we send your Gems?
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. #Y0URT4G"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Select Device Platform</label>
                  <div className="device-selector">
                    {['iOS', 'Android', 'PC'].map(device => (
                      <button
                        key={device}
                        className={`device-btn ${deviceFilter === device ? 'active' : ''}`}
                        onClick={() => {
                          playClickSound();
                          setDeviceFilter(device);
                        }}
                        style={{
                          background: deviceFilter === device ? 'var(--bs-blue-light)' : 'rgba(0,0,0,0.3)',
                          borderColor: 'var(--bs-black)',
                          color: deviceFilter === device ? 'white' : '#ccc'
                        }}
                      >
                        {device}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      playClickSound();
                      setCurrentStep(1);
                    }}
                    style={{ background: '#555', flex: '0.4' }}
                  >
                    BACK
                  </button>
                  <button
                    className="btn-primary glow-effect"
                    onClick={handleGenerate}
                    disabled={!username || isGenerating}
                    style={{ flex: '1' }}
                  >
                    {isGenerating ? 'GENERATING...' : 'CLAIM REWARD'}
                  </button>
                </div>

                <div className="trust-badges">
                  <span><ShieldCheck size={14} /> Secure Connection</span>
                  <span><CheckCircle2 size={14} /> 256-bit Encryption</span>
                </div>
              </motion.div>
            )}



          </motion.div>

          {/* Generation Modal */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                className={`modal-overlay ${isFinished ? 'locker-overlay' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={`modal-content ${isFinished ? 'locker-mode' : ''}`}
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  {!isFinished ? (
                    <>
                      <Server size={64} color="var(--bs-yellow-btn)" style={{ margin: '0 auto 1.5rem' }} className="pulse-icon" />
                      <h3 className="text-stroke" style={{ fontSize: '2.5rem', color: 'white', margin: 0, letterSpacing: '2px' }}>PROCESSING</h3>

                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>

                      <div className="status-text">{statusText}</div>
                      <div className="progress-percentage text-stroke">
                        {isFetchingOffers ? '99%' : `${progress}%`}
                      </div>

                      <div style={{ marginTop: '2rem', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                        Please do not close this window while generating.
                      </div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="locker-container"
                    >
                      <div className="urgency-timer">
                        ⚠️ Verification window closes in <span className="timer-text">{formatTime(timeLeft)}</span>
                      </div>

                      <img src={GEM_ICON} alt="Gems" style={{ width: '80px', height: '80px', margin: '0 auto 10px', filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.8))' }} className="animate-pulse" />
                      <h3 className="locker-title" style={{ fontSize: '2.4rem', color: 'var(--bs-white)', margin: '0 0 0.5rem', lineHeight: '1.2' }}>
                        VERIFICATION
                      </h3>
                      <p className="locker-desc" style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.4' }}>
                        Complete <strong style={{ color: 'var(--bs-yellow-btn)' }}>ONE</strong> of the free tasks below to unlock your <strong style={{ color: '#54ff3b' }}>{selectedGems} Gems</strong>!
                      </p>

                      <div className="offer-list">
                        {offers.map((offer: any) => (
                          <a key={offer.id} href={offer.url} target="_blank" rel="noopener noreferrer" className="offer-card" onClick={playClickSound}>
                            <img src={offer.network_icon} alt="Offer Icon" className="offer-icon" />
                            <div className="offer-details">
                              <h4 className="offer-title">{offer.anchor}</h4>
                              <p className="offer-desc">{offer.conversion}</p>
                            </div>
                            <div className="offer-btn-wrapper">
                              <button className="free-btn claim-pulse">CLAIM</button>
                            </div>
                          </a>
                        ))}

                        {offers.length === 0 && (
                          <div style={{ color: 'white', padding: '2rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '2px solid #555' }}>
                            Loading verification offers specifically for your device... Please wait.
                          </div>
                        )}
                      </div>

                      <div className="active-waiting">
                        <div className="spinner"></div>
                        <span>Waiting for offer completion...</span>
                      </div>

                      <div className="trust-badges" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                        <span><ShieldCheck size={14} /> 100% Safe</span>
                        <span><CheckCircle2 size={14} /> No Ban Risk</span>
                      </div>

                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: '500'
                      }}>
                        Gems securely sent to <strong style={{ color: '#ccc' }}>{username}</strong> instantly after verification.
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div> {/* End content-wrapper for Hero */}
      </div> {/* End hero-section */}

      {/* SEO FAQ Section - Placed Below the Fold */}
      <div className="content-wrapper">
        <div className="seo-faq-section" style={{ marginTop: '6rem' }}>
          <h2 className="faq-title">Brawl Stars: Frequently Asked Questions</h2>
          <div className="faq-list">

            <div className={`faq-item ${openFaq === 0 ? 'open' : ''}`} onClick={() => toggleFaq(0)}>
              <div className="faq-question">
                <h3>Who is the Best Brawler in Brawl Stars?</h3>
                <span className="faq-icon">{openFaq === 0 ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>The <strong>best brawler in Brawl Stars</strong> often changes depending on the current meta and the specific game mode. Historically, highly mobile and high-damage brawlers dominate. According to the latest <strong>Brawl Stars tier list</strong>, assassins and controllers are top picks. Many players argue that finding a brawler whose playstyle matches yours is more important than raw stats. For consistent climbing, mastering a mix of snipers and tanks is recommended.</p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 1 ? 'open' : ''}`} onClick={() => toggleFaq(1)}>
              <div className="faq-question">
                <h3>Is Surge Brawl Stars good in the current meta?</h3>
                <span className="faq-icon">{openFaq === 1 ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>Yes, <strong>Surge Brawl Stars</strong> remains an exceptionally strong pick. His unique upgrade mechanic allows him to snowball matches once he reaches Stage 3 or 4. He is particularly lethal in Solo Showdown and Brawl Ball. To counter him, you need long-range brawlers who can prevent him from getting his first super. When fully upgraded, Surge is arguably one of the most powerful damage dealers in the game.</p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 2 ? 'open' : ''}`} onClick={() => toggleFaq(2)}>
              <div className="faq-question">
                <h3>How to play Edgar Brawl Stars effectively?</h3>
                <span className="faq-icon">{openFaq === 2 ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p><strong>Edgar Brawl Stars</strong> is a fierce close-range assassin. The key to playing Edgar is patience. You must wait for your super to auto-charge or use the "Let's Fly" gadget. Once your super is ready, jump onto isolated, squishy targets. His life-steal passive makes him incredibly difficult to duel 1v1. He dominates in Showdown but can struggle in open 3v3 maps against heavy crowd control.</p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 3 ? 'open' : ''}`} onClick={() => toggleFaq(3)}>
              <div className="faq-question">
                <h3>Are there any active Brawl Stars Codes?</h3>
                <span className="faq-icon">{openFaq === 3 ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>Yes, Supercell occasionally releases <strong>Brawl Stars codes</strong> (often called Creator Codes or Promo Codes) during special events, esports tournaments, or major updates. These codes can reward you with pins, coins, or sometimes even small gem packs. We regularly monitor official social channels to bring you the latest working codes to boost your account progression.</p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 4 ? 'open' : ''}`} onClick={() => toggleFaq(4)}>
              <div className="faq-question">
                <h3>Why are Spike and Leon so popular?</h3>
                <span className="faq-icon">{openFaq === 4 ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>Legendary brawlers like <strong>Spike Brawl Stars</strong> and <strong>Leon Brawl Stars</strong> are fan favorites because of their unique mechanics. Spike offers massive burst damage and area-denial with his super, making him a versatile pick in almost any mode. Leon, on the other hand, specializes in stealth. His invisibility super allows for devastating flank attacks, making him a nightmare for low-HP backline brawlers like Poco or Melodie.</p>
              </div>
            </div>

          </div>
        </div>
      </div> {/* End content-wrapper for FAQ */}

      {/* Background Character Art Full Bleed */}
      <div className="character-bg-footer">
        <picture>
          <img src="/bg_new.png" alt="Brawl Stars New Background" className="full-bg-img" />
        </picture>
      </div>

      {/* Social Proof Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast-notification"
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
            style={{ left: '50%' }}
          >
            <div className="toast-icon">
              <img src={GEM_ICON} alt="Gems" />
            </div>
            <div className="toast-content">
              <div className="toast-title">{toastMessage.name}</div>
              <div className="toast-desc">Received <span>{toastMessage.gems} Gems</span></div>
            </div>
            <div className="toast-time">{toastMessage.time}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
