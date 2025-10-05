import React from 'react';

export default function PunjabPhulkari() {
  return (
    <div className="relative w-full h-96 lg:h-[500px]">
      {/* Phulkari Pattern Background */}
      <div className="absolute inset-0 punjab-phulkari-bg rounded-2xl"></div>
      
      {/* Punjab Map Outline */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Punjab State Outline */}
        <path
          d="M50 50 L350 50 L350 250 L50 250 Z"
          fill="none"
          stroke="var(--punjab-indigo)"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        
        {/* Wheat Silhouette */}
        <g transform="translate(200, 100)">
          <path
            d="M-20 0 Q-10 -20 0 0 Q10 -20 20 0 Q15 10 10 5 Q5 10 0 5 Q-5 10 -10 5 Q-15 10 -20 0"
            fill="var(--punjab-mustard)"
            opacity="0.8"
          />
          <path
            d="M-15 -5 Q-5 -25 5 -5 Q15 -25 25 -5"
            fill="var(--punjab-mustard)"
            opacity="0.6"
          />
        </g>
        
        {/* Decorative Elements */}
        <circle cx="100" cy="80" r="8" fill="var(--punjab-green)" opacity="0.7" />
        <circle cx="300" cy="120" r="6" fill="var(--punjab-red)" opacity="0.7" />
        <circle cx="150" cy="200" r="10" fill="var(--punjab-mustard)" opacity="0.7" />
        <circle cx="250" cy="180" r="7" fill="var(--punjab-indigo)" opacity="0.7" />
        
        {/* Phulkari Motifs */}
        <g transform="translate(80, 60)">
          <path
            d="M0 0 L10 5 L20 0 L15 10 L25 15 L15 20 L10 15 L5 20 L0 15 Z"
            fill="var(--punjab-red)"
            opacity="0.6"
          />
        </g>
        
        <g transform="translate(320, 160)">
          <path
            d="M0 0 L8 4 L16 0 L12 8 L20 12 L12 16 L8 12 L4 16 L0 12 Z"
            fill="var(--punjab-green)"
            opacity="0.6"
          />
        </g>
        
        <g transform="translate(180, 140)">
          <path
            d="M0 0 L6 3 L12 0 L9 6 L15 9 L9 12 L6 9 L3 12 L0 9 Z"
            fill="var(--punjab-mustard)"
            opacity="0.6"
          />
        </g>
        
        {/* Text Elements */}
        <text
          x="200"
          y="40"
          textAnchor="middle"
          className="fill-punjab-indigo font-bold text-lg"
          style={{ fontFamily: 'var(--font-family-primary)' }}
        >
          ਪੰਜਾਬ
        </text>
        
        <text
          x="200"
          y="280"
          textAnchor="middle"
          className="fill-punjab-indigo font-semibold text-sm"
          style={{ fontFamily: 'var(--font-family-primary)' }}
        >
          Punjab State
        </text>
      </svg>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-punjab-mustard rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-punjab-green rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 bg-punjab-red rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
