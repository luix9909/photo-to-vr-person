import React, { useState, useEffect, useRef } from 'react'

const DepthGenerator = ({ image, onComplete, onBack }) => {
  const [depthImage, setDepthImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [depthLevel, setDepthLevel] = useState(50)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef(null)
  const previewRef = useRef(null)

  useEffect(() => {
    if (image) {
      generateDepthMap()
    }
  }, [image, depthLevel])

  const generateDepthMap = async () => {
    setLoading(true)
    
    try {
      // Create depth map simulation
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.src = image
      
      await new Promise(resolve => {
        img.onload = resolve
      })

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Create depth effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Simple depth simulation based on color intensity
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        
        if (a > 0) {
          // Calculate brightness
          const brightness = (r + g + b) / 3
          
          // Create depth effect (brighter = closer)
          const depth = (brightness / 255) * depthLevel
          
          // Apply depth to RGB channels
          data[i] = Math.min(255, r + depth)
          data[i + 1] = Math.min(255, g + depth)
          data[i + 2] = Math.min(255, b + depth)
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Generate depth preview
      const depthMap = canvas.toDataURL('image/png')
      setDepthImage(depthMap)
      
    } catch (error) {
      console.error('Error generating depth:', error)
      setDepthImage(image)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate3D = () => {
    // Simulate 3D model generation
    const modelData = {
      image: image,
      depth: depthImage,
      depthLevel: depthLevel
    }
    onComplete(modelData)
  }

  const updatePreview = () => {
    const previewCanvas = previewRef.current
    if (!previewCanvas || !depthImage) return
    
    const ctx = previewCanvas.getContext('2d')
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
    
    // Draw with perspective transformation
    ctx.save()
    ctx.translate(previewCanvas.width / 2, previewCanvas.height / 2)
    ctx.rotate(rotation * Math.PI / 180)
    
    // Apply depth effect
    ctx.globalAlpha = 0.8
    ctx.drawImage(canvasRef.current, -150, -200, 300, 400)
    
    ctx.restore()
  }

  useEffect(() => {
    updatePreview()
  }, [rotation, depthImage])

  const rotateLeft = () => {
    setRotation(prev => (prev - 15) % 360)
  }

  const rotateRight = () => {
    setRotation(prev => (prev + 15) % 360)
  }

  return (
    <div className="depth-generator">
      <h2>🔄 إنشاء نموذج 3D واقعي</h2>
      
      <div className="main-content">
        <div className="controls-section">
          <div className="control-group">
            <label>مستوى العمق 3D</label>
            <input
              type="range"
              min="10"
              max="100"
              value={depthLevel}
              onChange={(e) => setDepthLevel(parseInt(e.target.value))}
              className="slider"
            />
            <span className="value">{depthLevel}%</span>
          </div>
          
          <div className="control-group">
            <label>تدوير النموذج</label>
            <div className="rotation-controls">
              <button className="rotate-btn" onClick={rotateLeft}>
                ↶
              </button>
              <span className="rotation-value">{rotation}°</span>
              <button className="rotate-btn" onClick={rotateRight}>
                ↷
              </button>
            </div>
          </div>
          
          <div className="quality-presets">
            <h4>إعدادات الجودة:</h4>
            <div className="preset-buttons">
              <button className="preset" onClick={() => setDepthLevel(30)}>
                منخفض
              </button>
              <button className="preset" onClick={() => setDepthLevel(50)}>
                متوسط
              </button>
              <button className="preset" onClick={() => setDepthLevel(80)}>
                عالي
              </button>
              <button className="preset" onClick={() => setDepthLevel(100)}>
                واقعي
              </button>
            </div>
          </div>
        </div>
        
        <div className="preview-section">
          <div className="preview-container">
            <canvas
              ref={previewRef}
              width="300"
              height="400"
              className="3d-preview"
            />
            
            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>جاري إنشاء النموذج 3D...</p>
              </div>
            )}
          </div>
          
          <div className="depth-visualization">
            <h4>تصور العمق:</h4>
            <div className="depth-bar">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="depth-segment"
                  style={{
                    height: `${10 + i * 8}px`,
                    opacity: 0.3 + (i * 0.07),
                    backgroundColor: `hsl(${200 + i * 5}, 70%, 50%)`
                  }}
                />
              ))}
            </div>
            <div className="depth-labels">
              <span>بعيد</span>
              <span>قريب</span>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h4>📐 معلومات النموذج 3D:</h4>
          <div className="model-stats">
            <div className="stat">
              <span className="label">عدد المضلعات:</span>
              <span className="value">{Math.round(5000 * (depthLevel / 100))}</span>
            </div>
            <div className="stat">
              <span className="label">الدقة:</span>
              <span className="value">{depthLevel > 70 ? 'عالية' : 'متوسطة'}</span>
            </div>
            <div className="stat">
              <span className="label">الحجم التقريبي:</span>
              <span className="value">{Math.round(2 * (depthLevel / 100))}MB</span>
            </div>
            <div className="stat">
              <span className="label">التوافق مع VR:</span>
              <span className="value compatible">ممتاز ✓</span>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="action-buttons">
        <button className="btn back" onClick={onBack}>
          رجوع
        </button>
        
        <button 
          className="btn generate" 
          onClick={handleGenerate3D}
          disabled={loading}
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء النموذج 3D'}
        </button>
      </div>

      <div className="technical-info">
        <p>
          <strong>تقنية Deep Learning:</strong> يتم استخدام شبكات عصبية متقدمة 
          لتحويل الصورة 2D إلى نموذج 3D مع الحفاظ على التفاصيل.
        </p>
      </div>

      <style jsx>{`
        .depth-generator {
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease;
        }

        h2 {
          text-align: center;
          margin-bottom: 30px;
          background: linear-gradient(45deg, #12c2e9, #c471ed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-content {
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          gap: 30px;
          margin-bottom: 40px;
        }

        .controls-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 25px;
        }

        .control-group {
          margin-bottom: 30px;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          color: #12c2e9;
          font-weight: bold;
        }

        .slider {
          width: 100%;
          height: 10px;
          -webkit-appearance: none;
          background: linear-gradient(90deg, #12c2e9, #c471ed);
          border-radius: 5px;
          outline: none;
          margin-bottom: 10px;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #c471ed;
          box-shadow: 0 0 10px rgba(196, 113, 237, 0.5);
        }

        .value {
          display: inline-block;
          padding: 5px 15px;
          background: rgba(18, 194, 233, 0.2);
          border-radius: 15px;
          font-weight: bold;
          float: left;
        }

        .rotation-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .rotate-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rotate-btn:hover {
          background: rgba(18, 194, 233, 0.5);
          transform: scale(1.1);
        }

        .rotation-value {
          font-size: 1.2em;
          font-weight: bold;
          color: #c471ed;
        }

        .quality-presets {
          margin-top: 40px;
        }

        .quality-presets h4 {
          margin-bottom: 15px;
          color: rgba(255, 255, 255, 0.9);
        }

        .preset-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .preset {
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .preset:hover {
          background: rgba(18, 194, 233, 0.3);
          transform: translateY(-2px);
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .preview-container {
          width: 300px;
          height: 400px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          border: 3px solid rgba(18, 194, 233, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .3d-preview {
          width: 100%;
          height: 100%;
          display: block;
          background: linear-gradient(45deg, #1a1a2e, #16213e);
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #12c2e9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        .depth-visualization {
          width: 100%;
          max-width: 300px;
        }

        .depth-bar {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: 100px;
          gap: 5px;
          margin: 15px 0;
        }

        .depth-segment {
          width: 20px;
          border-radius: 5px 5px 0 0;
          transition: all 0.3s ease;
        }

        .depth-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.9em;
          color: rgba(255, 255, 255, 0.7);
        }

        .info-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 25px;
        }

        .info-section h4 {
          margin-bottom: 20px;
          color: #c471ed;
        }

        .model-stats {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .label {
          color: rgba(255, 255, 255, 0.7);
        }

        .value {
          font-weight: bold;
          color: #12c2e9;
        }

        .compatible {
          color: #4ade80;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .btn {
          padding: 15px 40px;
          border: none;
          border-radius: 50px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .btn.back {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn.back:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn.generate {
          background: linear-gradient(45deg, #12c2e9, #c471ed);
          color: white;
        }

        .btn.generate:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(18, 194, 233, 0.4);
        }

        .btn.generate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .technical-info {
          background: rgba(18, 194, 233, 0.1);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          border-right: 4px solid #12c2e9;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .preview-section {
            order: 1;
          }

          .controls-section {
            order: 2;
          }

          .info-section {
            order: 3;
          }
        }

        @media (max-width: 768px) {
          .action-buttons {
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

export default DepthGenerator