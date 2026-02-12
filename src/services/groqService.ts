import Groq from "groq-sdk";

// NOTE: If using Vite, change process.env to import.meta.env
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true
});

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  estimatedPrice: number;
  brand?: string;
}

export interface VideoAnalysisResult {
  recipeName: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  dietaryTags: string[];
}

export class GroqAIService {
  static async analyzeVideoTranscript(transcript: string): Promise<VideoAnalysisResult> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a culinary expert. Extract recipe information from transcripts.
            Return ONLY a valid JSON object. Do not include markdown formatting or prose.
            
            Format:
            {
              "recipeName": string,
              "description": string,
              "prepTime": number,
              "cookTime": number,
              "servings": number,
              "ingredients": [
                {
                  "name": string,
                  "quantity": string,
                  "unit": string,
                  "category": string,
                  "estimatedPrice": number,
                  "brand": string
                }
              ],
              "instructions": string[],
              "dietaryTags": string[]
            }`
          },
          {
            role: "user",
            content: `Extract recipe information from this transcript: ${transcript}`
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.1, // Lower temperature for more consistent JSON
        max_tokens: 2048,
        response_format: { type: "json_object" }
      });

      let content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");

      // Safety: Strip markdown code blocks if the model accidentally includes them
      const cleanedContent = content.replace(/```json|```/g, "").trim();

      return JSON.parse(cleanedContent) as VideoAnalysisResult;
    } catch (error) {
      console.error("Error analyzing video transcript:", error);
      throw error;
    }
  }

  static async generateMockTranscript(): Promise<string> {
    return `
    Today I'm showing you how to make Chicken Caprese.
    Ingredients: 2 large chicken breasts, 4 tomatoes, 200g mozzarella, fresh basil, 
    2 tbsp olive oil, 3 cloves garlic, salt, pepper, 1 tsp oregano, 1/4 cup balsamic glaze.
    Instructions: Season chicken. Pan fry 7 mins per side. Slice cheese and tomatoes. 
    Layer and drizzle with glaze. Serves 2. Prep time 10 mins, cook time 20 mins.
    `;
  }
}