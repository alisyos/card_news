'use client';

import { CardNewsOutput } from '@/types/cardNews';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Loader2, Image as ImageIcon } from 'lucide-react';

interface CardNewsPreviewProps {
  cardNews: CardNewsOutput;
  images: string[];
  additionalRequests: string;
  onAdditionalRequestsChange: (value: string) => void;
  onGenerateImages: (pageIndex: number) => void;
  isGeneratingImages: boolean;
  onCardNewsUpdate: (updatedCardNews: CardNewsOutput) => void;
}

export default function CardNewsPreview({ 
  cardNews, 
  images, 
  additionalRequests, 
  onAdditionalRequestsChange,
  onGenerateImages,
  isGeneratingImages,
  onCardNewsUpdate
}: CardNewsPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<CardNewsOutput>(cardNews);

  const handleEdit = () => {
    setEditedContent(cardNews);
    setIsEditing(true);
  };

  const handleSave = () => {
    onCardNewsUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(cardNews);
    setIsEditing(false);
  };

  const handleContentChange = (field: 'topic' | 'text' | 'imagePrompt', value: string) => {
    setEditedContent(prev => ({
      ...prev,
      pages: prev.pages.map((page, index) => 
        index === currentPage ? { ...page, [field]: value } : page
      )
    }));
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % cardNews.pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + cardNews.pages.length) % cardNews.pages.length);
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `card-news-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {cardNews.overallTitle}
        </h3>
        <p className="text-sm text-gray-600">
          총 {cardNews.pages.length}장의 카드뉴스
        </p>
      </div>

      {/* 전체 카드 목차 */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">전체 카드 목차</h4>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
          {cardNews.pages.map((page, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`text-left p-2 rounded text-xs transition-colors ${
                currentPage === index
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="font-medium">카드 {index + 1}:</span> {page.topic}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 네비게이션 */}
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={prevPage}
          disabled={cardNews.pages.length <= 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <span className="text-sm text-gray-600">
          {currentPage + 1} / {cardNews.pages.length}
        </span>
        
        <button
          onClick={nextPage}
          disabled={cardNews.pages.length <= 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 카드뉴스 제안 */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            카드뉴스 제안
          </h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              편집
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">주제</h4>
            {isEditing ? (
              <input
                type="text"
                value={editedContent.pages[currentPage].topic}
                onChange={(e) => handleContentChange('topic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">
                {cardNews.pages[currentPage].topic}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">본문</h4>
            {isEditing ? (
              <textarea
                value={editedContent.pages[currentPage].text}
                onChange={(e) => handleContentChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {cardNews.pages[currentPage].text}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">이미지 프롬프트</h4>
            {isEditing ? (
              <textarea
                value={editedContent.pages[currentPage].imagePrompt}
                onChange={(e) => handleContentChange('imagePrompt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                {cardNews.pages[currentPage].imagePrompt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 생성된 이미지 */}
      <div className="border rounded-lg p-4 bg-white shadow-sm mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          이미지 생성
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 추가 요청사항
            </label>
            <textarea
              value={additionalRequests}
              onChange={(e) => onAdditionalRequestsChange(e.target.value)}
              placeholder="이미지 생성 시 추가 요청할 사항을 입력해 주세요."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => onGenerateImages(currentPage)}
              disabled={isGeneratingImages}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGeneratingImages ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  현재 카드 이미지 생성 ({currentPage + 1}/{cardNews.pages.length})
                </>
              )}
            </button>
          </div>

          {images[currentPage] ? (
            <div className="relative">
              <Image
                src={images[currentPage]}
                alt={`카드 ${currentPage + 1}`}
                width={400}
                height={400}
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={() => downloadImage(images[currentPage], currentPage)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                title="이미지 다운로드"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              이미지가 생성되지 않았습니다. 이미지 생성 버튼을 클릭하여 현재 카드의 이미지를 생성해주세요.
            </div>
          )}
        </div>
      </div>

      {/* 전체 다운로드 버튼 */}
      {images.length > 0 && (
        <button
          onClick={() => {
            images.forEach((imageUrl, index) => {
              if (imageUrl) {
                setTimeout(() => downloadImage(imageUrl, index), index * 100);
              }
            });
          }}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 flex items-center justify-center mt-4"
        >
          <Download className="w-4 h-4 mr-2" />
          생성된 이미지 다운로드
        </button>
      )}
    </div>
  );
} 