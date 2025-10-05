import React, { useState } from 'react';

export default function Leaderboard({ title, subtitle, data, type }) {
  const [sortBy, setSortBy] = useState('verifiedCount');

  const getSortOptions = () => {
    if (type === 'citizen') {
      return [
        { value: 'verifiedCount', label: 'Verified Count' },
        { value: 'totalReported', label: 'Total Reported' },
        { value: 'mostResolved', label: 'Most Resolved' }
      ];
    } else if (type === 'wards') {
      return [
        { value: 'resolvedCount', label: 'Resolved Count' },
        { value: 'ward', label: 'Ward Name' },
        { value: 'efficiency', label: 'Efficiency' }
      ];
    } else {
      return [
        { value: 'resolvedCount', label: 'Resolved Count' },
        { value: 'district', label: 'District Name' },
        { value: 'efficiency', label: 'Efficiency' }
      ];
    }
  };

  const getSortedData = () => {
    return [...data].sort((a, b) => {
      if (type === 'citizen') {
        switch (sortBy) {
          case 'verifiedCount':
            return b.verifiedCount - a.verifiedCount;
          case 'totalReported':
            return (b.totalReported || 0) - (a.totalReported || 0);
          case 'mostResolved':
            return (b.mostResolved || 0) - (a.mostResolved || 0);
          default:
            return b.verifiedCount - a.verifiedCount;
        }
      } else if (type === 'wards') {
        switch (sortBy) {
          case 'resolvedCount':
            return b.resolvedCount - a.resolvedCount;
          case 'ward':
            return a.ward.localeCompare(b.ward);
          case 'efficiency':
            return (b.efficiency || 0) - (a.efficiency || 0);
          default:
            return b.resolvedCount - a.resolvedCount;
        }
      } else {
        switch (sortBy) {
          case 'resolvedCount':
            return b.resolvedCount - a.resolvedCount;
          case 'district':
            return a.district.localeCompare(b.district);
          case 'efficiency':
            return (b.efficiency || 0) - (a.efficiency || 0);
          default:
            return b.resolvedCount - a.resolvedCount;
        }
      }
    });
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return '👑';
    }
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <div className="punjab-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold punjab-text-primary">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="punjab-select text-sm"
        >
          {getSortOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {getSortedData().map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`text-2xl font-bold ${getRankColor(item.rank)}`}>
                {getRankIcon(item.rank)}
              </div>
              
              {type === 'citizen' ? (
                <>
                  <div className="w-12 h-12 bg-punjab-mustard rounded-full flex items-center justify-center text-xl">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.city}</div>
                  </div>
                </>
              ) : type === 'wards' ? (
                <div>
                  <div className="font-semibold text-gray-900">{item.ward}</div>
                  <div className="text-sm text-gray-600">{item.city}</div>
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-900">{item.district}</div>
                  <div className="text-sm text-gray-600">{item.mcAdmin}</div>
                </div>
              )}
            </div>

            <div className="text-right">
              {type === 'citizen' ? (
                <div className="text-2xl font-bold punjab-text-accent">
                  {item.verifiedCount}
                </div>
              ) : type === 'wards' ? (
                <div className="text-2xl font-bold punjab-text-accent">
                  {item.resolvedCount}
                </div>
              ) : (
                <div className="text-2xl font-bold punjab-text-accent">
                  {item.resolvedCount}
                </div>
              )}
              <div className="text-sm text-gray-600">
                {type === 'citizen' ? 'Verified' : type === 'wards' ? 'Resolved' : 'Resolved'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div>No data available</div>
        </div>
      )}
    </div>
  );
}
