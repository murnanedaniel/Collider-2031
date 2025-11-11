import React, { useState } from 'react';
import Card from './Card';

export default function BettingCard() {
  const [selectedBet, setSelectedBet] = useState(null);
  const [betAmount, setBetAmount] = useState(100);
  const [showConfirm, setShowConfirm] = useState(false);

  const bets = [
    {
      id: 'stability-stable',
      measurement: 'Higgs Vacuum Stability',
      outcome: 'Stable',
      odds: 8.5,
      probability: '12%',
    },
    {
      id: 'stability-metastable',
      measurement: 'Higgs Vacuum Stability',
      outcome: 'Metastable',
      odds: 1.2,
      probability: '84%',
    },
    {
      id: 'stability-unstable',
      measurement: 'Higgs Vacuum Stability',
      outcome: 'Unstable',
      odds: 25.0,
      probability: '4%',
    },
    {
      id: 'trilinear-excess',
      measurement: 'Trilinear Coupling',
      outcome: 'Excess > 2σ',
      odds: 3.5,
      probability: '28%',
    },
    {
      id: 'trilinear-sm',
      measurement: 'Trilinear Coupling',
      outcome: 'Consistent with SM',
      odds: 1.4,
      probability: '72%',
    },
  ];

  const handlePlaceBet = () => {
    const bet = bets.find(b => b.id === selectedBet);
    if (bet && betAmount > 0) {
      setShowConfirm(true);
      setTimeout(() => {
        alert(`Bet placed! ${betAmount} credits on "${bet.outcome}" at ${bet.odds}x odds. Potential payout: ${(betAmount * bet.odds).toLocaleString()} credits`);
        setShowConfirm(false);
        setSelectedBet(null);
        setBetAmount(100);
      }, 1000);
    }
  };

  return (
    <Card className="border-l-4 border-purple-500">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-light mb-1">Credit Betting</h3>
          <p className="text-sm text-gray-600">Wager credits on measurement outcomes</p>
        </div>

        {/* Available Bets */}
        <div className="space-y-2">
          {bets.map((bet) => (
            <button
              key={bet.id}
              onClick={() => setSelectedBet(bet.id)}
              className={`w-full text-left p-3 rounded border-2 transition-all ${
                selectedBet === bet.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{bet.measurement}</div>
                  <div className="font-medium">{bet.outcome}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-lg">{bet.odds}x</div>
                  <div className="text-xs text-gray-500">{bet.probability}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bet Controls */}
        {selectedBet && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Bet Amount: {betAmount} credits
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10</span>
                <span>1,000</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Potential payout:</span>
                <span className="font-medium">
                  {(betAmount * bets.find(b => b.id === selectedBet).odds).toLocaleString()} credits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net profit:</span>
                <span className="font-medium text-green-600">
                  +{((betAmount * bets.find(b => b.id === selectedBet).odds) - betAmount).toLocaleString()} credits
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={showConfirm}
              className="btn-primary w-full"
            >
              {showConfirm ? 'Placing Bet...' : 'Place Bet'}
            </button>
          </div>
        )}

        {/* Leaderboard Preview */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Top Bettors</span>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">1. T. Golling</span>
              <span className="font-medium">+127k credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">2. M. Pierini</span>
              <span className="font-medium">+89k credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">3. A. Schmidt</span>
              <span className="font-medium">+64k credits</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}


