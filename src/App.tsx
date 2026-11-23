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
        <div className="postcard-lines">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY
    if (!accessKey) {
      setErrorMessage('The contact form is not configured yet.')
      setStatus('error')
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    const name = ((data.get('name') as string) ?? '').trim()
    const email = ((data.get('email') as string) ?? '').trim()
    const subject = ((data.get('subject') as string) ?? '').trim()
    const message = ((data.get('message') as string) ?? '').trim()

    // Web3Forms delivers the submission by email to the inbox tied to the access
    // key. `from_name`/`subject` shape the email; the `email` field becomes the
    // reply-to; a non-empty `botcheck` (our honeypot) is rejected as spam.
    const payload = {
      access_key: accessKey,
      from_name: 'My Year in New York Synagogues',
      subject: subject
        ? `[Website] ${subject} — ${name}`
        : `[Website] Speaking / interview inquiry — ${name}`,
      name,
      email,
      message,
      botcheck: (data.get('botcheck') as string) ?? '',
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json().catch(() => ({}))

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Your message could not be sent.')
      }

      form.reset()
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Your message could not be sent.')
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <FadeSection>
        <div className="section-inner">
          <p className="section-label">Speaking &amp; Interviews</p>
          <h2 className="section-heading">Invite Andrew</h2>
          <p className="contact-intro">
            Andrew is glad to speak with book clubs, congregations, and podcasts, or to
            sit down for an interview about the year he spent among Manhattan&rsquo;s
            synagogues. Send a note and he&rsquo;ll be in touch.
          </p>

          {status === 'success' ? (
            <div className="contact-success" role="status">
              <p className="contact-success-title">Thank you&mdash;your message is on its way.</p>
              <p className="contact-success-text">
                Andrew reads every note personally and will get back to you soon.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-row">
                <label className="contact-field">
                  <span className="contact-label">Name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    disabled={status === 'submitting'}
                  />
                </label>
                <label className="contact-field">
                  <span className="contact-label">Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    disabled={status === 'submitting'}
                  />
                </label>
              </div>

              <label className="contact-field">
                <span className="contact-label">
                  Subject <span className="contact-optional">(optional)</span>
                </span>
                <input
                  type="text"
                  name="subject"
                  placeholder="Speaking engagement, interview, book club&hellip;"
                  maxLength={160}
                  disabled={status === 'submitting'}
                />
              </label>

              <label className="contact-field">
                <span className="contact-label">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  maxLength={4000}
                  disabled={status === 'submitting'}
                />
              </label>

              {/* Honeypot — hidden from users; Web3Forms rejects if filled. */}
              <div className="contact-honeypot" aria-hidden="true">
                <label>
                  Company
                  <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {status === 'error' && (
                <p className="contact-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <button type="submit" className="cta-button" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
                {status !== 'submitting' && <ArrowIcon />}
              </button>
            </form>
          )}
        </div>
      </FadeSection>
    </section>
  )
}

// Andrew's book talk at Central Synagogue, posted on their YouTube channel.
const TALK_VIDEO = {
  host: 'Central Synagogue',
  title: 'Learn & Lunch: Exploring Synagogues Across New York City',
  date: 'November 17, 2026',
  youtubeId: 'lGooWhcP51o',
}

// One story, written for the JTA wire, then picked up by papers that subscribe
// to it. Only the original carries a byline; the pickups are listed by outlet.
const PRESS_ORIGINAL = {
  outlet: 'Jewish Telegraphic Agency',
  headline: 'He went to a different Manhattan synagogue every week. Here\u2019s what it taught him.',
  byline: 'Andrew Silow-Carroll, editor-in-chief of JTA',
  date: 'September 6, 2026',
  url: 'https://www.jta.org/2026/09/06/culture/he-went-to-a-different-manhattan-synagogue-every-week-heres-what-it-taught-him',
}

const PRESS_PICKUPS = [
  {
    outlet: 'The Times of Israel',
    // Run under its own headline, so it is worth showing.
    headline: 'New \u2018Yelp guide for synagogues\u2019 in Manhattan showcases Big Apple\u2019s Jewish diversity',
    url: 'https://www.timesofisrael.com/new-yelp-guide-for-synagogues-in-manhattan-showcases-big-apples-jewish-diversity/',
  },
  {
    outlet: 'Intermountain Jewish News',
    headline: 'All of New York\u2019s Synagogues',
    url: 'https://www.ijn.com/50-new-york-synagogues-andrew-waxman/',
  },
  {
    outlet: 'The Forward',
    url: 'https://forward.com/fast-forward/848819/he-went-to-a-different-manhattan-synagogue-every-week-heres-what-it-taught-him',
  },
  {
    outlet: 'Cleveland Jewish News',
    url: 'https://www.clevelandjewishnews.com/jta/he-went-to-a-different-manhattan-synagogue-every-week-here-s-what-it-taught-him/article_facdcdd2-dec0-55e0-af1f-f5edc83f7690.html',
  },
]

function NewsSection() {
  return (
    <section className="news" id="news" aria-labelledby="news-heading">
      <FadeSection>
        <div className="section-inner">
          <p className="section-label">Andrew in the News</p>
          <h2 id="news-heading" className="section-heading">Media Coverage</h2>
          <p className="news-intro">
            Andrew spoke about the book at Central Synagogue, and the Jewish
            Telegraphic Agency sat down with him about his year of shul-hopping.
            The JTA story went out on the wire and was picked up by Jewish papers
            in the United States and Israel.
          </p>

          <article className="news-feature">
            <p className="news-outlet-name">{TALK_VIDEO.host}</p>
            <h3 className="news-feature-headline">{TALK_VIDEO.title}</h3>
            <p className="news-meta">{TALK_VIDEO.date}</p>
            <div className="news-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${TALK_VIDEO.youtubeId}`}
                title={TALK_VIDEO.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <a
              className="news-feature-link"
              href={`https://www.youtube.com/watch?v=${TALK_VIDEO.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube <ArrowIcon />
            </a>
          </article>

          <article className="news-feature">
            <p className="news-outlet-name">{PRESS_ORIGINAL.outlet}</p>
            <h3 className="news-feature-headline">{PRESS_ORIGINAL.headline}</h3>
            <p className="news-meta">
              {PRESS_ORIGINAL.byline}
              <span className="news-meta-dot" aria-hidden="true">&middot;</span>
              {PRESS_ORIGINAL.date}
            </p>
            <blockquote className="news-quote">
              The impetus for the book really was just the awe in which I find myself
              around the number of amazing communities, and the diversity that we have
              in New York that I really think is unparalleled in Jewish history.
            </blockquote>
            <p className="news-quote-attribution">Andrew Waxman, to JTA</p>
            <a
              className="news-feature-link"
              href={PRESS_ORIGINAL.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the article <ArrowIcon />
            </a>
          </article>

          <div className="news-pickups">
            <p className="news-pickups-label">Also published in</p>
            <ul className="news-pickups-list">
              {PRESS_PICKUPS.map((item) => (
                <li key={item.url} className="news-pickup">
                  <a
                    className="news-pickup-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="news-pickup-outlet">{item.outlet}</span>
                    {item.headline && (
                      <span className="news-pickup-headline">{item.headline}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeSection>
    </section>
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
            <a href="https://www.amazon.com/My-Year-New-York-Synagogues/dp/B0H3FFM8DW/ref=sr_1_1?crid=1XASJSZJR2ALZ&dib=eyJ2IjoiMSJ9.HNCzpQ4fKNmy6VzSrLvOXA.R3c_6PGXR_bwNOAf35UHUXI5opT10aoIRmsBt2WVjoM&dib_tag=se&keywords=My+Year+in+New+York+Synagogues%3A+A+Personal+Guide&nsdOptOutParam=true&qid=1782461855&sprefix=my+year+in+new+york+synagogues+a+personal+guide%2Caps%2C254&sr=8-1" target="_blank" rel="noopener noreferrer" className="hero-cta">
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
                  Synagogues,&rdquo; chronicles the many different synagogues Waxman
                  encountered. For those looking for a synagogue in New York, to
                  make their home, this book may help.
                </p>
              </div>
              <div>
                <p>
                  For those curious about what is probably the greatest diversity
                  of synagogues ever assembled in a concentrated single physical
                  location, this will also be of great interest.
                </p>
                <p>
                  For those tired of going to synagogue, they can simply pick up
                  Waxman&rsquo;s book, and be transported to the action from their
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
                  it all out for the reader. All readers &ndash; from the regular
                  synagogue goer to the curious non-Jew &ndash; will find much to be
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
                    {' '}(Brown Judaic studies), and <em>Mine is the Golden Tongue:
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
                  Mr. Waxman grew up in the suburbs of Manchester, England,
                  later living in London, and then New York. He has degrees in
                  history and urban planning from London University.
                </p>
                <p>
                  &ldquo;My Year in New York Synagogues- A Personal
                  Guide,&rdquo; is Mr. Waxman&rsquo;s third book. His prior works
                  are: &ldquo;Shops and Land&rdquo; and &ldquo;Rogues of Wall Street.&rdquo;
                </p>
              </div>
              <div>
                <p>
                  His love of synagogue life has only increased over time and has
                  long sought to pass this love on to his children. This is
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

      <StarDivider />

      {/* ANDREW IN THE NEWS */}
      <NewsSection />

      {/* CONTACT / INVITE ANDREW */}
      <ContactSection />

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
            <a href="https://www.amazon.com/My-Year-New-York-Synagogues/dp/B0H3FFM8DW/ref=sr_1_1?crid=1XASJSZJR2ALZ&dib=eyJ2IjoiMSJ9.HNCzpQ4fKNmy6VzSrLvOXA.R3c_6PGXR_bwNOAf35UHUXI5opT10aoIRmsBt2WVjoM&dib_tag=se&keywords=My+Year+in+New+York+Synagogues%3A+A+Personal+Guide&nsdOptOutParam=true&qid=1782461855&sprefix=my+year+in+new+york+synagogues+a+personal+guide%2Caps%2C254&sr=8-1" target="_blank" rel="noopener noreferrer" className="cta-button">
              Order Now <ArrowIcon />
            </a>
          </div>
        </FadeSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Andrew Waxman. All rights reserved.
        <p className="footer-credit">
          Website built by Hannah Waxman &middot;{" "}
          <a
            href="https://tonicolabs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            tonicolabs.com
          </a>{" "}
          &middot; get in touch for your own website
        </p>
      </footer>
    </main>
  )
}
