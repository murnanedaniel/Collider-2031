import React, { useState, useRef, useEffect } from 'react';

// Glossary of simulation concepts, in plain language.
export const GLOSSARY = {
  pivoted: {
    title: 'Pivoted',
    body: 'The funding conversion happened: at least two of the big national funders re-labeled their particle-physics money from analyst salaries to hardware, operations and archives — with an authorized programme actually receiving it. "Mostly late" because in the great majority of these histories the conversion arrives only AFTER years of cuts, not before them.',
  },
  'muddle-through': {
    title: 'Muddle-through',
    body: 'No coordinated response ever happens. Funding erodes in scattered, uncoordinated steps; nobody formally converts the money to new purposes; the field simply gets smaller without ever having the conversation. The second most likely future.',
  },
  disorderly: {
    title: 'Disorderly',
    body: 'The damage reaches the machine itself: FCC construction is paused pending refinancing, or deep cuts spread across three or more countries with nothing built to replace what was lost.',
  },
  hollowed: {
    title: 'Hollowed out',
    body: 'Three or more national funding blocs cut deeply and the conversion never arrives. The machine may still be built — contracts are hard to stop — while the human field around it empties, one grant renewal at a time.',
  },
  intact: {
    title: 'Intact',
    body: 'No major national funder has yet cut its particle-physics grants. Where every history starts in 2026.',
  },
  cutting: {
    title: 'Cutting',
    body: 'At least one major funder has trimmed (10–20%: studentships and short-term postdocs first) or cut deeply (30–50%) — and no replacement programme exists yet to receive the freed money. The cutting wave typically arrives around 2029, when grant panels start asking: "which result required your funded people?"',
  },
  converting: {
    title: 'Converting',
    body: 'The conversion package has been appropriated — a real, authorized budget line now exists that can receive money re-labeled from analysis salaries to hardware, operations and archives — but fewer than two big funders have actually moved their money yet.',
  },
  converted: {
    title: 'Converted',
    body: 'Two or more of the big national funders now spend their particle-physics money on instrumentation, engineering, computing and archive stewardship instead of analyst salaries. The field is smaller but re-purposed.',
  },
  conversion: {
    title: 'The conversion package',
    body: 'A pre-agreed plan, adopted by CERN Council and the national agencies together, that re-labels national funding from analyst salaries toward hardware, operations, computing and archives — triggered automatically when measured automation crosses agreed thresholds, so no single country has to confess first. "Proposed" means it is on the table; "appropriated" means real budget lines exist. The simulation’s sharpest number: it arrives BEFORE the first cuts in only 8% of histories.',
  },
  trim: {
    title: 'Trim',
    body: 'A 10–20% cut to a national grant line — typically new studentships and fixed-term postdoc positions first, since those expire on their own. The politically easiest cut.',
  },
  'deep cut': {
    title: 'Deep cut',
    body: 'A 30–50% cut to a national grant line. Universities keep their permanent professors for a while but stop replacing departures; PhD places largely disappear.',
  },
  rescope: {
    title: 'Re-scope',
    body: 'A funder moves more than a quarter of its grant line from analysis into instrumentation, operations and archives. Only possible once a receiving programme exists — you cannot re-label money that has nowhere to go.',
  },
  'machine-led': {
    title: 'Machine-led analysis',
    body: 'A physics analysis where AI systems chose the strategy, executed it, and wrote it up — humans at most reviewed. The simulation tracks two different things: how much of this is happening in fact, and how much of it funding panels can SEE. The gap between the two (rebadging analysts as "AI-physics researchers", quiet relabeling) typically lasts years, and collapses fast once any agency asks the direct question.',
  },
  consultations: {
    title: 'The 2026 consultations',
    body: 'The French débat public (June–October 2026) and the parallel Swiss consultation on hosting the FCC. Legally they only inform the decision — but their outcome (clean pass, redesign demands, delay demands, or blockage) is the first big fork in every simulated history, and it is happening right now.',
  },
  fcc: {
    title: 'The FCC',
    body: 'The Future Circular Collider: a proposed 91 km ring under France and Switzerland, price ~CHF 15.3 billion for its first (electron–positron) stage. CERN Council decides by end-2028. In the simulation, once construction starts it is the most shock-proof object in the model: contracts are armored, people are soft.',
  },
  'approved (gated)': {
    title: 'Approved with gates',
    body: 'Conditional authorization: the project proceeds, but Council re-confirms it annually against financing and milestone conditions. The single most likely 2028 outcome in the simulation — more likely than clean full approval.',
  },
  descope: {
    title: 'Descoped',
    body: 'The project is shrunk to save money — for example from four detector experiments to two — while the tunnel and the long-term plan are preserved. The tunnel is always the last thing sacrificed.',
  },
  paused: {
    title: 'Paused',
    body: 'Construction halted pending refinancing — the megaproject failure mode. Usually triggered by a large cost overrun landing in bad fiscal weather with no conversion programme in place to defend the project politically.',
  },
  rrb: {
    title: 'The funding boards (RRB)',
    body: 'The twice-yearly Resource Review Boards where funding agencies approve each experiment’s running costs — historically charged per PhD-author (~CHF 10,000 each). As author counts fall, this formula breaks, and in 95% of simulated histories the boards switch to charging for services instead: the moment automation gets formally priced. The single most inevitable event in the model.',
  },
  'muon demonstrator': {
    title: 'The muon cooling demonstrator',
    body: 'A test facility (~CHF 0.2B) that would prove "6D muon cooling" — the missing technology for a muon collider, the only known machine whose physics actually improves with energy. It is the cheap option on the field’s only multi-TeV future. In the simulation it survives with real dates and funding in only 14% of histories; usually it is deferred or kept at paper-study level.',
  },
  cepc: {
    title: 'CEPC',
    body: 'China’s proposed circular collider — a direct competitor to the FCC. Left out of the current five-year plan; expected to be re-proposed around 2030 (the simulation gives approval ~45%). Its approval stiffens European resolve while FCC is healthy, and becomes an exit excuse if FCC is already in trouble.',
  },
  'structured judgments': {
    title: 'Structured judgments',
    body: 'These probabilities were assigned by AI reasoning systems working from sourced calendars, historical base rates and explicit decision memos — then stress-tested. They are disciplined estimates of shape and ordering, not calibrated forecasts. Treat the percentages as "roughly", never as "precisely".',
  },
  cuts: {
    title: 'The cuts',
    body: 'National grant reductions at the regular renewal reviews (the UK’s four-year grant rounds, Germany’s three-year calls, and their counterparts). In 97% of simulated histories at least one big funder cuts; the median first cut lands in 2029.',
  },
};

export function Term({ k, children, className = '' }) {
  const info = GLOSSARY[k];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  if (!info) return <span className={className}>{children}</span>;
  return (
    <span ref={ref} className={`relative inline-block ${className}`}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="border-b border-dotted border-indigo-400 text-inherit cursor-help">
        {children}
      </button>
      {open && (
        <span className="absolute z-50 left-0 top-full mt-1 w-72 max-w-[80vw] rounded-lg border border-gray-200 bg-white p-3 shadow-xl text-left normal-case">
          <span className="block text-sm font-semibold text-gray-800 mb-1">{info.title}</span>
          <span className="block text-xs leading-relaxed text-gray-600">{info.body}</span>
        </span>
      )}
    </span>
  );
}

// Legend row of clickable term chips (for chart categories).
export function TermChips({ items, colors }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {items.map(([key, label]) => (
        <span key={key} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
          {colors && <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: colors[key.split('|')[1] || key] }} />}
          <Term k={key.split('|')[0]}>{label}</Term>
        </span>
      ))}
    </div>
  );
}
