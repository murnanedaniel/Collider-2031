# The Last Analysis: Particle Physics PhDs in the Age of AI Agents

## A Design Fiction for 2028–2034

---

## Executive Summary

Between 2028 and 2034, AI transforms high-energy physics from a labor-intensive craft practiced by thousands into an infrastructure-enabled science maintained by hundreds. This document explores what happens to PhD training when the traditional apprenticeship model—learning physics by doing analysis—becomes obsolete.

We follow four characters whose paths diverge as the field transforms:

- **Erik (2028–2030):** The last traditional analyst, stranded mid-thesis when agents achieve autonomy
- **Sofia (2029–2031):** The validator, essential but uncertain whether she's still a physicist
- **Maja (2031–2033):** The outsider, a climate scientist who enters through democratized access
- **Elena (2029–2032):** The full-stack physicist, who builds a tabletop experiment probing the same physics as the LHC

Their stories illuminate a deeper question: What is the irreducible human contribution to experimental physics?

---

## Part I: The Transformation

### 1.1 The State of Play (2025)

ATLAS has ~5,200 members. A typical analysis takes 2–3 years and involves:
- Writing and debugging analysis code
- Understanding detector systematics through hands-on iteration
- Navigating collaboration approval (Editorial Boards, review committees)
- Producing plots that appear in papers

PhD students learn physics *by doing this work*. The analysis is both the training and the output. Remove the analysis, and you remove the apprenticeship.

### 1.2 The 2028 Transition

By 2028, the AutoAna platform has matured. Students no longer write analysis code—they *manage* AI analysis pipelines:

**A Typical Week (2028):**
- Monday: Review overnight agent runs. Scout agent explored 200 selection variations; Skeptic agent flagged three systematic issues.
- Tuesday: Supervisor meeting focuses on physics interpretation, not code review.
- Wednesday: Specify new systematics in natural language; agents execute overnight.
- Thursday: Collaboration approval meeting—reviewers check judgment about trusting agents, not code quality.
- Friday: Writing shifts from analysis notes (agents draft these) to interpretation (still human domain).

**The Pedagogical Shift:**

The feedback loop becomes sub-second. "Show me the dijet mass distribution" → it appears. The student never leaves physics-mode. This enables Socratic teaching—supervisors can watch students think in real-time as data responds to questions.

But the bottleneck shifts: No longer "can you execute an analysis?" but rather:
- Can you formulate physics questions precisely?
- Can you recognize when agents are wrong?
- Can you defend choices you didn't manually make?
- Can you connect measurement to meaning?

### 1.3 The 2029 Inflection

Agents achieve **self-critique**. They can play both student AND supervisor roles. The human-in-loop becomes overhead for standard analyses.

This forces the question: Why are PhD students doing analyses at all?

**Three Responses Emerge:**

1. **Analysis becomes coursework** — Masters-level training, not PhD research
2. **Analysis is "solved"** — Like numerical integration. Experimentalists fork into hardware, theory/phenomenology, or infrastructure
3. **Go broad** — PhD spans the full chain (hardware + reconstruction + simulation + analysis + interpretation)

### 1.4 The Uncomfortable Truth

The mega-collaboration doesn't need O(1000) PhD students. Shrinkage happens via attrition, not announcement:
- Positions aren't renewed
- Funding agencies notice inefficiency
- Talent flows to other fields

By 2031, ATLAS has 847 members (down from 5,200 in 2025).

### 1.5 The Bidirectional Flow

What emerges is a bidirectional transformation:

**Outward (HEP as Resource):**
TeV-scale data becomes accessible to other fields. Climate scientists query Foundation Space for solar neutrino correlations. Condensed matter theorists check QCD constraints. HEP becomes like genomics databases—infrastructure other fields build on.

**Inward (Fabrication as Resource):**
By 2031, building a detector requires months not years, one person not fifty. 3D-printed scintillators, open-source electronics, AI-assisted design, cheap beam time, accurate simulation. This opens the question space—weird corners of physics become tractable as small experiments.

**The Core (Platform Operators):**
The collaboration persists but transformed: ~300 people maintaining detector operations, ML infrastructure, Foundation Space, and the API that both Maja (querying from outside) and Elena (building her own experiment) use.

---

## Part II: The Characters

### 2.1 Erik: The Stranded Analyst (2028–2030)

**Arc:** Traditional → Obsolete → Departure

