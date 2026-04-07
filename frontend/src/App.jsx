import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const fetchProfile = async () => {
  const res = await fetch(`${API_URL}/api/profile/public`)
  if (!res.ok) throw new Error('Unable to load profile')
  return res.json()
}

function App() {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data.profile)
        setStatus('loaded')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const displayName = profile?.user?.fullName || profile?.about?.headline || 'Your Name'
  const summary = profile?.about?.summary || 'Full-stack Specialist crafting robust experiences.'
  const location = profile?.about?.location || 'Remote · Worldwide'
  const availability = profile?.about?.availability || 'available'
  const avatar = profile?.about?.avatar
  const userMobile = profile?.user?.mobile

  const socials = profile?.socials || []
  const skills = profile?.skills || []
  const projects = profile?.projects || []
  const experience = profile?.experience || []
  const services = profile?.services || []
  const education = profile?.education || []
  const contact = profile?.contact || {}
  const primaryContactLink = contact.phone
    ? `tel:${contact.phone}`
    : contact.email
      ? `mailto:${contact.email}`
      : null

  const topSocials = useMemo(() => socials.slice(0, 4), [socials])

  const yearsOfExperience = useMemo(() => {
    const starts = experience
      .map((exp) => (exp.startDate ? new Date(exp.startDate).getTime() : null))
      .filter(Boolean)
    if (!starts.length) return null
    const earliest = Math.min(...starts)
    const years = (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 365)
    return Math.max(1, Math.round(years))
  }, [experience])

  const keywords = useMemo(
    () =>
      Array.from(
        new Set(
          skills
            .flatMap((s) => s.keywords || [])
            .filter(Boolean)
            .map((k) => k.trim()),
        ),
      ).slice(0, 14),
    [skills],
  )

  const statCards = useMemo(
    () => [
      { label: 'Years in craft', value: yearsOfExperience ? `${yearsOfExperience}+` : '1+' },
      { label: 'Projects shipped', value: projects.length || '—' },
      { label: 'Services offered', value: services.length || '—' },
      { label: 'Core skills', value: skills.length || '—' },
    ],
    [projects.length, services.length, skills.length, yearsOfExperience],
  )

  return (
    <div className="page">
      <div className="bg glow-a" />
      <div className="bg glow-b" />
      <div className="bg mesh" />

      <nav className="top-nav">
        <div className="brand">
          <span className="brand-dot" />
          <span>Deepak Kumar</span>
        </div>
        <div className={`nav-links ${navOpen ? 'open' : ''}`}>
          <a href="#about" onClick={() => setNavOpen(false)}>
            About
          </a>
          <a href="#services" onClick={() => setNavOpen(false)}>
            My Services
          </a>
          <a href="#projects" onClick={() => setNavOpen(false)}>
            Projects
          </a>
          <a href="#skills" onClick={() => setNavOpen(false)}>
            Skills
          </a>
          <a href="#profile" onClick={() => setNavOpen(false)}>
            Profile
          </a>
        </div>
        <button
          type="button"
          className={`burger ${navOpen ? 'open' : ''}`}
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <header className="hero" id="about">
        <div className="eyebrow">Portfolio Snapshot</div>
        <h1>
          {displayName}{' '}
          <span className="badge badge-soft">
            {availability === 'available' ? 'Open for work' : availability}
          </span>
        </h1>
        <p className="lede">{summary}</p>
        <div className="meta">
          <span className="pill">{location}</span>
          <span className="pill pill-ghost">
            {status === 'loading' ? 'Loading profile…' : 'Synced from CMS'}
          </span>
          {userMobile && <span className="pill">📱 {userMobile}</span>}
          {contact.website && (
            <a className="pill linkish" href={contact.website} target="_blank" rel="noreferrer">
              Portfolio ↗
            </a>
          )}
        </div>

        <div className="identity-card">
          <div className="avatar-ring">
            {avatar ? <img src={avatar} alt="Profile avatar" /> : <span>👤</span>}
          </div>
          <div className="id-copy">
            <p className="muted">{profile?.about?.headline || 'Identity'}</p>
            <h3>{displayName}</h3>
            <p className="muted">{summary}</p>
            <div className="id-meta">
              <span className="pill micro">{availability}</span>
              {contact.email && <span className="pill micro">✉️ {contact.email}</span>}
              {userMobile && <span className="pill micro">📞 {userMobile}</span>}
            </div>
          </div>
        </div>

        <div className="cta-row">
          {contact.email && (
            <a className="cta primary" href={`mailto:${contact.email}`}>
              Book a project
            </a>
          )}
          {contact.phone && (
            <a className="cta ghost" href={`tel:${contact.phone}`}>
              Call / WhatsApp
            </a>
          )}
          {contact.linkedin && (
            <a className="cta outline" href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </div>

        <div className="stat-grid">
          {statCards.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="social-grid">
          {topSocials.length === 0 && (
            <div className="social-card ghost">Connect your social snapshots in CMS</div>
          )}
          {topSocials.map((s) => (
            <div className="social-card" key={`${s.platform}-${s.handle}`}>
              <div className="social-top">
                <span className="pill small">{s.platform}</span>
                <span className="muted">@{s.handle}</span>
              </div>
              <div className="social-metrics">
                <div>
                  <strong>{(s.followers || 0).toLocaleString()}</strong>
                  <small>Followers</small>
                </div>
                <div>
                  <strong>{s.engagementRate ? `${s.engagementRate}%` : '—'}</strong>
                  <small>Engagement</small>
                </div>
                <div>
                  <strong>{s.impressionsLast30 ? s.impressionsLast30.toLocaleString() : '—'}</strong>
                  <small>30d Views</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="grid two" id="skills">
        <div className="panel">
          <div className="panel-head">
            <h2>Skills & Stacks</h2>
            <span className="pill small">Craft</span>
          </div>
          <div className="chips">
            {skills.length === 0 && <span className="muted">Add skills in admin</span>}
            {skills.map((skill) => (
              <div className="chip" key={`${skill.name}-${skill.stack}`}>
                <div>
                  <strong>{skill.name}</strong>
                  <small>{skill.stack}</small>
                </div>
                <span className="pill micro">
                  {skill.level || 'mid'} · {skill.years || 0}y
                </span>
              </div>
            ))}
          </div>

          {keywords.length > 0 && (
            <div className="tags keyword-cloud">
              {keywords.map((kw) => (
                <span key={kw} className="tag">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="panel" id="services">
          <div className="panel-head">
            <h2>Freelance Services</h2>
            <span className="pill small success">
              {profile?.isFreelanceOpen ? 'Available' : 'Booked'}
            </span>
          </div>
          <div className="services">
            {services.length === 0 && <span className="muted">Define services in admin</span>}
            {services.map((svc) => (
              <div className="service-card" key={svc.name}>
                <div>
                  <strong>{svc.name}</strong>
                  <p className="muted">{svc.summary}</p>
                </div>
                <div className="price">
                  {svc.priceFrom ? (
                    <>
                      <span className="number">
                        {svc.currency || 'USD'} {svc.priceFrom}
                      </span>
                      <small>per {svc.unit || 'project'}</small>
                    </>
                  ) : (
                    <small>Custom pricing</small>
                  )}
                </div>
                <div className="tags">
                  {(svc.tags || []).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {primaryContactLink && (
                  <a className="pill micro linkish" href={primaryContactLink}>
                    Enquire →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Education</h2>
          <span className="pill small">Learning</span>
        </div>
        <div className="education-list">
          {education.length === 0 && <span className="muted">Add education in admin</span>}
          {education.map((edu) => (
            <div className="edu-card" key={`${edu.institution}-${edu.degree}`}>
              <div>
                <h3>{edu.institution}</h3>
                <p className="muted">{edu.degree} {edu.field && `· ${edu.field}`}</p>
              </div>
              <div className="edu-meta">
                <span className="pill micro">{edu.location || 'Location N/A'}</span>
                <span className="pill micro">
                  {edu.startYear || '—'} – {edu.currentlyStudying ? 'Present' : edu.endYear || '—'}
                </span>
              </div>
              {(edu.highlights || []).length > 0 && (
                <ul className="edu-highlights">
                  {edu.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="panel" id="projects">
        <div className="panel-head">
          <h2>Highlighted Projects</h2>
          <span className="pill small">Builds</span>
        </div>
        <div className="cards">
          {projects.length === 0 && <span className="muted">Add projects in admin</span>}
          {projects.map((p) => (
            <div className="card project-card" key={p.title}>
              {p.coverImage && <div className="card-cover" style={{ backgroundImage: `url(${p.coverImage})` }} />}
              <div className="card-head">
                <div>
                  <h3>{p.title}</h3>
                  <p className="muted">{p.role}</p>
                </div>
                <span className="pill micro">{p.status}</span>
              </div>
              <p>{p.description}</p>
              <div className="muted small">
                {(p.startedAt || p.endedAt) && (
                  <>
                    {p.startedAt?.slice(0, 10) || '—'} → {p.endedAt?.slice(0, 10) || 'Present'}
                  </>
                )}
              </div>
              <div className="tags">
                {(p.tech || []).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              {(p.highlights || []).length > 0 && (
                <ul className="project-highlights">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              <div className="links">
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer">
                    Live ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noreferrer">
                    Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Experience</h2>
          <span className="pill small">Timeline</span>
        </div>
        <div className="timeline">
          {experience.length === 0 && <span className="muted">Add roles in admin</span>}
          {experience.map((exp) => (
            <div className="timeline-item" key={`${exp.company}-${exp.title}`}>
              <div className="dot" />
              <div className="timeline-body">
                <div className="timeline-top">
                  <h3>{exp.title}</h3>
                  <span className="pill micro">{exp.employmentType}</span>
                </div>
                <p className="muted">{exp.company}</p>
                <p className="muted">{exp.location}</p>
                <p className="muted">
                  {exp.startDate?.slice(0, 10)} — {exp.currentlyWorking ? 'Present' : exp.endDate?.slice(0, 10)}
                </p>
                <ul>
                  {(exp.achievements || []).map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <div className="tags">
                  {(exp.tech || []).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Social Profiles</h2>
          <span className="pill small">Signals</span>
        </div>
        <div className="social-list">
          {socials.length === 0 && <span className="muted">Add socials in admin</span>}
          {socials.map((s) => (
            <div className="social-row" key={`${s.platform}-${s.handle}`}>
              <div>
                <strong>{s.platform}</strong>
                <p className="muted">@{s.handle}</p>
              </div>
              <div className="social-stats">
                <span>{(s.followers || 0).toLocaleString()} followers</span>
                {s.engagementRate ? <span>{s.engagementRate}% engagement</span> : <span>—</span>}
              </div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="pill micro linkish">
                  View ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="panel contact-panel" id="profile">
        <div className="panel-head">
          <h2>Contact</h2>
          <span className="pill small">Reach out</span>
        </div>
        <div className="contact-grid">
          <div>
            <p className="muted">Email</p>
            <a href={`mailto:${contact.email || ''}`}>{contact.email || 'Add email'}</a>
          </div>
          <div>
            <p className="muted">Phone</p>
            <span>{contact.phone || 'Add phone'}</span>
          </div>
          <div>
            <p className="muted">Website</p>
            {contact.website ? (
              <a href={contact.website} target="_blank" rel="noreferrer">
                {contact.website} ↗
              </a>
            ) : (
              <span>Add website</span>
            )}
          </div>
          <div>
            <p className="muted">Location</p>
            <span>{profile?.about?.location || 'Update location'}</span>
          </div>
        </div>
        {primaryContactLink && (
          <div className="cta-row contact-cta">
            <a className="cta primary wide" href={primaryContactLink}>
              Start a project
            </a>
            {contact.linkedin && (
              <a className="cta outline" href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn profile
              </a>
            )}
          </div>
        )}
      </section>

      {status === 'error' && (
        <div className="toast error">Failed to load profile: {error}</div>
      )}
    </div>
  )
}

export default App
