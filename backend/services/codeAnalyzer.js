/**
 * Code Analyzer Service
 * Heuristic-based engine that analyzes submitted code and returns insights.
 * Uses pattern matching on code structure, keywords, and logic to infer:
 * - Time & Space Complexity
 * - Solution Type (brute-force vs optimized)
 * - Algorithm Pattern
 * - Suggestions & Edge Cases
 */

// ─── Complexity Detection ──────────────────────────────────────────────────────

/**
 * Count nested loop depth in code
 */
function countNestedLoops(code) {
  const loopKeywords = /\b(for|while|forEach|map|filter|reduce|every|some)\b/g;
  const lines = code.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;

  for (const line of lines) {
    const matches = line.match(loopKeywords);
    if (matches) currentDepth += matches.length;
    // Reset on function boundaries (rough heuristic)
    if (line.match(/^(function|def|class)\s/)) currentDepth = 0;
    maxDepth = Math.max(maxDepth, currentDepth);
  }
  return maxDepth;
}

/**
 * Detect time complexity based on code patterns
 */
function detectTimeComplexity(code) {
  const normalized = code.toLowerCase();

  // O(1) - no loops, just direct operations
  const hasNoLoops = !normalized.match(/\b(for|while|foreach|\.map|\.filter|\.reduce)\b/);
  if (hasNoLoops && !normalized.includes('recursion') && !normalized.includes('recursive')) {
    return 'O(1)';
  }

  // O(log n) - binary search patterns
  if (
    normalized.includes('mid') && normalized.includes('left') && normalized.includes('right') ||
    normalized.includes('binary search') ||
    normalized.match(/\bleft\s*\+\s*.*\bright\b/) ||
    normalized.includes('Math.floor') && normalized.includes('left') && normalized.includes('right')
  ) {
    return 'O(log n)';
  }

  // O(n log n) - sorting
  if (
    normalized.includes('.sort(') ||
    normalized.includes('mergesort') ||
    normalized.includes('merge sort') ||
    normalized.includes('quicksort') ||
    normalized.includes('quick sort') ||
    normalized.includes('heapsort')
  ) {
    return 'O(n log n)';
  }

  // O(n^3) or worse - triple nested loops
  const loopDepth = countNestedLoops(code);
  if (loopDepth >= 3) return 'O(n³) or worse';

  // O(n^2) - double nested loops
  if (loopDepth === 2) return 'O(n²)';

  // O(2^n) - exponential recursion
  if (
    normalized.includes('fibonacci') ||
    (normalized.includes('recursiv') && !normalized.includes('memo') && !normalized.includes('dp'))
  ) {
    return 'O(2^n)';
  }

  // O(n) - single loop
  if (loopDepth === 1) return 'O(n)';

  return 'O(n)';
}

/**
 * Detect space complexity
 */
