import Category from '../models/Category.js';

// Utility to wrap async route handlers
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export const createCategory = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const category = await Category.create(payload);
  return res.status(201).json(category);
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  return res.status(200).json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  return res.status(200).json(category);
});

export const getCategoryByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const category = await Category.findOne({ name });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  return res.status(200).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body || {};

  const category = await Category.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  return res.status(200).json(category);
});
