import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, logout } from './store/slices/authSlice'
import { fetchMe, loginUser, registerUser } from './store/thunks/authThunks'
import { fetchProfile, saveProfile } from './store/thunks/profileThunks'
import './App.css'
import './index.css'

const defaultAbout = {
  headline: '',
  summary: '',
  location: '',
  availability: 'available',
  avatar: '',
  website: '',
}

const emptyEducation = () => ({
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  currentlyStudying: false,
  grade: '',
  highlights: [],
  location: '',
})

const emptySkill = () => ({
  name: '',
  level: 'mid',
  years: '',
  stack: 'fullstack',
  keywords: [],
})

const emptyExperience = () => ({
  company: '',
  title: '',
  employmentType: 'full-time',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  achievements: [],
  tech: [],
})

const emptyProject = () => ({
  title: '',
  role: '',
  description: '',
  tech: [],
  repoUrl: '',
  liveUrl: '',
  coverImage: '',
  gallery: [],
  status: 'completed',
  startedAt: '',
  endedAt: '',
  highlights: [],
})

const emptyService = () => ({
  name: '',
  summary: '',
  priceFrom: '',
  currency: 'USD',
  unit: 'project',
  tags: [],
})

const emptySocial = () => ({
  platform: 'linkedin',
  handle: '',
  url: '',
  followers: 0,
  impressionsLast30: 0,
  engagementRate: 0,
})

const defaultContact = {
  email: '',
  phone: '',
  website: '',
  linkedin: '',
  github: '',
  twitter: '',
  dribbble: '',
  address: '',
}

const TAB_LABELS = {
  about: 'About',
  education: 'Education',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  services: 'Services',
  socials: 'Socials',
  contact: 'Contact',
}

const arrayFromCsv = (value = '') =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

