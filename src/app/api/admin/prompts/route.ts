import { NextRequest, NextResponse } from 'next/server';
import { PromptType } from '@/types/cardNews';
import { defaultPrompts } from '@/lib/prompts';

interface PromptsUpdateRequest {
  prompts: Record<PromptType, string>;
}

// 모든 프롬프트 조회
export async function GET() {
  try {
    return NextResponse.json({ prompts: defaultPrompts });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: '프롬프트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 프롬프트 업데이트 (실제로는 클라이언트에서 로컬 스토리지에 저장)
export async function POST(request: NextRequest) {
  try {
    const body: PromptsUpdateRequest = await request.json();
    
    if (!body.prompts) {
      return NextResponse.json(
        { error: '프롬프트 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 여기서는 단순히 성공 응답만 반환
    // 실제 저장은 클라이언트의 로컬 스토리지에서 처리
    return NextResponse.json({ 
      success: true,
      message: '프롬프트가 성공적으로 저장되었습니다.' 
    });
  } catch (error) {
    console.error('Error updating prompts:', error);
    return NextResponse.json(
      { error: '프롬프트 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 