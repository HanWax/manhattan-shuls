import { useEffect, useRef, useState, lazy, Suspense, Component } from 'react'
import type { ReactNode } from 'react'

const ManhattanMap = lazy(() => import('./ManhattanMap'))

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('ManhattanMap failed to load:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="map-section" aria-labelledby="map-heading-fallback">
          <div className="map-section-inner">
            <div className="map-text">
              <p className="section-label">Explore the Journey</p>
              <h2 id="map-heading-fallback" className="section-heading">A&nbsp;Walk Through Manhattan</h2>
              <p className="map-description">
                From Washington Heights to the Financial District, across the Upper West Side
                to the Lower East Side&mdash;the book visits more than twenty synagogues
                across Manhattan&rsquo;s neighborhoods.
              </p>
              <p className="map-count">
                <span className="map-count-number">20+</span>
                <span className="map-count-label">Synagogues explored across Manhattan&rsquo;s neighborhoods</span>
              </p>
            </div>
            <div className="map-container map-container--fallback">
              <div className="map-fallback map-fallback--boundary" role="status">
                <p className="map-fallback-title">Interactive map unavailable</p>
                <p className="map-fallback-text">
                  <a
                    href="https://www.google.com/maps/search/synagogues+manhattan/@40.758,-73.985,12z"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}

function StarDivider() {
  return (
    <div className="star-divider" role="presentation">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <polygon points="20,4 26,18 14,18" stroke="currentColor" strokeWidth="1.2" fill="none" style={{ color: 'var(--gold)' }} />
        <polygon points="20,36 14,22 26,22" stroke="currentColor" strokeWidth="1.2" fill="none" style={{ color: 'var(--gold)' }} />
      </svg>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn()
  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  )
}

function PostcardStamp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="12,2 15,10 9,10" stroke="currentColor" strokeWidth="1" fill="none" />
      <polygon points="12,22 9,14 15,14" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