function detectSpaceComplexity(code) {
  const normalized = code.toLowerCase();

  // O(1) space - only primitive variables, no collections
  const hasCollections = normalized.match(/\b(map|set|dict|list|array|\[\]|{}|new array|new map|new set|hashmap|hashtable)\b/);
  const hasRecursion = normalized.match(/\b(recursive|recursion|return.*\(.*\()\b/);

  if (!hasCollections && !hasRecursion) return 'O(1)';

  // O(n) space - uses one collection proportional to input
  if (hasCollections) return 'O(n)';

  // O(n) for recursion stack
  if (hasRecursion) return 'O(n)';

  return 'O(n)';
}

// ─── Pattern Detection ─────────────────────────────────────────────────────────

/**
 * Detect algorithm patterns used in the code
 */
function detectAlgorithmPattern(code, description = '') {
  const normalized = (code + ' ' + description).toLowerCase();
  const patterns = [];

  const patternMap = [
    { pattern: /two.?pointer|left.*right|start.*end/i, label: 'Two Pointers' },
    { pattern: /sliding.?window|window.?size/i, label: 'Sliding Window' },
    { pattern: /binary.?search|mid\s*=|left.*right.*mid/i, label: 'Binary Search' },
    { pattern: /dynamic.?program|dp\[|memo\[|memoiz|tabulation/i, label: 'Dynamic Programming' },
    { pattern: /bfs|breadth.?first|queue\.push|dequeue/i, label: 'BFS (Breadth-First Search)' },
    { pattern: /dfs|depth.?first|stack\.push|visited\[/i, label: 'DFS (Depth-First Search)' },
    { pattern: /hash.?map|hash.?table|new map|{}.*\[|dictionary/i, label: 'Hash Map' },
    { pattern: /quick.?sort|merge.?sort|heap.?sort/i, label: 'Sorting Algorithm' },
    { pattern: /\.sort\(/i, label: 'Built-in Sort' },
    { pattern: /greedy|max.*profit|min.*cost/i, label: 'Greedy' },
    { pattern: /backtrack|permut|combin/i, label: 'Backtracking' },
    { pattern: /trie|prefix.?tree/i, label: 'Trie' },
    { pattern: /heap|priority.?queue|min.?heap|max.?heap/i, label: 'Heap/Priority Queue' },
    { pattern: /union.?find|disjoint/i, label: 'Union-Find' },
    { pattern: /recursion|recursive|base.?case/i, label: 'Recursion' },
    { pattern: /prefix.?sum|running.?sum/i, label: 'Prefix Sum' },
    { pattern: /monotonic.?stack|decreasing.?stack/i, label: 'Monotonic Stack' },
  ];

  for (const { pattern, label } of patternMap) {
    if (pattern.test(normalized)) patterns.push(label);
  }

  return patterns.length > 0 ? patterns.join(', ') : 'Brute Force / Iteration';
}

/**
 * Identify the topics this problem likely covers
 */
function detectTopics(code, description = '') {
  const normalized = (code + ' ' + description).toLowerCase();
  const topics = [];

  const topicMap = [
    { pattern: /array|\[\]|list/i, label: 'Arrays' },
    { pattern: /string|char|substr|split|join/i, label: 'Strings' },
    { pattern: /tree|node|left|right|root/i, label: 'Trees' },
    { pattern: /graph|vertex|edge|adj/i, label: 'Graphs' },
    { pattern: /stack|push|pop/i, label: 'Stack' },
    { pattern: /queue|enqueue|dequeue/i, label: 'Queue' },
    { pattern: /linked.?list|next\.|prev\./i, label: 'Linked Lists' },
    { pattern: /hash|map|set/i, label: 'Hash Tables' },
    { pattern: /dp\[|memo|tabulation/i, label: 'Dynamic Programming' },
    { pattern: /sort|order/i, label: 'Sorting' },
    { pattern: /binary.?search|log n/i, label: 'Binary Search' },
    { pattern: /recursion|recursive/i, label: 'Recursion' },
    { pattern: /math|prime|factorial|gcd/i, label: 'Math' },
    { pattern: /bit|xor|shift|&|\|/i, label: 'Bit Manipulation' },
  ];

  for (const { pattern, label } of topicMap) {
    if (pattern.test(normalized)) topics.push(label);
  }

  return [...new Set(topics)].slice(0, 5); // Deduplicate and cap at 5
}

// ─── Solution Quality Assessment ──────────────────────────────────────────────

/**
 * Determine if solution is brute force or optimized
 */
function assessSolutionType(code, timeComplexity) {
  if (['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'].includes(timeComplexity)) {
    const normalized = code.toLowerCase();
    if (
      normalized.includes('map') || normalized.includes('set') ||
      normalized.includes('dp') || normalized.includes('memo') ||
      normalized.includes('binary') || normalized.includes('two pointer')
    ) {
      return timeComplexity === 'O(1)' || timeComplexity === 'O(log n)' ? 'optimal' : 'optimized';
    }
  }
  if (['O(n²)', 'O(n³) or worse', 'O(2^n)'].includes(timeComplexity)) {
    return 'brute-force';
  }
  return 'optimized';
}

/**
 * Score the solution from 0–100
 */
function scoreSubmission(timeComplexity, solutionType, codeLength) {
  let score = 50; // Base score

  // Complexity scoring
  const complexityScores = {
    'O(1)': 40, 'O(log n)': 35, 'O(n)': 30,
    'O(n log n)': 20, 'O(n²)': 5, 'O(n³) or worse': 0, 'O(2^n)': 0
  };
  score += (complexityScores[timeComplexity] ?? 10);

  // Solution type bonus
  if (solutionType === 'optimal') score += 10;
  else if (solutionType === 'optimized') score += 5;

  // Penalize for very short (suspicious) or very long (messy) code
  if (codeLength < 20) score -= 10;
  if (codeLength > 2000) score -= 5;

  return Math.min(100, Math.max(0, score));
}

// ─── Feedback Generation ───────────────────────────────────────────────────────

/**
 * Generate improvement suggestions based on analysis
 */
function generateSuggestions(code, timeComplexity, pattern, language) {
  const suggestions = [];
  const normalized = code.toLowerCase();

  // Complexity-specific suggestions
  if (timeComplexity === 'O(n²)') {
    suggestions.push('Consider using a Hash Map to reduce time complexity from O(n²) to O(n).');
    suggestions.push('Two-pointer technique might work here if the input is sorted.');
  }
  if (timeComplexity === 'O(2^n)') {
    suggestions.push('Memoization (top-down DP) can drastically reduce repeated subproblem computation.');
    suggestions.push('Consider converting to bottom-up dynamic programming for O(n) or O(n²) complexity.');
  }
  if (timeComplexity === 'O(n³) or worse') {
    suggestions.push('Triple nested loops are a red flag. Try to collapse one dimension with a smarter data structure.');
  }

  // Pattern-specific suggestions
  if (!normalized.includes('map') && !normalized.includes('set') && timeComplexity !== 'O(1)') {
    suggestions.push('Hash Maps/Sets can often convert O(n²) lookups into O(1) lookups — worth exploring.');
  }
  if (normalized.match(/for.*for/s) && !normalized.includes('break')) {
    suggestions.push('If you find the answer early, use `break` or `return` to exit loops early and save time.');
  }

  // General code quality
  if (!normalized.includes('//') && !normalized.includes('#')) {
    suggestions.push('Add comments to explain your logic — especially the key algorithmic insight.');
  }
  if (code.length > 1500) {
    suggestions.push('Consider refactoring into helper functions to improve readability and reusability.');
  }

  // Language-specific
  if (language === 'javascript' && !normalized.includes('const') && !normalized.includes('let')) {
    suggestions.push('Use `const` and `let` instead of `var` for proper scoping in modern JavaScript.');
  }
  if (language === 'python' && normalized.includes('range(len(')) {
    suggestions.push('In Python, prefer `enumerate()` over `range(len(arr))` for cleaner, more Pythonic code.');
  }

  return suggestions.slice(0, 4); // Return at most 4 suggestions
}

/**
 * Generate edge case reminders
 */
function generateEdgeCases(code, description) {
  const edgeCases = [];
  const normalized = (code + ' ' + (description || '')).toLowerCase();

  // Common edge cases based on data structure
  if (normalized.match(/array|list|\[\]/)) {
    edgeCases.push('Empty array input []');
    edgeCases.push('Array with a single element');
  }
  if (normalized.match(/string|char/)) {
    edgeCases.push('Empty string ""');
    edgeCases.push('String with all identical characters (e.g., "aaaa")');
  }
  if (normalized.match(/tree|node|root/)) {
    edgeCases.push('Null/empty tree (root = null)');
    edgeCases.push('Tree with only one node');
    edgeCases.push('Skewed tree (all nodes in one direction)');
  }
  if (normalized.match(/number|integer|num/)) {
    edgeCases.push('Negative numbers');
    edgeCases.push('Zero as input');
    edgeCases.push('Integer overflow (very large numbers)');
  }

  // Check if they handle null/undefined
  if (!normalized.includes('null') && !normalized.includes('none') && !normalized.includes('undefined')) {
    edgeCases.push('Null/undefined inputs — consider adding guard clauses');
  }

  // Duplicate elements
  if (!normalized.includes('set') && !normalized.includes('unique') && !normalized.includes('duplicate')) {
    edgeCases.push('Duplicate elements in input');
  }

  return [...new Set(edgeCases)].slice(0, 4);
}

/**
 * Generate overall feedback summary
 */
function generateFeedback(solutionType, timeComplexity, pattern, score) {
  const qualityMap = {
    'optimal': 'Excellent work! Your solution appears to be highly optimized.',
    'optimized': 'Good job! Your solution uses an efficient approach.',
    'brute-force': 'Your solution is functionally correct but uses a brute-force approach.',
    'unknown': 'Your solution has been analyzed. See suggestions for improvements.'
  };

  const base = qualityMap[solutionType] || qualityMap['unknown'];
  const complexityNote = `Detected time complexity: ${timeComplexity}.`;
  const patternNote = pattern !== 'Brute Force / Iteration'
    ? `You used the ${pattern} pattern — a solid choice.`
    : 'Consider whether a known algorithm pattern (e.g., Two Pointers, Hash Map, DP) could improve efficiency.';

  const scoreNote = score >= 80
    ? 'Overall, this is a strong submission!'
    : score >= 60
      ? 'This is a decent attempt with room for improvement.'
      : 'There are several ways to significantly improve this solution.';

  return `${base} ${complexityNote} ${patternNote} ${scoreNote}`;
}

// ─── Main Analyzer Export ──────────────────────────────────────────────────────

/**
 * Analyze a code submission and return full analysis report
 * @param {string} code - The submitted source code
 * @param {string} language - Programming language
 * @param {string} problemDescription - Problem statement
 * @returns {object} Full analysis result
 */
function analyzeCode(code, language = 'javascript', problemDescription = '') {
  const timeComplexity = detectTimeComplexity(code);
  const spaceComplexity = detectSpaceComplexity(code);
  const algorithmPattern = detectAlgorithmPattern(code, problemDescription);
  const solutionType = assessSolutionType(code, timeComplexity);
  const topics = detectTopics(code, problemDescription);
  const suggestions = generateSuggestions(code, timeComplexity, algorithmPattern, language);
  const edgeCases = generateEdgeCases(code, problemDescription);
  const score = scoreSubmission(timeComplexity, solutionType, code.length);
  const feedback = generateFeedback(solutionType, timeComplexity, algorithmPattern, score);

  return {
    timeComplexity,
    spaceComplexity,
    algorithmPattern,
    solutionType,
    topics,
    suggestions,
    edgeCases,
    score,
    feedback
  };
}

module.exports = { analyzeCode };
