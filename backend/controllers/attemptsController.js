/**
 * Attempts Controller
 * Handles code submission, retrieval, and dashboard stats
 */

const ProblemAttempt = require('../models/ProblemAttempt');
const { analyzeCode } = require('../services/codeAnalyzer');

/**
 * POST /api/attempts/submit
 * Submit a coding problem and solution for analysis
 */
const submitAttempt = async (req, res, next) => {
  try {
    const { problemTitle, problemDescription, code, language } = req.body;

    // Validate required fields
    if (!problemTitle || !problemDescription || !code || !language) {
      return res.status(400).json({
        error: 'problemTitle, problemDescription, code, and language are all required.'
      });
    }

    // Run the heuristic code analysis
    const analysis = analyzeCode(code, language, problemDescription);

    // Save attempt to database
    const attempt = await ProblemAttempt.create({
      userId: req.user._id,
      problemTitle: problemTitle.trim(),
      problemDescription: problemDescription.trim(),
      code,
      language,
      timeComplexity: analysis.timeComplexity,
      spaceComplexity: analysis.spaceComplexity,
      solutionType: analysis.solutionType,
      algorithmPattern: analysis.algorithmPattern,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      edgeCases: analysis.edgeCases,
      score: analysis.score,
      topics: analysis.topics
    });

    res.status(201).json({
      message: 'Solution submitted and analyzed successfully.',
      attempt
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    next(err);
  }
};

/**
 * GET /api/attempts/user/:id
 * Get all attempts for a specific user (paginated)
 */
const getUserAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Users can only see their own attempts
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ error: 'Access denied. You can only view your own attempts.' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      ProblemAttempt.find({ userId: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      ProblemAttempt.countDocuments({ userId: id })
    ]);

    res.json({
      attempts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/attempts/:id
 * Get a single attempt by its ID
 */
const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await ProblemAttempt.findById(req.params.id).select('-__v');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Ensure the attempt belongs to the requesting user
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ attempt });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid attempt ID.' });
    }
    next(err);
  }
};

/**
 * GET /api/attempts/dashboard/:userId
 * Get aggregated dashboard stats for a user
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const attempts = await ProblemAttempt.find({ userId }).select(
      'problemTitle topics score solutionType timeComplexity createdAt algorithmPattern'
    );

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        avgScore: 0,
        topicStats: [],
        strongTopics: [],
        weakTopics: [],
        solutionTypeBreakdown: {},
        recentAttempts: []
      });
    }

    // Count topics and calculate per-topic scores
    const topicScoreMap = {};
    for (const attempt of attempts) {
      for (const topic of attempt.topics || []) {
        if (!topicScoreMap[topic]) {
          topicScoreMap[topic] = { total: 0, count: 0 };
        }
        topicScoreMap[topic].total += attempt.score;
        topicScoreMap[topic].count += 1;
      }
    }

    const topicStats = Object.entries(topicScoreMap).map(([topic, data]) => ({
      topic,
      count: data.count,
      avgScore: Math.round(data.total / data.count)
    })).sort((a, b) => b.count - a.count);

    const strongTopics = topicStats.filter(t => t.avgScore >= 70).map(t => t.topic);
    const weakTopics = topicStats.filter(t => t.avgScore < 50).map(t => t.topic);

    // Solution type breakdown
    const solutionTypeBreakdown = attempts.reduce((acc, a) => {
      acc[a.solutionType] = (acc[a.solutionType] || 0) + 1;
      return acc;
    }, {});

    const avgScore = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
    );

    const recentAttempts = [...attempts]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(a => ({
        _id: a._id,
        problemTitle: a.problemTitle,
        score: a.score,
        solutionType: a.solutionType,
        timeComplexity: a.timeComplexity,
        createdAt: a.createdAt
      }));

    res.json({
      totalAttempts: attempts.length,
      avgScore,
      topicStats,
      strongTopics,
      weakTopics,
      solutionTypeBreakdown,
      recentAttempts
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitAttempt, getUserAttempts, getAttemptById, getDashboardStats };
