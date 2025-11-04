import mongoose from 'mongoose';
import Category from './Category.js';
import Subcategory from './Subcategory.js';

const ItemSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', default: null, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    taxApplicable: { type: Boolean },
    tax: { type: Number, min: [0, 'Tax must be >= 0'] },
    baseAmount: { type: Number, required: true, min: [0, 'Base amount must be >= 0'] },
    discount: { type: Number, default: 0, min: [0, 'Discount must be >= 0'] },
    totalAmount: { type: Number, min: [0, 'Total amount must be >= 0'] },
  },
  { timestamps: true }
);

ItemSchema.index({ name: 'text' });
ItemSchema.index({ categoryId: 1, subcategoryId: 1, name: 1 });

// Helper to inherit tax fields
async function applyTaxDefaults(doc) {
  // Prefer subcategory, then category
  if (doc.subcategoryId) {
    const sub = await Subcategory.findById(doc.subcategoryId).lean();
    if (sub) {
      if (doc.taxApplicable === undefined) doc.taxApplicable = sub.taxApplicable;
      if (doc.tax === undefined && typeof sub.tax === 'number') doc.tax = sub.tax;
    }
  }
  if (doc.taxApplicable === undefined || doc.tax === undefined) {
    const cat = await Category.findById(doc.categoryId).lean();
    if (cat) {
      if (doc.taxApplicable === undefined) doc.taxApplicable = cat.taxApplicable;
      if (doc.tax === undefined && typeof cat.tax === 'number') doc.tax = cat.tax;
    }
  }
}

// Compute totalAmount = baseAmount - discount (never negative)
function computeTotal(doc) {
  const base = Number(doc.baseAmount || 0);
  const discount = Number(doc.discount || 0);
  const total = Math.max(0, base - discount);
  doc.totalAmount = total;
}

ItemSchema.pre('validate', async function (next) {
  try {
    await applyTaxDefaults(this);
    computeTotal(this);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Ensure updates also recompute totals and defaults
ItemSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate() || {};
    // Normalize $set usage
    const $set = update.$set || update;

    // Load existing doc to fill missing context
    const current = await this.model.findOne(this.getQuery()).lean();
    if (!current) return next();

    // Prepare a temp doc snapshot combining current + updates
    const snapshot = {
      ...current,
      ...$set,
    };

    // Apply tax defaults if not explicitly set by the update
    await applyTaxDefaults(snapshot);

    // Recompute total based on possibly updated baseAmount/discount
    computeTotal(snapshot);

    // Write back computed fields into the update
    if (!update.$set) update.$set = {};
    update.$set.taxApplicable = snapshot.taxApplicable;
    update.$set.tax = snapshot.tax;
    update.$set.totalAmount = snapshot.totalAmount;

    // Ensure validators run on update
    this.setOptions({ runValidators: true, new: true });

    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Item', ItemSchema);
