# AI 카드뉴스 생성기

OpenAI API를 활용하여 자동으로 카드뉴스를 생성하는 웹 애플리케이션입니다.

## 주요 기능

- **카드뉴스 컨텐츠 생성**: GPT-4를 사용하여 목적에 맞는 카드뉴스 텍스트 자동 생성
- **이미지 자동 생성**: DALL-E 3를 사용하여 각 카드에 맞는 이미지 자동 생성
- **반응형 UI**: 모바일과 데스크톱에서 모두 사용 가능한 반응형 인터페이스
- **실시간 미리보기**: 생성된 카드뉴스를 실시간으로 확인
- **이미지 다운로드**: 생성된 이미지를 개별 또는 일괄 다운로드

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4, DALL-E 3
- **Deployment**: Vercel (권장)

## 설치 및 실행

1. 레포지토리 클론
```bash
git clone <repository-url>
cd card_news
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 OpenAI API 키를 추가합니다:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## 사용 방법

### 1단계: 기본 정보 입력
- **목적**: 카드뉴스의 목적 (예: 신규 서비스 홍보)
- **내용**: 홍보할 내용의 핵심 정보
- **타겟**: 주요 독자층
- **문체**: -해요, -합니다, -함, -이다 중 선택
- **문장스타일**: 격식, 친근, 유머러스 중 선택
- **카드 수**: 1~10장 중 선택

### 2단계: 컨텐츠 생성
"카드뉴스 컨텐츠 생성하기" 버튼을 클릭하여 텍스트 컨텐츠를 생성합니다.

### 3단계: 이미지 생성
- 필요시 이미지 추가 요청사항을 입력
- "이미지 생성하기" 버튼을 클릭하여 각 카드의 이미지를 생성

### 4단계: 다운로드
생성된 이미지를 개별 또는 일괄로 다운로드할 수 있습니다.

## API 엔드포인트

### POST `/api/generate-content`
카드뉴스 컨텐츠를 생성합니다.

**요청 본문:**
```json
{
  "purpose": "string",
  "details": "string", 
  "target": "string",
  "style": "-해요" | "-합니다" | "-함" | "-이다",
  "form": "격식" | "친근" | "유머러스",
  "cardCount": number
}
```

**응답:**
```json
{
  "overallTitle": "string",
  "pages": [
    {
      "topic": "string",
      "text": "string", 
      "imagePrompt": "string"
    }
  ]
}
```

### POST `/api/generate-images`
카드뉴스 이미지를 생성합니다.

**요청 본문:**
```json
{
  "imagePrompts": ["string"],
  "additionalRequests": "string"
}
```

**응답:**
```json
{
  "images": ["string"]
}
```

## Vercel 배포

1. Vercel 계정에 로그인
2. 프로젝트를 GitHub에 업로드
3. Vercel에서 "New Project" 생성
4. 환경 변수 `OPENAI_API_KEY` 설정
5. 배포 완료

## 주의사항

- OpenAI API 키가 필요합니다
- 이미지 생성에는 시간이 걸릴 수 있습니다 (카드당 약 10-30초)
- API 사용량에 따라 비용이 발생할 수 있습니다

## 라이선스

MIT License
