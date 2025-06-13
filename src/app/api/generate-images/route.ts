import { NextRequest, NextResponse } from 'next/server';
import { generateCardImage } from '@/lib/openai';

interface ImageGenerationRequest {
  imagePrompts: string[];
  additionalRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    
    if (!body.imagePrompts || !Array.isArray(body.imagePrompts) || body.imagePrompts.length === 0) {
      return NextResponse.json(
        { error: '이미지 프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    // 모든 이미지를 병렬로 생성
    const imagePromises = body.imagePrompts.map(prompt => 
      generateCardImage(prompt, body.additionalRequests || '')
    );

    const images = await Promise.all(imagePromises);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 