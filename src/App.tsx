import { useEffect, useRef, lazy, Suspense } from 'react'

const ManhattanMap = lazy(() => import('./ManhattanMap'))

function StarDivider() {
  return (
    <div className="star-divider">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,4 26,18 14,18" stroke="currentColor" strokeWidth="1.2" fill="none" style={{ color: 'var(--gold)' }} />
        <polygon points="20,36 14,22 26,22" stroke="currentColor" strokeWidth="1.2" fill="none" style={{ color: 'var(--gold)' }} />
      </svg>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function App() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">A new book by Andrew Waxman</p>
            <h1 className="hero-title">
              Find My <em>Synagogue</em>
            </h1>
            <p className="hero-subtitle">A Manhattan Guide</p>
            <p className="hero-tagline">
              Part journal, part guide&mdash;one man&rsquo;s year-long journey through the most
              remarkable concentration of synagogues ever assembled in a single city.
            </p>
            <a href="https://www.amazon.com/s?k=find+my+synagogue+andrew+waxman" target="_blank" rel="noopener noreferrer" className="hero-cta">
              Get Your Copy <ArrowIcon />
            </a>
          </div>
          <div className="hero-book">
            <div className="book-wrapper">
              <img
                src="/book-front.png"
                alt="Find My Synagogue — A Manhattan Guide book cover"
              />
            </div>
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
                  Andrew Waxman had been going to the same New York synagogue for years.
                  But what if he went to a different one each week? And so, with his kids
                  off at college, he finally had the time&mdash;and took his chances.
                </p>
                <p>
                  &ldquo;My Year in New York Synagogues&rdquo; chronicles the many different
                  synagogues Waxman encountered&mdash;from grand historic landmarks to intimate
                  neighborhood congregations, each with its own character, traditions, and community.
                </p>
              </div>
              <div>
                <div className="pull-quote">
                  &ldquo;For those curious about what is probably the greatest diversity of
                  synagogues ever assembled in a concentrated single physical location,
                  this will be of great interest.&rdquo;
                </div>
                <p>
                  For those looking for a synagogue in New York to make their home, this book
                  may help. And for those tired of going to synagogue, they can simply pick up
                  Waxman&rsquo;s book and be transported to the action from their living room.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      <StarDivider />

      {/* FEATURES */}
      <section className="features">
        <FadeSection>
          <div className="section-inner">
            <p className="section-label">What Makes This Book Special</p>
            <h2 className="section-heading">Three Books in One</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 40V12a4 4 0 014-4h24a4 4 0 014 4v28" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 40h32" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 16h16M16 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="16" y="28" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <h3 className="feature-title">A Personal Journal</h3>
                <p className="feature-text">
                  Warm, candid reflections from each week&rsquo;s visit&mdash;the atmosphere,
                  the people, the sermons, and the unexpected moments of connection.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M24 28v12" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M18 34h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10 40a14 14 0 0128 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                  </svg>
                </div>
                <h3 className="feature-title">A Practical Guide</h3>
                <p className="feature-text">
                  Looking for your spiritual home in Manhattan? Navigate the incredible
                  diversity of congregations with a trusted companion who&rsquo;s been to them all.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8l4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 38c4-2 8-2 12-2s8 0 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="feature-title">A Cultural Portrait</h3>
                <p className="feature-text">
                  An unprecedented exploration of the greatest diversity of synagogues
                  ever assembled in one place&mdash;a living tapestry of tradition and community.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* MAP */}
      <Suspense fallback={null}>
        <ManhattanMap />
      </Suspense>

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
                  Andrew Waxman grew up in the suburbs of Manchester, England, later living
                  in London, and then New York. He has degrees in history and urban planning
                  from London University.
                </p>
                <p>
                  His love of synagogue life has only increased in time, and he has long
                  sought to pass this love on to his children. &ldquo;Find My Synagogue&rdquo;
                  is his attempt to do just that&mdash;and a testament to the communities that
                  make Manhattan&rsquo;s Jewish life so extraordinary.
                </p>
              </div>
              <div>
                <p>
                  &ldquo;Find My Synagogue &mdash; A Manhattan Guide&rdquo; is Mr. Waxman&rsquo;s
                  third book, following his earlier works on the intersection of history,
                  place, and people.
                </p>
                <div className="author-books">
                  <p className="author-books-label">Also by Andrew Waxman</p>
                  <div className="author-books-list">
                    <span className="book-tag">Shops and Land</span>
                    <span className="book-tag">Rogues of Wall Street</span>
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
            <a href="https://www.amazon.com/s?k=find+my+synagogue+andrew+waxman" target="_blank" rel="noopener noreferrer" className="cta-button">
              Order Now <ArrowIcon />
            </a>
          </div>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Andrew Waxman. All rights reserved.
      </footer>
    </>
  )
}
