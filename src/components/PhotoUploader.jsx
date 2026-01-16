import React, { useRef, useState } from 'react'

const PhotoUploader = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="photo-uploader">
      <h1>🌟 رفع صورة الشخص</h1>
      <p className="subtitle">اسحب وأفلت صورة أو انقر لاختيار صورة</p>
      
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="معاينة" className="preview-image" />
            <div className="change-photo">تغيير الصورة</div>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <p className="upload-text">انقر أو اسحب الصورة هنا</p>
            <p className="upload-hint">يفضل صور واضحة للوجه والجسم</p>
          </>
        )}
      </div>

      <div className="requirements">
        <h3>📋 متطلبات الصورة:</h3>
        <ul>
          <li>صورة واضحة للشخص</li>
          <li>خلفية بسيطة (لنتيجة أفضل)</li>
          <li>الدقة الموصى بها: 1080x1350 بكسل</li>
          <li>الصيغ المدعومة: JPG, PNG, WebP</li>
        </ul>
      </div>

      <style jsx>{`
        .photo-uploader {
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 30px;
          font-size: 1.1em;
        }

        .upload-area {
          width: 500px;
          max-width: 90%;
          height: 400px;
          margin: 0 auto 30px;
          border: 3px dashed rgba(106, 17, 203, 0.5);
          border-radius: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        .upload-area:hover {
          border-color: #6a11cb;
          background: rgba(106, 17, 203, 0.1);
          transform: translateY(-5px);
        }

        .upload-area.drag-over {
          border-color: #2575fc;
          background: rgba(37, 117, 252, 0.2);
          transform: scale(1.02);
        }

        .upload-area.has-preview {
          border-style: solid;
          padding: 0;
        }

        .upload-icon {
          color: #6a11cb;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .upload-text {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .upload-hint {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9em;
        }

        .preview-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .change-photo {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .change-photo:hover {
          background: rgba(106, 17, 203, 0.9);
        }

        .requirements {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
          text-align: right;
        }

        .requirements h3 {
          margin-bottom: 15px;
          color: #6a11cb;
        }

        .requirements ul {
          list-style: none;
          padding: 0;
        }

        .requirements li {
          margin-bottom: 10px;
          padding-right: 25px;
          position: relative;
        }

        .requirements li:before {
          content: '✓';
          position: absolute;
          right: 0;
          color: #6a11cb;
          font-weight: bold;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.8em;
          }

          .upload-area {
            height: 300px;
          }
        }
      `}</style>
    </div>
  )
}

export default PhotoUploader