'use client';

import { useState } from 'react';
import { CardNewsInput, CardNewsOutput } from '@/types/cardNews';
import CardNewsForm from '@/components/CardNewsForm';
import CardNewsPreview from '@/components/CardNewsPreview';
import { Loader2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [cardNews, setCardNews] = useState<CardNewsOutput | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [additionalRequests, setAdditionalRequests] = useState('');

  const handleGenerateContent = async (input: CardNewsInput) => {
    setIsGeneratingContent(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '컨텐츠 생성에 실패했습니다.');
      }

      const result: CardNewsOutput = await response.json();
      setCardNews(result);
      setImages([]); // 이미지 초기화
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '컨텐츠 생성에 실패했습니다.');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleCardNewsUpdate = (updatedCardNews: CardNewsOutput) => {
    setCardNews(updatedCardNews);
    setImages([]); // 이미지 초기화
  };

  const handleGenerateImages = async (pageIndex: number) => {
    if (!cardNews) return;

    setIsGeneratingImages(true);
    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePrompts: [cardNews.pages[pageIndex].imagePrompt],
          additionalRequests,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '이미지 생성에 실패했습니다.');
      }

      const result = await response.json();
      const newImages = [...images];
      newImages[pageIndex] = result.images[0];
      setImages(newImages);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '이미지 생성에 실패했습니다.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            AI 카드뉴스 생성기
          </h1>
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            프롬프트 관리
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 입력 폼 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              카드뉴스 정보 입력
            </h2>
            <CardNewsForm 
              onSubmit={handleGenerateContent}
              isLoading={isGeneratingContent}
            />
          </div>

          {/* 미리보기 및 이미지 생성 */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              카드뉴스 미리보기
            </h2>
            
            {isGeneratingContent && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">컨텐츠 생성 중...</span>
              </div>
            )}

            {cardNews && !isGeneratingContent && (
              <div className="space-y-4">
                <CardNewsPreview 
                  cardNews={cardNews}
                  images={images}
                  additionalRequests={additionalRequests}
                  onAdditionalRequestsChange={setAdditionalRequests}
                  onGenerateImages={handleGenerateImages}
                  isGeneratingImages={isGeneratingImages}
                  onCardNewsUpdate={handleCardNewsUpdate}
                />
              </div>
            )}

            {!cardNews && !isGeneratingContent && (
              <div className="text-center py-12 text-gray-500">
                카드뉴스 정보를 입력하고 생성 버튼을 클릭해주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
