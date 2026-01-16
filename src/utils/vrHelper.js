// VR helper utilities

class VRHelper {
  constructor() {
    this.isVRSupported = false
    this.isARSupported = false
    this.currentSession = null
    this.checkSupport()
  }

  async checkSupport() {
    if (navigator.xr) {
      this.isVRSupported = await navigator.xr.isSessionSupported('immersive-vr')
      this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar')
    }
  }

  async enterVR(renderer) {
    if (!this.isVRSupported) {
      alert('VR غير مدعوم في متصفحك. جرب Chrome أو Firefox')
      return false
    }

    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor']
      })
      
      this.currentSession = session
      await renderer.xr.setSession(session)
      
      return true
    } catch (error) {
      console.error('Failed to enter VR:', error)
      return false
    }
  }

  async enterAR(renderer) {
    if (!this.isARSupported) {
      alert('AR غير مدعوم في جهازك')
      return false
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar')
      this.currentSession = session
      await renderer.xr.setSession(session)
      
      return true
    } catch (error) {
      console.error('Failed to enter AR:', error)
      return false
    }
  }

  exitVR() {
    if (this.currentSession) {
      this.currentSession.end()
      this.currentSession = null
    }
  }

  setupController(renderer, scene) {
    if (!renderer.xr) return

    const controller1 = renderer.xr.getController(0)
    const controller2 = renderer.xr.getController(1)
    
    // Add controller models
    const controllerModel1 = this.createControllerModel()
    const controllerModel2 = this.createControllerModel()
    
    controller1.add(controllerModel1)
    controller2.add(controllerModel2)
    
    scene.add(controller1)
    scene.add(controller2)

    // Add controller event listeners
    controller1.addEventListener('selectstart', () => this.onSelectStart(0))
    controller1.addEventListener('selectend', () => this.onSelectEnd(0))
    
    controller2.addEventListener('selectstart', () => this.onSelectStart(1))
    controller2.addEventListener('selectend', () => this.onSelectEnd(1))
  }

  createControllerModel() {
    const geometry = new THREE.CylinderGeometry(0.005, 0.02, 0.1, 8)
    geometry.rotateX(Math.PI / 2)
    
    const material = new THREE.MeshBasicMaterial({
      color: 0x4444ff
    })
    
    return new THREE.Mesh(geometry, material)
  }

  onSelectStart(controllerIndex) {
    console.log(`Controller ${controllerIndex} select start`)
    // Handle controller selection
  }

  onSelectEnd(controllerIndex) {
    console.log(`Controller ${controllerIndex} select end`)
    // Handle controller deselection
  }

  createPassthroughScene() {
    // Create a scene with transparent background for passthrough
    const scene = new THREE.Scene()
    scene.background = null
    return scene
  }

  addTeleportation(renderer, camera) {
    // Add teleportation functionality
    const teleportGeometry = new THREE.RingGeometry(0.1, 0.12, 32)
    const teleportMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    
    const teleportRing = new THREE.Mesh(teleportGeometry, teleportMaterial)
    teleportRing.rotation.x = -Math.PI / 2
    teleportRing.visible = false
    
    return teleportRing
  }

  setupRoom() {
    // Create a simple room for VR
    const room = new THREE.Group()
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    room.add(floor)
    
    // Walls
    const wallGeometry = new THREE.PlaneGeometry(10, 3)
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.7
    })
    
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial)
    backWall.position.z = -5
    backWall.receiveShadow = true
    room.add(backWall)
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
    leftWall.position.x = -5
    leftWall.rotation.y = Math.PI / 2
    leftWall.receiveShadow = true
    room.add(leftWall)
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
    rightWall.position.x = 5
    rightWall.rotation.y = -Math.PI / 2
    rightWall.receiveShadow = true
    room.add(rightWall)
    
    return room
  }

  addLighting(scene) {
    // Add VR-optimized lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)
    
    return { ambientLight, directionalLight }
  }

  optimizeForVR(renderer, scene) {
    // Optimize performance for VR
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Enable anti-aliasing for better quality
    renderer.antialias = true
    
    // Set pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Optimize scene
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
        
        // Simplify geometry for better performance
        if (object.geometry) {
          object.geometry.computeVertexNormals()
        }
      }
    })
  }

  createLoadingManager() {
    // Create loading manager with progress tracking
    const loadingManager = new THREE.LoadingManager()
    
    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}`)
      console.log(`Progress: ${itemsLoaded}/${itemsTotal}`)
    }
    
    loadingManager.onLoad = () => {
      console.log('Loading complete!')
    }
    
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100
      console.log(`Loading: ${progress.toFixed(2)}%`)
    }
    
    loadingManager.onError = (url) => {
      console.error(`Error loading: ${url}`)
    }
    
    return loadingManager
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      isOculus: /Oculus/i.test(navigator.userAgent),
      isHTCVive: /Vive/i.test(navigator.userAgent),
      supportsWebXR: !!navigator.xr,
      // Add more device detection as needed
    }
  }

  calculatePerformanceScore() {
    // Calculate performance score for optimization
    const memory = performance.memory
    const score = {
      fps: 0,
      memory: memory ? memory.usedJSHeapSize : 0,
      triangles: 0,
      drawCalls: 0
    }
    
    return score
  }

  // Utility function to convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  // Utility function to convert radians to degrees
  toDegrees(radians) {
    return radians * (180 / Math.PI)
  }

  // Calculate distance between two 3D points
  distanceBetween(point1, point2) {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    const dz = point2.z - point1.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  // Generate unique ID for objects
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// Create singleton instance
const vrHelper = new VRHelper()

export default vrHelper