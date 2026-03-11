/**
 * SubmitForm Component
 * Form for submitting a coding problem and solution
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attemptService } from '../services/api';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript'];

export default function SubmitForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    problemTitle: '',
    problemDescription: '',
    code: '',
    language: 'javascript'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.problemTitle.trim() || !form.problemDescription.trim() || !form.code.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await attemptService.submit(form);
      navigate(`/attempts/${data.attempt._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Problem Title */}
      <div>
        <label className="block text-xs text-muted font-mono mb-1.5 uppercase tracking-wider">
          Problem Title
        </label>
        <input
          name="problemTitle"
          value={form.problemTitle}
          onChange={handleChange}
          placeholder="e.g., Two Sum"
          className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright placeholder-muted focus:outline-none focus:border-acid transition-colors"
        />
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-xs text-muted font-mono mb-1.5 uppercase tracking-wider">
          Problem Description
        </label>
        <textarea
          name="problemDescription"
          value={form.problemDescription}
          onChange={handleChange}
          rows={4}
          placeholder="Given an array of integers nums and a target integer, return the indices of the two numbers that add up to target..."
          className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright placeholder-muted focus:outline-none focus:border-acid transition-colors resize-y"
        />
      </div>

      {/* Language Selector */}
      <div>
        <label className="block text-xs text-muted font-mono mb-1.5 uppercase tracking-wider">
          Language
        </label>
        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright focus:outline-none focus:border-acid transition-colors"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-muted font-mono uppercase tracking-wider">
            Your Solution
          </label>
          <span className="text-[10px] text-muted font-mono">{form.code.length} chars</span>
        </div>
        {/* Fake code editor header */}
        <div className="border border-border rounded overflow-hidden">
          <div className="bg-panel border-b border-border px-3 py-2 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-warn/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-acid/60"></div>
            <span className="text-muted text-[10px] font-mono ml-2">solution.{form.language === 'cpp' ? 'cpp' : form.language === 'java' ? 'java' : form.language === 'python' ? 'py' : 'js'}</span>
          </div>
          <textarea
            name="code"
            value={form.code}
            onChange={handleChange}
            rows={14}
            placeholder={`// Write your ${form.language} solution here...\n\nfunction twoSum(nums, target) {\n  // your code\n}`}
            className="code-textarea w-full bg-void-3 px-4 py-3 text-bright placeholder-muted focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-danger/30 bg-danger/5 rounded px-3 py-2 text-danger text-xs font-mono">
          ✗ {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-acid text-void font-mono font-bold text-sm rounded hover:bg-acid-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </>
        ) : (
          '→ Submit & Analyze'
        )}
      </button>
    </form>
  );
}
