import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Importation des images situées à la racine (niveau au-dessus de src)
import imgEnsetNormal from '../enset_vue_aerienne.jpg';
import imgEnsetDestroy from '../enset_destroy.png';
import imgPreparation from '../preparation_post.png';
import imgDiffusion from '../duffusion_post.png';
import imgManipulation from '../la manupilation_avec_deepkesk.png';
import imgChaos from '../choas_effect.png';
import imgDeath from '../death_fo_threat.png';
import imgProbleme from '../probleme_financiser.png';
import img_situation2 from '../siatuation_2.png';
import imgDrone from '../drone.png';

/* --- COMPOSANTS INTERACTIFS --- */

// 1. Effet Machine à écrire pour les titres
const TypingText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="typing-text">{displayed}<span className="cursor">_</span></span>;
};

// 2. Slider Avant/Après interactif (Comparaison Deepfake)
const BeforeAfterSlider = ({ imgBefore, imgAfter }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div 
      className="comparison-container reveal-shadow" 
      ref={containerRef} 
      onMouseMove={handleMove}
      onTouchMove={(e) => handleMove(e.touches[0])}
    >
      <img src={imgBefore} alt="Before" className="comp-img comp-base" />
      <div className="comp-overlay" style={{ width: `${sliderPos}%` }}>
        <img src={imgAfter} alt="After" className="comp-img comp-after" />
      </div>
      <div className="comp-slider-line" style={{ left: `${sliderPos}%` }}>
        <div className="comp-slider-handle">◄ Destroy ►</div>
      </div>
    </div>
  );
};

