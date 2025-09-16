
import React, { useState, useCallback } from 'react';
import { getScheduleRecommendation } from '../services/geminiService';
import type { AdherenceDataPoint, Compartment, ScheduleItem, PatientHealth } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  compartments: Compartment[];
  schedule: ScheduleItem[];
  adherenceHistory: AdherenceDataPoint[];
  patientHealth: PatientHealth;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  compartments,
  schedule,
  adherenceHistory,
  patientHealth,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleGetRecommendation = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setRecommendation('');

    const adherenceSummary = adherenceHistory
      .map(
        (d) =>
          `${d.day}: ${((d.taken / d.total) * 100).toFixed(0)}% adherence (${
            d.taken
          }/${d.total} doses taken)`
      )
      .join('\n');

    const prompt = `
      You are an expert AI assistant for medication management. Based on the following patient data, provide an optimized medication schedule and explain your reasoning.
      Analyze the patient's adherence patterns and suggest changes that might improve compliance.
      Keep the explanation concise, easy for a patient to understand, and encouraging. Format the output with clear headings using markdown bold syntax (e.g., **Adherence Analysis**).

      Patient Health Summary:
      - Primary Condition: ${patientHealth.condition}
      - Last Blood Pressure Reading: ${patientHealth.lastBp}
      - Notes: ${patientHealth.notes}
      
      Current Medications:
      ${compartments
        .map((c) => `- ${c.medicine.name} (${c.medicine.dosage})${c.medicine.isCritical ? ' - CRITICAL' : ''}`)
        .join('\n')}

      Current Schedule:
      ${schedule
        .map((s) => `- ${s.medicineName} at ${s.time} (Status: ${s.status})`)
        .join('\n')}

      Adherence Data (last 7 days):
      ${adherenceSummary}

      Please provide:
      1. A brief "Adherence Analysis".
      2. A "Recommended Schedule" in a simple list format.
      3. A "Reasoning" section explaining why the changes are beneficial, considering the patient's health condition.
    `;
    
    try {
      const result = await getScheduleRecommendation(prompt);
      setRecommendation(result);
    } catch (e: any) {
      setError('Sorry, I couldn\'t generate a recommendation at this time. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [compartments, schedule, adherenceHistory, patientHealth]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-7 h-7 text-teal-500" />
            <h2 className="text-2xl font-bold text-slate-800">AI Schedule Optimizer</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
           <div className="p-4 mb-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2">Analyzing Your Data</h4>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                <li><strong>Condition:</strong> {patientHealth.condition} ({patientHealth.lastBp})</li>
                <li>Medication adherence from the last 7 days</li>
                <li>Current medication schedule and stock levels</li>
            </ul>
          </div>
          {!recommendation && !isLoading && !error && (
             <div className="text-center">
                <p className="text-slate-600 mb-6">Get a personalized medication schedule recommendation based on your health data and adherence history to improve effectiveness and make your routine easier.</p>
                <button
                    onClick={handleGetRecommendation}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Generate My Recommendation
                </button>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center flex-col gap-4 p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              <p className="text-slate-600 font-semibold">AI is analyzing your data...</p>
            </div>
          )}

          {error && <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}

          {recommendation && (
            <div className="prose prose-slate max-w-none prose-h3:text-teal-600 prose-h3:font-bold prose-ul:list-disc prose-ul:ml-5">
              {recommendation.split('\n').map((line, index) => {
                 if (line.startsWith('**') && line.endsWith('**')) {
                  return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                }
                 if (line.trim().startsWith('* ')) {
                   return <li key={index}>{line.trim().substring(2)}</li>;
                }
                return <p key={index}>{line}</p>;
              })}
            </div>
          )}
        </div>
        {recommendation && (
          <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={handleGetRecommendation}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50"
              >
                Regenerate
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