Erik begins his PhD in 2028, just as AutoAna reaches maturity. His thesis is a search for heavy resonances in the dijet channel—classic bread-and-butter ATLAS physics.

**Year 1:** Erik learns to manage the pipeline. His Scout agent explores phase space; his Skeptic agent challenges assumptions. He feels productive, but something is off. He's not *doing* the physics—he's *supervising* it.

**Year 2:** The agents improve faster than Erik does. Self-critique capability means they catch their own mistakes. Erik's value-add shrinks. His supervisor starts asking: "What did *you* contribute that the agent couldn't?"

**Year 3:** Erik can't answer that question. His analysis is technically complete—the agents produced valid results—but he can't defend the choices in his thesis defense. He understands the physics, but he didn't *generate* the understanding through struggle.

**Departure:** Erik leaves the field. Not bitter, exactly—just dislocated. He takes a job in quantitative finance, where his skills at managing complex automated systems are valued. He still reads the arXiv sometimes.

**Erik's Function in the Narrative:**
He represents the end of the old model. His story is a cautionary tale, but also a compassionate one. The system failed him, not the reverse.

---

### 2.2 Sofia: The Validator (2029–2031)

**Arc:** Commissioning → Doubt → Quiet Pride

Sofia joins in 2029, just as HL-LHC commissioning begins. Her role: validate that the detector and reconstruction actually work. She catches subsystem failures that would corrupt downstream physics:

- ITk efficiency drops in a specific η region
- HGTD timing degradation under high pile-up
- Foundation Space embedding coverage gaps for rare topologies

**The Work:**
Sofia uses the ColliderLab validation dashboard. She's not doing analysis in the traditional sense—she's ensuring that *anyone* who does analysis (human or agent) can trust the inputs. Her notebooks are full of diagnostic plots: "Here's where the tracker fails. Here's why. Here's the fix."

**The Doubt:**
Is this physics, or engineering? Sofia struggles with identity. Her friends in theory look down on "service work." The agents don't need her to do analysis—they need her to tell them when the data is lying.

**The Resolution:**
Sofia finishes her PhD. Her thesis is titled "Validation of Track Reconstruction for the HL-LHC Inner Tracker." It's essential. It's rigorous. It's not glamorous. She's not sure what comes next, but she knows the physics couldn't happen without her.

**Sofia's Function in the Narrative:**
She represents the infrastructure path—the people who keep the machine honest. Her uncertainty reflects a real tension: we need validators, but we don't always value them.

---

### 2.3 Maja: The Outsider (2031–2033)

**Arc:** Climate Science → Anomaly Hunting → Discovery

Maja is a postdoc in atmospheric physics when she stumbles onto ColliderLab. She's studying solar neutrino correlations with terrestrial climate signals—fringe stuff, but Foundation Space makes the query possible.

**The Discovery:**
While exploring, Maja notices something odd: a cluster of events in Foundation Space that don't lie on the Standard Model manifold. They're not background. They're not known systematics. They're... something.

**The Bounty:**
ColliderLab has a bounty system for anomaly hunting. Maja flags the cluster. A human review panel (the remnant physics leadership) examines it. Initial skepticism gives way to interest. More data is collected. The anomaly persists.

**The Paper:**
Maja becomes co-first-author on a discovery paper. She never learned to write analysis code. She doesn't understand trigger systems. But she asked the right question, and Foundation Space gave her the tools to pursue it.

**Maja's Function in the Narrative:**
She represents the outward flow—HEP data as a resource for other fields. Her success validates the democratization thesis. But it also raises questions: If outsiders can discover new physics, what's special about being a particle physicist?

---

### 2.4 Elena: The Full-Stack Physicist (2029–2032)

**Arc:** Simulation → Hardware → Beam Test → Analysis → Foundation Space Commit

Elena is the protagonist. She represents what a PhD *could* become when the constraints change.

**The Insight:**
Elena realizes that "high-energy physics" doesn't require high-energy beams. The same Lagrangian terms ATLAS probes at TeV scales—kinetic mixing, dark photons, millicharged particles—can be probed at low energies with precision instruments. The approaches are complementary, not competing.

**The Project: MACE**
Elena builds the **Millicharge Accumulator with Cold-ion Electrometry** (MACE)—a tabletop experiment that searches for millicharged particles using:

