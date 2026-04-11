const mongoose = require('mongoose')
const Service = require('../models/service.model')

const hasOwnerAccess = (req) => {
  const role = String(req?.user?.role || '').toLowerCase()
  return role === 'owner' || role === 'admin'
}

const normalizeText = (value) => String(value || '').trim()

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
}

const buildPayload = (body = {}) => {
  const name = normalizeText(body.name)
  const description = normalizeText(body.description)
  const image = normalizeText(body.image)
  const snapshots = normalizeArray(body.snapshots).slice(0, 15)
  const bulletPoints = normalizeArray(body.bulletPoints).slice(0, 40)
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0

  if (!name) {
    throw new Error('Service name is required')
  }

  if (!description) {
    throw new Error('Service description is required')
  }

  if (Array.isArray(body.snapshots) && body.snapshots.length > 15) {
    throw new Error('Snapshots can hold up to 15 images')
  }

  return {
    name,
    description,
    image: image || snapshots[0] || '',
    bulletPoints,
    snapshots,
    sortOrder: sortOrder >= 0 ? sortOrder : 0,
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  }
}

const getPublicServices = async (_req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ sortOrder: 1, updatedAt: -1, createdAt: -1 })
      .lean()

    return res.json({ services })
  } catch (err) {
    console.error('Public services fetch error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getPublicServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid service id' })
    }

    const service = await Service.findOne({ _id: serviceId, isActive: true }).lean()
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    return res.json({ service })
  } catch (err) {
    console.error('Public service fetch error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getOwnerServices = async (req, res) => {
  if (!hasOwnerAccess(req)) {
    return res.status(403).json({ message: 'Only owner/admin can manage services' })
  }

  try {
    const services = await Service.find({})
      .sort({ sortOrder: 1, updatedAt: -1, createdAt: -1 })
      .lean()

    return res.json({ services })
  } catch (err) {
    console.error('Owner services fetch error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

const createService = async (req, res) => {
  if (!hasOwnerAccess(req)) {
    return res.status(403).json({ message: 'Only owner/admin can manage services' })
  }

  try {
    const payload = buildPayload(req.body)
    const service = await Service.create({
      ...payload,
      createdBy: req.user.sub,
      updatedBy: req.user.sub,
    })

    return res.status(201).json({ service })
  } catch (err) {
    console.error('Service create error:', err)
    return res.status(400).json({ message: err.message || 'Invalid service data' })
  }
}

const updateService = async (req, res) => {
  if (!hasOwnerAccess(req)) {
    return res.status(403).json({ message: 'Only owner/admin can manage services' })
  }

  try {
    const { serviceId } = req.params
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid service id' })
    }

    const payload = buildPayload(req.body)
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { $set: { ...payload, updatedBy: req.user.sub } },
      { new: true, runValidators: true },
    )

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    return res.json({ service })
  } catch (err) {
    console.error('Service update error:', err)
    return res.status(400).json({ message: err.message || 'Invalid service data' })
  }
}

const deleteService = async (req, res) => {
  if (!hasOwnerAccess(req)) {
    return res.status(403).json({ message: 'Only owner/admin can manage services' })
  }

  try {
    const { serviceId } = req.params
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid service id' })
    }

    const service = await Service.findByIdAndDelete(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    return res.json({ message: 'Service deleted', serviceId })
  } catch (err) {
    console.error('Service delete error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getPublicServices,
  getPublicServiceById,
  getOwnerServices,
  createService,
  updateService,
  deleteService,
}
