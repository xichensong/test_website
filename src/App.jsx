import { useEffect, useRef, useState } from 'react'
import './App.css'

const categories = [
  {
    title: 'Liquor',
    items: [
      'Beer',
      'Wine',
      'Mixers',
      'Hard seltzer',
      'Malt beverages',
    ],
    featureTitle: 'A neighborhood liquor stop since 2018.',
    featureText:
      'Liquor is one of Mela Market’s focus areas, with beer, wine, hard seltzers, malt beverages, and ready-to-drink options stocked for quick runs, gatherings, and regular neighborhood customers.',
    groups: [
      {
        label: 'Wine',
        items: [
          'Sutter Home 1.5 oz',
          'Black Box Pinot Grigio 3L',
          'Sutter Home Pink Moscato 187 ml',
          'Yellow Tail',
        ],
      },
      {
        label: 'Beer and Ready-to-Drink',
        items: [
          'Steel Reserve 40 oz NR',
          'White Claw Surge 2/12 cans',
          'Heineken Original 24 oz can',
          'Smirnoff Ice 4/6 NR 12 oz',
          'Stella Artois 25 fl oz can',
        ],
      },
    ],
    text: 'A dedicated beer and wine stop with familiar bottles, large-format options, cans, hard seltzers, and ready-to-drink favorites.',
  },
  {
    title: 'Snacks, Drinks and Tobacco',
    items: [
      'Chips',
      'Cigarettes',
      'Soda',
      'Juice',
      'Water',
      'Energy drinks',
      'Iced tea',
      'Candy',
      'Gum',
      'Cookies',
      'Crackers',
      'Nuts',
      'Chocolate',
    ],
    text: 'Grab-and-go snacks, tobacco products, and everyday drinks kept simple for fast neighborhood errands.',
  },
  {
    title: 'Pantry and Quick Meals',
    items: [
      'Noodles',
      'Cooking foods',
      'Pasta',
      'Rice',
      'Canned foods',
      'Sauces',
      'Spices',
      'Coffee',
      'Tea',
    ],
    text: 'Shelf-stable basics for easy meals, from pasta and noodles to cooking ingredients that help finish dinner.',
  },
  {
    title: 'Home and Dairy Basics',
    items: [
      'Dairy',
      'Detergents',
      'Milk',
      'Eggs',
      'Butter',
      'Cheese',
      'Paper goods',
      'Cleaning sprays',
      'Soap',
    ],
    text: 'Daily home essentials, including dairy for the fridge and detergents for the household.',
  },
]

function ModelImageDisplay({
  className,
  progress,
  progressProperty = '--section-model-progress',
  src,
  alt,
}) {
  return (
    <div
      className={className}
      aria-label={alt}
      style={{ [progressProperty]: progress }}
    >
      <img src={src} alt="" aria-hidden="true" />
    </div>
  )
}

function BananaDisplay({ progress }) {
  return (
    <ModelImageDisplay
      className="banana-display"
      progress={progress}
      progressProperty="--banana-progress"
      src="/models/banana-snapshot.png"
      alt="Banana product image"
    />
  )
}

function WineDisplay({ progress }) {
  return (
    <ModelImageDisplay
      className="section-model-display wine-display"
      progress={progress}
      src="/models/wine-snapshot.png"
      alt="Wine bottles product image"
    />
  )
}

function SnackDisplay({ progress }) {
  return (
    <ModelImageDisplay
      className="section-model-display snack-display"
      progress={progress}
      src="/models/snack-snapshot.png"
      alt="Packaged food product image"
    />
  )
}

function CleanerDisplay({ progress }) {
  return (
    <ModelImageDisplay
      className="section-model-display cleaner-display"
      progress={progress}
      src="/models/cleaner-snapshot.png"
      alt="Cleaner product image"
    />
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

function getLiquorProgress(section) {
  if (!section) return 0

  const rect = section.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const enterStart = viewportHeight * 0.94
  const enterEnd = viewportHeight * 0.5
  const exitStart = -rect.height * 0.58
  const exitEnd = -rect.height * 0.92
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
      setWineProgress(getLiquorProgress(drinksRef.current))
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
        size = Math.max(36, Math.min(52, (heroRect.width - 48) / 6.4))
        left = Math.max(18, (heroRect.width - size * 6.4) / 2)
        top = heroRect.height * 0.81
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
            <span className="desktop-wordmark">
              <span className="sr-only">M</span>
              <span aria-hidden="true">ela Market</span>
            </span>
            <span className="mobile-wordmark">Mela Market</span>
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
                category.title === 'Liquor'
                  ? ' liquor-section'
                  : category.title === 'Snacks, Drinks and Tobacco'
                    ? ' snacks-section'
                  : category.title === 'Pantry and Quick Meals'
                    ? ' pantry-section'
                  : category.title === 'Home and Dairy Basics'
                    ? ' home-section'
                    : ''
              }`}
              key={category.title}
              ref={
                category.title === 'Liquor'
                  ? drinksRef
                  : category.title === 'Snacks, Drinks and Tobacco'
                    ? snacksRef
                  : category.title === 'Pantry and Quick Meals'
                    ? pantryRef
                  : category.title === 'Home and Dairy Basics'
                    ? homeRef
                    : null
              }
            >
              {category.title === 'Liquor' && wineProgress > 0 && (
                <WineDisplay progress={wineProgress} />
              )}
              {category.title === 'Snacks, Drinks and Tobacco' && snackProgress > 0 && (
                <SnackDisplay progress={snackProgress} />
              )}
              {category.title === 'Pantry and Quick Meals' && bananaProgress > 0 && (
                <BananaDisplay progress={bananaProgress} />
              )}
              {category.title === 'Home and Dairy Basics' && cleanerProgress > 0 && (
                <CleanerDisplay progress={cleanerProgress} />
              )}
              <div>
                <p className="eyebrow">Mela Market</p>
                <h2>{category.title}</h2>
                {category.featureTitle && (
                  <section className="liquor-feature">
                    <h3>{category.featureTitle}</h3>
                    <p>{category.featureText}</p>
                  </section>
                )}
              </div>
              <div>
                <p>{category.text}</p>
                <ul>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {category.groups && (
                  <div className="featured-goods">
                    <p className="featured-note">Items include and are not limited to:</p>
                    {category.groups.map((group) => (
                      <section key={group.label}>
                        <h3>{group.label}</h3>
                        <ul>
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="market-footer" aria-label="Mela Market contact information">
        <div className="footer-heading">
          <p className="eyebrow">Visit Mela Market</p>
          <h2>Stop by or call ahead.</h2>
        </div>
        <div className="footer-details">
          <address>
            <span>8711 1st Ave</span>
            <span>Silver Spring, MD 20910</span>
          </address>
          <a href="tel:+13015851051">(301) 585-1051</a>
          <div className="hours-list" aria-label="Store hours">
            <p>
              <span>Monday, Tuesday, Thursday</span>
              <span>12PM-9:30PM</span>
            </p>
            <p>
              <span>Wednesday, Saturday</span>
              <span>12PM-10PM</span>
            </p>
            <p>
              <span>Sunday</span>
              <span>12PM-8PM</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
