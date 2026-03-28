import mongoose, { Schema } from 'mongoose';

const TestQuestionSchema = new Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    validate: [(arr) => arr.length === 4, '4 options required'],
  },
  correctOptionIndex: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
});

const ModuleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Module title is required"],
    trim: true,
  },

  description: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    enum: ["video", "pdf"],
    required: [true, "Module type is required"],
  },

  assetLink: {
    type: [String], // ✅ ARRAY
    required: true,
  },

  test: {
    questions: [TestQuestionSchema],
    passPercentage: {
      type: Number,
      default: 60,
    },
  },
});

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    courseThumbnail: {
      type: String,
      required: [true, 'Thumbnail For The Course Is Required'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },

    // ✅ PRICE AS STRING
    price: {
      type: String,
      required: [true, 'Price is required'],
      validate: {
        validator: (value) => {
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        },
        message: 'Price must be a valid number string',
      },
    },

    // ✅ DISCOUNT PRICE AS STRING
    discountedPrice: {
      type: String,
      validate: {
        validator: function (value) {
          if (value == null || value === '') return true;

          const discount = Number(value);
          const price = Number(this.price);

          if (isNaN(discount) || isNaN(price)) return false;

          return discount < price;
        },
        message: 'Discounted price must be a valid number and less than price',
      },
    },

    actual_price:{
      type: mongoose.Schema.Types.Decimal128,
      default:0
    },

    purchasedByHowMuch: {
      type: Number,
      default: 0,
    },

    modules: {
      type: [ModuleSchema],
      // validate: [(arr) => arr.length > 0, 'At least one module is required'],
    },

    // ⚠️ string ke liye min kaam nahi karta
    durationToComplete: {
      type: String,
      required: [true, 'Duration to complete is required'],
      trim: true,
    },

    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        value: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: { type: String },
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },
    
    total_enrolled_user: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
export default Course;
