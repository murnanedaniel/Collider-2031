import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';

import TimelineHeaderVisualization from '@/components/viz/TimelineHeaderVisualization';

export default function Timeline() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Find all year sections
      const yearElements = [];
      for (let year = 2025; year <= 2031; year++) {
        const el = document.getElementById(`year-${year}`);
        if (el) yearElements.push({ year, el });
      }

      if (yearElements.length === 0) {
        // Fallback to simple scroll if elements not ready
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
        return;
      }

      // Calculate progress based on which year section is in view
      // We want the dot to be at 'year' when that year's section hits the top (minus offset)
      // And move towards 'year+1' as we scroll through the section

      const offset = 200; // Pixel offset from top where "active" starts
      const scrollY = window.scrollY + offset;

      // Find current interval
      let currentYearIndex = -1;
      for (let i = 0; i < yearElements.length; i++) {
        if (scrollY >= yearElements[i].el.offsetTop) {
          currentYearIndex = i;
        } else {
          break;
        }
      }

      let semanticProgress = 0;

      if (currentYearIndex === -1) {
        // Before 2025
        const firstTop = yearElements[0].el.offsetTop;
        semanticProgress = Math.max(0, scrollY / firstTop) * (1 / 7) * 0.5; // Just a little movement before start
      } else if (currentYearIndex >= yearElements.length - 1) {
        // After 2031 (last section)
        // Map 2031 -> 2032 based on progress through the last section
        const currentEl = yearElements[currentYearIndex].el;
        const sectionHeight = currentEl.offsetHeight;
        const progressInSection = Math.min(1, (scrollY - currentEl.offsetTop) / sectionHeight);

        // Map index 6 (2031) to index 7 (2032)
        semanticProgress = (6 + progressInSection) / 7;
      } else {
        // Between years
        const currentEl = yearElements[currentYearIndex].el;
        const nextEl = yearElements[currentYearIndex + 1].el;

        const sectionStart = currentEl.offsetTop;
        const sectionEnd = nextEl.offsetTop;
        const sectionHeight = sectionEnd - sectionStart;

        const progressInSection = (scrollY - sectionStart) / sectionHeight;

        // Map current index to next index
        semanticProgress = (currentYearIndex + progressInSection) / 7;
      }

      setScrollProgress(Math.min(Math.max(semanticProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, collapsedSections]);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    fetch(`${baseUrl}docs/timeline.md`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load timeline');
        return res.text();
      })
      .then(text => {
        setMarkdown(text);
        // Initialize collapsed sections - collapse everything after "2031: Discovery Enablement & Maja's Story"
        const collapsedState = {};
        const mainSections = [
          'Key Technology Trajectories',
          'Critical Inflection Points',
          'Alternative Scenarios',
          'Real-World Dependencies',
          'Turning Points That Could Derail This Timeline',
          'Cultural Shifts Required'
        ];
        mainSections.forEach(section => {
          collapsedState[section] = true;
        });
        setCollapsedSections(collapsedState);
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
        <Card className="bg-red-50 border-red-200">
          <div className="text-center py-8 text-red-700">
            <p className="text-lg font-medium mb-2">Failed to load timeline</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </Card>
      </ScreenLayout>
    );
  }

  // Configure marked for better rendering
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Parse markdown into sections
  const parseMarkdownIntoSections = (md) => {
    const lines = md.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect h2 headers (main sections)
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        currentSection = {
          title: line.replace('## ', ''),
          level: 2
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Add final section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return sections;
  };

  const sections = parseMarkdownIntoSections(markdown);

  const toggleSection = (title) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <ScreenLayout
      title="Timeline to ColliderLab"
      subtitle="The path from today to Maja's discovery (2025-2031)"
    >
      <TimelineHeaderVisualization progress={scrollProgress} />

      <Card className="bg-blue-50 border-blue-200 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800 leading-relaxed">
            <p className="mb-2">
              This timeline traces the technological, political, and cultural shifts from today's
              traditional collaborations to Maja's 2031 discovery workflow.
            </p>
            <p className="font-medium">
              Overall probability of this exact timeline: ~2% (requires multiple
              low-probability events to align perfectly)
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {sections.map((section, idx) => {
          const isCollapsed = collapsedSections[section.title];
          const isMainTimeline = section.title.includes('Discovery Enablement');

          // Try to extract year from title for semantic scrolling
          const yearMatch = section.title.match(/^(\d{4}):/);
          const yearId = yearMatch ? `year-${yearMatch[1]}` : undefined;

          return (
            <div key={idx} id={yearId} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${isCollapsed
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <h2 className="text-xl font-light text-left">
                  {section.title}
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 ml-4 transition-transform ${isCollapsed ? '' : 'rotate-180'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {!isCollapsed && (
                <div
                  className="px-6 py-4 bg-white border-t border-gray-200 timeline-content"
                  dangerouslySetInnerHTML={{ __html: marked.parse(section.content) }}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#374151'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .timeline-content h1 {
          font-size: 2.25rem;
          font-weight: 300;
          margin-bottom: 2rem;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.75rem;
        }

        .timeline-content h2 {
          font-size: 1.875rem;
          font-weight: 400;
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1f2937;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 0.5rem;
        }

        .timeline-content h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .timeline-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .timeline-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
          list-style-type: disc;
        }

        .timeline-content li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }

        .timeline-content strong {
          font-weight: 600;
          color: #111827;
        }

        .timeline-content em {
          font-style: italic;
          color: #6b7280;
        }

        .timeline-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .timeline-content hr {
          margin: 2rem 0;
          border: 0;
          border-top: 1px solid #e5e7eb;
        }

        .timeline-content a {
          color: #2563eb;
          text-decoration: none;
        }

        .timeline-content a:hover {
          text-decoration: underline;
        }

        .timeline-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin-left: 0;
          margin-bottom: 1.5rem;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </ScreenLayout>
  );
}
