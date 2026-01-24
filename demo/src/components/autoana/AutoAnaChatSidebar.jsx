import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';

function normalizeText(s) {
  return (s ?? '').toString().toLowerCase();
}

function makeId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildAssistantResponse({ tab, prompt, analysisId, config }) {
  const p = normalizeText(prompt);
  const t = normalizeText(tab);

  const baseHelp =
    t === 'overview'
      ? 'Use the prompt box to ask for plots, cut changes, or systematic checks. I will propose changes for your approval.'
      : t === 'configuration'
        ? 'Adjust parameters, then ask me to explain tradeoffs or propose safer defaults.'
        : t === 'running'
          ? 'Watch the workflow progress. Click jobs to view logs and context.'
          : t === 'results'
            ? 'Ask me to interpret the plots, explain anomalies, or suggest follow-up checks.'
            : 'Ask a physics question and I will propose next steps.';

  const proposals = [];

  if (p.includes('tighten') && (p.includes('met') || p.includes('missing') || p.includes('missing energy'))) {
    const next = Math.max((config?.metCutGeV ?? 200) + 50, 250);
    proposals.push({
      id: makeId('proposal'),
      kind: 'set_config',
      field: 'metCutGeV',
      value: next,
      title: `Tighten MET cut to ${next} GeV`,
      rationale: 'Reduce W+jets contamination by requiring higher missing transverse energy.',
    });
  }

  if (p.includes('show') && p.includes('dijet')) {
    proposals.push({
      id: makeId('proposal'),
      kind: 'navigate_tab',
      tab: 'results',
      title: 'Open Results tab',
      rationale: 'The dijet mass distribution is available in Results.',
    });
  }

  const summaryLines = [
    `AutoAna (deprecated) mock assistant for analysis: ${analysisId}.`,
    baseHelp,
  ];

  if (proposals.length > 0) {
    summaryLines.push('');
    summaryLines.push('I can propose the following for your review:');
    for (const pr of proposals) {
      summaryLines.push(`- ${pr.title} (${pr.rationale})`);
    }
  }

  return { text: summaryLines.join('\n'), proposals };
}

export default function AutoAnaChatSidebar({
  tab,
  analysisId,
  config,
  onPropose,
}) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      id: makeId('msg'),
      role: 'assistant',
      text:
        'This is a deprecated AutoAna legacy demo.\n' +
        'I can help you navigate the dashboard and propose configuration changes for approval.',
    },
  ]);

  const headerSubtitle = useMemo(() => {
    const map = {
      overview: 'Overview help & next steps',
      configuration: 'Configuration assistant',
      running: 'Workflow / logs assistant',
      results: 'Results interpretation',
    };
    return map[tab] ?? 'Assistant';
  }, [tab]);

  const send = () => {
    const prompt = draft.trim();
    if (!prompt) return;

    setDraft('');
    setMessages((prev) => [...prev, { id: makeId('msg'), role: 'user', text: prompt }]);

    const { text, proposals } = buildAssistantResponse({ tab, prompt, analysisId, config });
    setMessages((prev) => [...prev, { id: makeId('msg'), role: 'assistant', text }]);
    if (proposals.length > 0) onPropose?.(proposals);
  };

  return (
    <div className="sticky top-6">
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">chATLAS (mock)</div>
          <div className="font-medium">Assistant</div>
          <div className="text-xs text-gray-500 mt-1">{headerSubtitle}</div>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div
                className={`inline-block text-sm rounded-lg px-3 py-2 border whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-4 py-4">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder='e.g. "Tighten the MET cut to reduce W+jets"'
            />
            <button onClick={send} className="btn-primary py-2 px-4">
              Send
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            This is a deterministic mock. No external API calls.
          </div>
        </div>
      </Card>
    </div>
  );
}

