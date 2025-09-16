
import { useState, useEffect, useCallback } from 'react';
import type { Compartment, ScheduleItem, AdherenceDataPoint, CloudStatus, EmergencyAlert, PatientHealth } from '../types';
import { ScheduleStatus } from '../types';
import { useNotifications } from '../context/NotificationContext';

const INITIAL_COMPARTMENTS: Compartment[] = [
  { id: 1, medicine: { id: 'med1', name: 'Metformin', dosage: '500mg' }, currentPills: 25, capacity: 30 },
  { id: 2, medicine: { id: 'med2', name: 'Lisinopril', dosage: '10mg', isCritical: true }, currentPills: 28, capacity: 30 },
  { id: 3, medicine: { id: 'med3', name: 'Atorvastatin', dosage: '20mg' }, currentPills: 12, capacity: 30 },
  { id: 4, medicine: { id: 'med4', name: 'Aspirin', dosage: '81mg' }, currentPills: 7, capacity: 30 },
];

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 's1', compartmentId: 1, medicineName: 'Metformin', time: '08:00 AM', status: ScheduleStatus.Upcoming },
  { id: 's2', compartmentId: 2, medicineName: 'Lisinopril', time: '08:00 AM', status: ScheduleStatus.Upcoming },
  { id: 's3', compartmentId: 4, medicineName: 'Aspirin', time: '08:00 AM', status: ScheduleStatus.Upcoming },
  { id: 's4', compartmentId: 1, medicineName: 'Metformin', time: '08:00 PM', status: ScheduleStatus.Upcoming },
  { id: 's5', compartmentId: 3, medicineName: 'Atorvastatin', time: '08:00 PM', status: ScheduleStatus.Upcoming },
];

const INITIAL_ADHERENCE: AdherenceDataPoint[] = [
    { day: 'Mon', taken: 4, total: 5 },
    { day: 'Tue', taken: 5, total: 5 },
    { day: 'Wed', taken: 5, total: 5 },
    { day: 'Thu', taken: 3, total: 5 },
    { day: 'Fri', taken: 5, total: 5 },
    { day: 'Sat', taken: 4, total: 5 },
    { day: 'Sun', taken: 5, total: 5 },
];

const useSmartCompartment = () => {
  const { addNotification } = useNotifications();
  const [compartments, setCompartments] = useState<Compartment[]>(INITIAL_COMPARTMENTS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [adherenceHistory, setAdherenceHistory] = useState<AdherenceDataPoint[]>(INITIAL_ADHERENCE);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>('synced');
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert | null>(null);
  const [patientHealth] = useState<PatientHealth>({
      condition: 'Hypertension',
      lastBp: '135/85 mmHg',
      notes: 'Patient reports feeling well. Adherence to Lisinopril is crucial.',
  });

  const simulateSync = useCallback((): Promise<CloudStatus> => {
    return new Promise((resolve) => {
        setCloudStatus('syncing');
        setTimeout(() => {
            const newStatus: CloudStatus = Math.random() < 0.2 ? 'offline' : 'synced';
            setCloudStatus(newStatus);
            resolve(newStatus);
        }, 800);
    });
  }, []);

  const takePill = useCallback((compartmentId: number) => {
    const compartment = compartments.find(c => c.id === compartmentId);
    if (!compartment || compartment.currentPills === 0) return;

    const newPillCount = compartment.currentPills - 1;
    const lowStockThreshold = compartment.capacity * 0.2;
    const justCrossedThreshold = newPillCount <= lowStockThreshold && compartment.currentPills > lowStockThreshold;

    setCompartments(prev =>
        prev.map(c => c.id === compartmentId ? { ...c, currentPills: newPillCount } : c)
    );

    setSchedule((prev) => {
        const upcomingDose = prev.find(s => s.compartmentId === compartmentId && s.status === ScheduleStatus.Upcoming);
        if (upcomingDose) {
            return prev.map(s => s.id === upcomingDose.id ? { ...s, status: ScheduleStatus.Taken } : s);
        }
        return prev;
    });

    simulateSync().then(status => {
      if (status === 'synced') {
        addNotification({
          type: 'success',
          title: 'Dose Recorded',
          message: `${compartment.medicine.name} dose successfully recorded and synced.`,
        });
      } else {
        addNotification({
          type: 'info',
          title: 'Action Saved Locally',
          message: `Your action was saved. It will sync when you are back online.`,
        });
      }

      if (justCrossedThreshold) {
        addNotification({
          type: 'info',
          title: 'Low Stock Warning',
          message: `${compartment.medicine.name} is running low. ${newPillCount} pills remaining.`,
        });
      }
    });
  }, [compartments, addNotification, simulateSync]);

  const refillCompartment = useCallback((compartmentId: number) => {
    const compartment = compartments.find(c => c.id === compartmentId);
    if (!compartment) return;
    
    setCompartments(prev =>
        prev.map(c => c.id === compartmentId ? { ...c, currentPills: c.capacity } : c)
    );
    
    simulateSync().then(status => {
        if (status === 'synced') {
            addNotification({
                type: 'success',
                title: 'Refill Successful',
                message: `${compartment.medicine.name} compartment has been refilled and synced.`
            });
        } else {
            addNotification({
                type: 'info',
                title: 'Action Saved Locally',
                message: `Device is offline. Your refill action will sync later.`
            });
        }
    });
  }, [compartments, addNotification, simulateSync]);

  const dismissEmergencyAlert = useCallback(() => {
    setEmergencyAlert(null);
    alert('Caregiver and emergency contacts have been notified.');
  }, []);
  
    // Simulate upcoming dose reminder
    useEffect(() => {
      const nextDose = INITIAL_SCHEDULE.find(s => s.status === ScheduleStatus.Upcoming);
      if (nextDose) {
          const reminderTimeout = setTimeout(() => {
              addNotification({
                  type: 'info',
                  title: 'Medication Reminder',
                  message: `It's almost time for your ${nextDose.time} dose of ${nextDose.medicineName}.`,
              });
          }, 3000); // Remind after 3 seconds of loading the app

          return () => clearTimeout(reminderTimeout);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNotification]);


   // Simulate time passing to miss doses - for demo purposes only
    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours(); // 0-23
        
        // Let's pretend it's past 8 AM but before 8 PM
        if (currentHour >= 9 && currentHour < 21) {
            setSchedule(s => {
                const newSchedule = s.map(item => {
                    if (item.time.includes('AM') && item.status === ScheduleStatus.Upcoming) {
                        const compartment = INITIAL_COMPARTMENTS.find(c => c.id === item.compartmentId);
                        
                        // For demo, deterministically miss the critical drug
                        if (compartment?.medicine.isCritical) {
                             if (!emergencyAlert) {
                                const newAlert = { medicineName: item.medicineName, time: item.time };
                                setEmergencyAlert(newAlert);
                                addNotification({
                                    type: 'emergency',
                                    title: 'CRITICAL DOSE MISSED',
                                    message: `The ${newAlert.medicineName} dose for ${newAlert.time} was missed. Please notify a caregiver immediately.`
                                });
                            }
                            return { ...item, status: ScheduleStatus.Missed };
                        }

                        // Take other morning pills
                        return { ...item, status: ScheduleStatus.Taken };
                    }
                    return item;
                });
                return newSchedule;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addNotification, emergencyAlert]);


  return { compartments, schedule, adherenceHistory, takePill, refillCompartment, cloudStatus, emergencyAlert, patientHealth, dismissEmergencyAlert };
};

export default useSmartCompartment;
