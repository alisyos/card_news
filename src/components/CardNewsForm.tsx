'use client';

import { useState } from 'react';
import { CardNewsInput, CardNewsType } from '@/types/cardNews';
import { Loader2 } from 'lucide-react';

interface CardNewsFormProps {
  onSubmit: (data: CardNewsInput) => void;
  isLoading: boolean;
}

export default function CardNewsForm({ onSubmit, isLoading }: CardNewsFormProps) {
  const [formData, setFormData] = useState<CardNewsInput>({
    type: '제품/서비스 홍보용',
    purpose: '',
    details: '',
    target: '',
    style: '-해요',
    form: '친근',
    cardCount: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CardNewsInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const cardNewsTypes: CardNewsType[] = [
    '정책/제도 홍보용',
    '정보 전달용',
    '제품/서비스 홍보용',
    '사회 이슈/공익 캠페인용'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          카드뉴스 유형
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value as CardNewsType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {cardNewsTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          목적
        </label>
        <input
          type="text"
          value={formData.purpose}
          onChange={(e) => handleChange('purpose', e.target.value)}
          placeholder="ex) 신규 GPT 챗봇 서비스 홍보"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          value={formData.details}
          onChange={(e) => handleChange('details', e.target.value)}
          placeholder="ex) 베타 출시 → 1개월 무료 체험 제공"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          타겟
        </label>
        <input
          type="text"
          value={formData.target}
          onChange={(e) => handleChange('target', e.target.value)}
          placeholder="ex) 중소기업 마케팅 담당자, IT 스타트업"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문체 (style)
          </label>
          <select
            value={formData.style}
            onChange={(e) => handleChange('style', e.target.value as CardNewsInput['style'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-해요">-해요</option>
            <option value="-합니다">-합니다</option>
            <option value="-함">-함</option>
            <option value="-이다">-이다</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문장스타일 (form)
          </label>
          <select
            value={formData.form}
            onChange={(e) => handleChange('form', e.target.value as CardNewsInput['form'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="격식">격식</option>
            <option value="친근">친근</option>
            <option value="유머러스">유머러스</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          카드 수
        </label>
        <select
          value={formData.cardCount}
          onChange={(e) => handleChange('cardCount', Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}장</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            컨텐츠 생성 중...
          </>
        ) : (
          '카드뉴스 컨텐츠 생성하기'
        )}
      </button>
    </form>
  );
} 