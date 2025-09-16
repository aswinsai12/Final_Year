
import React from 'react';
import type { AdherenceDataPoint, Compartment, ScheduleItem, EmergencyAlert, PatientHealth } from '../types';
import AdherenceChart from './AdherenceChart';
import PatientSummaryCard from './PatientSummaryCard';
import MedicationStatusList from './MedicationStatusList';
import { SirenIcon } from './icons/SirenIcon';
import { AlertIcon } from './icons/AlertIcon';

interface CaregiverDashboardProps {
  compartments: Compartment[];
  schedule: ScheduleItem[];
  adherenceHistory: AdherenceDataPoint[];
  emergencyAlert: EmergencyAlert | null;
  patientHealth: PatientHealth;
  dismissEmergencyAlert: () => void;
}

const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  compartments,
  adherenceHistory,
  emergencyAlert,
  patientHealth,
  dismissEmergencyAlert,
}) => {
    
  const lowPillCompartments = compartments.filter(
    (c) => c.currentPills / c.capacity <= 0.2
  );

  return (
    <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Caregiver Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <PatientSummaryCard 
                    name="Jane Doe"
                    avatar="https://picsum.photos/100"
                    condition={patientHealth.condition}
                    alertsCount={emergencyAlert ? 1 : 0}
                    lowStockCount={lowPillCompartments.length}
                />
                <MedicationStatusList compartments={compartments} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {emergencyAlert && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SirenIcon className="w-8 h-8 text-red-500" />
                            <div>
                            <p className="font-bold text-lg">Action Required: Critical Dose Missed</p>
                            <p>
                                Jane Doe missed the {emergencyAlert.medicineName} dose at {emergencyAlert.time}.
                            </p>
                            </div>
                        </div>
                        <button
                            onClick={dismissEmergencyAlert}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Confirm & Notify
                        </button>
                    </div>
                 )}
                 {lowPillCompartments.length > 0 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md flex items-center gap-3">
                        <AlertIcon className="w-6 h-6 text-yellow-500" />
                        <div>
                            <p className="font-bold">Low Stock Alert for Jane Doe</p>
                            <p>
                            Refill needed for: {' '}
                            {lowPillCompartments.map((c) => c.medicine.name).join(', ')}.
                            </p>
                        </div>
                    </div>
                )}
                <AdherenceChart data={adherenceHistory} />
            </div>
        </div>
    </div>
  );
};

export default CaregiverDashboard;
