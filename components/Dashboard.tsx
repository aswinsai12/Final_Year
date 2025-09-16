
import React, { useState } from 'react';
import CompartmentCard from './CompartmentCard';
import Schedule from './Schedule';
import AdherenceChart from './AdherenceChart';
import AiAssistant from './AiAssistant';
import { SparklesIcon } from './icons/SparklesIcon';
import { AlertIcon } from './icons/AlertIcon';
import { CloudUploadIcon } from './icons/CloudUploadIcon';
import { SirenIcon } from './icons/SirenIcon';
import type { AdherenceDataPoint, Compartment, ScheduleItem, CloudStatus, EmergencyAlert, PatientHealth } from '../types';

interface DashboardProps {
  compartments: Compartment[];
  schedule: ScheduleItem[];
  adherenceHistory: AdherenceDataPoint[];
  takePill: (compartmentId: number) => void;
  refillCompartment: (compartmentId: number) => void;
  cloudStatus: CloudStatus;
  emergencyAlert: EmergencyAlert | null;
  patientHealth: PatientHealth;
  dismissEmergencyAlert: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  compartments,
  schedule,
  adherenceHistory,
  takePill,
  refillCompartment,
  cloudStatus,
  emergencyAlert,
  patientHealth,
  dismissEmergencyAlert,
}) => {
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  const lowPillCompartments = compartments.filter(
    (c) => c.currentPills / c.capacity <= 0.2
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back, Jane!</h2>
           <div className="flex items-center gap-2 mt-2">
            {cloudStatus === 'offline' ? (
                <AlertIcon className="w-5 h-5 text-red-500" />
            ) : (
                <CloudUploadIcon 
                    className={`w-5 h-5 transition-colors ${cloudStatus === 'syncing' ? 'animate-pulse text-blue-500' : 'text-green-500'}`} 
                />
            )}
            <span className={`text-sm font-medium ${
                cloudStatus === 'offline' ? 'text-red-500' : 'text-slate-500'
            }`}>
                Cloud Status: {
                    cloudStatus === 'syncing' ? 'Syncing...' :
                    cloudStatus === 'offline' ? 'Offline' :
                    'Synced'
                }
            </span>
        </div>
        </div>
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5" />
          AI Schedule Optimizer
        </button>
      </div>

       {emergencyAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <SirenIcon className="w-8 h-8 text-red-500" />
            <div>
              <p className="font-bold text-lg">Emergency: Critical Dose Missed!</p>
              <p>
                The {emergencyAlert.medicineName} dose scheduled for {emergencyAlert.time} was missed.
              </p>
            </div>
          </div>
          <button
            onClick={dismissEmergencyAlert}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Notify Caregiver
          </button>
        </div>
      )}

      {lowPillCompartments.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 flex items-center gap-3">
          <AlertIcon className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="font-bold">Low Stock Alert</p>
            <p>
              You are running low on:{' '}
              {lowPillCompartments.map((c) => c.medicine.name).join(', ')}. Please refill soon.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {compartments.map((comp) => (
          <CompartmentCard
            key={comp.id}
            compartment={comp}
            onTakePill={() => takePill(comp.id)}
            onRefill={() => refillCompartment(comp.id)}
            nextDoseTime={schedule.find(s => s.compartmentId === comp.id && s.status === 'Upcoming')?.time}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Schedule schedule={schedule} compartments={compartments} />
        </div>
        <div className="lg:col-span-2">
          <AdherenceChart data={adherenceHistory} />
        </div>
      </div>
      
      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        compartments={compartments}
        schedule={schedule}
        adherenceHistory={adherenceHistory}
        patientHealth={patientHealth}
      />
    </div>
  );
};

export default Dashboard;
