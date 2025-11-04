import Subcategory from '../models/Subcategory.js';

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export const createSubcategory = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const subcategory = await Subcategory.create(payload);
  return res.status(201).json(subcategory);
});

export const getAllSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({}).sort({ createdAt: -1 });
  return res.status(200).json(subcategories);
});

export const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const subcategories = await Subcategory.find({ categoryId }).sort({ createdAt: -1 });
  return res.status(200).json(subcategories);
});

export const getSubcategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
  return res.status(200).json(subcategory);
});

export const getSubcategoryByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const subcategory = await Subcategory.findOne({ name });
  if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
  return res.status(200).json(subcategory);
});

export const updateSubcategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body || {};
  const subcategory = await Subcategory.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
  return res.status(200).json(subcategory);
});
