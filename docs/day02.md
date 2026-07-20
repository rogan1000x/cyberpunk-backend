# Day 02 - Render로 백엔드 실제 배포

## 오늘 배운 것
- **배포 환경과 로컬 환경의 차이**: 포트 번호를 배포 서비스가 직접 지정함
- **환경 변수 (process.env)**: 배포 환경에서 동적으로 설정값을 받는 방법
- **package.json의 start 스크립트**: 배포 서비스가 서버를 실행하는 표준 명령어
- **Render**: Node.js 백엔드를 무료로 배포할 수 있는 서비스

## 오늘 한 것

### 1. package.json에 start 스크립트 추가
```json
"scripts": {
  "start": "node index.js"
}
```
Render 같은 배포 서비스는 `npm start` 명령어로 서버를 실행하기 때문에 필수

### 2. PORT 환경변수 대응
**이전:**
```javascript
const PORT = 3001;
```

**이후:**
```javascript
const PORT = process.env.PORT || 3001;
```

**이유**: 배포 서비스(Render)는 자체적으로 포트 번호를 할당하는데, 
로컬에서는 그런 환경변수가 없으므로 `|| 3001`로 기본값 설정

### 3. Render 배포 과정
1. render.com 가입 (GitHub 연동)
2. New Web Service → cyberpunk-backend 저장소 연결
3. 설정:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. 배포 완료 → https://cyberpunk-backend-5i57.onrender.com

### 4. React 프론트엔드와 연결
`cyberpunk-portfolio-react`의 fetch 주소 전체 교체:
localhost:3001 → https://cyberpunk-backend-5i57.onrender.com

### 5. 배포 검증
로컬 백엔드 서버를 의도적으로 꺼둔 상태에서 React 앱이 정상 작동하는지 확인
→ 로컬 서버 없이도 정상 작동 확인 = Render 서버와 실제로 통신하고 있다는 증거

## 완성된 배포 아키텍처
사용자 (전 세계 어디서든)
↓
React (Netlify: cyberpunk-portfolio-react.netlify.app)
↓ fetch
Express 서버 (Render: cyberpunk-backend-5i57.onrender.com)
↓ fs 모듈
projects.json (Render 서버 내부 저장)

## 막혔던 것
- 없음 (순조롭게 진행)

## 오늘의 의미
프론트엔드와 백엔드를 각각 독립적으로 실제 인터넷에 배포하고,
서로 연결까지 완료한 첫 "진짜 배포된 풀스택 웹앱" 완성

## 다음 할 것
- MongoDB 등 진짜 데이터베이스로 업그레이드 (Render 재배포 시 파일 초기화 이슈 대비)
- React 쪽 UI/UX 개선
- life-sim-game 프로젝트 이어서 진행

## 목표 진행 상황
🎯 최종 목표: 올라운드 풀스택 개발자
- ✅ 프론트엔드 배포 (Netlify)
- ✅ 백엔드 배포 (Render)
- ✅ 프론트-백엔드 연동 검증
- ⬜ 데이터베이스 (MongoDB)
- ⬜ 게임 개발 (Phaser.js, 진행중)