function App() {
  const dispatch = useDispatch()
  const { status, error, user } = useSelector((state) => state.auth)
  const { profile, status: profileStatus, error: profileError } = useSelector(
    (state) => state.profile,
  )

  const [view, setView] = useState('login')

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setView('dashboard')
      dispatch(fetchProfile())
    } else if (view === 'dashboard') {
      setView('login')
    }
  }, [user, view, dispatch])

  useEffect(() => {
    dispatch(clearError())
  }, [view, dispatch])

  const [loginData, setLoginData] = useState({ mobile: '', password: '' })
  const [signupData, setSignupData] = useState({
    fullName: '',
    mobile: '',
    password: '',
  })

  const isLoading = status === 'loading'

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(loginUser(loginData))
  }

  const handleSignup = (e) => {
    e.preventDefault()
    dispatch(registerUser(signupData))
  }

  const resetSession = () => {
    dispatch(logout())
    setLoginData({ mobile: '', password: '' })
    setSignupData({ fullName: '', mobile: '', password: '' })
    setView('login')
  }

  // theme
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Sectional state
  const [activeTab, setActiveTab] = useState('about')
  const [about, setAbout] = useState(defaultAbout)
  const [education, setEducation] = useState([emptyEducation()])
  const [skills, setSkills] = useState([emptySkill()])
  const [experience, setExperience] = useState([emptyExperience()])
  const [projects, setProjects] = useState([emptyProject()])
  const [services, setServices] = useState([emptyService()])
  const [socials, setSocials] = useState([emptySocial()])
  const [contact, setContact] = useState(defaultContact)
  const [isFreelanceOpen, setIsFreelanceOpen] = useState(true)
  const [savingSection, setSavingSection] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!profile) return

    setAbout({ ...defaultAbout, ...(profile.about || {}) })
    setEducation(
      profile.education && profile.education.length
        ? profile.education.map((item) => ({ ...emptyEducation(), ...item }))
        : [emptyEducation()],
    )
    setSkills(
      profile.skills && profile.skills.length
        ? profile.skills.map((item) => ({ ...emptySkill(), ...item }))
        : [emptySkill()],
    )
    setExperience(
      profile.experience && profile.experience.length
        ? profile.experience.map((item) => ({ ...emptyExperience(), ...item }))
        : [emptyExperience()],
    )
    setProjects(
      profile.projects && profile.projects.length
        ? profile.projects.map((item) => ({ ...emptyProject(), ...item }))
        : [emptyProject()],
    )
    setServices(
      profile.services && profile.services.length
        ? profile.services.map((item) => ({ ...emptyService(), ...item }))
        : [emptyService()],
    )
    setSocials(
      profile.socials && profile.socials.length
        ? profile.socials.map((item) => ({ ...emptySocial(), ...item }))
        : [emptySocial()],
    )
    setContact({ ...defaultContact, ...(profile.contact || {}) })
    setIsFreelanceOpen(profile.isFreelanceOpen ?? true)
  }, [profile])

  const addItem = (setter, factory) => setter((prev) => [...prev, factory()])
  const removeItem = (setter, list, index, min = 1) => {
    if (list.length <= min) return
    setter(list.filter((_, i) => i !== index))
  }

  const handleArrayField = (setter, list, index, key, value) => {
    setter(list.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  const sectionTitle = useMemo(() => TAB_LABELS[activeTab], [activeTab])

  const handleProjectImages = async (index, files) => {
    const fileList = Array.from(files || [])
    if (!fileList.length) return

    const asDataUrls = await Promise.all(
      fileList.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
          }),
      ),
    )

    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== index) return proj
        const nextGallery = [...(proj.gallery || []), ...asDataUrls].slice(0, 15)
        return { ...proj, gallery: nextGallery, coverImage: proj.coverImage || nextGallery[0] || '' }
      }),
    )
  }

  const removeProjectImage = (pIndex, imgIndex) => {
    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== pIndex) return proj
        const nextGallery = (proj.gallery || []).filter((_, gi) => gi !== imgIndex)
        return {
          ...proj,
          gallery: nextGallery,
          coverImage: proj.coverImage && nextGallery.includes(proj.coverImage)
            ? proj.coverImage
            : nextGallery[0] || '',
        }
      }),
    )
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    setAbout((prev) => ({ ...prev, avatar: dataUrl }))
    e.target.value = ''
    try {
      setSavingSection('about')
      await dispatch(saveProfile({ about: { ...about, avatar: dataUrl }, isFreelanceOpen })).unwrap()
      setToast('About saved')
    } catch (err) {
      setToast(err.message || 'Unable to save photo')
    } finally {
      setSavingSection(null)
      setTimeout(() => setToast(''), 2200)
    }
  }

  const prepDates = (value) => (value ? new Date(value).toISOString() : null)
  const prepNumber = (value) => (value === '' || value === null ? undefined : Number(value))

  const buildPayload = (section) => {
    switch (section) {
      case 'about':
        return { about: { ...about }, isFreelanceOpen }
      case 'education':
        return {
          education: education.map((edu) => ({
            ...edu,
            startYear: prepNumber(edu.startYear),
            endYear: edu.currentlyStudying ? undefined : prepNumber(edu.endYear),
            highlights: edu.highlights || [],
          })),
        }
      case 'skills':
        return {
          skills: skills.map((skill) => ({
            ...skill,
            years: prepNumber(skill.years),
            keywords: skill.keywords || [],
          })),
        }
      case 'experience':
        return {
          experience: experience.map((exp) => ({
            ...exp,
            startDate: prepDates(exp.startDate),
            endDate: exp.currentlyWorking ? null : prepDates(exp.endDate),
            achievements: exp.achievements || [],
            tech: exp.tech || [],
          })),
        }
      case 'projects':
        return {
          projects: projects.map((proj) => ({
            ...proj,
            startedAt: prepDates(proj.startedAt),
            endedAt: prepDates(proj.endedAt),
            tech: proj.tech || [],
            highlights: proj.highlights || [],
            gallery: (proj.gallery || []).slice(0, 15),
          })),
        }
      case 'services':
        return {
          services: services.map((svc) => ({
            ...svc,
            priceFrom: prepNumber(svc.priceFrom),
            tags: svc.tags || [],
          })),
        }
      case 'socials':
        return {
          socials: socials.map((soc) => ({
            ...soc,
            followers: prepNumber(soc.followers) || 0,
            impressionsLast30: prepNumber(soc.impressionsLast30) || 0,
            engagementRate: prepNumber(soc.engagementRate) || 0,
          })),
        }
      case 'contact':
        return { contact: { ...contact }, isFreelanceOpen }
      default:
        return {}
    }
  }

  const handleSaveSection = async (section) => {
    setSavingSection(section)
    try {
      const payload = buildPayload(section)
      await dispatch(saveProfile(payload)).unwrap()
      setToast(`${TAB_LABELS[section]} saved`)
    } catch (err) {
      setToast(err.message || 'Unable to save')
    } finally {
      setSavingSection(null)
      setTimeout(() => setToast(''), 2200)
    }
  }

  const SectionHeader = ({ title, cta }) => (
    <div className="section-head">
      <h3>{title}</h3>
      {cta}
    </div>
  )

  const Badge = ({ children }) => <span className="badge">{children}</span>

  const renderAbout = () => (
    <div className="section">
      <SectionHeader
        title="About you"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('about')}
            disabled={savingSection === 'about'}
          >
            {savingSection === 'about' ? 'Saving…' : 'Save About'}
          </button>
        }
      />

      <div className="grid two">
        <label className="field">
          <span>Availability</span>
          <select
            value={about.availability}
            onChange={(e) => setAbout((prev) => ({ ...prev, availability: e.target.value }))}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="looking">Open to offers</option>
          </select>
        </label>

        <label className="field">
          <span>Headline</span>
          <input
            value={about.headline}
            onChange={(e) => setAbout((prev) => ({ ...prev, headline: e.target.value }))}
            placeholder="Product-minded full-stack engineer"
          />
        </label>
      </div>

      <label className="field">
        <span>Intro</span>
        <textarea
          rows={4}
          value={about.summary}
          onChange={(e) => setAbout((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="Short, 3–4 sentence story about you"
        />
      </label>

      <div className="grid two">
        <label className="field">
          <span>Location</span>
          <input
            value={about.location}
            onChange={(e) => setAbout((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Delhi, India"
          />
        </label>
        <label className="field">
          <span>Website</span>
          <input
            value={about.website}
            onChange={(e) => setAbout((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://portfolio.com"
          />
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>Profile photo URL</span>
          <input
            value={about.avatar}
            onChange={(e) => setAbout((prev) => ({ ...prev, avatar: e.target.value }))}
            placeholder="https://.../me.jpg"
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={isFreelanceOpen}
            onChange={(e) => setIsFreelanceOpen(e.target.checked)}
          />
          <span>Freelance inquiries open</span>
        </label>
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="section">
      <SectionHeader
        title="Education"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('education')}
            disabled={savingSection === 'education'}
          >
            {savingSection === 'education' ? 'Saving…' : 'Save Education'}
          </button>
        }
      />

      <div className="stack">
        {education.map((edu, idx) => (
          <div className="item-card" key={`edu-${idx}`}>
            <div className="item-top">
              <strong>Entry {idx + 1}</strong>
              <div className="item-actions">
                <Badge>{edu.currentlyStudying ? 'Current' : 'Alumni'}</Badge>
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => removeItem(setEducation, education, idx)}
                  disabled={education.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Institution</span>
                <input
                  value={edu.institution}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'institution', e.target.value)}
                  placeholder="College / University"
                  required
                />
              </label>
              <label className="field">
                <span>Degree</span>
                <input
                  value={edu.degree}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'degree', e.target.value)}
                  placeholder="B.Tech / B.Sc / MBA"
                />
              </label>
            </div>

            <div className="grid three">
              <label className="field">
                <span>Field</span>
                <input
                  value={edu.field}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
              </label>
              <label className="field">
                <span>Start year</span>
                <input
                  type="number"
                  value={edu.startYear}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'startYear', e.target.value)}
                  placeholder="2022"
                />
              </label>
              <label className="field">
                <span>End year</span>
                <input
                  type="number"
                  value={edu.endYear}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'endYear', e.target.value)}
                  placeholder="2026"
                  disabled={edu.currentlyStudying}
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Grade / Score</span>
                <input
                  value={edu.grade}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'grade', e.target.value)}
                  placeholder="8.5 CGPA"
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  value={edu.location}
                  onChange={(e) => handleArrayField(setEducation, education, idx, 'location', e.target.value)}
                  placeholder="City, Country"
                />
              </label>
            </div>

            <label className="field">
              <span>Highlights (comma separated)</span>
              <input
                value={(edu.highlights || []).join(', ')}
                onChange={(e) =>
                  handleArrayField(setEducation, education, idx, 'highlights', arrayFromCsv(e.target.value))
                }
                placeholder="Dean's list, Hackathon finalist"
              />
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={edu.currentlyStudying}
                onChange={(e) =>
                  handleArrayField(setEducation, education, idx, 'currentlyStudying', e.target.checked)
                }
              />
              <span>Currently studying here</span>
            </label>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setEducation, emptyEducation)}>
        + Add another education
      </button>
    </div>
  )

  const renderSkills = () => (
    <div className="section">
      <SectionHeader
        title="Skills"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('skills')}
            disabled={savingSection === 'skills'}
          >
            {savingSection === 'skills' ? 'Saving…' : 'Save Skills'}
          </button>
        }
      />

      <div className="stack">
        {skills.map((skill, idx) => (
          <div className="item-card" key={`skill-${idx}`}>
            <div className="item-top">
              <strong>Skill {idx + 1}</strong>
              <button
                className="link-btn"
                type="button"
                onClick={() => removeItem(setSkills, skills, idx)}
                disabled={skills.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="grid three">
              <label className="field">
                <span>Name</span>
                <input
                  value={skill.name}
                  onChange={(e) => handleArrayField(setSkills, skills, idx, 'name', e.target.value)}
                  placeholder="React"
                />
              </label>
              <label className="field">
                <span>Level</span>
                <select
                  value={skill.level}
                  onChange={(e) => handleArrayField(setSkills, skills, idx, 'level', e.target.value)}
                >
                  <option value="novice">Novice</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="expert">Expert</option>
                </select>
              </label>
              <label className="field">
                <span>Years</span>
                <input
                  type="number"
                  value={skill.years}
                  onChange={(e) => handleArrayField(setSkills, skills, idx, 'years', e.target.value)}
                  placeholder="3"
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Stack</span>
                <select
                  value={skill.stack}
                  onChange={(e) => handleArrayField(setSkills, skills, idx, 'stack', e.target.value)}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="mobile">Mobile</option>
                  <option value="devops">DevOps</option>
                  <option value="data">Data</option>
                  <option value="product">Product</option>
                  <option value="design">Design</option>
                  <option value="qa">QA</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="field">
                <span>Keywords (comma separated)</span>
                <input
                  value={(skill.keywords || []).join(', ')}
                  onChange={(e) =>
                    handleArrayField(setSkills, skills, idx, 'keywords', arrayFromCsv(e.target.value))
                  }
                  placeholder="Next.js, Hooks, Vite"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setSkills, emptySkill)}>
        + Add skill
      </button>
    </div>
  )

  const renderExperience = () => (
    <div className="section">
      <SectionHeader
        title="Experience"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('experience')}
            disabled={savingSection === 'experience'}
          >
            {savingSection === 'experience' ? 'Saving…' : 'Save Experience'}
          </button>
        }
      />

      <div className="stack">
        {experience.map((exp, idx) => (
          <div className="item-card" key={`exp-${idx}`}>
            <div className="item-top">
              <strong>Role {idx + 1}</strong>
              <button
                className="link-btn"
                type="button"
                onClick={() => removeItem(setExperience, experience, idx)}
                disabled={experience.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Company</span>
                <input
                  value={exp.company}
                  onChange={(e) => handleArrayField(setExperience, experience, idx, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </label>
              <label className="field">
                <span>Title</span>
                <input
                  value={exp.title}
                  onChange={(e) => handleArrayField(setExperience, experience, idx, 'title', e.target.value)}
                  placeholder="Software Engineer"
                />
              </label>
            </div>

            <div className="grid three">
              <label className="field">
                <span>Employment type</span>
                <select
                  value={exp.employmentType}
                  onChange={(e) =>
                    handleArrayField(setExperience, experience, idx, 'employmentType', e.target.value)
                  }
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="intern">Intern</option>
                </select>
              </label>
              <label className="field">
                <span>Start date</span>
                <input
                  type="date"
                  value={exp.startDate?.slice(0, 10) || ''}
                  onChange={(e) => handleArrayField(setExperience, experience, idx, 'startDate', e.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  type="date"
                  value={exp.endDate?.slice(0, 10) || ''}
                  onChange={(e) => handleArrayField(setExperience, experience, idx, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                />
              </label>
            </div>

            <label className="field">
              <span>Location</span>
              <input
                value={exp.location}
                onChange={(e) => handleArrayField(setExperience, experience, idx, 'location', e.target.value)}
                placeholder="Remote / City"
              />
            </label>

            <label className="field">
              <span>Achievements (comma separated)</span>
              <input
                value={(exp.achievements || []).join(', ')}
                onChange={(e) =>
                  handleArrayField(
                    setExperience,
                    experience,
                    idx,
                    'achievements',
                    arrayFromCsv(e.target.value),
                  )
                }
                placeholder="Shipped X, Improved Y by 40%"
              />
            </label>

            <label className="field">
              <span>Tech stack (comma separated)</span>
              <input
                value={(exp.tech || []).join(', ')}
                onChange={(e) =>
                  handleArrayField(setExperience, experience, idx, 'tech', arrayFromCsv(e.target.value))
                }
                placeholder="Node.js, PostgreSQL, AWS"
              />
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={exp.currentlyWorking}
                onChange={(e) =>
                  handleArrayField(setExperience, experience, idx, 'currentlyWorking', e.target.checked)
                }
              />
              <span>Currently working here</span>
            </label>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setExperience, emptyExperience)}>
        + Add experience
      </button>
    </div>
  )

  const renderProjects = () => (
    <div className="section">
      <SectionHeader
        title="Projects"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('projects')}
            disabled={savingSection === 'projects'}
          >
            {savingSection === 'projects' ? 'Saving…' : 'Save Projects'}
          </button>
        }
      />

      <div className="stack">
        {projects.map((proj, idx) => (
          <div className="item-card" key={`proj-${idx}`}>
            <div className="item-top">
              <strong>Project {idx + 1}</strong>
              <button
                className="link-btn"
                type="button"
                onClick={() => removeItem(setProjects, projects, idx)}
                disabled={projects.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Title</span>
                <input
                  value={proj.title}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'title', e.target.value)}
                  placeholder="Project name"
                />
              </label>
              <label className="field">
                <span>Role</span>
                <input
                  value={proj.role}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'role', e.target.value)}
                  placeholder="Lead developer"
                />
              </label>
            </div>

            <label className="field">
              <span>Summary</span>
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => handleArrayField(setProjects, projects, idx, 'description', e.target.value)}
                placeholder="What problem it solves, outcomes"
              />
            </label>

            <div className="grid two">
              <label className="field">
                <span>Live URL</span>
                <input
                  value={proj.liveUrl}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'liveUrl', e.target.value)}
                  placeholder="https://project.com"
                />
              </label>
              <label className="field">
                <span>Repo URL</span>
                <input
                  value={proj.repoUrl}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'repoUrl', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </label>
            </div>

            <div className="grid three">
              <label className="field">
                <span>Status</span>
                <select
                  value={proj.status}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'status', e.target.value)}
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="field">
                <span>Start</span>
                <input
                  type="date"
                  value={proj.startedAt?.slice(0, 10) || ''}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'startedAt', e.target.value)}
                />
              </label>
              <label className="field">
                <span>End</span>
                <input
                  type="date"
                  value={proj.endedAt?.slice(0, 10) || ''}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'endedAt', e.target.value)}
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Tech (comma separated)</span>
                <input
                  value={(proj.tech || []).join(', ')}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'tech', arrayFromCsv(e.target.value))}
                  placeholder="React, Node, MongoDB"
                />
              </label>
              <label className="field">
                <span>Highlights (comma separated)</span>
                <input
                  value={(proj.highlights || []).join(', ')}
                  onChange={(e) =>
                    handleArrayField(setProjects, projects, idx, 'highlights', arrayFromCsv(e.target.value))
                  }
                  placeholder="Performance +40%, Stripe payments"
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Cover image URL</span>
                <input
                  value={proj.coverImage}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'coverImage', e.target.value)}
                  placeholder="https://cdn.../cover.jpg"
                />
              </label>
              <label className="field">
                <span>Upload gallery (max 15)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleProjectImages(idx, e.target.files)}
                />
              </label>
            </div>

            <div className="gallery-row">
              <div className="chip">{(proj.gallery || []).length} / 15 images</div>
              <div className="thumbs">
                {(proj.gallery || []).map((img, gi) => (
                  <div className="thumb" key={`g-${gi}`}>
                    <img src={img} alt={`gallery-${gi}`} />
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => removeProjectImage(idx, gi)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setProjects, emptyProject)}>
        + Add project
      </button>
    </div>
  )

  const renderServices = () => (
    <div className="section">
      <SectionHeader
        title="Services"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('services')}
            disabled={savingSection === 'services'}
          >
            {savingSection === 'services' ? 'Saving…' : 'Save Services'}
          </button>
        }
      />

      <div className="stack">
        {services.map((svc, idx) => (
          <div className="item-card" key={`svc-${idx}`}>
            <div className="item-top">
              <strong>Service {idx + 1}</strong>
              <button
                className="link-btn"
                type="button"
                onClick={() => removeItem(setServices, services, idx)}
                disabled={services.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Title</span>
                <input
                  value={svc.name}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'name', e.target.value)}
                  placeholder="Web app development"
                />
              </label>
              <label className="field">
                <span>Starting price</span>
                <input
                  type="number"
                  value={svc.priceFrom}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'priceFrom', e.target.value)}
                  placeholder="1500"
                />
              </label>
            </div>

            <div className="grid three">
              <label className="field">
                <span>Currency</span>
                <input
                  value={svc.currency}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'currency', e.target.value)}
                  placeholder="USD"
                />
              </label>
              <label className="field">
                <span>Unit</span>
                <input
                  value={svc.unit}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'unit', e.target.value)}
                  placeholder="project / sprint / hour"
                />
              </label>
              <label className="field">
                <span>Tags (comma separated)</span>
                <input
                  value={(svc.tags || []).join(', ')}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'tags', arrayFromCsv(e.target.value))}
                  placeholder="MVP, Dashboard, API"
                />
              </label>
            </div>

            <label className="field">
              <span>Description</span>
              <textarea
                rows={3}
                value={svc.summary}
                onChange={(e) => handleArrayField(setServices, services, idx, 'summary', e.target.value)}
                placeholder="What you deliver and outcomes"
              />
            </label>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setServices, emptyService)}>
        + Add service
      </button>
    </div>
  )

  const renderSocials = () => (
    <div className="section">
      <SectionHeader
        title="Social snapshots"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('socials')}
            disabled={savingSection === 'socials'}
          >
            {savingSection === 'socials' ? 'Saving…' : 'Save Socials'}
          </button>
        }
      />

      <div className="stack">
        {socials.map((soc, idx) => (
          <div className="item-card" key={`soc-${idx}`}>
            <div className="item-top">
              <strong>Social {idx + 1}</strong>
              <button
                className="link-btn"
                type="button"
                onClick={() => removeItem(setSocials, socials, idx)}
                disabled={socials.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Platform</span>
                <select
                  value={soc.platform}
                  onChange={(e) => handleArrayField(setSocials, socials, idx, 'platform', e.target.value)}
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="behance">Behance</option>
                  <option value="facebook">Facebook</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="field">
                <span>Handle</span>
                <input
                  value={soc.handle}
                  onChange={(e) => handleArrayField(setSocials, socials, idx, 'handle', e.target.value)}
                  placeholder="@username"
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Profile URL</span>
                <input
                  value={soc.url}
                  onChange={(e) => handleArrayField(setSocials, socials, idx, 'url', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </label>
              <label className="field">
                <span>Followers</span>
                <input
                  type="number"
                  value={soc.followers}
                  onChange={(e) => handleArrayField(setSocials, socials, idx, 'followers', e.target.value)}
                  placeholder="1200"
                />
              </label>
            </div>

            <div className="grid two">
              <label className="field">
                <span>Impressions (30d)</span>
                <input
                  type="number"
                  value={soc.impressionsLast30}
                  onChange={(e) =>
                    handleArrayField(setSocials, socials, idx, 'impressionsLast30', e.target.value)
                  }
                  placeholder="50000"
                />
              </label>
              <label className="field">
                <span>Engagement %</span>
                <input
                  type="number"
                  value={soc.engagementRate}
                  onChange={(e) =>
                    handleArrayField(setSocials, socials, idx, 'engagementRate', e.target.value)
                  }
                  placeholder="4.2"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button className="ghost" type="button" onClick={() => addItem(setSocials, emptySocial)}>
        + Add social profile
      </button>
    </div>
  )

  const renderContact = () => (
    <div className="section">
      <SectionHeader
        title="Contact"
        cta={
          <button
            className="primary"
            type="button"
            onClick={() => handleSaveSection('contact')}
            disabled={savingSection === 'contact'}
          >
            {savingSection === 'contact' ? 'Saving…' : 'Save Contact'}
          </button>
        }
      />

      <div className="grid two">
        <label className="field">
          <span>Email</span>
          <input
            value={contact.email}
            onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            value={contact.phone}
            onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 00000 00000"
          />
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>Website</span>
          <input
            value={contact.website}
            onChange={(e) => setContact((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourdomain.com"
          />
        </label>
        <label className="field">
          <span>Address</span>
          <input
            value={contact.address}
            onChange={(e) => setContact((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="City, Country"
          />
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>LinkedIn</span>
          <input
            value={contact.linkedin}
            onChange={(e) => setContact((prev) => ({ ...prev, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/in/..."
          />
        </label>
        <label className="field">
          <span>GitHub</span>
          <input
            value={contact.github}
            onChange={(e) => setContact((prev) => ({ ...prev, github: e.target.value }))}
            placeholder="https://github.com/..."
          />
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>Twitter</span>
          <input
            value={contact.twitter}
            onChange={(e) => setContact((prev) => ({ ...prev, twitter: e.target.value }))}
            placeholder="https://twitter.com/..."
          />
        </label>
        <label className="field">
          <span>Dribbble</span>
          <input
            value={contact.dribbble}
            onChange={(e) => setContact((prev) => ({ ...prev, dribbble: e.target.value }))}
            placeholder="https://dribbble.com/..."
          />
        </label>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={isFreelanceOpen}
          onChange={(e) => setIsFreelanceOpen(e.target.checked)}
        />
        <span>Freelance inquiries open</span>
      </label>
    </div>
  )

  const renderServicesTabs = {
    about: renderAbout,
    education: renderEducation,
    skills: renderSkills,
    experience: renderExperience,
    projects: renderProjects,
    services: renderServices,
    socials: renderSocials,
    contact: renderContact,
  }

  const isAuthView = view !== 'dashboard'

  return (
    <div className={`page${isAuthView ? ' auth-mode' : ''}`}>
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="glow glow-c" />

      <div className="content-shell">
        {view !== 'dashboard' && (
          <section className="auth-shell">
            <div className="hero-panel panel auth-card" style={{ marginBottom: 14 }}>
              <h1 className="text-center">
              {view === 'login' ? 'Admin Access Login' : 'Admin Access Sign up'}
            </h1>
            <p className="muted">
              {view === 'login'
                ? 'Sign in with your mobile and password to manage the admin dashboard.'
                : 'Create your admin login with your full name, mobile, and a strong password.'}
            </p>

            {view === 'login' && (
              <form className="form compact" onSubmit={handleLogin}>
                <label className="field">
                  <span>Mobile number</span>
                  <input
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    placeholder="+91 00000 00000"
                    value={loginData.mobile}
                    onChange={(e) =>
                      setLoginData((prev) => ({ ...prev, mobile: e.target.value }))
                    }
                    required
                    disabled={isLoading}
                  />
                </label>

                <label className="field">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Minimum 8 characters"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                </label>

                {error && <p className="error">{error}</p>}

                <button className="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Authorising…' : 'Login Securely'}
                </button>

                <p className="muted" style={{ textAlign: 'center', marginTop: 12 }}>
                  New here?{' '}
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => setView('signup')}
                    disabled={isLoading}
                  >
                    Create an account
                  </button>
                </p>
              </form>
            )}

            {view === 'signup' && (
              <form className="form compact" onSubmit={handleSignup}>
                <label className="field">
                  <span>Full name</span>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    required
                    disabled={isLoading}
                  />
                </label>

                <label className="field">
                  <span>Mobile number</span>
                  <input
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    placeholder="+91 00000 00000"
                    value={signupData.mobile}
                    onChange={(e) =>
                      setSignupData((prev) => ({ ...prev, mobile: e.target.value }))
                    }
                    required
                    disabled={isLoading}
                  />
                </label>

                <label className="field">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                </label>

                {error && <p className="error">{error}</p>}

                <button className="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating…' : 'Create & Continue'}
                </button>

                <p className="muted" style={{ textAlign: 'center', marginTop: 12 }}>
                  Already onboarded?{' '}
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => setView('login')}
                    disabled={isLoading}
                  >
                    Go to login
                  </button>
                </p>
              </form>
            )}
            </div>
          </section>
        )}

        {view === 'dashboard' && user && (
          <section className="panel data-panel">
            <div className="panel-top panel-top-stack">
              <div className="panel-head-left">
                <div className="profile-inline">
                  <div className="avatar-stack">
                    <div className="avatar large">
                      {about.avatar ? <img src={about.avatar} alt="Admin avatar" /> : <span>👤</span>}
                    </div>
                    <div className="identity-block">
                      <div className="pill">
                        Role: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin'}
                      </div>
                      <h4>{user.fullName || 'Admin user'}</h4>
                      <p className="muted">Mobile: {user.mobile || '—'}</p>
                      <label className="upload-btn small">
                        Upload photo
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                  </div>
                  <div className="theme-toggle">
                    <span className="muted">Theme</span>
                    <div className="toggle-buttons">
                      <button
                        type="button"
                        className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                </div>
                <div className="chip">
                  {user?.role === 'partner'
                    ? "Partner's Dashboard"
                    : `Dashboard · ${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin'}`}
                </div>
                <p className="muted">Separate forms for each section. Save individually, then publish.</p>
              </div>
              <div className="status-wrap">
                <span className={`status-pill ${profileStatus}`}>
                  {profileStatus === 'loading'
                    ? 'Saving…'
                    : profileStatus === 'succeeded'
                      ? 'Saved'
                      : profileStatus === 'failed'
                        ? 'Error'
                        : 'Idle'}
                </span>
                {profileError && <p className="error">{profileError}</p>}
                <button className="ghost" type="button" onClick={resetSession}>
                  Logout
                </button>
              </div>
            </div>

            <div className="dashboard-shell">
              <div className="side-nav">
                {Object.entries(TAB_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`nav-btn ${activeTab === key ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="cms-body">
                <div className="section-meta">
                  <div className="pill">{sectionTitle}</div>
                  <div className="pill">Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '—'}</div>
                </div>

                {toast && <div className="success-banner">{toast}</div>}

                {renderServicesTabs[activeTab]?.()}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
