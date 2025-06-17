'use client';
import React from 'react';

export default function CompetitionHeader({ name, code, emblem, type, area, flag }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <img src={emblem} alt={`${name} Emblem`} className="w-24 h-24 object-contain rounded-full p-2 shadow-md" />
      <div className="text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{code}</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{type}</span>
          <div className="flex items-center gap-1">
            <img src={area.flag} alt={area.name} className="w-4 h-4 rounded-full" />
            <span className="text-sm text-gray-600">{area.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