function Postcard({ tag, stat, quote, children }: {
  tag: string
  stat?: string
  quote?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="postcard">
      <div className="postcard-body">
        <div className="postcard-stamp"><PostcardStamp /></div>
        <div className="postcard-postmark" />
        <p className="postcard-tag">{tag}</p>
        {stat && <p className="postcard-stat">{stat}</p>}
        <p className={quote ? 'postcard-text--quote' : 'postcard-text'}>
          {children}
        </p>
        <p className="postcard-placeholder">Placeholder &mdash; replace with real content</p>
        <div className="postcard-lines">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

function HeroBookImage() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="book-wrapper book-wrapper--fallback" role="img" aria-label="My Year in New York Synagogues — A Personal Guide book cover">
        <div className="book-fallback">
          <span className="book-fallback-eyebrow">A Personal Guide</span>
          <span className="book-fallback-title">My Year in New York <em>Synagogues</em></span>
          <span className="book-fallback-author">Andrew Waxman</span>
        </div>
      </div>
    )
  }

  return (
    <div className="book-wrapper">
      <img
        src="/book-front.jpg"
        alt="My Year in New York Synagogues — A Personal Guide book cover"
        width={1750}
        height={2700}
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export default function App() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">A new book by Andrew Waxman</p>
            <h1 className="hero-title">
              My Year in New York <em>Synagogues</em>
            </h1>
            <p className="hero-subtitle">A Personal Guide</p>
            <p className="hero-tagline">
              Part journal, part guide&mdash;one man&rsquo;s year-long journey through the most
              remarkable concentration of synagogues ever assembled in a single city.
            </p>
            <a href="https://www.amazon.com/s?k=my+year+in+new+york+synagogues+andrew+waxman" target="_blank" rel="noopener noreferrer" className="hero-cta">
              Get Your Copy <ArrowIcon />
            </a>
          </div>
          <div className="hero-book">
            <HeroBookImage />
          </div>
        </div>
      </section>

      <StarDivider />

      {/* ABOUT THE BOOK */}
      <section className="about-book">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">About the Book</p>
            <h2 className="section-heading">A Year of Discovery in<br />New York&rsquo;s Synagogues</h2>
            <div className="about-book-content">
              <div>
                <p>
                  Andrew Waxman had been going to the same New York synagogue for
                  years. But what if he went to a different one each week? And so,
                  with his kids in college, he took his chances.
                </p>
                <p>
                  Part journal, part guide, &ldquo;My Year in New York
                  Synagogues&rdquo; chronicles the many different synagogues Waxman
                  encountered. For those looking for a synagogue in New York to
                  make their home, this book may help.
                </p>
              </div>
              <div>
                <div className="pull-quote">
                  Probably the greatest diversity of synagogues ever assembled in a
                  concentrated single physical location.
                </div>
                <p>
                  For those tired of going to synagogue, they can simply pick up
                  Waxman&rsquo;s book and be transported to the action from their
                  living room.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      <StarDivider />

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">Praise for the Book</p>
            <h2 className="section-heading">What Readers Are Saying</h2>
            <div className="testimonials-grid">
              <figure className="testimonial">
                <blockquote className="testimonial-quote">
                  Every type of synagogue known can be found in the few square
                  miles of Manhattan that flank Central Park. Andrew Waxman&rsquo;s
                  shabbat wandering takes us on a tour of them all. This charming
                  guide takes us into each synagogue and tells us about the
                  community, its approach to Judaism, its building and its history.
                  The variety of Jewish expression is eye opening and Andrew lays
                  it all out for the reader. All readers&mdash;from the regular
                  synagogue goer to the curious non-Jew&mdash;will find much to be
                  learned and enjoyed.
                </blockquote>
                <figcaption className="testimonial-attribution">
                  <span className="testimonial-name">Paul Wachtel</span>
                  <span className="testimonial-title">Professor Emeritus, New York University</span>
                </figcaption>
              </figure>
              <figure className="testimonial">
                <blockquote className="testimonial-quote">
                  This book will rapidly prove to be an indispensable guide for New
                  Yorkers trying to choose a synagogue, as well as tourists with
                  more occasional interests. The author&rsquo;s engaging personal
                  touch is apparent on every page and makes the guide a pleasure
                  to read, much like a well written travel book.
                </blockquote>
                <figcaption className="testimonial-attribution">
                  <span className="testimonial-name">Dr. Yehudah Cohn</span>
                  <span className="testimonial-title">
                    Author of <em>Tangled Up in Text: Tefillin and the Ancient World</em>
                    {' '}(Brown Judaic Studies) and <em>Mine is the Golden Tongue:
                    The Hebrew Sonnets of Immanuel of Rome</em> (CPL Editions)
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* MAP */}
      <MapErrorBoundary>
        <Suspense fallback={<section className="map-section map-section--placeholder" aria-hidden="true" />}>
          <ManhattanMap />
        </Suspense>
      </MapErrorBoundary>

      <StarDivider />

      {/* DID YOU KNOW — POSTCARDS */}
      <section className="discoveries">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">From the Book</p>
            <h2 className="section-heading">Things You&rsquo;ll Discover</h2>
            <div className="discoveries-grid">

              <Postcard tag="The Oldest" stat="1654">
                Congregation Shearith Israel&mdash;the oldest Jewish congregation
                in North America, still active after more than 370&nbsp;years.
              </Postcard>

              <Postcard tag="The Biggest" stat="2,500">
                Seats in one of Manhattan&rsquo;s grandest sanctuaries&mdash;and it still
                fills up on the High Holidays.
              </Postcard>

              <Postcard tag="The Smallest" stat="12">
                Regulars at one of Manhattan&rsquo;s tiniest congregations,
                meeting in a room you&rsquo;d walk right past.
              </Postcard>

              <Postcard tag="The Surprise" quote>
                &ldquo;One synagogue met in what used to be a church, another
                shared space with a yoga studio. You truly never knew
                what you&rsquo;d find behind the next door.&rdquo;
              </Postcard>

              <Postcard tag="The Youngest" stat="2019">
                Manhattan&rsquo;s newest congregation, founded just before
                the pandemic changed everything.
              </Postcard>

              <Postcard tag="The Funniest" quote>
                &ldquo;I showed up in a suit. Everyone else was in shorts.
                I&rsquo;d accidentally found the most laid-back
                shul in all of Manhattan.&rdquo;
              </Postcard>

            </div>
          </div>
        </FadeSection>
      </section>

      <StarDivider />

      {/* ABOUT THE AUTHOR */}
      <section className="about-author">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">About the Author</p>
            <h2 className="section-heading">Andrew Waxman</h2>
            <div className="author-content">
              <div>
                <p>
                  Andrew Waxman grew up in the suburbs of Manchester, England,
                  later living in London, and then New York. He has degrees in
                  history and urban planning from London University.
                </p>
                <p>
                  &ldquo;My Year in New York Synagogues &mdash; A Personal
                  Guide&rdquo; is Mr. Waxman&rsquo;s third book, following
                  &ldquo;Shops and Land&rdquo; and &ldquo;Rogues of Wall Street.&rdquo;
                </p>
              </div>
              <div>
                <p>
                  His love of synagogue life has only increased over time, and he
                  has long sought to pass this love on to his children. This is
                  his last ditch attempt to do so.
                </p>
                <div className="author-books">
                  <p className="author-books-label">Also by Andrew Waxman</p>
                  <div className="author-books-list">
                    <span className="book-tag">Shops and Land</span>
                    <a
                      href="https://www.amazon.com/Rogues-Wall-Street-Manage-Cognitive-ebook/dp/B06Y4XR8LD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-tag book-tag--link"
                    >
                      Rogues of Wall Street
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">Start Your Journey</p>
            <h2 className="section-heading">Find Your Synagogue</h2>
            <p className="final-cta-text">
              Whether you&rsquo;re searching for a spiritual home in Manhattan or simply
              curious about one of the world&rsquo;s most vibrant Jewish communities,
              this book is your invitation.
            </p>
            <a href="https://www.amazon.com/s?k=my+year+in+new+york+synagogues+andrew+waxman" target="_blank" rel="noopener noreferrer" className="cta-button">
              Order Now <ArrowIcon />
            </a>
          </div>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Andrew Waxman. All rights reserved.
      </footer>
    </main>
  )
}
