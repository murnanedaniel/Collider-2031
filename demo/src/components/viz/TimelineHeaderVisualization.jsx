import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';

export default function TimelineHeaderVisualization({ progress }) {
    // Years from the timeline subtitle: 2025-2032
    const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];

    return (
        <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300 transform -mx-8 px-8 mb-8">
            <div className="py-4">
                <div className="relative h-12 flex items-center">
                    {/* Main timeline track */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 rounded-full" />

                    {/* Progress bar (colored) */}
                    <div
                        className="absolute left-0 top-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-100 ease-out"
                        style={{ width: `${progress * 100}%` }}
                    />

                    {/* Current position indicator (The "Traveler") */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-lg border-2 border-white transition-all duration-100 ease-out z-10 flex items-center justify-center transform -translate-x-1/2"
                        style={{ left: `${progress * 100}%` }}
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>

                    {/* Year markers */}
                    <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                        {years.map((year, index) => {
                            // Calculate position for this year
                            const yearProgress = index / (years.length - 1);
                            const isActive = progress >= yearProgress;
                            const isCurrent = Math.abs(progress - yearProgress) < 0.05;

                            return (
                                <div
                                    key={year}
                                    className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400'
                                        }`}
                                >
                                    {/* Dot on the line */}
                                    <div
                                        className={`w-2 h-2 rounded-full mb-2 transition-all duration-300 ${isActive ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                                            }`}
                                    />

                                    {/* Year Label */}
                                    <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${isCurrent ? 'scale-110 font-bold' : ''
                                        }`}>
                                        {year}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
