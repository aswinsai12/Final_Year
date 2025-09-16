
import React from 'react';
import type { Compartment } from '../types';

interface MedicationStatusListProps {
  compartments: Compartment[];
}

const MedicationStatusList: React.FC<MedicationStatusListProps> = ({ compartments }) => {

    const getPillLevelColor = (percentage: number) => {
        if (percentage > 50) return 'bg-green-500';
        if (percentage > 20) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Medication Status</h3>
            <ul className="space-y-4">
                {compartments.map(comp => {
                    const fillPercentage = (comp.currentPills / comp.capacity) * 100;
                    return (
                        <li key={comp.id} className="flex items-center gap-4">
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-semibold text-slate-700">{comp.medicine.name}</span>
                                    <span className="text-sm font-medium text-slate-500">
                                        {comp.currentPills} / {comp.capacity} pills
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getPillLevelColor(fillPercentage)}`}
                                        style={{ width: `${fillPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MedicationStatusList;
