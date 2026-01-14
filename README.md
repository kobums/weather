# 🌤️ Weather Application

실시간 날씨 정보를 제공하는 반응형 웹 애플리케이션입니다. 현재 위치 기반 날씨 조회와 즐겨찾기 기능을 통해 편리하게 날씨 정보를 확인할 수 있습니다.

## ✨ 주요 기능

### 🎯 핵심 기능

- **현재 위치 기반 날씨** - Geolocation API를 활용한 자동 위치 감지 및 실시간 날씨 정보 제공
- **지역 검색** - 전국 시/군/구 단위의 상세 지역 검색 (korea_districts.json 기반)
- **즐겨찾기 관리** - 최대 5개 위치 저장 및 별칭 설정 기능
- **상세 날씨 정보**
  - 현재 온도 및 체감 온도
  - 날씨 상태 (맑음, 흐림, 비, 눈 등)
  - 습도, 풍속, 기압 등 상세 기상 정보
  - 시간대별 날씨 예보
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 모든 환경 지원
- **다크 모드** - 시간대(주간/야간)에 따른 자동 테마 변경

### 🎨 UX 특징

- 직관적인 사이드바 네비게이션
- 실시간 검색 필터링
- 로딩 상태 및 에러 핸들링
- 위치 권한 안내 메시지
- 부드러운 애니메이션 효과

## 🚀 프로젝트 실행 방법

### 사전 요구사항

- Node.js 22 이상
- npm 또는 Docker

### 로컬 개발 환경

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 접속
# http://localhost:9005
```

### Docker를 이용한 실행

```bash
# Docker Compose 실행 (권장)
docker-compose up

# 또는 Docker 직접 실행
docker build -t weather-app .
docker run -p 9005:9005 weather-app

# 브라우저에서 접속
# http://localhost:9005
```

### 빌드 및 프로덕션

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🛠️ 기술 스택

### Frontend Core

- **React 19** - 최신 React 버전으로 성능 최적화 및 동시성 기능 활용
- **TypeScript 5.9** - 타입 안정성 및 개발 생산성 향상
- **Vite 7** - 빠른 개발 서버 및 빌드 도구

### 상태 관리 & 데이터 페칭

- **TanStack Query (React Query) 5.90** - 서버 상태 관리 및 캐싱
  - 자동 리페칭 및 백그라운드 동기화
  - 로딩/에러 상태 자동 관리
  - 강력한 캐싱 전략

### 스타일링

- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **@tailwindcss/vite** - Vite와의 원활한 통합

### 개발 도구

- **ESLint** - 코드 품질 및 일관성 유지
- **Docker** - 컨테이너 기반 배포 환경

## 🏗️ 아키텍처

### Feature-Sliced Design (FSD)

프로젝트는 **FSD 아키텍처**를 채택하여 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.

```
src/
├── app/                    # 앱 초기화 및 프로바이더
│   └── providers/          # React Query 등 전역 프로바이더
├── widgets/                # 독립적인 UI 블록
│   ├── Sidebar/           # 사이드바 (검색, 즐겨찾기)
│   ├── WeatherCard/       # 날씨 카드 컴포넌트
│   ├── WeatherDetailSection/ # 상세 날씨 정보
│   └── ...
├── features/               # 비즈니스 기능
│   └── favorites/         # 즐겨찾기 관리 로직
├── entities/               # 비즈니스 엔티티
│   └── weather/           # 날씨 데이터 모델
└── shared/                 # 공통 모듈
    ├── api/               # API 클라이언트
    ├── hooks/             # 공통 커스텀 훅
    ├── types/             # 타입 정의
    └── utils/             # 유틸리티 함수
