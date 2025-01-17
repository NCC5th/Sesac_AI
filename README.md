# 취약계층 자녀 심리를 위한 AI 안전망 서비스
![image](https://github.com/user-attachments/assets/6d35e995-d5d1-4f27-aa2f-d6052a195d77)

## 프로젝트 소개
- 취약 계층 지역별 데이터 분석 및 예측
- 채팅을 통한 아동 심리 상태 분석 및 예측
- 자녀의 일간, 주간, 심리 예측 보고서

## 1. 개발 환경 및 기술 스택
### Back-End
- Spring Suite Tool 3
  
### Front-End
- Visual Studio (CSS, HTML, JavaScript)

### AI
- OpenAI 3.5-turbo FineTuning API (as Chat)
- ClovaX HCX-003 (as Chat)
- OpenAI 4.5-turbo (as Emotion Analysis)

### Network
- Apache Tomcat 9

## 2. 역할 분담
### 임수한
- PM, Presenter
- AI FineTuning

### 박지수
- Backend
- PPT 작성

### 박우람
- UI/UX

### 양호준
- UI/UX

## 3. 개발 기간 및 작업 관리
### 개발 기간
- 기획
  - 2024/06/03 ~ 2024/06/14
- 개발
  - 2024/07/25 ~ 2024/08/01

---
# 보완점
## 감정 분석
- KoBert와 같은 한국어에 특화된 LLM 모델을 활용하여 텍스트 분석을 통한 심리 분석까지 확장해야 했음

## 생성형 AI 채팅
- 데이터셋 부족 (준비된 데이터: 약 1000개)
- Training Loss 수치 높음 (목표치: 0.01 미망/ 실수치: 3.0~5.0)
- 위와 같은 문제점으로 Clova X 모델로 교체