1. A high-voltage (MV-scale) conducting shell that traps ambient millicharges
2. A single laser-cooled ion at the center, serving as an ultra-sensitive charge detector
3. Modulation schemes to discriminate signal from background

**The Timeline:**

| Year | Phase | Deliverable |
|------|-------|-------------|
| 2029 | Theory & Design | Technical Design Report, sensitivity projections |
| 2030 | Construction | Apparatus paper, first commissioning data |
| 2031 | Physics Run | Long integration, systematic studies, blind analysis |
| 2032 | Analysis & Thesis | Limit curve (or discovery!), Foundation Space commit |

**The Commit:**
When Elena's results are ready, she doesn't publish to a "tabletop experiments" archive. She commits to Foundation Space, in the **dark photon / millicharge sector**, alongside ATLAS limits. Her exclusion curve at low mass appears on the same plot as collider limits at high mass.

This is the vision: Foundation Space unifies all approaches to the same physics, regardless of the tool that generated them.

**Elena's Function in the Narrative:**
She represents the future—a physicist who spans hardware, simulation, analysis, and interpretation. Her workspace is ephemeral (it dissolves when the project ends), but her contribution to Foundation Space is permanent.

---

## Part III: Elena's Experiment — Technical Deep Dive

### 3.1 The Physics: Millicharged Particles

**Theoretical Motivation:**

If a hidden U(1)' gauge symmetry exists with its own "dark photon" A', and this dark photon kinetically mixes with the SM photon:

```
ℒ ⊃ -(ε/2) F_μν F'^μν
```

then particles χ charged under U(1)' acquire an effective electric charge:

```
q_χ = ε e' / e
```

Typical values: q_χ ~ 10⁻³ to 10⁻¹ times the electron charge—hence "millicharged."

**Why This Matters:**
- Kinetic mixing is dimension-4, renormalizable, radiatively stable
- Arises naturally in string theory (brane–antibrane configurations)
- mCPs are viable dark matter subcomponents
- Same parameter ε probed by ATLAS dark photon searches, just at different mass scales

**Key Papers:**
- Holdom 1986, Phys. Lett. B 166, 196 — foundational theory (~2000 citations)
- Berlin et al. 2025, arXiv:2510.25834 — the accumulator concept
- Berlin et al. 2025, arXiv:2510.25825 — Cavendish tests
- Budker et al. 2022, PRX Quantum 3, 010330 — ion traps for mCP detection
- Moore, Rider & Gratta 2014, PRL 113, 251801 — levitated microspheres

### 3.2 The Experimental Landscape

| Experiment | Technique | Mass Range | Status |
|------------|-----------|------------|--------|
| milliQan | Scintillator (33m from CMS) | 20 MeV – 10 GeV | Running |
| FORMOSA | Scintillator (forward of ATLAS) | 10 MeV – 100 GeV | Demonstrator 2025 |
| ArgoNeuT | LArTPC at Fermilab | 0.1 – 3 GeV | Published 2020 |
| Moore et al. | Levitated microspheres | Bound particles | Published 2014 |
| **MACE (Elena)** | Ion trap + accumulator | MeV – GeV (low ε) | Proposed |

### 3.3 The MACE Concept

**Core Innovation:**
Combine the Berlin accumulator (density enhancement) with ion-trap quantum sensing (nanoelectronvolt detection threshold).

**Apparatus:**

```
            ┌─────────────────────────────┐
            │   Outer Shell (grounded)    │
            │  ┌───────────────────────┐  │
            │  │  Accumulator Shell    │  │
            │  │  (1-5 MV, R~30cm)     │  │
            │  │  ┌─────────────────┐  │  │
            │  │  │                 │  │  │
            │  │  │   Paul Trap     │  │  │
            │  │  │   (single Ca⁺)  │  │  │
            │  │  │                 │  │  │
            │  │  └─────────────────┘  │  │
            │  └───────────────────────┘  │
            └─────────────────────────────┘
                        │
                        ▼
                   To laser system,
                   detection optics
```

**Detection Modes:**

1. **Heating Rate:** mCPs scattering off the ion transfer momentum, causing anomalous heating above the baseline
2. **Quantum Jumps:** Single mCP scatters cause discrete transitions in the ion's motional state
3. **Modulation:** Cycle accumulator voltage on/off; look for correlated signal variation

