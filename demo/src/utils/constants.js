export const DETECTOR_COLORS = {
  ATLAS: '#e74c3c',
  CMS: '#3498db',
  LHCb: '#9b59b6',
  ALICE: '#2ecc71',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FOUNDATION: '/foundation',
  ANALYSIS: '/analysis',
  SIMULATION: '/simulation',
  SOLAR: '/solar',
  CALIBRATION: '/calibration',
  MEMBERS: '/members',
  TIMELINE: '/timeline',
  FUTURES: '/futures',
  DOCS: '/docs',
  METACOLLABORATION: '/metacollaboration',
  DETECTOR_DESIGN: '/detector-design',
  PROFILE: '/profile',
  DEPRECATED_AUTOANA: '/deprecated/autoana',
  TIMELINE_PROTOTYPE: '/prototype',
  ERIK: '/erik',
  SOFIA: '/sofia',
  ELENA: '/elena',
};

// ============================================================================
// CHARACTERS — the four playable protagonists.
// The presenter role-plays one at a time; `activeCharacter` (AgentContext)
// reparametrizes the shell. Each character owns an independent world-clock
// that resets to `startYear` on entry. `agentRelationship` is the one-line
// thesis (how the agents relate to this human) used in framing copy.
// ============================================================================
export const CHARACTERS = {
  maja: {
    id: 'maja',
    name: 'Maja Andersen',
    institution: 'ETH Zürich',
    field: 'Climate Science',
    affiliation: 'HiLumi M.C.',
    credits: 47832,
    storage_tb: 3.2,
    color: '#10b981',
    startYear: 2031,
    route: ROUTES.DASHBOARD,
    tagline: 'The outsider who finds new physics',
    agentRelationship: 'Agents democratize access for the outsider',
  },
  erik: {
    id: 'erik',
    name: 'Erik Hansen',
    institution: 'Niels Bohr Institute',
    field: 'Experimental HEP · PhD',
    affiliation: 'ATLAS',
    credits: 12400,
    storage_tb: 1.1,
    color: '#f59e0b',
    startYear: 2028,
    route: ROUTES.ERIK,
    tagline: 'The last traditional analyst',
    agentRelationship: 'Agents replace the analyst',
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Ricci',
    institution: 'INFN · CERN',
    field: 'Detector Validation · PhD',
    affiliation: 'HL-LHC Commissioning',
    credits: 28100,
    storage_tb: 2.4,
    color: '#8b5cf6',
    startYear: 2030,
    route: ROUTES.SOFIA,
    tagline: 'The validator the agents still need',
    agentRelationship: 'Agents miss what she catches',
  },
  elena: {
    id: 'elena',
    name: 'Elena Kowalski',
    institution: 'MIT',
    field: 'Full-stack Physicist · PhD',
    affiliation: 'MACE Collaboration',
    credits: 63500,
    storage_tb: 4.8,
    color: '#3b82f6',
    startYear: 2029,
    route: ROUTES.ELENA,
    tagline: 'She builds something new',
    agentRelationship: 'Agents amplify the builder',
  },
};

export const CHARACTER_ORDER = ['maja', 'erik', 'sofia', 'elena'];

// Back-compat alias: existing screens import MAJA_INFO directly.
export const MAJA_INFO = CHARACTERS.maja;
