# Collider 2031

A design fiction exploring future particle physics infrastructure, set in 2031. Features ColliderLab, a democratized platform for HEP research, and follows climate scientist Maja Andersen as she hunts for anomalies in Foundation Space.

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17578821.svg)](https://doi.org/10.5281/zenodo.17578821)

## Demo & Documentation

- 🌐 **Interactive Demo**: https://collider-2031.com
- 📹 **Video Walkthrough**: [YouTube link - coming soon]
- 📄 **Framework Document**: [docs/collider-2031-framework.pdf](docs/collider-2031-framework.pdf) *(coming soon)*
- 📅 **Timeline**: [docs/timeline.md](docs/timeline.md)

## What is Collider 2031?

Collider 2031 is a design fiction project exploring what particle physics research could look like in 2031 if current trends in open data, AI, and distributed computing converge. Through an interactive demonstration of the ColliderLab platform and the story of Maja Andersen, it presents 40+ interconnected technical concepts for democratized, AI-native HEP infrastructure.

## Key Concepts

- **Hit-level open data** - All LHC events stored at full granularity
- **Distributed storage** - 200 EB across consumer devices
- **Foundation Space** - 100,000D learned latent space for HEP events
- **Geant5** - Differentiable, GPU-based detector simulation
- **Metacollaborations** - Cross-detector research communities
- **SiReAaaS** - Simulation, Reconstruction, Analysis as a Service
- **Adversarial Unfolding** - ML-based detector calibration
- **Credit Economy** - Distributed compute and storage marketplace

## Interactive Demo

The ColliderLab demo is a fully functional React application that tells Maja's story through interactive screens. Experience:

- **Login & Welcome** - Beautiful animated introduction to 2031
- **Dashboard** - View active bounties and credit balance
- **Foundation Space** - Explore the 100k-dimensional latent space
- **Simulation Builder** - Modular lego-style physics simulation
- **Calibration Results** - Adversarial unfolding visualization
- **Solar Confirmation** - The dramatic reveal of temporal correlation
- **Analysis Page** - Higgs vacuum stability tracker
- **Member Heatmap** - Distributed network and phone detector proposal
- **Documentation** - In-app technical explanations

### Running the Demo Locally

```bash
cd demo
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Building for Production

```bash
cd demo
npm run build
```

## Project Structure

```
collider2031/
├── README.md                 # This file
├── CITATION.cff             # Citation metadata
├── LICENSE                  # Dual license (CC-BY-4.0 + MIT)
├── .gitignore               # Git ignore rules
├── docs/                    # Public documentation
│   └── timeline.md          # 2025-2031 technology roadmap
└── demo/                    # Interactive React application
    ├── src/                 # React components and screens
    │   ├── components/      # UI components
    │   ├── screens/         # Main application screens
    │   ├── docs/            # In-app documentation
    │   └── utils/           # Constants and utilities
    ├── public/              # Static assets and data
    ├── dist/                # Production build
    └── package.json         # Dependencies
```

## Version History

- **v1.0** (2025-11-11): Initial release with core framework and demo
- **v1.1** (Planned): Enhanced documentation and arXiv paper

## Citation

If you use or build upon Collider 2031, please cite:

```bibtex
@software{murnane2025collider2031,
  author = {Murnane, Daniel},
  title = {Collider 2031: A Design Fiction for Future HEP Infrastructure},
  year = {2025},
  url = {https://collider-2031.com},
  doi = {10.5281/zenodo.17578821},
  version = {1.0.0}
}
```

See [CITATION.cff](CITATION.cff) for full citation details.

## How to Build On This Work

This work is released under CC-BY-4.0 (content) and MIT (code). You're welcome to:
- Build similar demonstrations
- Implement specific concepts
- Extend the worldbuilding
- Use in research or teaching

Please cite this repository appropriately. For substantial adaptations or collaborations, consider reaching out.

## Stack

Built with:
- **Framework**: React 18.3 + Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 6.26
- **Visualization**: Three.js, Recharts

## License

- **Content** (narrative, documentation, concepts): [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)
- **Code** (demo application): MIT License

See [LICENSE](LICENSE) for full details.

## Contact

**Daniel Murnane**
Niels Bohr Institute, University of Copenhagen
daniel.murnane@nbi.ku.dk
https://orcid.org/0000-0003-4046-4822

## Acknowledgments

This project draws inspiration from:
- The real HL-LHC upgrade program and CERN computing challenges
- Open science movements and data democratization efforts
- ML advances in physics (foundation models, differentiable simulation)
- Conversations with physicists about infrastructure futures

All characters and companies in this fiction are fictitious. Any resemblance to real persons or organizations is coincidental.

---

**Ready to explore?** Visit [collider-2031.com](https://collider-2031.com) or run the demo locally!
