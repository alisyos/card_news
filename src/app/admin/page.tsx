'use client';

import { useState, useEffect } from 'react';
import { PromptType } from '@/types/cardNews';
import { defaultPrompts, getStoredPrompts, savePrompts } from '@/lib/prompts';
import { Save, RotateCcw, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [prompts, setPrompts] = useState<Record<PromptType, string>>(defaultPrompts);
  const [activeTab, setActiveTab] = useState<PromptType>('정책/제도 홍보용');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const promptTypes: PromptType[] = [
    '정책/제도 홍보용',
    '정보 전달용',
    '제품/서비스 홍보용',
    '사회 이슈/공익 캠페인용',
    '이미지 생성용'
  ];

  useEffect(() => {
    // 저장된 프롬프트 로드
    const stored = getStoredPrompts();
    setPrompts(stored);
  }, []);

  const handlePromptChange = (type: PromptType, value: string) => {
    setPrompts(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 로컬 스토리지에 저장
      savePrompts(prompts);
      
      // 서버에도 알림 (실제로는 로그 목적)
      await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompts }),
      });

      setSaveMessage('프롬프트가 성공적으로 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving prompts:', error);
      setSaveMessage('저장 중 오류가 발생했습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (type: PromptType) => {
    if (confirm(`${type} 프롬프트를 기본값으로 초기화하시겠습니까?`)) {
      setPrompts(prev => ({
        ...prev,
        [type]: defaultPrompts[type]
      }));
    }
  };

  const handleResetAll = () => {
    if (confirm('모든 프롬프트를 기본값으로 초기화하시겠습니까?')) {
      setPrompts(defaultPrompts);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              메인으로 돌아가기
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-gray-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">
                시스템 프롬프트 관리
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleResetAll}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                전체 초기화
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
          
          {saveMessage && (
            <div className={`mt-2 p-2 rounded text-sm ${
              saveMessage.includes('성공') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {saveMessage}
            </div>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {promptTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === type
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 프롬프트 편집 영역 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab} 프롬프트
            </h2>
            <button
              onClick={() => handleReset(activeTab)}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              기본값으로 초기화
            </button>
          </div>

          <textarea
            value={prompts[activeTab]}
            onChange={(e) => handlePromptChange(activeTab, e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="시스템 프롬프트를 입력하세요..."
          />

          <div className="mt-4 text-sm text-gray-500">
            <p className="mb-2">
              <strong>사용 가능한 변수:</strong>
            </p>
            {activeTab === '이미지 생성용' ? (
              <ul className="list-disc list-inside space-y-1">
                <li><code>{'{{imagePrompt}}'}</code> - AI가 생성한 이미지 프롬프트</li>
                <li><code>{'{{additionalRequests}}'}</code> - 사용자 추가 요청사항</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                <li><code>{'{{purpose}}'}</code> - 카드뉴스 제작 목적</li>
                <li><code>{'{{details}}'}</code> - 핵심 정보</li>
                <li><code>{'{{target}}'}</code> - 주요 독자층</li>
                <li><code>{'{{style}}'}</code> - 문체</li>
                <li><code>{'{{form}}'}</code> - 문장 스타일</li>
                <li><code>{'{{cardcount}}'}</code> - 카드 수</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 