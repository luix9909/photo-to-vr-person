import React, { useState, useEffect } from 'react'
import PhotoUploader from './components/PhotoUploader'
import BackgroundRemover from './components/BackgroundRemover'
import DepthGenerator from './components/DepthGenerator'
import VRViewer from './components/VRViewer'
import ControlPanel from './components/ControlPanel'
import './index.css'

function App() {
  const [step, setStep] = useState(1)
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [depthMap, setDepthMap] = useState(null)
  const [isVRMode, setIsVRMode] = useState(false)
  const [isPassthrough, setIsPassthrough] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (image) => {
    setOriginalImage(image)
    setStep(2)
  }

  const handleBackgroundRemoved = (image) => {
    setProcessedImage(image)
    setStep(3)
  }

  const handleDepthGenerated = (depth) => {
    setDepthMap(depth)
    setStep(4)
  }

  const enterVRMode = () => {
    setIsVRMode(true)
    document.body.style.overflow = 'hidden'
  }

  const exitVRMode = () => {
    setIsVRMode(false)
    document.body.style.overflow = 'auto'
  }

  const togglePassthrough = () => {
    setIsPassthrough(!isPassthrough)
  }

  const resetApp = () => {
    setStep(1)
    setOriginalImage(null)
    setProcessedImage(null)
    setDepthMap(null)
    setIsVRMode(false)
    setIsPassthrough(false)
  }

  const steps = [
    { number: 1, title: 'رفع الصورة' },
    { number: 2, title: 'إزالة الخلفية' },
    { number: 3, title: 'إنشاء عمق 3D' },
    { number: 4, title: 'عرض في VR' }
  ]

  return (
    <div className="app-container">
      {!isVRMode ? (
        <>
          {/* شريط التقدم */}
          <div className="progress-bar">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`step ${step >= s.number ? 'active' : ''}`}
              >
                <div className="step-circle">{s.number}</div>
                <div className="step-title">{s.title}</div>
              </div>
            ))}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="main-content">
            {step === 1 && (
              <PhotoUploader onImageUpload={handleImageUpload} />
            )}
            
            {step === 2 && originalImage && (
              <BackgroundRemover
                image={originalImage}
                onComplete={handleBackgroundRemoved}
                onBack={() => setStep(1)}
              />
            )}
            
            {step === 3 && processedImage && (
              <DepthGenerator
                image={processedImage}
                onComplete={handleDepthGenerated}
                onBack={() => setStep(2)}
              />
            )}
            
            {step === 4 && processedImage && depthMap && (
              <div className="preview-section">
                <h2>جاهز للدخول في VR!</h2>
                <div className="preview-image">
                  <img src={processedImage} alt="معالج" />
                </div>
                <ControlPanel
                  onEnterVR={enterVRMode}
                  onTogglePassthrough={togglePassthrough}
                  onReset={resetApp}
                  isPassthrough={isPassthrough}
                />
              </div>
            )}
          </div>

          {/* معلومات التطبيق */}
          <footer className="app-footer">
            <p>تقنية الذكاء الاصطناعي لتحويل الصور 2D إلى نماذج 3D في VR</p>
            <p>يدعم: Oculus Quest, HTC Vive, جميع متصفحات WebXR</p>
          </footer>
        </>
      ) : (
        <VRViewer
          image={processedImage}
          depthMap={depthMap}
          isPassthrough={isPassthrough}
          onExit={exitVRMode}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>جاري المعالجة بالذكاء الاصطناعي...</p>
        </div>
      )}

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .step:not(:last-child):after {
          content: '';
          position: absolute;
          top: 25px;
          right: 50%;
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          z-index: 1;
        }

        .step.active:not(:last-child):after {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
        }

        .step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .step.active .step-circle {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(106, 17, 203, 0.5);
        }

        .step-title {
          font-size: 0.9em;
          opacity: 0.7;
        }

        .step.active .step-title {
          opacity: 1;
          font-weight: bold;
        }

        .main-content {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .preview-section {
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        .preview-section h2 {
          margin-bottom: 30px;
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.5em;
        }

        .preview-image {
          width: 300px;
          height: 400px;
          margin: 0 auto 30px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 3px solid rgba(106, 17, 203, 0.5);
        }

        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .spinner {
          width: 80px;
          height: 80px;
          border: 5px solid rgba(255, 255, 255, 0.1);
          border-top: 5px solid #6a11cb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .app-footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9em;
          opacity: 0.7;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .progress-bar {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .step:not(:last-child):after {
            display: none;
          }

          .preview-section h2 {
            font-size: 1.8em;
          }
        }
      `}</style>
    </div>
  )
}

export default App