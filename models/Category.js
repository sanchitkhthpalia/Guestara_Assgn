import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: '' }, // URL string, validated by clients
    description: { type: String, default: '' },
    taxApplicable: { type: Boolean, default: false },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax must be >= 0'],
      validate: {
        validator: function (v) {
          // If taxApplicable is false, allow 0; if true, require >= 0
          if (this.taxApplicable) return v >= 0;
          return v === 0 || v >= 0; // effectively allow any non-negative
        },
        message: 'Invalid tax value',
      },
    },
    taxType: { type: String, enum: ['flat', 'percent'], default: 'percent' },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1 }, { unique: true });

export default mongoose.model('Category', CategorySchema);