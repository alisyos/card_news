import { NextRequest, NextResponse } from 'next/server';
import { generateCardNewsContent } from '@/lib/openai';
import { CardNewsInput } from '@/types/cardNews';

export async function POST(request: NextRequest) {
  try {
    const body: CardNewsInput = await request.json();
    
    // 입력 검증
    if (!body.type || !body.purpose || !body.details || !body.target || !body.style || !body.form || !body.cardCount) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (body.cardCount < 1 || body.cardCount > 10) {
      return NextResponse.json(
        { error: '카드 수는 1~10 사이여야 합니다.' },
        { status: 400 }
      );
    }

    const result = await generateCardNewsContent(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating card news content:', error);
    return NextResponse.json(
      { error: '카드뉴스 컨텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 