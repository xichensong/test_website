import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import './App.css'

const categories = [
  {
    title: 'Drinks and Alcohol',
    items: ['Beer', 'Wine', 'Soda', 'Juice'],
    text: 'Cold drinks for a quick stop, party run, or dinner at home, with beer and wine alongside everyday sodas and juices.',
  },
  {
    title: 'Snacks and Tobacco',
    items: ['Chips', 'Cigarettes'],
    text: 'Grab-and-go snacks and tobacco products kept simple for fast neighborhood errands.',
  },
  {
    title: 'Pantry and Quick Meals',
    items: ['Noodles', 'Cooking foods', 'Pasta'],
    text: 'Shelf-stable basics for easy meals, from pasta and noodles to cooking ingredients that help finish dinner.',
  },
  {
    title: 'Home and Dairy Basics',
    items: ['Dairy', 'Detergents'],
    text: 'Daily home essentials, including dairy for the fridge and detergents for the household.',
  },
]

const canvasSettings = {
  dpr: [1, 1.25],
  frameloop: 'demand',
  gl: {
    alpha: true,
    antialias: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'high-performance',
  },
}

class ModelErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('3D model failed to render:', error)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function handleCanvasCreated({ gl }) {
  gl.setClearAlpha(0)
  gl.domElement.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault()
    },
    false,
  )
}

function SafeModelCanvas({ camera, children }) {
  return (
    <ModelErrorBoundary>
      <Canvas
        {...canvasSettings}
        camera={camera}
        onCreated={handleCanvasCreated}
      >
        {children}
      </Canvas>
    </ModelErrorBoundary>
  )
}

function disposeMaterial(material) {
  const materials = Array.isArray(material) ? material : [material]

  materials.filter(Boolean).forEach((item) => {
    Object.values(item).forEach((value) => {
      if (value?.isTexture) value.dispose()
    })
    item.dispose?.()
  })
}

function useClearModel(url, scene) {
  const modelScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    return () => {
      modelScene.traverse((object) => {
        object.geometry?.dispose()
        disposeMaterial(object.material)
      })
    }
  }, [modelScene, url])

  return modelScene
}

function BananaModel() {
  const modelUrl = '/models/bananas_4k.glb'
  const { scene } = useGLTF(modelUrl)
  const modelScene = useClearModel(modelUrl, scene)

  return (
    <group rotation={[0.06, 0, -0.16]} scale={5.8}>
      <Center>
        <primitive object={modelScene} />
      </Center>
    </group>
  )
}

function BananaCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, -5.6, 1.35)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function BananaDisplay({ progress }) {
  return (
    <div
      className="banana-display"
      aria-label="3D banana model"
      style={{ '--banana-progress': progress }}
    >
      <SafeModelCanvas camera={{ fov: 30, near: 0.1, far: 100 }}>
        <BananaCamera />
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, -5, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} />
        <Suspense fallback={null}>
          <BananaModel />
        </Suspense>
      </SafeModelCanvas>
    </div>
  )
}

function WineModel() {
  const modelUrl = '/models/wine_bottles_01_4k-v3.glb'
  const { scene } = useGLTF(modelUrl)
  const modelScene = useClearModel(modelUrl, scene)

  return (
    <group rotation={[0, 0, 0]} scale={5.2}>
      <Center>
        <primitive object={modelScene} />
      </Center>
    </group>
  )
}

function WineCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 6.2)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function WineDisplay({ progress }) {
  return (
    <div
      className="section-model-display wine-display"
      aria-label="3D wine bottles model"
      style={{ '--section-model-progress': progress }}
    >
      <SafeModelCanvas camera={{ fov: 28, near: 0.1, far: 100 }}>
        <WineCamera />
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, -5, 6]} intensity={2.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.75} />
        <Suspense fallback={null}>
          <WineModel />
        </Suspense>
      </SafeModelCanvas>
    </div>
  )
}

function SnackModel() {
  const modelUrl = '/models/long_life_food_4k.glb'
  const { scene } = useGLTF(modelUrl)
  const modelScene = useClearModel(modelUrl, scene)

  return (
    <group rotation={[0, 0, 0]} scale={5.1}>
      <Center>
        <primitive object={modelScene} />
      </Center>
    </group>
  )
}

function SnackCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function SnackDisplay({ progress }) {
  return (
    <div
      className="section-model-display snack-display"
      aria-label="3D packaged food model"
      style={{ '--section-model-progress': progress }}
    >
      <SafeModelCanvas camera={{ fov: 30, near: 0.1, far: 100 }}>
        <SnackCamera />
        <ambientLight intensity={1.55} />
        <directionalLight position={[4, -5, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} />
        <Suspense fallback={null}>
          <SnackModel />
        </Suspense>
      </SafeModelCanvas>
    </div>
  )
}

function CleanerModel() {
  const modelUrl = '/models/all_purpose_cleaner_4k.glb'
  const { scene } = useGLTF(modelUrl)
  const modelScene = useClearModel(modelUrl, scene)

  return (
    <group rotation={[0, 0, 0]} scale={5.2}>
      <Center>
        <primitive object={modelScene} />
      </Center>
    </group>
  )
}

function CleanerCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function CleanerDisplay({ progress }) {
  return (
    <div
      className="section-model-display cleaner-display"
      aria-label="3D cleaner bottle model"
      style={{ '--section-model-progress': progress }}
    >
      <SafeModelCanvas camera={{ fov: 30, near: 0.1, far: 100 }}>
        <CleanerCamera />
        <ambientLight intensity={1.55} />
        <directionalLight position={[4, -5, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} />
        <Suspense fallback={null}>
          <CleanerModel />
        </Suspense>
      </SafeModelCanvas>
    </div>
  )
}

function getSectionProgress(section) {
  if (!section) return 0

  const rect = section.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const enterStart = viewportHeight * 0.86
  const enterEnd = viewportHeight * 0.48
  const exitStart = viewportHeight * 0.26
  const exitEnd = -rect.height * 0.12
  const entering = (enterStart - rect.top) / (enterStart - enterEnd)
  const exiting = (rect.top - exitEnd) / (exitStart - exitEnd)

  return Math.min(Math.max(entering, 0), Math.max(exiting, 0), 1)
}

export default function App() {
  const heroRef = useRef(null)
  const artRef = useRef(null)
  const drinksRef = useRef(null)
  const snacksRef = useRef(null)
  const pantryRef = useRef(null)
  const homeRef = useRef(null)
  const [wordmarkProgress, setWordmarkProgress] = useState(0)
  const [wineProgress, setWineProgress] = useState(0)
  const [snackProgress, setSnackProgress] = useState(0)
  const [bananaProgress, setBananaProgress] = useState(0)
  const [cleanerProgress, setCleanerProgress] = useState(0)
  const [wordmarkLayout, setWordmarkLayout] = useState({
    left: 0,
    top: 0,
    size: 80,
  })
  const activeModelTitle = [
    { title: 'Drinks and Alcohol', progress: wineProgress },
    { title: 'Snacks and Tobacco', progress: snackProgress },
    { title: 'Pantry and Quick Meals', progress: bananaProgress },
    { title: 'Home and Dairy Basics', progress: cleanerProgress },
  ].reduce(
    (active, model) => (model.progress > active.progress ? model : active),
    { title: '', progress: 0 },
  ).title

  useEffect(() => {
    const updateWordmark = () => {
      const progress = Math.min(Math.max(window.scrollY / 320, 0), 1)
      setWordmarkProgress(progress)
    }

    updateWordmark()
    window.addEventListener('scroll', updateWordmark, { passive: true })
    return () => window.removeEventListener('scroll', updateWordmark)
  }, [])

  useEffect(() => {
    const updateSectionModels = () => {
      setWineProgress(getSectionProgress(drinksRef.current))
      setSnackProgress(getSectionProgress(snacksRef.current))
      setBananaProgress(getSectionProgress(pantryRef.current))
      setCleanerProgress(getSectionProgress(homeRef.current))
    }

    updateSectionModels()
    window.addEventListener('scroll', updateSectionModels, { passive: true })
    window.addEventListener('resize', updateSectionModels)
    return () => {
      window.removeEventListener('scroll', updateSectionModels)
      window.removeEventListener('resize', updateSectionModels)
    }
  }, [])

  useEffect(() => {
    const updateLayout = () => {
      const hero = heroRef.current
      const art = artRef.current

      if (!hero || !art || !art.naturalWidth || !art.naturalHeight) return

      const heroRect = hero.getBoundingClientRect()
      const imageScale = Math.max(
        heroRect.width / art.naturalWidth,
        heroRect.height / art.naturalHeight,
      )
      const renderedWidth = art.naturalWidth * imageScale
      const renderedHeight = art.naturalHeight * imageScale
      const isMobile = heroRect.width <= 560
      const artOffsetX = isMobile
        ? Math.min(0, heroRect.width * 0.5 - 478 * imageScale)
        : 0
      const offsetY = (heroRect.height - renderedHeight) / 2
      let left = artOffsetX + 860 * imageScale
      let top = offsetY + 875 * imageScale
      let availableWidth = Math.max(heroRect.width - left - 24, 80)
      let size = Math.min(154 * imageScale, availableWidth / 5.9)

      if (isMobile) {
        size = Math.max(30, Math.min(52, (heroRect.width - 128) / 5.9))
        const maxLeft = Math.max(12, heroRect.width - size * 5.9 - 12)
        left = Math.min(Math.max(artOffsetX + 615 * imageScale, 86), maxLeft)
        top = offsetY + 872 * imageScale
      }

      setWordmarkLayout({
        left,
        top,
        size: Math.max(size, 20),
      })

      hero.style.setProperty('--hero-art-offset-x', `${artOffsetX}px`)
      hero.style.setProperty('--hero-art-rendered-width', `${renderedWidth}px`)
    }

    updateLayout()

    const art = artRef.current
    art?.addEventListener('load', updateLayout)
    window.addEventListener('resize', updateLayout)

    const resizeObserver = new ResizeObserver(updateLayout)
    if (heroRef.current) resizeObserver.observe(heroRef.current)

    return () => {
      art?.removeEventListener('load', updateLayout)
      window.removeEventListener('resize', updateLayout)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <main className="site-shell">
      <section
        id="top"
        className="hero"
        aria-label="Mela Market storefront artwork"
        ref={heroRef}
      >
        <img
          className="hero-art"
          src="/mela-market-hero.jpg"
          alt="Black silhouette of an Ethiopian church dome and cross"
          ref={artRef}
        />
        <img
          className="hero-art hero-art-transition"
          src="/second.jpg"
          alt=""
          aria-hidden="true"
          style={{ '--hero-transition-progress': wordmarkProgress }}
        />

        <div
          className="embedded-title"
          aria-label="Mela Market"
          style={{
            '--wordmark-progress': wordmarkProgress,
            '--wordmark-left': `${wordmarkLayout.left}px`,
            '--wordmark-top': `${wordmarkLayout.top}px`,
            '--wordmark-size': `${wordmarkLayout.size}px`,
          }}
        >
          <h1>
            <span className="sr-only">M</span>
            <span aria-hidden="true">ela Market</span>
          </h1>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-grid">
          <div>
            <p className="eyebrow">On the shelves</p>
            <h2>Everyday goods for quick neighborhood runs.</h2>
          </div>
          <p>
            Mela Market keeps the daily stop easy: cold drinks, snacks, pantry
            staples, tobacco products, dairy, and household basics in one place.
          </p>
        </div>
      </section>

      <section className="goods-section">
        <div className="category-list" aria-label="Goods categories">
          {categories.map((category) => (
            <article
              className={`category-section${
                category.title === 'Drinks and Alcohol'
                  ? ' drinks-section'
                  : category.title === 'Snacks and Tobacco'
                    ? ' snacks-section'
                  : category.title === 'Pantry and Quick Meals'
                    ? ' pantry-section'
                  : category.title === 'Home and Dairy Basics'
                    ? ' home-section'
                    : ''
              }`}
              key={category.title}
              ref={
                category.title === 'Drinks and Alcohol'
                  ? drinksRef
                  : category.title === 'Snacks and Tobacco'
                    ? snacksRef
                  : category.title === 'Pantry and Quick Meals'
                    ? pantryRef
                  : category.title === 'Home and Dairy Basics'
                    ? homeRef
                    : null
              }
            >
              {category.title === 'Drinks and Alcohol' &&
                activeModelTitle === category.title &&
                wineProgress > 0 && <WineDisplay progress={wineProgress} />}
              {category.title === 'Snacks and Tobacco' &&
                activeModelTitle === category.title &&
                snackProgress > 0 && <SnackDisplay progress={snackProgress} />}
              {category.title === 'Pantry and Quick Meals' &&
                activeModelTitle === category.title &&
                bananaProgress > 0 && <BananaDisplay progress={bananaProgress} />}
              {category.title === 'Home and Dairy Basics' &&
                activeModelTitle === category.title &&
                cleanerProgress > 0 && <CleanerDisplay progress={cleanerProgress} />}
              <div>
                <p className="eyebrow">Mela Market</p>
                <h2>{category.title}</h2>
              </div>
              <div>
                <p>{category.text}</p>
                <ul>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
