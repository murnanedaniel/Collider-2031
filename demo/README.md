# ColliderLab MVP Demo

An interactive web application demonstrating Maja's journey investigating particle physics anomalies in 2031 using the ColliderLab platform.

## Features

- Beautiful welcome/authentication screen with fade-in animation
- Persistent navigation between screens
- Dashboard with credit counter and active bounty
- Foundation Space explorer with placeholder 3D visualization
- Time series analysis with interactive controls
- Modular simulation builder (lego-style)
- Solar confirmation with correlation analysis
- Comprehensive documentation system

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts (for future visualizations)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # NavigationBar, ScreenLayout
│   └── ui/              # Button, Card, CreditCounter, Modal, etc.
├── screens/             # Main application screens
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── FoundationSpace.jsx
│   ├── TimeAnalysis.jsx
│   ├── SimulationBuilder.jsx
│   └── SolarConfirmation.jsx
├── docs/                # Documentation pages
├── hooks/               # Custom React hooks
├── utils/               # Constants and utilities
└── styles/              # Global CSS
```

## Design Philosophy

- Minimal, light color scheme with lots of whitespace
- Futuristic but clean aesthetic
- Colors reserved primarily for visualizations
- Real application feel (not a slideshow)
- Persistent navigation allowing return to any screen

## Future Enhancements

- Add real 3D visualizations with Three.js
- Implement actual Recharts time series plots
- Add data generation script for realistic datasets
- Implement drag-and-drop for simulation builder
- Add more interactive controls and animations

