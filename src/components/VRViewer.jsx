import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const VRViewer = ({ image, depthMap, isPassthrough, onExit }) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelRef = useRef(null)
  const [isInVR, setIsInVR] = useState(false)
  const [controlsEnabled, setControlsEnabled] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: isPassthrough
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.xr.enabled = true
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create 3D model from image
    create3DModel(image)

    // Add VR controls
    setupVRControls()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      if (modelRef.current && controlsEnabled) {
        // Gentle rotation
        modelRef.current.rotation.y += 0.005
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Handle VR session
    const handleVRSessionStart = () => {
      setIsInVR(true)
      document.body.requestFullscreen()
    }

    const handleVRSessionEnd = () => {
      setIsInVR(false)
    }

    renderer.xr.addEventListener('sessionstart', handleVRSessionStart)
    renderer.xr.addEventListener('sessionend', handleVRSessionEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.xr.removeEventListener('sessionstart', handleVRSessionStart)
      renderer.xr.removeEventListener('sessionend', handleVRSessionEnd)
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
    }
  }, [image, isPassthrough])

  useEffect(() => {
    if (sceneRef.current && rendererRef.current) {
      rendererRef.current.setClearAlpha(isPassthrough ? 0 : 1)
      sceneRef.current.background = isPassthrough ? null : new THREE.Color(0x1a1a2e)
    }
  }, [isPassthrough])

  const create3DModel = (imgSrc) => {
    if (!sceneRef.current) return

    // Remove existing model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current)
    }

    // Create texture from image
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imgSrc, (texture) => {
      // Create geometry with depth
      const geometry = new THREE.PlaneGeometry(3, 4, 32, 32)
      
      // Create material with texture
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
      })

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 0, 0)
      
      sceneRef.current.add(mesh)
      modelRef.current = mesh
    })
  }

  const setupVRControls = () => {
    if (!rendererRef.current) return

    // Add VR button
    const vrButton = document.createElement('button')
    vrButton.textContent = '🚀 دخول VR'
    vrButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 30px;
      background: linear-gradient(45deg, #6a11cb, #2575fc);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 1.1em;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `
    vrButton.onclick = () => {
      if (rendererRef.current.xr) {
        rendererRef.current.xr.setSession(navigator.xr.requestSession('immersive-vr'))
      }
    }
    document.body.appendChild(vrButton)
  }

  const handleRotate = (direction) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += direction * Math.PI / 8
    }
  }

  const handleZoom = (direction) => {
    if (cameraRef.current) {
      cameraRef.current.position.z += direction
    }
  }

  const toggleControls = () => {
    setControlsEnabled(!controlsEnabled)
  }

  return (
    <div className="vr-viewer">
      <div ref={mountRef} className="vr-canvas" />
      
      {!isInVR && (
        <div className="vr-controls-overlay">
          <div className="controls-panel">
            <h3>🎮 أدوات التحكم في VR</h3>
            
            <div className="control-group">
              <button 
                className="control-btn rotate-left"
                onClick={() => handleRotate(-1)}
              >
                ↶ تدوير لليسار
              </button>
              <button 
                className="control-btn rotate-right"
                onClick={() => handleRotate(1)}
              >
                تدوير لليمين ↷
              </button>
            </div>
            
            <div className="control-group">
              <button 
                className="control-btn zoom-in"
                onClick={() => handleZoom(-0.5)}
              >
                + تكبير
              </button>
              <button 
                className="control-btn zoom-out"
                onClick={() => handleZoom(0.5)}
              >
                - تصغير
              </button>
            </div>
            
            <div className="control-group">
              <button 
                className="control-btn toggle-rotate"
                onClick={toggleControls}
              >
                {controlsEnabled ? '⏸ إيقاف الدوران' : '▶ استئناف الدوران'}
              </button>
            </div>
            
            <div className="vr-instructions">
              <h4>تعليمات VR:</h4>
              <ul>
                <li>استخدم زر VR لدخول الوضع الغامر</li>
                <li>حرك رأسك للنظر حول النموذج</li>
                <li>في الوضع Passthrough سترى بيئتك الحقيقية</li>
                <li>اضغط ESC للخروج من VR</li>
              </ul>
            </div>
            
            <button className="exit-btn" onClick={onExit}>
              خروج من VR
            </button>
          </div>
          
          <div className="status-indicator">
            <div className={`status-dot ${isPassthrough ? 'passthrough' : 'vr'}`} />
            <span>
              {isPassthrough ? 'وضع Passthrough' : 'وضع VR'} | 
              {isInVR ? ' في VR' : ' معاينة'}
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .vr-viewer {
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .vr-canvas {
          width: 100%;
          height: 100%;
        }

        .vr-controls-overlay {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          pointer-events: none;
        }

        .controls-panel {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          width: 350px;
          pointer-events: auto;
          border: 1px solid rgba(106, 17, 203, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        h3 {
          margin-bottom: 20px;
          text-align: center;
          color: #6a11cb;
          font-size: 1.4em;
        }

        .control-group {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .control-btn {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .control-btn:hover {
          background: rgba(106, 17, 203, 0.5);
          transform: translateY(-2px);
        }

        .rotate-left { border-left: 3px solid #ff6b6b; }
        .rotate-right { border-left: 3px solid #4ecdc4; }
        .zoom-in { border-left: 3px solid #12c2e9; }
        .zoom-out { border-left: 3px solid #ffd93d; }
        .toggle-rotate { border-left: 3px solid #c471ed; }

        .vr-instructions {
          margin-top: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          text-align: right;
        }

        .vr-instructions h4 {
          margin-bottom: 10px;
          color: #2575fc;
        }

        .vr-instructions ul {
          list-style: none;
          padding: 0;
        }

        .vr-instructions li {
          margin-bottom: 8px;
          padding-right: 20px;
          position: relative;
          font-size: 0.9em;
          opacity: 0.9;
        }

        .vr-instructions li:before {
          content: '•';
          position: absolute;
          right: 0;
          color: #6a11cb;
        }

        .exit-btn {
          width: 100%;
          padding: 15px;
          margin-top: 20px;
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .exit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .status-indicator {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          pointer-events: auto;
          backdrop-filter: blur(5px);
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.vr {
          background: #6a11cb;
          box-shadow: 0 0 10px #6a11cb;
        }

        .status-dot.passthrough {
          background: #12c2e9;
          box-shadow: 0 0 10px #12c2e9;
        }

        .status-indicator span {
          font-size: 0.9em;
          color: rgba(255, 255, 255, 0.9);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .controls-panel {
            width: calc(100vw - 40px);
            max-width: 300px;
            padding: 15px;
          }

          .control-group {
            flex-direction: column;
          }

          .status-indicator {
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 40px);
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default VRViewer