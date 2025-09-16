
import React from 'react';
import type { Compartment } from '../types';
import { PillIcon } from './icons/PillIcon';

interface CompartmentCardProps {
  compartment: Compartment;
  onTakePill: () => void;
  onRefill: () => void;
  nextDoseTime?: string;
}

const CompartmentCard: React.FC<CompartmentCardProps> = ({
  compartment,
  onTakePill,
  onRefill,
  nextDoseTime,
}) => {
  const { medicine, currentPills, capacity } = compartment;
  const fillPercentage = (currentPills / capacity) * 100;

  const getPillLevelColor = () => {
    if (fillPercentage > 50) return 'bg-green-500';
    if (fillPercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
             <h3 className="text-lg font-bold text-slate-800">{medicine.name}</h3>
             {medicine.isCritical && (
                <span className="mt-1 px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded-full w-fit">
                    CRITICAL
                </span>
            )}
          </div>
          <span className="text-sm flex-shrink-0 font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {medicine.dosage}
          </span>
        </div>
        <div className="text-center my-4">
          <p className="text-slate-500 text-sm">Pills Remaining</p>
          <p className="text-4xl font-bold text-slate-900">{currentPills}</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${getPillLevelColor()}`}
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
        {nextDoseTime && (
            <p className="text-sm text-center text-slate-500 mb-4">Next Dose: <span className="font-semibold text-teal-600">{nextDoseTime}</span></p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <button
          onClick={onTakePill}
          disabled={currentPills === 0}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
        >
          <PillIcon className="w-5 h-5" />
          Take
        </button>
        <button
          onClick={onRefill}
          className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
        >
          Refill
        </button>
      </div>
    </div>
  );
};

export default CompartmentCard;
