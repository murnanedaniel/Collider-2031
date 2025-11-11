import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import FoundationSpaceDoc from './FoundationSpaceDoc';
import MetacollaborationDoc from './MetacollaborationDoc';
import Geant5Doc from './Geant5Doc';
import MadgraphDoc from './MadgraphDoc';
import SiReAaaSDoc from './SiReAaaSDoc';
import OpenDataDoc from './OpenDataDoc';
import { ROUTES } from '@/utils/constants';

const DOCS = {
  'foundation-space': { component: FoundationSpaceDoc, title: 'Foundation Space' },
  'metacollaboration': { component: MetacollaborationDoc, title: 'Metacollaborations' },
  'geant5': { component: Geant5Doc, title: 'Geant5 Differentiable Simulation' },
  'madgraph': { component: MadgraphDoc, title: 'MadGraph 6' },
  'sireaas': { component: SiReAaaSDoc, title: 'SiReAaaS Platform' },
  'open-data': { component: OpenDataDoc, title: 'Open Data Mandate' },
};

export default function DocsPage() {
  const { docId } = useParams();
  const navigate = useNavigate();

  if (!docId) {
    // Index page showing all docs
    return (
      <ScreenLayout title="Documentation" subtitle="Learn about ColliderLab's core technologies">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(DOCS).map(([id, { title }]) => (
            <Link key={id} to={`${ROUTES.DOCS}/${id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-gray-600">Click to read more →</p>
              </Card>
            </Link>
          ))}
        </div>
      </ScreenLayout>
    );
  }

  const doc = DOCS[docId];
  
  if (!doc) {
    return (
      <ScreenLayout>
        <Card>
          <h2 className="text-2xl font-light mb-4">Documentation Not Found</h2>
          <button onClick={() => navigate(ROUTES.DOCS)} className="btn-secondary">
            ← Back to Docs
          </button>
        </Card>
      </ScreenLayout>
    );
  }

  const DocComponent = doc.component;

  return (
    <ScreenLayout>
      <div className="mb-6">
        <button onClick={() => navigate(ROUTES.DOCS)} className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to all documentation
        </button>
      </div>
      <Card className="prose prose-sm max-w-none">
        <DocComponent />
      </Card>
    </ScreenLayout>
  );
}

