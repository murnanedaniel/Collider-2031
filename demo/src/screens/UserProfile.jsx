import React from 'react';
import { Link } from 'react-router-dom';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Card from '@/components/ui/Card';
import { MAJA_INFO, ROUTES } from '@/utils/constants';
import { formatStorage, formatCredits } from '@/utils/formatting';

export default function UserProfile() {
    const recentActivity = [
        {
            id: 1,
            type: 'discovery',
            title: 'Solar-enhanced detector anomaly discovered',
            description: 'Identified temporal correlation between LHC anomalies and solar flares',
            date: '2031-06-14',
            credits: '+15,000'
        },
        {
            id: 2,
            type: 'analysis',
            title: 'Foundation Space analysis completed',
            description: 'Anomaly pattern study in 100k-dimensional latent space',
            date: '2031-06-13',
            credits: '+500'
        },
        {
            id: 3,
            type: 'simulation',
            title: 'Solar flare simulation run',
            description: 'Generated 100M events with Solaris 7.5 + Geant5',
            date: '2031-06-12',
            credits: '-4,700'
        },
        {
            id: 4,
            type: 'contribution',
            title: 'Storage contribution milestone',
            description: 'Reached 3.2 TB distributed storage contribution',
            date: '2031-06-10',
            credits: '+2,400'
        }
    ];

    const publications = [
        {
            title: 'Temporal Correlation of Detector Anomalies with Solar Activity',
            status: 'In preparation',
            collaboration: 'HiLumi M.C.',
            date: '2031-06'
        },
        {
            title: 'Model-Independent Anomaly Detection in Foundation Space',
            status: 'Submitted to JHEP',
            collaboration: 'HiLumi M.C.',
            date: '2031-05'
        }
    ];

    return (
        <ScreenLayout title={MAJA_INFO.name} subtitle={`${MAJA_INFO.institution} • ${MAJA_INFO.field}`}>
            <div className="space-y-8">
                {/* Profile Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-light mb-2">{formatCredits(MAJA_INFO.credits)}</div>
                            <div className="text-sm text-gray-600">GPU Credits</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-light mb-2">{formatStorage(MAJA_INFO.storage_tb)}</div>
                            <div className="text-sm text-gray-600">Storage Contributed</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-light mb-2">12,847</div>
                            <div className="text-sm text-gray-600">Compute Hours</div>
                        </div>
                    </Card>
                </div>

                {/* About */}
                <Card>
                    <h3 className="text-lg font-medium mb-4">About</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium">{MAJA_INFO.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Institution</span>
                            <span className="font-medium">{MAJA_INFO.institution}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Primary Field</span>
                            <span className="font-medium">{MAJA_INFO.field}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Metacollaboration</span>
                            <Link to={ROUTES.METACOLLABORATION}>
                                <span className="font-medium text-blue-600 hover:text-blue-700">{MAJA_INFO.affiliation}</span>
                            </Link>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Member Since</span>
                            <span className="font-medium">January 2030</span>
                        </div>
                    </div>
                </Card>

                {/* Bio */}
                <Card className="bg-gray-50">
                    <h3 className="text-lg font-medium mb-3">Bio</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Climate scientist turned particle physics researcher. After the Swiss Data Transparency
                        Act opened LHC data to the public, Maja joined the HiLumi Metacollaboration to apply
                        machine learning techniques from climate modeling to anomaly detection in particle physics.
                        Her interdisciplinary approach led to the discovery of temporal correlations between
                        detector anomalies and solar flare events—a finding that has implications for detector
                        calibration and background modeling in future experiments.
                    </p>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="border-l-4 border-gray-200 pl-4 py-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{activity.title}</div>
                                        <div className="text-xs text-gray-600 mt-1">{activity.description}</div>
                                        <div className="text-xs text-gray-400 mt-1">{activity.date}</div>
                                    </div>
                                    <div className={`text-sm font-medium ml-4 ${activity.credits.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {activity.credits}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Publications */}
                <Card>
                    <h3 className="text-lg font-medium mb-4">Publications</h3>
                    <div className="space-y-4">
                        {publications.map((pub, idx) => (
                            <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                <div className="font-medium text-sm mb-1">{pub.title}</div>
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                    <span>{pub.collaboration}</span>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">{pub.status}</span>
                                    <span>•</span>
                                    <span>{pub.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Specializations */}
                <Card>
                    <h3 className="text-lg font-medium mb-4">Research Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {[
                            'Anomaly Detection',
                            'Foundation Models',
                            'Cross-Detector Analysis',
                            'Solar-Terrestrial Physics',
                            'Machine Learning',
                            'Model-Independent Searches',
                            'Distributed Computing'
                        ].map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                    <Link to={ROUTES.DASHBOARD}>
                        <button className="btn-secondary">← Back to Dashboard</button>
                    </Link>
                </div>
            </div>
        </ScreenLayout>
    );
}
