'use client'

import { useState } from 'react'
import { RANDOM_TOPICS, TONES } from '../constants'
import { ResolutionType, AspectRatioType, DurationType } from '../types'

// Components
import { AppHeader } from '../components/features/AppHeader'
import { ContentSection } from '../components/features/ContentSection'
import { VideoConfigSection } from '../components/features/VideoConfigSection'
import { VisualAudioSection } from '../components/features/VisualAudioSection'
import { PreviewPanel } from '../components/features/PreviewPanel'

export default function Home() {
  // State: Video Config
  const [resolution,     setResolution]     = useState<ResolutionType>('720p')
  const [aspectRatio,    setAspectRatio]    = useState<AspectRatioType>('9:16')
  const [duration,       setDuration]       = useState<DurationType>('15s')
  const [activeStyle,    setActiveStyle]    = useState('cinematic')
  const [activeTone,     setActiveTone]     = useState(TONES[0])
  const [emotion,        setEmotion]        = useState('Vui tươi')
  const [motionIntensity,setMotionIntensity]= useState(50)
  const [transitions,    setTransitions]    = useState(true)
  const [charConsistency,setCharConsistency]= useState(true)

  // State: Audio Config
  const [voiceGender,    setVoiceGender]    = useState('Nam')
  const [language,       setLanguage]       = useState('vi')
  const [voiceSpeed,     setVoiceSpeed]     = useState(50)
  const [bgMusic,        setBgMusic]        = useState(false)

  // State: Content
  const [foodTopic,      setFoodTopic]      = useState('')
  const [mainCharacter,  setMainCharacter]  = useState('')
  const [script,         setScript]         = useState('')

  const handleFillSamples = () => {
    const randomIdx = Math.floor(Math.random() * RANDOM_TOPICS.length)
    const item = RANDOM_TOPICS[randomIdx]
    setFoodTopic(item.topic)
    setMainCharacter(item.character)
    setScript(item.script)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 var(--space-6) var(--space-8)' }}>
      <AppHeader />

      <main className="main-grid-responsive">
        {/* LEFT — Scrollable form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          
          <ContentSection 
            foodTopic={foodTopic} setFoodTopic={setFoodTopic}
            mainCharacter={mainCharacter} setMainCharacter={setMainCharacter}
            script={script} setScript={setScript}
            activeTone={activeTone} setActiveTone={setActiveTone}
            onSuggest={handleFillSamples}
          />

          <VideoConfigSection 
            resolution={resolution} setResolution={setResolution}
            aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
            duration={duration} setDuration={setDuration}
          />

          <VisualAudioSection 
            emotion={emotion} setEmotion={setEmotion}
            activeStyle={activeStyle} setActiveStyle={setActiveStyle}
            motionIntensity={motionIntensity} setMotionIntensity={setMotionIntensity}
            transitions={transitions} setTransitions={setTransitions}
            charConsistency={charConsistency} setCharConsistency={setCharConsistency}
            voiceGender={voiceGender} setVoiceGender={setVoiceGender}
            language={language} setLanguage={setLanguage}
            voiceSpeed={voiceSpeed} setVoiceSpeed={setVoiceSpeed}
            bgMusic={bgMusic} setBgMusic={setBgMusic}
          />

          {/* Main Action Buttons — Compact & Clean */}
          <div className="main-actions-container">
            <button className="btn-secondary btn-draft" style={{ padding: '12px 24px', minWidth: 120 }}>
              Lưu nháp
            </button>
            <button className="btn-generate" style={{ width: 'auto', padding: '12px 32px', minWidth: 180 }}>
              <span>Tạo video</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT — Preview & Summary */}
        <PreviewPanel 
          config={{
            resolution,
            aspectRatio,
            duration,
            voiceGender,
            activeStyle,
            activeTone
          }}
        />
      </main>
    </div>
  )
}
