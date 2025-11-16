
// src/lib/prompts.ts

/**
 * Este archivo centraliza la creación de los "system prompts" o instrucciones de sistema
 * que se envían a la IA de Gemini. Al tenerlos en un solo lugar, podemos personalizarlos
 * y mejorarlos fácilmente.
 * 
 * Cada función aquí toma los parámetros necesarios (personaje, materia, etc.) y devuelve
 * una instrucción detallada y específica para la tarea solicitada.
 */

import type { InnovatecTutor } from "./types";

const GRADE_MAP: { [key: number]: string } = {
    7: 'primero de secundaria (12-13 años)',
    8: 'segundo de secundaria (13-14 años)',
    9: 'tercero de secundaria (14-15 años)',
    10: 'cuarto de secundaria (15-16 años)',
    11: 'quinto de secundaria (16-17 años)',
    12: 'sexto de secundaria o bachillerato (17-18 años)',
};

const getGradeText = (grade: number) => {
    return GRADE_MAP[grade] || `un nivel educativo de grado ${grade}`;
}

export function getSystemInstruction(character: InnovatecTutor, mode: string, subject: string, grade: number): string {
    const basePersonality = character.personalityPrompt;
    let taskInstruction = '';

    switch (mode) {
        case 'dudas':
            taskInstruction = `Tu tarea principal es actuar como un experto en "${subject}" y resolver dudas para un estudiante de ${getGradeText(grade)}. Debes explicar los conceptos de forma clara, directa y con ejemplos simples si es necesario. Adapta la complejidad de tu respuesta al nivel del estudiante.`;
            break;
        
        case 'plan':
            taskInstruction = `Tu tarea es generar un plan de estudio estructurado y detallado sobre "${subject}" para un estudiante de ${getGradeText(grade)}. El plan debe ser realista y estar dividido en secciones o días. Para cada sección, enumera los puntos o temas clave a cubrir. El resultado debe ser una guía práctica que el estudiante pueda seguir paso a paso. Sé motivador y claro.`;
            break;
            
        case 'plan_creativo':
            taskInstruction = `Tu tarea es generar un plan de estudio CREATIVO y original sobre "${subject}" para un estudiante de ${getGradeText(grade)}. No te limites a una lista de temas. Incorpora metáforas, analogías con la vida real, pequeños desafíos, preguntas intrigantes o formas no convencionales de abordar el material. El objetivo es hacer el aprendizaje memorable y divertido, manteniendo siempre tu personalidad.`;
            break;
            
        case 'examen':
            taskInstruction = `Tu tarea es generar un mini-examen de 5 preguntas de opción múltiple sobre "${subject}", adecuado para un estudiante de ${getGradeText(grade)}. Es MUY IMPORTANTE que respondas únicamente con un objeto JSON válido, sin texto antes o después. El JSON debe tener la siguiente estructura:
{
  "title": "Examen Rápido sobre ${subject}",
  "time_suggestion_minutes": 10,
  "questions": [
    {
      "q": "Texto de la primera pregunta...",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctIndex": 2, // Índice de la respuesta correcta (0, 1, 2, o 3)
      "explain": "Una breve explicación de por qué esa es la respuesta correcta."
    }
  ]
}
Repite la estructura para las 5 preguntas. No incluyas saltos de línea ni ningún otro texto fuera del JSON.`;
            break;

        case 'flashcards':
            taskInstruction = `Tu tarea es generar 5 flashcards sobre los conceptos más importantes de "${subject}", para un estudiante de ${getGradeText(grade)}. Es CRÍTICO que respondas únicamente con un objeto JSON válido, sin texto introductorio ni despedida. El JSON debe ser un array de objetos, con la siguiente estructura:
[
  {
    "term": "Término o concepto clave",
    "definition": "Definición clara y concisa.",
    "difficulty": "fácil"
  },
  {
    "term": "Otro término",
    "definition": "Su definición...",
    "difficulty": "medio"
  }
]
Los valores para "difficulty" solo pueden ser "fácil", "medio" o "difícil". Asegúrate de que el JSON sea perfecto.`;
            break;

        default:
            taskInstruction = `Tu tarea principal es conversar con el estudiante y ayudarle en lo que necesite sobre "${subject}", adaptando tu lenguaje para un nivel de ${getGradeText(grade)}. Sé amable, servicial y mantén tu personalidad en todo momento.`;
    }

    return `${basePersonality}\n\n### TAREA ESPECÍFICA ###\n${taskInstruction}`;
}
