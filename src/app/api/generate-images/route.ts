import { NextResponse } from 'next/server';
import { generateCardImage } from '@/lib/openai';
import { getImagePrompt } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { imagePrompts, topic, text, additionalRequests } = await req.json();

    if (!imagePrompts || !Array.isArray(imagePrompts)) {
      return NextResponse.json(
        { error: '이미지 프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    const generatedImages = await Promise.all(
      imagePrompts.map(async (imagePrompt: string, index: number) => {
        // 프롬프트 생성
        const fullPrompt = getImagePrompt(imagePrompt, additionalRequests || '', topic, text);

        // 프롬프트 로그 출력
        console.log(`\n=== 이미지 생성 프롬프트 (${index + 1}번째 카드) ===`);
        console.log('주제:', topic);
        console.log('본문:', text);
        console.log('이미지 프롬프트:', imagePrompt);
        console.log('프롬프트:', fullPrompt);
        console.log('===========================================\n');

        const imageData = await generateCardImage(fullPrompt, additionalRequests || '');
        return imageData;
      })
    );

    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error('이미지 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 