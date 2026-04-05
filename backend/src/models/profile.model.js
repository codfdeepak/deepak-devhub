const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['novice', 'junior', 'mid', 'senior', 'lead', 'expert'],
      default: 'mid',
    },
    years: { type: Number, min: 0, max: 50 },
    stack: {
      type: String,
      enum: [
        'frontend',
        'backend',
        'fullstack',
        'mobile',
        'devops',
        'data',
        'product',
        'design',
        'qa',
        'other',
      ],
      default: 'fullstack',
    },
    keywords: [{ type: String, trim: true }],
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    description: { type: String, trim: true },
    tech: [{ type: String, trim: true }],
    repoUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    gallery: {
      type: [String],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length <= 15
        },
        message: 'Gallery can hold up to 15 images',
      },
      default: [],
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed'],
      default: 'completed',
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    highlights: [{ type: String, trim: true }],
  },
  { _id: true },
)

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'intern'],
      default: 'full-time',
    },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false },
    achievements: [{ type: String, trim: true }],
    tech: [{ type: String, trim: true }],
  },
  { _id: true },
)

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, trim: true },
    startYear: { type: Number },
    endYear: { type: Number },
    currentlyStudying: { type: Boolean, default: false },
    grade: { type: String, trim: true },
    highlights: [{ type: String, trim: true }],
    location: { type: String, trim: true },
  },
  { _id: true },
)

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },
    priceFrom: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'project' }, // e.g. per hour/project/sprint
    tags: [{ type: String, trim: true }],
  },
  { _id: true },
)

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
    dribbble: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { _id: false },
)

const socialSnapshotSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        'linkedin',
        'github',
        'twitter',
        'instagram',
        'youtube',
        'dribbble',
        'behance',
        'facebook',
        'other',
      ],
    },
    handle: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    followers: { type: Number, min: 0, default: 0 },
    impressionsLast30: { type: Number, min: 0 },
    engagementRate: { type: Number, min: 0, max: 100 }, // percentage
    lastSync: { type: Date, default: Date.now },
  },
  { _id: true },
)

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    about: {
      headline: { type: String, trim: true },
      summary: { type: String, trim: true },
      location: { type: String, trim: true },
      availability: {
        type: String,
        enum: ['available', 'busy', 'looking'],
        default: 'available',
      },
      avatar: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    skills: [skillSchema],
    projects: [projectSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    services: [serviceSchema],
    contact: contactSchema,
    socials: [socialSnapshotSchema],
    isFreelanceOpen: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Profile', profileSchema)