**Key Parameters:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Accumulator voltage | 1–5 MV | Limited by vacuum breakdown |
| Accumulator radius | 30 cm | Sets geometric acceptance |
| Integration time | Days–weeks | Longer = more accumulation |
| Ion trap frequency | ~1 MHz | Sets energy threshold (~neV) |
| Operating pressure | 10⁻⁶ mbar | Required for ion trap |
| Temperature | 4K–300K | Cryogenic improves accumulation |

**Sensitivity:**

For mCP mass m_χ = 100 MeV and charge ε = 10⁻³:
- Ambient cosmic-ray-produced density: n_χ ~ 10⁻² cm⁻³
- After accumulation (1 MV, 1 week): n_χ ~ 10⁴ cm⁻³
- Expected heating rate contribution: ~0.1 quanta/second
- Current baseline heating rates: ~1 quanta/second
- → Detectable with systematic control

### 3.4 Technical Challenges & Solutions

**Challenge 1: High-Voltage Stability**

*Problem:* Need MV-scale DC voltage in vacuum without breakdown or corona.

*Solution:* 
- Topology-optimized electrode geometry (AI-assisted design)
- Gradient-controlled dielectric coatings
- Active corona prediction and voltage feedback
- Possible cryogenic operation (higher breakdown threshold)

*Elena's contribution:* Design and fabricate a custom accumulator shell using additive manufacturing, optimized for field uniformity.

---

**Challenge 2: Ultra-Low Background**

*Problem:* Many sources mimic the mCP signal—patch potentials, radioactivity, cosmic ray muons, vibrational noise.

*Solution:*
- Two-ion correlation: Use ion pair, require correlated heating
- Voltage modulation: Signal should track accumulator state
- Day/night variation: Cosmic ray flux changes with atmospheric depth
- Shielding: Operate underground if needed

*Elena's contribution:* Develop ML-based anomaly detection trained on simulation, blind to mCP injection.

---

**Challenge 3: Simulation Pipeline**

*Problem:* Need end-to-end prediction from cosmic rays → mCP production → transport → accumulation → detection.

*Solution:*

```
Cosmic Ray Flux (CORSIKA) 
        │
        ▼
mCP Production (custom module, Drell-Yan + meson decay)
        │
        ▼
Atmospheric Propagation (Geant4 + EM fields)
        │
        ▼
Accumulator Dynamics (Boltzmann solver / PIC code)
        │
        ▼
Ion Response (quantum master equation)
        │
        ▼
Observable Prediction (heating rate vs. ε, m_χ)
```

*Elena's contribution:* Agent-orchestrated pipeline with automatic validation against ArgoNeuT and milliQan data.

### 3.5 The Collider Connection

Elena's limit curve appears on the **same plot** as LHC experiments:

```
       charge ε = q/e
           │
    10⁻¹   │   ██████ milliQan (LHC)
           │   ██████ FORMOSA (LHC)
    10⁻²   │        ░░░░░░░░░
           │        ░░░░░░░░░ ← Elena's MACE
    10⁻³   │             ░░░░░░░
           │                  ░░░
    10⁻⁴   │                     ░░
           └──────────────────────────
              MeV    GeV    TeV     mass
```

**Same Lagrangian, complementary windows.** ATLAS probes massive dark photons (GeV–TeV) via visible decays. Elena probes the massless/ultralight limit where the physical effect is the millicharge itself.

---

## Part IV: Foundation Space

### 4.1 What Is Foundation Space?

Foundation Space is the unified embedding that emerges from training foundation models on the full corpus of HEP data:
- Simulated events (SM + BSM hypotheses)
- Real collision data (reconstructed objects)
- Detector response functions
- Published measurements and limits

The result is a ~100,000-dimensional manifold where:
- The Standard Model forms a topological surface
- BSM physics appears as deviations from that surface
- All measurements—from ATLAS, CMS, Belle II, tabletop experiments—map to points in the same space

### 4.2 How Characters Interact with Foundation Space

**Maja (the outsider):**
Queries Foundation Space with natural language: "Show me events consistent with heavy neutral leptons decaying to tau + X." The embedding returns clusters, ranked by SM-deviation score. Maja doesn't need to understand triggers or reconstruction—she just explores.

**Sofia (the validator):**
Uses Foundation Space diagnostics to catch when embeddings go wrong. Her job: ensure the mapping from detector signals to Foundation Space is faithful. When ITk efficiency drops, the embedding distorts. Sofia catches this before it corrupts physics.

