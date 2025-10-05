import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
// Use lightweight sample SVG to avoid heavy DOM and layout erosion
import mapSvg from '../assets/punjab_districts_sample.svg?raw';

export default function HeatmapDistrict({ districts, onDistrictClick }) {
  const [districtData, setDistrictData] = useState({});
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const svgContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistrictData();
  }, []);

  const fetchDistrictData = async () => {
    try {
      setLoading(true);
      // Fetch heatmap stats sequentially
      const res = await API.get('/super-admin/district-stats');
      const data = {};
      (res.data?.districts || []).forEach((d) => {
        data[normalizeDistrictName(d.district)] = {
          total: d.total,
          resolved: d.resolved,
          pending: d.pending,
          verified: d.verified,
          mcAdmin: d.mcAdmin,
        };
      });
      if (Object.keys(data).length === 0) {
        // Fallback sample data when backend has no stats yet
        setDistrictData({
          ludhiana: { total: 240, resolved: 190, pending: 50, verified: 160, mcAdmin: 'Ludhiana MC' },
          amritsar: { total: 180, resolved: 140, pending: 40, verified: 120, mcAdmin: 'Amritsar MC' },
          patiala: { total: 160, resolved: 120, pending: 40, verified: 95, mcAdmin: 'Patiala MC' },
          jalandhar: { total: 150, resolved: 110, pending: 40, verified: 90, mcAdmin: 'Jalandhar MC' },
          bathinda: { total: 100, resolved: 75, pending: 25, verified: 55, mcAdmin: 'Bathinda MC' },
          mohali: { total: 90, resolved: 65, pending: 25, verified: 45, mcAdmin: 'Mohali MC' },
          firozpur: { total: 80, resolved: 55, pending: 25, verified: 35, mcAdmin: 'Firozpur MC' },
          sangrur: { total: 70, resolved: 45, pending: 25, verified: 30, mcAdmin: 'Sangrur MC' },
        });
      } else {
        setDistrictData(data);
      }
    } catch (error) {
      console.error('Failed to fetch district data:', error);
      // Fallback sample data on error
      setDistrictData({
        ludhiana: { total: 240, resolved: 190, pending: 50, verified: 160, mcAdmin: 'Ludhiana MC' },
        amritsar: { total: 180, resolved: 140, pending: 40, verified: 120, mcAdmin: 'Amritsar MC' },
        patiala: { total: 160, resolved: 120, pending: 40, verified: 95, mcAdmin: 'Patiala MC' },
        jalandhar: { total: 150, resolved: 110, pending: 40, verified: 90, mcAdmin: 'Jalandhar MC' },
        bathinda: { total: 100, resolved: 75, pending: 25, verified: 55, mcAdmin: 'Bathinda MC' },
        mohali: { total: 90, resolved: 65, pending: 25, verified: 45, mcAdmin: 'Mohali MC' },
        firozpur: { total: 80, resolved: 55, pending: 25, verified: 35, mcAdmin: 'Firozpur MC' },
        sangrur: { total: 70, resolved: 45, pending: 25, verified: 30, mcAdmin: 'Sangrur MC' },
      });
    } finally {
      setLoading(false);
      // After loading state flips, colorize SVG in next tick
      setTimeout(() => colorizeSvg(), 0);
    }
  };

  const normalizeDistrictName = (name) => {
    return (name || '').toString().trim().toLowerCase().replace(/\s+/g, '_');
  };

  const getIntensityColor = (district) => {
    const data = districtData[normalizeDistrictName(district)] || { total: 0, resolved: 0 };
    const resolutionRate = data.total > 0 ? (data.resolved / data.total) : 0;
    
    if (resolutionRate >= 0.8) return 'var(--punjab-green)';
    if (resolutionRate >= 0.6) return 'var(--punjab-mustard)';
    if (resolutionRate >= 0.4) return '#f97316';
    return 'var(--punjab-red)';
  };

  const getOpacity = (district) => {
    const data = districtData[normalizeDistrictName(district)] || { total: 0 };
    return Math.min(0.3 + (data.total / 300) * 0.7, 1);
  };

  const handleDistrictClick = (district) => {
    if (onDistrictClick) {
      onDistrictClick(district);
      return;
    }
    navigate(`/mc-admin/dashboard?district=${encodeURIComponent(district)}`);
  };

  const colorizeSvg = () => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector('svg');
    if (!svgEl) return;

    Object.keys(districtData).forEach((key) => {
      // Expect path ids in SVG to match normalized district names
      const path = svgEl.querySelector(`#${key}`);
      if (path) {
        const originalName = key.replace(/_/g, ' ');
        path.setAttribute('fill', getIntensityColor(originalName));
        path.setAttribute('fill-opacity', getOpacity(originalName));
        path.setAttribute('stroke', 'var(--punjab-indigo)');
        path.setAttribute('stroke-width', '1.5');
        path.style.cursor = 'pointer';
        path.addEventListener('mouseenter', () => setHoveredDistrict(originalName.replace(/\b\w/g, c => c.toUpperCase())));
        path.addEventListener('mouseleave', () => setHoveredDistrict(null));
        path.addEventListener('click', () => handleDistrictClick(originalName));
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="punjab-skeleton w-full h-full rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Punjab Districts SVG Map (inline from asset) */}
      <div
        ref={svgContainerRef}
        className="w-full h-96 lg:h-[500px]"
        dangerouslySetInnerHTML={{ __html: mapSvg }}
      />

      {/* Tooltip */}
      {hoveredDistrict && districtData[normalizeDistrictName(hoveredDistrict)] && (
        <div className="absolute bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-10 pointer-events-none"
             style={{ 
               left: '50%', 
               top: '10px', 
               transform: 'translateX(-50%)',
               minWidth: '200px'
             }}>
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2">{hoveredDistrict}</div>
            <div className="space-y-1 text-gray-600">
              <div>Total Issues: <span className="font-medium">{districtData[normalizeDistrictName(hoveredDistrict)].total}</span></div>
              <div>Resolved: <span className="font-medium text-green-600">{districtData[normalizeDistrictName(hoveredDistrict)].resolved}</span></div>
              <div>Pending: <span className="font-medium text-yellow-600">{districtData[normalizeDistrictName(hoveredDistrict)].pending}</span></div>
              <div>Verified: <span className="font-medium text-blue-600">{districtData[normalizeDistrictName(hoveredDistrict)].verified}</span></div>
              <div className="pt-1 border-t">
                <div className="text-xs text-gray-500">MC Admin:</div>
                <div className="font-medium">{districtData[normalizeDistrictName(hoveredDistrict)].mcAdmin}</div>
              </div>
              <div className="pt-1">
                <div className="text-xs text-gray-500">Resolution Rate:</div>
                <div className="font-medium text-green-600">
                  {(() => { const d = districtData[normalizeDistrictName(hoveredDistrict)]; return d.total ? Math.round((d.resolved / d.total) * 100) : 0; })()}%
                </div>
              </div>
            </div>
            <button 
              className="mt-2 w-full text-xs bg-punjab-indigo text-white px-3 py-1 rounded hover:bg-punjab-indigo-light transition-colors"
              onClick={() => handleDistrictClick(hoveredDistrict)}
            >
              View District Details
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--punjab-green)' }}></div>
          <span>High Resolution (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--punjab-mustard)' }}></div>
          <span>Good Resolution (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
          <span>Moderate Resolution (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--punjab-red)' }}></div>
          <span>Needs Attention (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
}
