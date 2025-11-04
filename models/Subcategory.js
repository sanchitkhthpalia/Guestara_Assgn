import mongoose from 'mongoose';
import Category from './Category.js';

const SubcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    // Defaults inherited from Category if not provided
    taxApplicable: { type: Boolean },
    tax: { type: Number, min: [0, 'Tax must be >= 0'] },
  },
  { timestamps: true }
);

SubcategorySchema.index({ categoryId: 1, name: 1 }, { unique: true });

// Pre-validate to inherit tax fields from Category when missing
SubcategorySchema.pre('validate', async function (next) {
  try {
    if (!this.isModified('taxApplicable') || this.taxApplicable === undefined || this.tax === undefined) {
      // fetch category to read defaults
      const category = await Category.findById(this.categoryId).lean();
      if (category) {
        if (this.taxApplicable === undefined) this.taxApplicable = category.taxApplicable;
        if (this.tax === undefined) this.tax = category.tax;
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Subcategory', SubcategorySchema);