**Elena (the builder):**
Commits her results to Foundation Space. Her MACE exclusion isn't stored in a separate "tabletop" bucket—it's integrated into the dark photon sector, appearing on the same manifold as collider limits. Future physicists querying "millicharge constraints" get Elena's result alongside ATLAS.

### 4.3 The Permanence Principle

Individual workspaces are ephemeral. Erik's analysis environment dissolves when he leaves. Sofia's validation dashboards archive when HL-LHC commissioning ends.

But Foundation Space is permanent. It's the commons. Contributions persist; individual effort crystallizes into collective knowledge.

---

## Part V: Building the Demo

### 5.1 Existing Assets

The ColliderLab demo (github.com/murnanedaniel/Collider-2031) already demonstrates:
- Foundation Space visualization
- Query interface for anomaly hunting
- Basic bounty system

This needs to be extended with character-specific views.

### 5.2 Demo Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ColliderLab Platform                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Erik View  │  │ Sofia View  │  │  Maja View  │     │
│  │  (AutoAna)  │  │(Validation) │  │  (Query)    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Elena View (MACE)                   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │   │
│  │  │ Theory  │ │  Build  │ │   Run   │ │Commit │ │   │
│  │  │  Phase  │ │  Phase  │ │  Phase  │ │ Phase │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └───────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Foundation Space Viewer               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Erik's AutoAna Interface (2028)

**Purpose:** Show what analysis management looks like when agents do the heavy lifting.

**Key Elements:**
- Pipeline dashboard showing Scout/Skeptic/Scribe agents
- Natural language prompt input: "Tighten the MET cut to reduce W+jets"
- Real-time response: plots update, systematics recalculate
- Supervisor review queue: "Agent suggests X. Approve?"
- Deprecation notice (appears in 2029): "Human review is now optional for standard analyses"

**Interaction Flow:**
1. Erik types a physics question
2. Agents propose and execute strategies
3. Results appear instantly
4. Erik's role shifts from *doing* to *judging*

**Emotional Beat:** The interface is sleek and helpful—but it reveals Erik's obsolescence. He's productive, but not essential.

### 5.4 Sofia's Validation Dashboard (2029)

**Purpose:** Show the essential work of ensuring data quality.

**Key Elements:**
- Subsystem health monitors (ITk, HGTD, calorimeters)
- Foundation Space embedding coverage map
- Alert system: "Embedding distortion detected in region η ∈ [2.1, 2.3]"
- Diagnostic notebooks: Sofia's hand-written investigations
- Approval workflow: "Validation complete. Data certified for physics."

**Interaction Flow:**
1. Dashboard shows green across subsystems
2. Alert fires: ITk efficiency anomaly
3. Sofia drills down, finds the cause, proposes fix
4. Fix is implemented; embedding re-validated
5. Green again. Physics can proceed.

**Emotional Beat:** The work is invisible when it works. Sofia only becomes visible when something breaks.

### 5.5 Maja's Query Interface (2031)

**Purpose:** Show how outsiders access HEP data through Foundation Space.

**Key Elements:**
- Natural language query bar
- Foundation Space visualization (dimensionality-reduced)
- Anomaly clusters highlighted
- Bounty board: open questions with rewards
- Cross-domain connections: "This cluster may relate to [solar physics paper]"

**Interaction Flow:**
1. Maja queries: "Events with missing energy + displaced vertex"
2. Foundation Space returns clusters
3. One cluster is off-manifold—doesn't match known SM or BSM
4. Maja flags it for human review
5. Review panel examines; bounty awarded

**Emotional Beat:** The interface empowers discovery without requiring HEP expertise. But it also raises the question: what's the role of the expert?

### 5.6 Elena's MACE Workspace (2029–2032)

**Purpose:** Show the full arc of a small-experiment PhD.

**Key Phases:**

**Phase 1: Theory (2029)**
- Literature agent summarizes millicharge constraints
- Sensitivity calculator: input apparatus parameters, output reach
- Design optimizer: vary geometry, voltage, integration time
- Output: Technical Design Report (auto-generated skeleton, human-refined)

**Phase 2: Build (2030)**
- CAD viewer for accumulator shell
- Fabrication queue status
- Assembly checklist with AI-verified steps
- Commissioning plots: "First trapped ion achieved"

**Phase 3: Run (2031)**
- Live data dashboard: heating rate vs. time
- Accumulator voltage modulation status
- Blind analysis box (signal region hidden)
- Systematic studies panel

