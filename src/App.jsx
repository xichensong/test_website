import { Suspense, useEffect, useRef, useState } from 'react'
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

function BananaModel() {
  const { scene } = useGLTF('/models/bananas_4k.glb')

  return (
    <group rotation={[0.06, 0, -0.16]} scale={5.8}>
      <Center>
        <primitive object={scene} />
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
      <Canvas frameloop="demand" camera={{ fov: 30, near: 0.1, far: 100 }}>
        <BananaCamera />
        <ambientLight intensity={1.6} />
        <directionalLight position={[4, -5, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} />
        <Suspense fallback={null}>
          <BananaModel />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const artRef = useRef(null)
  const pantryRef = useRef(null)
  const [wordmarkProgress, setWordmarkProgress] = useState(0)
  const [bananaProgress, setBananaProgress] = useState(0)
  const [wordmarkLayout, setWordmarkLayout] = useState({
    left: 0,
    top: 0,
    size: 80,
  })

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
    const updateBanana = () => {
      const pantry = pantryRef.current
      if (!pantry) return

      const rect = pantry.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const enterStart = viewportHeight * 0.86
      const enterEnd = viewportHeight * 0.48
      const exitStart = viewportHeight * 0.26
      const exitEnd = -rect.height * 0.12
      const entering = (enterStart - rect.top) / (enterStart - enterEnd)
      const exiting = (rect.top - exitEnd) / (exitStart - exitEnd)
      const progress = Math.min(
        Math.max(entering, 0),
        Math.max(exiting, 0),
        1,
      )

      setBananaProgress(progress)
    }

    updateBanana()
    window.addEventListener('scroll', updateBanana, { passive: true })
    window.addEventListener('resize', updateBanana)
    return () => {
      window.removeEventListener('scroll', updateBanana)
      window.removeEventListener('resize', updateBanana)
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
      const renderedHeight = art.naturalHeight * imageScale
      const offsetY = (heroRect.height - renderedHeight) / 2
      const left = 860 * imageScale
      const top = offsetY + 820 * imageScale
      const availableWidth = Math.max(heroRect.width - left - 24, 80)
      const size = Math.min(154 * imageScale, availableWidth / 5.9)

      setWordmarkLayout({
        left,
        top,
        size: Math.max(size, 20),
      })
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
                category.title === 'Pantry and Quick Meals' ? ' pantry-section' : ''
              }`}
              key={category.title}
              ref={category.title === 'Pantry and Quick Meals' ? pantryRef : null}
            >
              {category.title === 'Pantry and Quick Meals' && (
                <BananaDisplay progress={bananaProgress} />
              )}
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
