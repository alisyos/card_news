export type CardNewsType = '정책/제도 홍보용' | '정보 전달용' | '제품/서비스 홍보용' | '사회 이슈/공익 캠페인용';

export type PromptType = CardNewsType | '이미지 생성용';

export interface CardNewsInput {
  type: CardNewsType;
  purpose: string;
  details: string;
  target: string;
  style: '-해요' | '-합니다' | '-함' | '-이다';
  form: '격식' | '친근' | '유머러스';
  cardCount: number;
}

export interface ImageGenerationInput {
  imagePrompt: string;
  additionalRequests: string;
}

export interface CardPage {
  topic: string;
  text: string;
  imagePrompt: string;
}

export interface CardNewsOutput {
  overallTitle: string;
  pages: CardPage[];
}

export interface GeneratedCardNews extends CardNewsOutput {
  images: string[];
} 