**Phase 4: Commit (2032)**
- Unblinding ceremony: reveal signal region
- Limit curve generator
- Foundation Space commit interface
- Integration confirmation: "Your result now appears in dark photon sector"

**Emotional Beat:** Elena's workspace evolves organically with her project. It starts as a folder, becomes a dashboard, mutates through phases, and eventually dissolves—but her contribution to Foundation Space persists.

### 5.7 Foundation Space Viewer

**Purpose:** The shared substrate underlying all views.

**Key Elements:**
- 3D projection of the embedding (t-SNE or UMAP)
- SM manifold highlighted
- User results overlaid (Elena's limit, Maja's anomaly)
- Historical data: limits from all experiments, all eras
- Query interface: "What constraints exist on kinetic mixing ε for m < 100 MeV?"

**Key Feature:** When Elena commits her result, it appears here—not in a separate "tabletop" section, but integrated into the physics.

---

## Part VI: Key Scenes

### 6.1 Erik's Thesis Defense (2030)

**Setup:** Erik presents his dijet resonance search. The agents produced valid results. But the committee probes deeper.

**Dialogue:**

> COMMITTEE MEMBER: "Walk us through the choice of jet energy scale uncertainty."
>
> ERIK: "The Skeptic agent flagged three options. I approved the conservative one."
>
> COMMITTEE MEMBER: "Why that one?"
>
> ERIK: "It... seemed reasonable? The agent's explanation was convincing."
>
> COMMITTEE MEMBER: "But what's *your* physical intuition? If the agent were wrong, how would you know?"
>
> (Silence.)

**Resolution:** Erik passes, but barely. He knows the committee is right. He understood the result but didn't generate the understanding.

---

### 6.2 Sofia's 3 AM Alert (2030)

**Setup:** Sofia is asleep when her phone buzzes. The validation system has flagged a critical anomaly.

**Scene:**

The dashboard glows red: "Foundation Space embedding divergence in forward region. Affected analyses: 847."

Sofia pulls up the diagnostics. The ITk efficiency in the forward region has degraded—not a sensor failure, but a calibration drift. The agents didn't catch it because the effect is subtle, buried in the tails.

She traces the cause: a firmware update three weeks ago introduced a timing offset. The agents treated the resulting data as valid. Only Sofia's validation caught the discrepancy.

She writes the fix, pushes it to the calibration queue, watches the embedding stabilize.

At 5 AM, she goes back to sleep. No one will thank her. The physics will simply work.

---

### 6.3 Maja's Discovery (2032)

**Setup:** Maja has been poking at Foundation Space for months, looking for correlations with solar data. She finds something unexpected.

**Scene:**

The cluster appears as a faint smudge off the SM manifold. Maja almost dismisses it—probably a systematic she doesn't understand. But she flags it anyway.

The review panel—three grizzled experimentalists who remember hand-scanning bubble chamber film—examine the events. Their skepticism melts into interest. This isn't a known background. This isn't a known signal. This is... new.

Six months of additional data-taking. The cluster persists. Statistics improve. A paper is drafted.

Maja's name goes first. She doesn't understand calorimeter calibration. She's never touched a PMT. But she asked the right question.

---

### 6.4 Elena's Unblinding (2032)

**Setup:** Elena has run MACE for eight months. The signal region has been hidden. Today, she opens the box.

**Scene:**

Her workspace shows the final plot. Heating rate vs. accumulator voltage. The blue band is the expected background. The red line is the mCP prediction for ε = 10⁻³.

She clicks "Unblind."

The data points appear. They're... consistent with background. No excess.

Elena exhales. Not a discovery. But not a failure either. Her limit curve extends two orders of magnitude below previous experiments for masses below 100 MeV. She's probed the cosmic ray floor—the irreducible prediction.

She opens the Foundation Space commit interface. Types a description. Uploads the likelihood.

A moment later, confirmation: "Result integrated. Dark photon sector updated."

She pulls up the combined plot. There's ATLAS at high mass. milliQan at intermediate mass. And now, at low mass and low charge, a new curve labeled "MACE (2032)."

Her workspace will dissolve tomorrow. The code will archive. The apparatus will be repurposed. But this—the physics—will remain.

---

## Part VII: Themes and Questions

### 7.1 The Irreducible Human

What can't be automated?

