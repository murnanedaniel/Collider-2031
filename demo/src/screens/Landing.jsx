import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-4">
          Collider 2031
        </h1>
        <div className="text-xl md:text-2xl text-gray-500 font-light mb-8">
          A Design Fiction
        </div>

        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          What if particle physics was open, distributed, and AI-native? Explore a world where anyone can hunt for new physics using ColliderLab.
        </p>

        <div className="bg-gray-50 border-l-4 border-gray-900 p-6 rounded-lg mb-10">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            <strong className="text-gray-900">The year is 2031.</strong> After the Swiss Data Transparency Act, all LHC data is public and stored across millions of devices. Climate scientist Maja Andersen is hunting for anomalies in Foundation Space—a 100,000-dimensional learned representation of all particle physics events. Using differentiable simulation and distributed computing, she discovers that mysterious detector signals correlate perfectly with solar flares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full text-base md:text-lg py-4"
          >
            → Enter ColliderLab
          </Button>

          <Button
            onClick={() => window.open('https://github.com/murnanedaniel/Collider-2031', '_blank')}
            variant="secondary"
            className="w-full text-base md:text-lg py-4"
          >
            &lt;/&gt; View on GitHub
          </Button>

          <Button
            disabled
            variant="secondary"
            className="w-full text-base md:text-lg py-4 opacity-50 cursor-not-allowed"
          >
            📹 Video (Coming Soon)
          </Button>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="mb-2">A design fiction by <strong className="text-gray-900">Daniel Murnane</strong></p>
          <p className="text-sm mb-4">Niels Bohr Institute, University of Copenhagen</p>
          <a
            href="https://doi.org/10.5281/zenodo.17578821"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://zenodo.org/badge/DOI/10.5281/zenodo.17578821.svg"
              alt="DOI"
              className="h-5"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
