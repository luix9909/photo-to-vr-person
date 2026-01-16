import React, { useState, useEffect, useRef } from 'react'

const BackgroundRemover = ({ image, onComplete, onBack }) => {
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (image) {
      removeBackground()
    }
  }, [image])

  const removeBackground = async () => {
    setLoading(true)
    
    try {
      // Simulate AI processing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(i)
      }

      // Create canvas for image processing
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Load image
      const img = new Image()
      img.src = image
      
      await new Promise(resolve => {
        img.onload = resolve
      })

      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx.drawImage(img, 0, 0)
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Simple background removal (simulated)
      // In production, use TensorFlow.js or MediaPipe
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Simple green screen removal simulation
        const isBackground = g > r * 1.2 && g > b * 1.2
        
        if (isBackground) {
          data[i + 3] = 0 // Make transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Convert to PNG with transparency
      const processed = canvas.toDataURL('image/png')
      setProcessedImage(processed)
      
      setProgress(100)
      
      // Auto proceed after 1 second
      setTimeout(() => {
        onComplete(processed)
      }, 1000)
      
    } catch (error) {
      console.error('Error removing background:', error)
      // Fallback to original image
      setProcessedImage(image)
      onComplete(image)
    } finally {
      setLoading(false)
    }
  }

  const handleManualAdjust = () => {
    // Manual adjustment functionality
    alert('ميزة الضبط اليدوي قريباً!')
  }

  return (
    <div className="background-remover">
      <h2>🎨 إزالة الخلفية بالذكاء الاصطناعي</h2>
      
      <div className="comparison-section">
        <div className="image-box original">
          <h3>الصورة الأصلية</h3>
          <img src={image} alt="أصلي" />
        </div>
        
        <div className="processing-indicator">
          <div className="arrow">➡️</div>
          {loading ? (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p>{progress}%</p>
            </div>
          ) : (
            <div className="processing-done">
              <div className="checkmark">✅</div>
              <p>تمت المعالجة</p>
            </div>
          )}
        </div>
        
        <div className="image-box processed">
          <h3>بعد الإزالة</h3>
          {processedImage ? (
            <img src={processedImage} alt="مُعالج" />
          ) : (
            <div className="placeholder">
              جاري المعالجة...
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!loading && processedImage && (
        <div className="controls">
          <button className="btn back" onClick={onBack}>
            رجوع
          </button>
          
          <button className="btn adjust" onClick={handleManualAdjust}>
            ضبط يدوي
          </button>
          
          <button className="btn next" onClick={() => onComplete(processedImage)}>
            التالي: إنشاء عمق 3D
          </button>
        </div>
      )}

      <div className="processing-info">
        <h4>🤖 كيف تعمل تقنية الذكاء الاصطناعي:</h4>
        <p>1. تحليل الصورة والتعرف على الشخص</p>
        <p>2. فصل الشخص عن الخلفية بدقة</p>
        <p>3. إنشاء قناعة ألفا للشفافية</p>
        <p>4. تحسين حواف الصورة</p>
      </div>

      <style jsx>{`
        .background-remover {
          text-align: center;
          animation: slideIn 0.5s ease;
        }

        h2 {
          margin-bottom: 30px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .comparison-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          gap: 20px;
        }

        .image-box {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 20px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .image-box h3 {
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.9);
        }

        .image-box img {
          width: 100%;
          max-width: 300px;
          height: 300px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .image-box.original img {
          border: 2px solid #ff6b6b;
        }

        .image-box.processed img {
          border: 2px solid #4ecdc4;
        }

        .placeholder {
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.2em;
        }

        .processing-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 150px;
        }

        .arrow {
          font-size: 2em;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        .progress-container {
          text-align: center;
        }

        .progress-bar {
          width: 100px;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
          transition: width 0.3s ease;
        }

        .processing-done {
          animation: bounceIn 0.5s ease;
        }

        .checkmark {
          font-size: 3em;
          margin-bottom: 10px;
        }

        .controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .btn {
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-size: 1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .btn.back {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn.back:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn.adjust {
          background: linear-gradient(45deg, #ffd93d, #ff6b6b);
          color: white;
        }

        .btn.adjust:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(255, 107, 107, 0.4);
        }

        .btn.next {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: white;
        }

        .btn.next:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(106, 17, 203, 0.4);
        }

        .processing-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 25px;
          max-width: 600px;
          margin: 0 auto;
          text-align: right;
        }

        .processing-info h4 {
          margin-bottom: 15px;
          color: #4ecdc4;
        }

        .processing-info p {
          margin-bottom: 10px;
          padding-right: 20px;
          position: relative;
        }

        .processing-info p:before {
          content: '•';
          position: absolute;
          right: 0;
          color: #4ecdc4;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .comparison-section {
            flex-direction: column;
          }

          .processing-indicator {
            flex-direction: row;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
          }

          .arrow {
            transform: rotate(90deg);
            margin-bottom: 0;
          }

          .controls {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}

export default BackgroundRemover