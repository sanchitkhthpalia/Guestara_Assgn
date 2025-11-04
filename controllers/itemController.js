import Item from '../models/Item.js';

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export const createItem = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const item = await Item.create(payload);
  return res.status(201).json(item);
});

export const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find({}).sort({ createdAt: -1 });
  return res.status(200).json(items);
});

export const getItemsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const items = await Item.find({ categoryId }).sort({ createdAt: -1 });
  return res.status(200).json(items);
});

export const getItemsBySubcategory = asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;
  const items = await Item.find({ subcategoryId }).sort({ createdAt: -1 });
  return res.status(200).json(items);
});

export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(item);
});

export const getItemByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const item = await Item.findOne({ name });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(item);
});

export const searchItemsByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  // Case-insensitive partial match using regex
  const items = await Item.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
  return res.status(200).json(items);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body || {};
  const item = await Item.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  return res.status(200).json(item);
});