- **Taste:** Choosing which questions matter
- **Judgment:** Recognizing when systems fail
- **Meaning:** Connecting measurement to understanding
- **Responsibility:** Standing behind results

### 7.2 The Value of Struggle

Erik's failure isn't that he's stupid—it's that he didn't struggle. The agents solved his problems before he could learn from them.

Elena's success isn't that she's smarter—it's that she built something with her hands. The struggle was productive.

Is there a way to preserve productive struggle in an age of capable agents?

### 7.3 The Democratization Dilemma

Maja's discovery is beautiful—an outsider contributing to fundamental physics. But it raises uncomfortable questions:

- If anyone can query Foundation Space, what's special about being a physicist?
- If analysis is automated, what's the apprenticeship?
- If the collaboration shrinks, who maintains the infrastructure?

### 7.4 The Infrastructure Trap

Sofia's work is essential but invisible. She's proud of it, but uncertain about her future. The field needs validators, but:

- Are they physicists or engineers?
- How do we train them if analysis is automated?
- How do we value them if their work only shows when it fails?

---

## Part VIII: Technical Appendix

### 8.1 Curriculum for the AI-Native Physicist

What should Elena have learned before starting her PhD?

**Undergraduate:**
- Classical mechanics, E&M, quantum, statistical mechanics
- Programming (Python, basics of ML)
- Laboratory skills (electronics, vacuum, optics)

**First-year graduate:**
- Particle physics phenomenology (SM + BSM survey)
- Detector physics (interactions of radiation with matter)
- Statistical methods (frequentist and Bayesian)
- Agent-assisted analysis practicum

**PhD-specific (Elena's track):**
- Precision measurement techniques
- Quantum sensing (ion traps, optomechanics)
- Small-experiment design and fabrication
- Foundation Space integration

### 8.2 Reading List

**Theory:**
- Holdom 1986, Phys. Lett. B 166, 196 (kinetic mixing)
- Berlin et al. 2019, PRD 99, 075001 (LDMX physics case)
- Davidson, Hannestad & Raffelt 2000, JHEP 05, 003 (mCP bounds review)

**Experiment:**
- Berlin et al. 2025, arXiv:2510.25834 (accumulator concept)
- Berlin et al. 2025, arXiv:2510.25825 (Cavendish tests)
- Budker et al. 2022, PRX Quantum 3, 010330 (ion trap detection)
- Moore, Rider & Gratta 2014, PRL 113, 251801 (levitated microspheres)
- ArgoNeuT 2020, PRL 124, 131801 (LArTPC search)
- FORMOSA 2025, arXiv:2504.12973 (forward LHC search)

**Design Fiction / Methodology:**
- Sterling, "Design Fiction" (Interactions, 2009)
- Dunne & Raby, "Speculative Everything" (MIT Press, 2013)

---

## Part IX: Production Notes

### 9.1 Target Audience

- **Primary:** HEP insiders (graduate students, postdocs, faculty)
- **Secondary:** Science policy makers, funding agencies
- **Tertiary:** General public interested in physics futures

### 9.2 Tone

- Compassionate toward all characters (no villains)
- Technically grounded (physics should be real)
- Emotionally honest (acknowledge loss alongside gain)
- Hopeful but not utopian

### 9.3 Format Options

1. **Interactive web demo** — Primary deliverable
2. **Narrative essay** — For publication (e.g., CERN Courier, Physics Today)
3. **Conference talk** — For ACAT 2025, CHEP, etc.
4. **Academic paper** — On design fiction methodology in physics

### 9.4 Open Questions

- What specific physics should Maja discover? (Current placeholder: unspecified anomaly)
- How detailed should the AutoAna interface be?
- Should Erik's story be softened or left as a cautionary tale?
- What's the emotional climax? (Currently: Elena's Foundation Space commit)

---

## Conclusion

This design fiction is not a prediction. It's a provocation—a way of asking:

*If AI agents can do analysis, what's left for physicists to do?*

The answer we propose: **Build new tools. Ask new questions. Connect measurement to meaning.**

Erik's tragedy is that he was trained for a world that no longer exists. Sofia's quiet pride is that she ensures the world works at all. Maja's joy is that the world opened up to include her. Elena's triumph is that she built something new.

The field will shrink. The methods will change. But the physics—the irreducible human need to understand the universe—will remain.

---

*Document version: 2026-01-23*
*Author: Daniel + Claude collaboration*
*Status: Draft for review*