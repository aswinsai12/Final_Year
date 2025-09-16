
import React from 'react';
import { AlertIcon } from './icons/AlertIcon';
import { SirenIcon } from './icons/SirenIcon';

interface PatientSummaryCardProps {
    name: string;
    avatar: string;
    condition: string;
    alertsCount: number;
    lowStockCount: number;
}

const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
    name,
    avatar,
    condition,
    alertsCount,
    lowStockCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Patient Overview</h3>
        <div className="flex items-center gap-4">
            <img src={avatar} alt={name} className="w-16 h-16 rounded-full"/>
            <div>
                <h4 className="text-lg font-bold text-slate-900">{name}</h4>
                <p className="text-sm text-slate-500">Primary Condition: <span className="font-semibold text-slate-600">{condition}</span></p>
            </div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
            <div className={`flex items-center gap-2 ${alertsCount > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                <SirenIcon className="w-5 h-5"/>
                <span className="font-semibold">{alertsCount} Active Emergency Alerts</span>
            </div>
            <div className={`flex items-center gap-2 ${lowStockCount > 0 ? 'text-yellow-600' : 'text-slate-600'}`}>
                <AlertIcon className="w-5 h-5"/>
                <span className="font-semibold">{lowStockCount} Medications Low on Stock</span>
            </div>
        </div>
    </div>
  );
};

export default PatientSummaryCard;
