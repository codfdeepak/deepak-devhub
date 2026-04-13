export const defaultAbout = {
  headline: "",
  summary: "",
  location: "",
  avatar: "",
  website: "",
};

export const emptyEducation = () => ({
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  currentlyStudying: false,
  grade: "",
  highlights: [],
  location: "",
});

export const emptySkill = () => ({
  name: "",
  level: "mid",
  years: "",
  stack: "fullstack",
  keywords: [],
});

export const emptyExperience = () => ({
  company: "",
  title: "",
  employmentType: "full-time",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  achievements: [],
  tech: [],
});

export const emptyProject = () => ({
  title: "",
  role: "",
  description: "",
  tech: [],
  repoUrl: "",
  liveUrl: "",
  coverImage: "",
  gallery: [],
  status: "completed",
  startedAt: "",
  endedAt: "",
  highlights: [],
});

export const emptyService = () => ({
  _id: "",
  name: "",
  image: "",
  description: "",
  bulletPoints: [""],
  snapshots: [],
  sortOrder: 0,
  isActive: true,
});

export const emptyHeroSlide = () => ({
  _id: "",
  image: "",
  title: "",
  description: "",
  sortOrder: 0,
  isActive: true,
});

export const emptySocial = () => ({
  platform: "linkedin",
  handle: "",
  url: "",
  followers: 0,
  impressionsLast30: 0,
  engagementRate: 0,
});

export const defaultContact = {
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  github: "",
  twitter: "",
  dribbble: "",
  address: "",
};

export const TAB_LABELS = {
  about: "About",
  education: "Education",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  services: "Services",
  hero: "Hero",
  consultations: "Consultations",
  users: "Users",
  socials: "Socials",
  contact: "Contact",
};

export const PROFILE_SETUP_TABS = [
  "about",
  "education",
  "skills",
  "experience",
  "projects",
  "socials",
  "contact",
];
export const OWNER_ACCESS_TABS = ["services", "hero", "consultations", "users"];

export const TAB_GROUPS = [
  { key: "profile-setup", title: "Profile Setup", tabs: PROFILE_SETUP_TABS },
  { key: "owner-access", title: "Owner Access", tabs: OWNER_ACCESS_TABS },
];

export const getTabGroupsForRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  const groups = [{ key: "profile-setup", title: "Profile Setup", tabs: PROFILE_SETUP_TABS }];

  if (normalizedRole === "owner") {
    groups.push({ key: "owner-access", title: "Owner Access", tabs: OWNER_ACCESS_TABS });
  }

  return groups;
};

export const arrayFromCsv = (value = "") =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const normalizeServiceForm = (service = {}) => ({
  ...emptyService(),
  ...service,
  bulletPoints:
    Array.isArray(service.bulletPoints) && service.bulletPoints.length
      ? service.bulletPoints
      : [""],
  snapshots: Array.isArray(service.snapshots)
    ? service.snapshots.slice(0, 15)
    : [],
});

export const normalizeHeroForm = (slide = {}) => ({
  ...emptyHeroSlide(),
  ...slide,
});