```

### 레이어별 설명

#### 📱 App Layer

- **QueryProvider**: React Query 설정 및 전역 제공
- 앱 전역 설정 및 초기화

#### 🧩 Widgets Layer

독립적으로 동작하는 UI 컴포넌트 블록

- `Sidebar`: 검색 및 즐겨찾기 관리
- `WeatherDetailSection`: 선택된 위치의 상세 날씨
- `CurrentLocationWeather`: 현재 위치 날씨
- `WeatherCard`, `FavoriteWeatherCard`: 날씨 정보 카드
- `HourlyForecast`: 시간대별 예보
- `LocationList`, `SearchInput`: 지역 검색 UI

#### ⚙️ Features Layer

사용자 중심의 비즈니스 기능

- **favorites**: 즐겨찾기 CRUD 로직 (추가, 삭제, 별칭 수정, 최대 5개 제한)

#### 🗂️ Entities Layer

핵심 비즈니스 엔티티

- **weather**: 날씨 데이터 페칭 및 관리 (`useWeather` 훅)

#### 🔧 Shared Layer

프로젝트 전역 공유 리소스

- **api/weatherApi**: OpenWeatherMap API 클라이언트
- **hooks/useGeolocation**: 브라우저 위치 정보 훅
- **types/weather**: 날씨 데이터 타입 정의
- **utils/locationSearch**: 지역 검색 유틸리티

## 💡 기술적 의사결정

### 1. React Query 선택 이유

**문제**: 날씨 API 호출의 복잡한 상태 관리 (로딩, 에러, 캐싱)

**해결책**: TanStack Query 도입

- ✅ 자동 캐싱으로 불필요한 API 호출 감소
- ✅ 백그라운드 리페칭으로 데이터 신선도 유지
- ✅ 로딩/에러 상태 자동 관리로 보일러플레이트 코드 감소
- ✅ 강력한 타입 지원으로 타입 안정성 향상

### 2. Feature-Sliced Design 아키텍처

**문제**: 프로젝트 확장 시 코드 구조 복잡도 증가

**해결책**: FSD 아키텍처 채택

- ✅ 레이어별 명확한 책임 분리
- ✅ 높은 응집도, 낮은 결합도
- ✅ 새로운 기능 추가 시 영향 범위 최소화
- ✅ 팀 협업 시 충돌 감소

### 3. Tailwind CSS 4.x

**문제**: 스타일링 일관성 및 반응형 디자인 복잡도

**해결책**: Tailwind CSS 사용

- ✅ 유틸리티 클래스로 빠른 프로토타이핑
- ✅ 일관된 디자인 시스템 (색상, 간격, 타이포그래피)
- ✅ 반응형 디자인 간편 구현 (`sm:`, `md:`, `lg:` 등)
- ✅ 프로덕션 빌드 시 사용하지 않는 CSS 자동 제거

### 4. TypeScript 적극 활용

**문제**: 런타임 에러 및 API 타입 불일치

**해결책**: 엄격한 타입 시스템 도입

- ✅ 컴파일 타임에 오류 사전 방지
- ✅ IDE 자동완성으로 개발 생산성 향상
- ✅ 리팩토링 시 안전성 보장
- ✅ API 응답 타입 정의로 데이터 구조 명확화

### 5. 커스텀 훅 패턴

**문제**: 비즈니스 로직과 UI 로직 결합

**해결책**: 커스텀 훅으로 관심사 분리

- `useWeather`: 날씨 데이터 페칭
- `useGeolocation`: 위치 정보 관리
- `useFavorites`: 즐겨찾기 로직
- ✅ 로직 재사용성 향상
- ✅ 컴포넌트 단순화
- ✅ 테스트 용이성

### 6. Docker 멀티 스테이지 빌드

**문제**: 프로덕션 이미지 크기 최적화

**해결책**: 빌드/런타임 스테이지 분리

- ✅ 빌드 의존성과 런타임 분리
- ✅ 이미지 크기 최소화
- ✅ 배포 환경 일관성 보장

## 📁 주요 파일 구조

```
weather/
├── public/
│   └── weather_in.png         # 앱 아이콘
├── src/
│   ├── app/
│   │   └── providers/
│   │       └── QueryProvider.tsx  # React Query 설정
│   ├── widgets/
│   │   ├── Sidebar/
│   │   ├── WeatherDetailSection/
│   │   └── ...
│   ├── features/
│   │   └── favorites/
│   │       └── model/
│   │           └── useFavorites.ts
│   ├── entities/
│   │   └── weather/
│   │       └── model/
│   │           └── useWeather.ts
│   ├── shared/
│   │   ├── api/
│   │   │   └── weatherApi.ts
│   │   ├── hooks/
│   │   │   └── useGeolocation.ts
│   │   ├── types/
│   │   │   └── weather.ts
│   │   └── utils/
│   │       └── locationSearch.ts
│   ├── App.tsx                # 메인 앱 컴포넌트
│   ├── main.tsx               # 앱 엔트리 포인트
│   └── index.css              # 글로벌 스타일
├── korea_districts.json       # 한국 지역 데이터
├── Dockerfile                 # Docker 빌드 설정
├── docker-compose.yml         # Docker Compose 설정
└── vite.config.ts            # Vite 설정

```

## 🔑 환경변수

프로젝트 루트에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 설정하세요:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

> **Note**: OpenWeatherMap API 키는 [https://openweathermap.org/api](https://openweathermap.org/api)에서 무료로 발급받을 수 있습니다.

## 📝 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 🌐 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

> **Note**: Geolocation API 사용을 위해서는 HTTPS 또는 localhost 환경이 필요합니다.

---

**Made with ❤️ using React, TypeScript, and Tailwind CSS**
