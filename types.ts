
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  isCritical?: boolean;
}

export interface Compartment {
  id: number;
  medicine: Medicine;
  currentPills: number;
  capacity: number;
}

export enum ScheduleStatus {
  Upcoming = 'Upcoming',
  Taken = 'Taken',
  Missed = 'Missed',
}

export interface ScheduleItem {
  id: string;
  compartmentId: number;
  medicineName: string;
  time: string;
  status: ScheduleStatus;
}

export interface AdherenceDataPoint {
  day: string;
  taken: number;
  total: number;
}

export interface PatientHealth {
    condition: string;
    lastBp: string;
    notes: string;
}

export interface EmergencyAlert {
    medicineName: string;
    time: string;
}

export type CloudStatus = 'synced' | 'syncing' | 'offline';

export type NotificationType = 'info' | 'success' | 'emergency';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}
