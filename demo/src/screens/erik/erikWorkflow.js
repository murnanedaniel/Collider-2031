// Richer, realistic branched analysis DAG for Erik's AutoAna workspace.
// Data only — consumed by WorkflowDAG (id, name, depends_on). Inert until
// imported by ErikFlow; kept here so the node set is easy to tune.
//
// Shape matches WorkflowDAG's expectations: { id, name, depends_on: string[] }.
// A node may also carry { config } (YAML-ish text shown when the node is
// clicked) and { plot } (key into an intermediate-histogram set).

export const ERIK_DAG = [
  { id: 'data_skim', name: 'Data skim (L1 → ntuple)', depends_on: [] },
  { id: 'mc_signal', name: 'MC signal samples', depends_on: [] },
  { id: 'mc_bkg', name: 'MC background samples', depends_on: [] },
  { id: 'obj_calib', name: 'Object calibration', depends_on: ['data_skim'] },
  { id: 'tagging', name: 'ATLAS-X3 event tagging', depends_on: ['obj_calib', 'mc_signal', 'mc_bkg'] },
  { id: 'selection', name: 'Event selection', depends_on: ['obj_calib'] },
  { id: 'systematics', name: 'Systematic uncertainties', depends_on: ['selection', 'tagging'] },
  { id: 'bkg_estimate', name: 'Background estimation', depends_on: ['selection'] },
  { id: 'signal_region', name: 'Signal region', depends_on: ['selection', 'tagging'] },
  { id: 'sbi_fit', name: 'Neural SBI fit (unbinned)', depends_on: ['systematics', 'bkg_estimate', 'signal_region'] },
  { id: 'limits', name: 'Limit setting', depends_on: ['sbi_fit'] },
];

// Per-node YAML-ish config shown when a DAG node is clicked.
export const ERIK_NODE_CONFIG = {
  data_skim: 'input: /data/run3/HLT/ntuples\ntriggers: [HLT_j420, HLT_2j250]\nlumi_fb: 140',
  mc_signal: 'process: Zprime_dijet\nmasses_TeV: [2.0, 3.0, 4.0, 5.0]\ngenerator: MadGraph6+Pythia9',
  mc_bkg: 'process: QCD_dijet\nslices: [JZ3W .. JZ9W]\ngenerator: Pythia9',
  obj_calib: 'jets: AntiKt4EMPFlow\njes: GlobalSequentialCalibration\njer: in-situ 2031',
  tagging: 'model: ATLAS-X3\ninputs: [jet_pt, jet_eta, constituents]\noutput: event_score',
  selection: 'cuts:\n  met_gev: 200\n  jet_pt_min_gev: 50\n  rapidity_max: 2.4\n  mjj_min_gev: 1500',
  systematics: 'sources: [JES, JER, ATLAS-X3, lumi, pileup]\nmode: nuisance-parameters',
  bkg_estimate: 'method: smooth-fit (dijet function)\nvalidation: low-score sideband',
  signal_region: 'score_min: 0.85\nmjj_window_gev: [1500, 6000]',
  sbi_fit: 'method: neural simulation-based inference\nepochs: 40000\narch: masked-autoregressive-flow',
  limits: 'cl: 0.95\nmethod: CLs',
};

// Intermediate histogram bins per node (illustrative). Used to show sanity
// plots in the sidebar; `data` follows `sm` closely (no excess).
export const ERIK_NODE_PLOTS = {
  selection: {
    title: 'Dijet mass after selection',
    x_label: 'm_jj (GeV)',
    bins: [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000].map((x, i) => {
      const sm = Math.round(9000 * Math.exp(-i * 0.55));
      return { x, sm, data: sm + Math.round((i % 2 ? 1 : -1) * Math.sqrt(sm) * 0.6) };
    }),
  },
  tagging: {
    title: 'ATLAS-X3 event score',
    x_label: 'event score',
    bins: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((x, i) => {
      // background peaks low; signal MC peaks high
      const sm = Math.round(8000 * Math.exp(-i * 0.45));
      const bsm = Math.round(120 * Math.exp((i - 9) * 0.4));
      return { x, sm, data: sm, bsm };
    }),
  },
};
