import OpenAI from 'openai';
import { CardNewsInput, CardNewsOutput } from '@/types/cardNews';
import { getPromptByType, getImagePrompt } from '@/lib/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCardNewsContent(input: CardNewsInput): Promise<CardNewsOutput> {
  // 유형별 프롬프트 가져오기
  const basePrompt = getPromptByType(input.type);
  
  // 변수 치환
  const prompt = basePrompt
    .replace('{{purpose}}', input.purpose)
    .replace('{{details}}', input.details)
    .replace('{{target}}', input.target)
    .replace('{{style}}', input.style)
    .replace('{{form}}', input.form)
    .replace('{{cardcount}}', input.cardCount.toString());

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI response is empty');
  }

  try {
    return JSON.parse(content) as CardNewsOutput;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content, error);
    throw new Error('Failed to parse card news content');
  }
}

export async function generateCardImage(imagePrompt: string, additionalRequests: string): Promise<string> {
  const fullPrompt = getImagePrompt(imagePrompt, additionalRequests);

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: fullPrompt,
    n: 1,
    size: "1024x1024",
    quality: "high",
    output_format: "png",
    background: "auto",
    moderation: "auto"
  });

  const imageData = response.data?.[0]?.b64_json;
  if (!imageData) {
    throw new Error('Failed to generate image');
  }

  return `data:image/png;base64,${imageData}`;
} 