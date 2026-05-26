import OpenAI from 'openai';
import { env } from '../../config/env.js';
import type { AIProvider } from './aiProvider.js';
import type { GeneratedPaper, QuestionTypeName } from '@vedaai/shared-types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI | null = null;

  constructor() {
    if (env.OPENAI_API_KEY && !env.OPENAI_API_KEY.includes('your-key')) {
      this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
  }

  async generate(prompt: string): Promise<string> {
    if (!this.client) {
      console.log('⚠️ [Mock AI] OpenAI API key is not configured. Using Mock AI Paper Generator...');
      return generateMockPaper(prompt);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: env.AI_MODEL ?? 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert Indian school exam paper generator.
You must respond ONLY with valid JSON matching the exact schema provided.
Do not add markdown, code fences, or explanatory text.
All questions must be educationally appropriate, accurate, and clearly worded.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      return response.choices[0].message.content ?? '';
    } catch (err) {
      console.error('❌ OpenAI API error:', err);
      console.log('🔄 Falling back to Mock AI Paper Generator...');
      return generateMockPaper(prompt);
    }
  }
}

function generateMockPaper(prompt: string): string {
  try {
    const schemaStartIndex = prompt.indexOf('SCHEMA:\n');
    if (schemaStartIndex === -1) {
      throw new Error('SCHEMA tag not found in prompt');
    }
    
    const jsonStart = prompt.indexOf('{', schemaStartIndex);
    const jsonEnd = prompt.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('Could not find JSON bounds in prompt');
    }
    
    const jsonString = prompt.substring(jsonStart, jsonEnd + 1);
    const paper = JSON.parse(jsonString) as GeneratedPaper;
    const subjectLower = (paper.subject || '').toLowerCase();
    
    const mcqPool = [
      "Which of the following represents the correct SI unit of power?",
      "Identify the main site of photosynthesis in green plants.",
      "What is the value of the acceleration due to gravity on Earth's surface?",
      "Which gas is primarily responsible for global warming?",
      "Select the option that represents an isotope of Hydrogen."
    ];
    const shortPool = [
      "Explain the process of respiration in human beings.",
      "State Newton's second law of motion and write its mathematical form.",
      "What is the difference between an acid and a base according to Arrhenius theory?",
      "Why do stars twinkle while planets do not?",
      "Define electric current and state its SI unit."
    ];
    const diagramPool = [
      "Study the diagram of the nephron and label the parts marked A, B, and C.",
      "Based on the given ray diagram, calculate the focal length of the convex lens.",
      "Observe the food chain diagram. Explain the 10% energy transfer rule.",
      "With reference to the circuit diagram, find the equivalent resistance between X and Y.",
      "Identify the stage of cell division depicted in the accompanying diagram."
    ];
    const numericalPool = [
      "Calculate the force required to impart a velocity of 30 m/s in 10s to a mass of 5kg.",
      "An electric heater of resistance 8 ohms draws 15A from the service mains for 2 hours. Calculate heat generated.",
      "A solution is prepared by dissolving 40g of sodium chloride in 320g of water. Calculate its concentration.",
      "If the speed of light in vacuum is 3x10^8 m/s, find its speed in glass (refractive index = 1.5).",
      "Find the number of moles in 44 grams of carbon dioxide gas."
    ];

    let questionIndex = 0;
    
    for (const section of paper.sections) {
      for (const question of section.questions) {
        question.id = `${section.label}${++questionIndex}`;
        
        let pool = shortPool;
        if (question.type === 'Multiple Choice Questions') pool = mcqPool;
        else if (question.type === 'Diagram/Graph-Based Questions') pool = diagramPool;
        else if (question.type === 'Numerical Problems') pool = numericalPool;
        
        const textTemplate = pool[(questionIndex - 1) % pool.length];
        
        if (subjectLower.includes('math')) {
          if (question.type === 'Multiple Choice Questions') {
            question.text = `Solve the quadratic equation: x^2 - 5x + 6 = 0. Which of the following are the roots?`;
          } else if (question.type === 'Short Questions') {
            question.text = `Find the 10th term of the Arithmetic Progression (AP): 2, 7, 12, 17...`;
          } else if (question.type === 'Numerical Problems') {
            question.text = `Find the area enclosed by the circle x^2 + y^2 = 16 using integration methods.`;
          } else {
            question.text = `Plot the linear equation y = 2x + 3 on a graph sheet and find its intercepts.`;
          }
        } else if (subjectLower.includes('history') || subjectLower.includes('civic') || subjectLower.includes('social') || subjectLower.includes('geography')) {
          if (question.type === 'Multiple Choice Questions') {
            question.text = `In which year was the first battle of Panipat fought?`;
          } else if (question.type === 'Short Questions') {
            question.text = `State two key differences between democratic and non-democratic forms of government.`;
          } else if (question.type === 'Numerical Problems') {
            question.text = `Calculate the percentage growth of the Indian population from 2011 to 2021 census data.`;
          } else {
            question.text = `On the outline map of India provided, locate and label the major cotton-growing regions.`;
          }
        } else {
          question.text = `${textTemplate.replace('photosynthesis', `photosynthesis in ${paper.subject}`)}`;
        }
        
        const rand = Math.random();
        if (rand < 0.3) question.difficulty = 'easy';
        else if (rand < 0.8) question.difficulty = 'moderate';
        else question.difficulty = 'hard';
        
        paper.answerKey.push({
          questionId: question.id,
          answer: `Solution guide for ${question.id}: Explain the core concepts of the question '${question.text.slice(0, 30)}...' with proper diagrams and steps where required.`,
        });
      }
    }
    
    return JSON.stringify(paper, null, 2);
  } catch (err) {
    console.error('Failed to generate mock paper:', err);
    return JSON.stringify({
      schoolName: "Delhi Public School",
      subject: "Science",
      className: "Class 10",
      timeAllowed: 180,
      totalMarks: 80,
      sections: [],
      answerKey: []
    });
  }
}
