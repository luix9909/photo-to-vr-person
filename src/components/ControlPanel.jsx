import React, { useState } from 'react'

const ControlPanel = ({ onEnterVR, onTogglePassthrough, onReset, isPassthrough }) => {
  const [settings, setSettings] = useState({
    scale: 1.0,
    rotationSpeed: 0.5,
    shadows: true,
    reflection: false,
    ambientLight: 0.6,
    animation: 'gentle'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const animationPresets = [
    { id: 'gentle', name: 'هادئ', icon: '🌊' },
    { id: 'bounce', name: 'مرن', icon: '🏀' },
    { id: 'float', name: 'طافٍ', icon: '☁️' },
    { id: 'none', name: 'بدون حركة', icon: '⏸️' }
  ]

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h3>⚙️ لوحة التحكم</h3>
        <p>اضبط إعدادات العرض في VR</p>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <label>
            <span className="setting-icon">📏</span>
            حجم النموذج
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.scale}
            onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
          />
          <span className="setting-value">{settings.scale.toFixed(1)}x</span>
        </div>

        <div className="setting-group">
          <label>
            <span className="setting-icon">🌀</span>
            سرعة الدوران
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.rotationSpeed}
            onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))}
          />
          <span className="setting-value">{settings.rotationSpeed.toFixed(1)}</span>
        </div>

        <div className="setting-group">
          <label>
            <span className="setting-icon">💡</span>
            إضاءة البيئة
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.ambientLight}
            onChange={(e) => handleSettingChange('ambientLight', parseFloat(e.target.value))}
          />
          <span className="setting-value">{settings.ambientLight.toFixed(1)}</span>
        </div>
      </div>

      <div className="toggle-settings">
        <div className="toggle-group">
          <button
            className={`toggle-btn ${settings.shadows ? 'active' : ''}`}
            onClick={() => handleSettingChange('shadows', !settings.shadows)}
          >
            <span className="toggle-icon">👥</span>
            الظلال
            {settings.shadows && <span className="toggle-check">✓</span>}
          </button>

          <button
            className={`toggle-btn ${settings.reflection ? 'active' : ''}`}
            onClick={() => handleSettingChange('reflection', !settings.reflection)}
          >
            <span className="toggle-icon">✨</span>
            الانعكاسات
            {settings.reflection && <span className="toggle-check">✓</span>}
          </button>

          <button
            className={`toggle-btn ${isPassthrough ? 'active' : ''}`}
            onClick={onTogglePassthrough}
          >
            <span className="toggle-icon">👁️</span>
            Passthrough
            {isPassthrough && <span className="toggle-check">✓</span>}
          </button>
        </div>
      </div>

      <div className="animation-presets">
        <h4>🎭 نمط الحركة:</h4>
        <div className="preset-grid">
          {animationPresets.map(preset => (
            <button
              key={preset.id}
              className={`preset-btn ${settings.animation === preset.id ? 'selected' : ''}`}
              onClick={() => handleSettingChange('animation', preset.id)}
            >
              <span className="preset-icon">{preset.icon}</span>
              <span className="preset-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn vr-btn" onClick={onEnterVR}>
          <span className="btn-icon">👓</span>
          دخول VR
          <span className="btn-sub">تجربة غامرة</span>
        </button>

        <button className="action-btn ar-btn">
          <span className="btn-icon">📱</span>
          تجربة AR
          <span className="btn-sub">عرض في بيئتك</span>
        </button>

        <button className="action-btn share-btn">
          <span className="btn-icon">🔗</span>
          مشاركة
          <span className="btn-sub">رابط مباشر</span>
        </button>

        <button className="action-btn reset-btn" onClick={onReset}>
          <span className="btn-icon">🔄</span>
          بدء من جديد
        </button>
      </div>

      <div className="quick-tips">
        <h4>💡 نصائح سريعة:</h4>
        <ul>
          <li>في VR: حرك رأسك للنظر حول النموذج</li>
          <li>استخدم Passthrough لرؤية البيئة الحقيقية</li>
          <li>اضبط الإضاءة حسب بيئتك</li>
          <li>حفظ الإعدادات للمرة القادمة</li>
        </ul>
      </div>

      <style jsx>{`
        .control-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid rgba(106, 17, 203, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .panel-header h3 {
          font-size: 2em;
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .panel-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1em;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-bottom: 30px;
        }

        .setting-group {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .setting-group label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.9);
        }

        .setting-icon {
          font-size: 1.2em;
        }

        input[type="range"] {
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border-radius: 4px;
          outline: none;
          margin-bottom: 10px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #6a11cb;
          box-shadow: 0 0 10px rgba(106, 17, 203, 0.5);
        }

        .setting-value {
          display: block;
          text-align: center;
          padding: 5px 10px;
          background: rgba(106, 17, 203, 0.2);
          border-radius: 10px;
          font-weight: bold;
          font-size: 0.9em;
          margin-top: 5px;
        }

        .toggle-settings {
          margin-bottom: 30px;
        }

        .toggle-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .toggle-btn {
          flex: 1;
          min-width: 150px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
          position: relative;
        }

        .toggle-btn:hover {
          background: rgba(106, 17, 203, 0.2);
          transform: translateY(-2px);
        }

        .toggle-btn.active {
          background: rgba(106, 17, 203, 0.3);
          border-color: #6a11cb;
          box-shadow: 0 0 20px rgba(106, 17, 203, 0.3);
        }

        .toggle-icon {
          font-size: 1.2em;
        }

        .toggle-check {
          position: absolute;
          top: 5px;
          left: 5px;
          background: #4ade80;
          color: black;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8em;
          font-weight: bold;
        }

        .animation-presets {
          margin-bottom: 30px;
        }

        .animation-presets h4 {
          margin-bottom: 15px;
          text-align: center;
          color: #2575fc;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .preset-btn {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .preset-btn:hover {
          background: rgba(37, 117, 252, 0.2);
          transform: translateY(-3px);
        }

        .preset-btn.selected {
          background: rgba(37, 117, 252, 0.3);
          border-color: #2575fc;
          box-shadow: 0 0 20px rgba(37, 117, 252, 0.3);
        }

        .preset-icon {
          font-size: 1.5em;
        }

        .preset-name {
          font-size: 0.9em;
          font-weight: bold;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .action-btn {
          padding: 20px;
          border: none;
          border-radius: 15px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
          min-height: 100px;
          position: relative;
          overflow: hidden;
        }

        .action-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .action-btn:hover:before {
          transform: translateX(0);
        }

        .vr-btn {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
        }

        .ar-btn {
          background: linear-gradient(45deg, #12c2e9, #c471ed);
        }

        .share-btn {
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
        }

        .reset-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .btn-icon {
          font-size: 2em;
        }

        .btn-sub {
          font-size: 0.8em;
          opacity: 0.9;
          font-weight: normal;
        }

        .quick-tips {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 25px;
          border-right: 4px solid #6a11cb;
        }

        .quick-tips h4 {
          margin-bottom: 15px;
          color: #6a11cb;
          text-align: center;
        }

        .quick-tips ul {
          list-style: none;
          padding: 0;
          text-align: right;
        }

        .quick-tips li {
          margin-bottom: 10px;
          padding-right: 25px;
          position: relative;
          font-size: 0.9em;
          opacity: 0.9;
        }

        .quick-tips li:before {
          content: '💡';
          position: absolute;
          right: 0;
          font-size: 1em;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .preset-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .toggle-group {
            flex-direction: column;
          }

          .toggle-btn {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default ControlPanel