// 3. Carte 3D Interactive (Tilt Effect)
const TiltCard = ({ title, desc, img, colorClass }) => {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRot({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      className={`tilt-card ${colorClass} ${isHovered ? 'hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRot({ x: 0, y: 0 }); }}
      style={{ transform: `perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)` }}
    >
      <div className="card-glare" style={{ 
        transform: `translate(${rot.y * 2}px, ${-rot.x * 2}px)`, 
        opacity: isHovered ? 0.3 : 0 
      }}></div>
      <img src={img} alt={title} className="card-bg" />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
};

// 4. Compteur animé (Viralité)
const AnimatedCounter = ({ target, suffix = '', active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 2000; // 2s
    const interval = 20;
    const step = (target / duration) * interval;
    
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [active, target]);

  return <span className="cyber-number">{Math.floor(count).toLocaleString()}{suffix}</span>;
};

/* --- APPLICATION PRINCIPALE --- */
const DeepfakePresentation = () => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('next');
  const totalSteps = 16;
  
  // États interactifs spécifiques
  const [instagramLiked, setInstagramLiked] = useState(false);
  const [particles, setParticles] = useState([]);
  const [dronePos, setDronePos] = useState({ x: 50, y: 50 });
  const radarRef = useRef(null);

  const nextStep = () => {
    setDir('next');
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };
  
  const prevStep = () => {
    setDir('prev');
    setStep((prev) => Math.max(prev - 1, 0));
  };
  
  const goToStep = (i) => {
    setDir(i > step ? 'next' : 'prev');
    setStep(i);
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Particules virales
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setParticles(p => {
          if (p.length > 25) return p.slice(1);
          return [...p, { id: Math.random(), left: Math.random() * 100, delay: Math.random() }];
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [step]);

  // Radar interactif Drone
  const handleRadarMove = (e) => {
    if (!radarRef.current) return;
    const rect = radarRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDronePos({ x, y });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="step-container welcome-page">
            <div className="welcome-background">
              <div className="floating-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="particle" style={{ 
                    left: `${Math.random() * 100}%`, 
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`
                  }}></div>
                ))}
              </div>
              
              <div className="welcome-content">
                <div className="welcome-logo">
                  <svg className="logo-shield" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10L10 30V60C10 85 50 110 50 110C50 110 90 85 90 60V30L50 10Z" stroke="url(#gradient1)" strokeWidth="3" fill="url(#gradient2)"/>
                    <path d="M35 55L45 65L65 45" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="50" cy="55" r="25" stroke="url(#gradient1)" strokeWidth="2" opacity="0.5"/>
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7"/>
                        <stop offset="50%" stopColor="#06b6d4"/>
                        <stop offset="100%" stopColor="#ec4899"/>
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)"/>
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h1 className="welcome-title">
                  <span className="title-line">DEEPFAKE</span>
                  <span className="title-line gradient-text">DEFENSE SYSTEM</span>
                </h1>

                <p className="welcome-tagline">Securing Digital Truth in the Age of AI</p>

                <div className="welcome-features-mini">
                  <div className="mini-feature">
                    <div className="mini-icon">🔒</div>
                    <span>Blockchain Verified</span>
                  </div>
                  <div className="mini-feature">
                    <div className="mini-icon">⚡</div>
                    <span>Real-Time Detection</span>
                  </div>
                  <div className="mini-feature">
                    <div className="mini-icon">🌐</div>
                    <span>Decentralized Trust</span>
                  </div>
                </div>

                <div className="welcome-cta">
                  <button className="cta-button" onClick={nextStep}>
                    <span>START PRESENTATION</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-container">
            <h2 className="glitch-title danger" data-text="ENSET Under Attack">ENSET Under Attack</h2>
            <p className="subtitle"><TypingText text="Welcome to the deepfake demonstration..." /></p>
            <div className="image-frame cinematic-pan">
              <img src={imgEnsetDestroy} alt="ENSET Destroyed" className="main-image" />
              {/* cyber-overlay removed to keep original colors */}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-container">
            <h2 className="glitch-title danger" data-text="The Destruction">The Destruction</h2>
            <p className="subtitle"><TypingText text="Hover over the image to deploy the Deepfake." /></p>
            <BeforeAfterSlider imgBefore={imgEnsetNormal} imgAfter={imgEnsetDestroy} />
          </div>
        );

      case 3:
        return (
          <div className="step-container">
            <h2>Deepfake Preparation</h2>
            <p className="subtitle"><TypingText text="A simple click is enough to spread chaos. (Double-click the image)" /></p>
            <div className="interactive-phone">
              <div className="phone-screen">
                <div className="insta-header">
                  <div className="insta-avatar"></div>
                  <span>@anonymous_hack</span>
                  <span className="insta-time">4m</span>
                </div>
                <div 
                  className="insta-img-container" 
                  onDoubleClick={() => setInstagramLiked(true)}
                >
                  <img src={imgPreparation} alt="Preparation Post" />
                  {instagramLiked && <div className="heart-burst">❤️</div>}
                </div>
                <div className="insta-actions">
                  <button className={`action-btn ${instagramLiked ? 'liked' : ''}`} onClick={() => setInstagramLiked(!instagramLiked)}>
                    {instagramLiked ? '❤️' : '🤍'}
                  </button>
                  <button className="action-btn">💬</button>
                  <button className="action-btn">🚀</button>
                </div>
                <div className="insta-likes">{instagramLiked ? '1,204' : '1,203'} Likes</div>
                <div className="insta-caption">
                  <strong>@anonymous_hack</strong> It's the end! ENSET is on fire 🔥 #deepfake #alert
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-container">
            <h2>Express Virality</h2>
            <p className="subtitle"><TypingText text="Fake news spreads 6 times faster than a true one." /></p>
            
            <div className="viral-zone full-width-diffusion">
              {/* Replace simple div background with full image of phones */}
              <img src={imgDiffusion} alt="Viral Diffusion" className="viral-main-image" />

              {particles.map(p => (
                <div key={p.id} className="viral-particle" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }}>
                  {Math.random() > 0.5 ? '🔄' : '❤️'}
                </div>
              ))}
              
              <div className="viral-stats-container glassmorphism overlay-on-image">
                <div className="stat-box">
                  <AnimatedCounter target={1200} suffix="K" active={step === 4} />
                  <span className="stat-label">Global Views</span>
                </div>
                <div className="stat-box warning">
                  <AnimatedCounter target={45000} active={step === 4} />
                  <span className="stat-label">Shares</span>
                </div>
                <div className="stat-box danger">
                  <AnimatedCounter target={800} suffix="/min" active={step === 4} />
                  <span className="stat-label">Reports</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-container">
            <h2 className="glitch-title cyber-blue" data-text="Forensic Analysis">Forensic Analysis</h2>
            <p className="subtitle"><TypingText text="Move the cursor to isolate the digitally injected element." /></p>
            
            <div className="radar-view" ref={radarRef} onMouseMove={handleRadarMove}>
              <div className="radar-grid"></div>
              <div className="radar-sweep"></div>
              <div 
                className="drone-element interactive" 
                style={{ left: `${dronePos.x}%`, top: `${dronePos.y}%` }}
              >
                <img src={imgDrone} alt="Drone" className="real-drone-img bg-removed-transparent" />
                <div className="target-lock"></div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-container">
            <h2>Artifact Revelation</h2>
            <p className="subtitle"><TypingText text="Injection validated: coordinates found, inconsistent shadow detected." /></p>
            <div className="image-frame">
              <img src={img_situation2} alt="Background" className="main-image" />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="step-container">
            <h2>Technical Mechanisms</h2>
            <p className="subtitle"><TypingText text="Hover over the image to understand the AI alterations." /></p>
            <div className="hotspot-container">
              <img src={imgManipulation} alt="Deepfake Mechanisms" className="hotspot-img" />
              
              {/* Interactive Points */}
              <div className="hotspot" style={{ top: '30%', left: '20%' }}>
                <div className="hotspot-pulse"></div>
                <div className="tooltip"><strong>GAN Generation</strong> Generative model creating realistic fire without physical reference.</div>
              </div>
              <div className="hotspot" style={{ top: '60%', left: '70%' }}>
                <div className="hotspot-pulse"></div>
                <div className="tooltip right"><strong>Color Grading</strong> Harmonization of shadows to trick the human eye.</div>
              </div>
              <div className="hotspot" style={{ top: '80%', left: '40%' }}>
                <div className="hotspot-pulse"></div>
                <div className="tooltip"><strong>Semantic Segmentation</strong> Perfect blending of the artificial edges into the building structure.</div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="step-container">
            <h2 className="glitch-title danger" data-text="Global Consequences">Global Consequences</h2>
            <p className="subtitle"><TypingText text="Interact with the cards to explore the systemic impact..." /></p>
            <div className="cards-grid">
              <TiltCard title="Chaos Effect" desc="Mass panic generated by a doctored image implying an impending danger." img={imgChaos} colorClass="border-red" />
              <TiltCard title="Death of Trust" desc="Permanent doubt regarding the truthfulness of official information." img={imgDeath} colorClass="border-orange" />
              <TiltCard title="Financial Krach" desc="Market destabilization following the spread of ultra-realistic rumors." img={imgProbleme} colorClass="border-blue" />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="step-container">
            <h2 className="glitch-title warning" data-text="Which One Is Real?">Which One Is Real?</h2>
            <p className="subtitle"><TypingText text="Watch both videos carefully. Can you spot the deepfake?" /></p>
            
            <div className="video-comparison-grid-large">
              <div className="video-box-large">
                <div className="video-label-large">Video A</div>
                <video 
                  id="videoA"
                  className="comparison-video-large" 
                  controls 
                  autoPlay
                  muted
                  src="/vidoeA.mp4"
                  preload="auto"
                  onEnded={() => {
                    const videoB = document.getElementById('videoB');
                    if (videoB) videoB.play();
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="video-box-large">
                <div className="video-label-large">Video B</div>
                <video 
                  id="videoB"
                  className="comparison-video-large" 
                  controls 
                  muted
                  src="/vidoeB.mp4"
                  preload="auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            <div className="question-prompt glassmorphism">
              <p className="cyber-text">🔍 Which video is the authentic one?</p>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="step-container">
            <h2 className="glitch-title cyber-blue" data-text="Step 1: Capture at Source">Step 1: Capture at Source</h2>
            <p className="subtitle"><TypingText text="Original content captured with cryptographic signature" /></p>
            
            <div className="single-video-container">
              <div className="large-step-number">01</div>
              <video 
                className="large-solution-video" 
                controls 
                autoPlay
                loop
                muted
                src="/vidoe1.mp4"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="video-caption glassmorphism">
                <p>The content is captured at the source with a unique cryptographic signature that ensures authenticity from the moment of creation.</p>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="step-container">
            <h2 className="glitch-title cyber-blue" data-text="Step 2: Register">Step 2: Register</h2>
            <p className="subtitle"><TypingText text="Content registered in immutable blockchain ledger" /></p>
            
            <div className="single-video-container">
              <div className="large-step-number">02</div>
              <video 
                className="large-solution-video" 
                controls 
                autoPlay
                loop
                muted
                src="/vidoe2.mp4"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="video-caption glassmorphism">
                <p>The signed content is registered in an immutable blockchain ledger, creating a permanent and tamper-proof record.</p>
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="step-container">
            <h2 className="glitch-title cyber-blue" data-text="Step 3: Verification">Step 3: Verification</h2>
            <p className="subtitle"><TypingText text="Real-time verification against registered signatures" /></p>
            
            <div className="single-video-container">
              <div className="large-step-number">03</div>
              <video 
                className="large-solution-video" 
                controls 
                autoPlay
                loop
                muted
                src="/vidoe3.mp4"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="video-caption glassmorphism">
                <p>Any content can be verified in real-time by comparing its signature against the blockchain registry to confirm authenticity.</p>
              </div>
            </div>
          </div>
        );

      case 13:
        return (
          <div className="step-container full-width-slide">
            <div className="strengths-header">
              <h2 className="core-strengths-title">CORE STRENGTHS</h2>
              <div className="title-underline"></div>
              <p className="strengths-subtitle">The foundation of our deepfake defense system</p>
            </div>
            
            <div className="strengths-grid-enhanced">
              <div className="strength-card-enhanced color-purple">
                <div className="card-number">01</div>
                <div className="strength-icon-circle-enhanced">
                  <svg className="strength-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 40L20 50L30 60M70 40L80 50L70 60M40 30L50 20L60 30M40 70L50 80L60 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="5" fill="currentColor"/>
                  </svg>
                </div>
                <div className="strength-content">
                  <h3 className="strength-title-enhanced">INDEPENDENT END<br/>DECENTRALIZED</h3>
                </div>
              </div>

              <div className="strength-card-enhanced color-cyan">
                <div className="card-number">02</div>
                <div className="strength-icon-circle-enhanced">
                  <svg className="strength-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="15" width="50" height="60" rx="3" stroke="currentColor" strokeWidth="3"/>
                    <path d="M35 25H65M35 35H60M35 45H55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="55" cy="58" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M52 58L54 60L58 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M68 55L73 60L68 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="strength-content">
                  <h3 className="strength-title-enhanced">EMPOWERING<br/>CITIZENS</h3>
                </div>
              </div>

              <div className="strength-card-enhanced color-pink">
                <div className="card-number">03</div>
                <div className="strength-icon-circle-enhanced">
                  <svg className="strength-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="40" r="20" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M30 40L20 40M70 40L80 40M50 20L50 10M50 60L50 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M35 55L30 60M65 55L70 60M35 25L30 20M65 25L70 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="35" y="70" width="30" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M40 75H60M40 80H55M40 85H58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="strength-content">
                  <h3 className="strength-title-enhanced">LENS-TO-INTERNET<br/>VERIFICATION</h3>
                </div>
              </div>

              <div className="strength-card-enhanced color-orange">
                <div className="card-number">04</div>
                <div className="strength-icon-circle-enhanced">
                  <svg className="strength-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="50" cy="50" r="5" fill="currentColor"/>
                    <path d="M50 20C50 20 35 30 35 50C35 70 50 80 50 80M50 20C50 20 65 30 65 50C65 70 50 80 50 80" stroke="currentColor" strokeWidth="2"/>
                    <path d="M25 35L20 30M75 35L80 30M75 65L80 70M25 65L20 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="strength-content">
                  <h3 className="strength-title-enhanced">THE "DIGITAL<br/>RITUAL"</h3>
                </div>
              </div>
            </div>
          </div>
        );

      case 14:
        return (
          <div className="step-container full-width-slide">
            <div className="future-header">
              <h2 className="future-main-title">NEXT STEPS AND FUTURE VISION</h2>
              <div className="future-title-underline"></div>
            </div>

            <div className="future-vision-container">
              <div className="future-vision-center">
                <div className="center-circle">
                  <div className="circle-border"></div>
                  <div className="circle-content">
                    <svg className="center-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3"/>
                      <path d="M50 15L55 30L70 25L60 40L75 45L60 50L70 65L55 60L50 75L45 60L30 65L40 50L25 45L40 40L30 25L45 30Z" fill="currentColor"/>
                    </svg>
                    <h3 className="center-subtitle">ROADMAP</h3>
                  </div>
                </div>
              </div>

              <div className="future-features">
                <div className="future-feature-card feature-purple">
                  <div className="feature-connector"></div>
                  <div className="feature-icon-circle">
                    <svg className="feature-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3"/>
                      <path d="M50 20V35M50 65V80M20 50H35M65 50H80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path d="M40 40L35 35M60 40L65 35M60 60L65 65M40 60L35 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">REAL-TIME PROTECTION</h3>
                </div>

                <div className="future-feature-card feature-cyan">
                  <div className="feature-connector"></div>
                  <div className="feature-icon-circle">
                    <svg className="feature-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="30" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="3"/>
                      <rect x="55" y="30" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="3"/>
                      <rect x="20" y="65" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="3"/>
                      <rect x="55" y="65" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="3"/>
                      <path d="M45 42.5H55M45 77.5H55M32.5 55V65M67.5 55V65" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="50" cy="15" r="8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">PLATFORM INTEGRATION</h3>
                </div>

                <div className="future-feature-card feature-pink">
                  <div className="feature-connector"></div>
                  <div className="feature-icon-circle">
                    <svg className="feature-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 70C30 70 20 60 20 45C20 30 30 20 30 20M70 20C70 20 80 30 80 45C80 60 70 70 70 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="50" cy="45" r="15" stroke="currentColor" strokeWidth="3"/>
                      <path d="M45 40L50 45L55 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="35" y="70" width="30" height="15" rx="2" stroke="currentColor" strokeWidth="3"/>
                      <path d="M42 77H58" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="feature-title">OFFLINE ACCESSIBILITY</h3>
                </div>
              </div>
            </div>
          </div>
        );

      case 15:
        return (
          <div className="step-container conclusion-page">
            <div className="conclusion-background">
              <div className="conclusion-glow"></div>
              
              <div className="conclusion-content">
                <div className="thank-you-icon">
                  <svg className="check-shield" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10L10 30V60C10 85 50 110 50 110C50 110 90 85 90 60V30L50 10Z" stroke="url(#gradientConclusion)" strokeWidth="4" fill="url(#gradientFillConclusion)"/>
                    <path d="M30 55L45 70L70 40" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="gradientConclusion" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7"/>
                        <stop offset="50%" stopColor="#06b6d4"/>
                        <stop offset="100%" stopColor="#ec4899"/>
                      </linearGradient>
                      <linearGradient id="gradientFillConclusion" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)"/>
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.2)"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h1 className="conclusion-title">
                  <span className="title-word">THANK YOU</span>
                  <span className="title-word">FOR YOUR</span>
                  <span className="title-word">ATTENTION</span>
                </h1>

                <div className="conclusion-divider"></div>

                <p className="conclusion-subtitle">Together, we can secure digital truth</p>

                <div className="conclusion-contact">
                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <span>contact@deepfake-defense.com</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">🌐</div>
                    <span>www.deepfake-defense.com</span>
                  </div>
                </div>

                <div className="conclusion-footer">
                  <p>© 2026 Deepfake Defense System - All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="presentation-app dark-theme">
      {/* Cybernetic Grid Background */}
      <div className="bg-grid"></div>

      <header className="app-header glassmorphism">
        <h1 className="logo"><span className="pulse-dot">🔴</span> LIVE_SYS :: DEEPFAKE</h1>
        <div className="progress-bar-container">
          <div className="progress-line" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}></div>
          <div className="progress-steps">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`step-dot ${i <= step ? 'active' : ''}`} onClick={() => goToStep(i)}></div>
            ))}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div key={step} className={`step-transition-group ${dir}`}>
          {renderStepContent()}
        </div>
      </main>

      <footer className="app-footer glassmorphism">
        <button onClick={prevStep} disabled={step === 0} className="cyber-btn">
           ◄ PREVIOUS
        </button>
        <div className="terminal-nav">SYS.STEP [{step + 1}/{totalSteps}]</div>
        <button onClick={nextStep} disabled={step === totalSteps - 1} className="cyber-btn primary">
          NEXT ►
        </button>
      </footer>
    </div>
  );
};

export default DeepfakePresentation;
