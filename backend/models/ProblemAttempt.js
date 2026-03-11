/**
 * ProblemAttempt Model
 * Stores every code submission with analysis results
 */

const mongoose = require('mongoose');

const problemAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  problemTitle: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    maxlength: [200, 'Problem title too long']
  },
  problemDescription: {
    type: String,
    required: [true, 'Problem description is required'],
    maxlength: [5000, 'Problem description too long']
  },
  code: {
    type: String,
    required: [true, 'Code is required'],
    maxlength: [50000, 'Code too long']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'],
    lowercase: true
  },
  // ─── AI Analysis Results ─────────────────────────────────────────────────────
  timeComplexity: {
    type: String,
    default: 'Unknown'
  },
  spaceComplexity: {
    type: String,
    default: 'Unknown'
  },
  solutionType: {
    type: String,
    enum: ['brute-force', 'optimized', 'optimal', 'unknown'],
    default: 'unknown'
  },
  algorithmPattern: {
    type: String,
    default: 'Unknown'
  },
  feedback: {
    type: String,
    default: ''
  },
  suggestions: [{
    type: String
  }],
  edgeCases: [{
    type: String
  }],
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  topics: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// ─── Compound index for faster user queries ────────────────────────────────────
problemAttemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ProblemAttempt', problemAttemptSchema);
