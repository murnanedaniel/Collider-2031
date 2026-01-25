import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import FoundationSpaceDoc from './FoundationSpaceDoc';
import MetacollaborationDoc from './MetacollaborationDoc';
import Geant5Doc from './Geant5Doc';
import MadgraphDoc from './MadgraphDoc';
import SiReAsDoc from './SiReASDoc';
import OpenDataDoc from './OpenDataDoc';
import DistributedStorageDoc from './DistributedStorageDoc';
import CreditEconomyDoc from './CreditEconomyDoc';
import HZZAnalysisDoc from './HZZAnalysisDoc';
import { ROUTES } from '@/utils/constants';

const DOCS = {
  'foundation-space': { component: FoundationSpaceDoc, title: 'Foundation Space' },
  'metacollaboration': { component: MetacollaborationDoc, title: 'Metacollaborations' },
  'geant5': { component: Geant5Doc, title: 'Geant5 Differentiable Simulation' },
  'madgraph': { component: MadgraphDoc, title: 'MadGraph 6' },
  'sireaas': { component: SiReAsDoc, title: 'SiReAs Platform' },
  'open-data': { component: OpenDataDoc, title: 'Open Data Mandate' },
  'distributed-storage': { component: DistributedStorageDoc, title: 'Distributed Storage' },
  'credit-economy': { component: CreditEconomyDoc, title: 'Credit Economy' },
  'hzz-analysis': { component: HZZAnalysisDoc, title: 'H→ZZ*→4l Analysis' },
};

export default function DocsPage() {
  const { docId } = useParams();
  const navigate = useNavigate();

  if (!docId) {
    // Index page showing all docs
    return (
      <ScreenLayout title="Documentation" subtitle="Learn about ColliderLab's core technologies">
        <div className="space-y-8">
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

          <Card className="border-l-4 border-yellow-500 bg-yellow-50">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-yellow-900 uppercase tracking-wide mb-1">Deprecated / legacy</div>
                <h3 className="font-medium text-yellow-900">AutoAna (legacy demo)</h3>
              </div>
              <div className="text-sm text-yellow-800">
                This area is deprecated and preserved for historical reference. Outputs are simulated and may be wrong.
              </div>
              <div>
                <Link to={ROUTES.DEPRECATED_AUTOANA} className="btn-secondary">
                  Open AutoAna (deprecated) →
                </Link>
              </div>
            </div>
          </Card>
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

