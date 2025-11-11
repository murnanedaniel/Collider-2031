import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import ScreenLayout from '@/components/layout/ScreenLayout';

export default function Timeline() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    fetch(`${baseUrl}docs/timeline.md`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load timeline');
        return res.text();
      })
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading timeline:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ScreenLayout
        title="Timeline to ColliderLab"
        subtitle="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout
        title="Timeline to ColliderLab"
        subtitle="Error loading timeline"
      >
        <div className="text-center py-12 text-red-600">
          Failed to load timeline. Please try again later.
        </div>
      </ScreenLayout>
    );
  }

  const htmlContent = marked.parse(markdown);

  return (
    <ScreenLayout
      title="Timeline to ColliderLab"
      subtitle="The path from today to Maja's discovery (2025-2031)"
    >
      <div
        className="prose prose-slate max-w-none
          prose-headings:font-light
          prose-h1:text-4xl prose-h1:mb-8
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-ul:my-4 prose-li:my-2
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-em:text-gray-600
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-hr:my-8 prose-hr:border-gray-300"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </ScreenLayout>
  );
}
