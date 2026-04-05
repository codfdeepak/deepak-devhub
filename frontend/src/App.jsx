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

  const name = profile?.about?.headline || 'Your Name'
  const role = profile?.about?.summary || 'Full-stack Specialist crafting robust experiences.'
  const location = profile?.about?.location || 'Remote · Worldwide'
  const availability = profile?.about?.availability || 'available'

  const socials = profile?.socials || []
  const skills = profile?.skills || []
  const projects = profile?.projects || []
  const experience = profile?.experience || []
  const services = profile?.services || []
  const contact = profile?.contact || {}

  const topSocials = useMemo(() => socials.slice(0, 4), [socials])

  return (
    <div className="page">
      <div className="bg glow-a" />
      <div className="bg glow-b" />
      <div className="bg mesh" />

      <header className="hero">
        <div className="eyebrow">Portfolio Snapshot</div>
        <h1>
          {name}{' '}
          <span className="badge badge-soft">
            {availability === 'available' ? 'Open for work' : availability}
          </span>
        </h1>
        <p className="lede">{role}</p>
        <div className="meta">
          <span className="pill">{location}</span>
          <span className="pill pill-ghost">
            {status === 'loading' ? 'Loading profile…' : 'Synced from CMS'}
          </span>
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

      <section className="grid two">
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
        </div>

        <div className="panel">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Highlighted Projects</h2>
          <span className="pill small">Builds</span>
        </div>
        <div className="cards">
          {projects.length === 0 && <span className="muted">Add projects in admin</span>}
          {projects.map((p) => (
            <div className="card" key={p.title}>
              <div className="card-head">
                <div>
                  <h3>{p.title}</h3>
                  <p className="muted">{p.role}</p>
                </div>
                <span className="pill micro">{p.status}</span>
              </div>
              <p>{p.description}</p>
              <div className="tags">
                {(p.tech || []).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
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

      <section className="panel contact-panel">
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
      </section>

      {status === 'error' && (
        <div className="toast error">Failed to load profile: {error}</div>
      )}
    </div>
  )
}

export default App
