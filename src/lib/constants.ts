
import type { Mode } from './types';

// Los personajes ahora se generan dinámicamente a través de la IA.
// Mantenemos los valores clave para la selección en la UI.
export const CHARACTER_VALUES: { value: string; label: string; description: string }[] = [
  { value: 'goku', label: 'Goku', description: 'Tono enérgico y motivador.' },
  { value: 'bulma', label: 'Bulma', description: 'Clara, analítica y metódica.' },
  { value: 'chavo', label: 'El Chavo', description: 'Amable, empático y cercano.' },
  { value: 'rory', label: 'Rory', description: 'Organizada y académica.' },
  { value: 'generic', label: 'Tutor', description: 'Neutro y servicial.' },
];

export const MODES: { value: Mode; label: string; description: string }[] = [
  { value: 'dudas', label: 'Resolver Dudas', description: 'Obtén respuestas claras y ejemplos.' },
  { value: 'plan', label: 'Plan de Estudio', description: 'Crea un cronograma de estudio efectivo.' },
  { value: 'plan_creativo', label: 'Plan Creativo', description: 'Un plan de estudio con desafíos divertidos.' },
  { value: 'examen', label: 'Generar Examen', description: 'Ponte a prueba con un examen rápido.' },
  { value: 'flashcards', label: 'Crear Flashcards', description: 'Genera tarjetas de estudio para memorizar.' },
];

export const GRADES = [
    { value: 7, label: '1º de Secundaria' },
    { value: 8, label: '2º de Secundaria' },
    { value: 9, label: '3º de Secundaria' },
    { value: 10, label: '4º de Secundaria' },
    { value: 11, label: '5º de Secundaria' },
    { value: 12, label: '6º de Secundaria / Bachillerato' },
];

export const AI_MODELS = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.0-flash-001', label: 'Gemini 2.0 Flash 001' },
    { value: 'gemini-2.0-flash-lite-001', label: 'Gemini 2.0 Flash Lite 001' },
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
];
