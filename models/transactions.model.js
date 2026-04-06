import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type must be either income or expense'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Salary', 'Investment', 'Others'], 
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, 
    },
    description: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Transaction must belong to a user'],
    },
  },
  { timestamps: true }
);


transactionSchema.index({ user: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;