
import React from 'react';
import { ScheduleItem, ScheduleStatus, Compartment } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { AlertIcon } from './icons/AlertIcon';

interface ScheduleProps {
  schedule: ScheduleItem[];
  compartments: Compartment[];
}

const ScheduleIcon: React.FC<{ status: ScheduleStatus }> = ({ status }) => {
  switch (status) {
    case ScheduleStatus.Taken:
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    case ScheduleStatus.Missed:
      return <XCircleIcon className="w-6 h-6 text-red-500" />;
    case ScheduleStatus.Upcoming:
      return <ClockIcon className="w-6 h-6 text-blue-500" />;
    default:
      return null;
  }
};

const Schedule: React.FC<ScheduleProps> = ({ schedule, compartments }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Today's Schedule</h3>
      <ul className="space-y-4">
        {schedule.map((item) => {
           const compartment = compartments.find(c => c.id === item.compartmentId);
           const isCritical = compartment?.medicine.isCritical;

          return (
          <li key={item.id} className={`flex items-center gap-4 p-3 rounded-lg ${item.status === ScheduleStatus.Missed && isCritical ? 'bg-red-100 ring-2 ring-red-200' : 'bg-slate-50'}`}>
            <div className="flex-shrink-0">
              <ScheduleIcon status={item.status} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-700">{item.medicineName}</p>
                {isCritical && <AlertIcon className="w-4 h-4 text-red-500" title="Critical Medication" />}
              </div>
              <p className="text-sm text-slate-500">{item.status}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{item.time}</p>
            </div>
          </li>
        )})}
      </ul>
    </div>
  );
};

export default Schedule;
