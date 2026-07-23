# Day 03 - MongoDB Atlas 연동 (JSON 파일 → 진짜 데이터베이스)

## 오늘 배운 것
- **MongoDB Atlas**: 클라우드 기반 무료 데이터베이스 서비스
- **Mongoose**: Node.js에서 MongoDB를 쉽게 다루는 라이브러리
- **Schema/Model**: 데이터의 구조(설계도)를 정의하는 방법
- **환경변수(.env)**: 민감한 정보(비밀번호 등)를 안전하게 관리하는 방법
- **async/await**: 시간이 걸리는 작업(DB 통신)을 기다렸다 처리하는 문법
- **Windows vs Linux 파일 시스템 차이**: 대소문자 구분 이슈

## 오늘 한 것

### 1. MongoDB Atlas 설정
- 무료 클러스터 생성
- Network Access 설정 (Allow from Anywhere)
- 연결 문자열(Connection String) 발급

### 2. 패키지 설치 및 환경변수 설정
```powershell
npm install mongoose dotenv
```

`.env` 파일 생성 (Git에는 올라가지 않도록 `.gitignore`에 추가):

MONGO_URI=mongodb+srv://...

### 3. Schema/Model 생성
```javascript
// models/Project.js
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String
});

const Project = mongoose.model('Project', projectSchema);
```

### 4. index.js를 MongoDB 방식으로 전환
파일 기반 CRUD(fs 모듈) → MongoDB 기반 CRUD(mongoose)로 전체 교체
```javascript
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});
```
- `:index`(배열 순서) → `:id`(MongoDB 고유 ID)로 식별 방식 변경

## 트러블슈팅 (오늘 가장 많이 겪은 부분!)

### 1. ECONNREFUSED (DNS 조회 실패)
**원인**: 로컬 네트워크 환경이 MongoDB의 SRV 레코드 조회를 방해
**해결**: Node.js가 구글 DNS(8.8.8.8)를 사용하도록 명시적으로 설정
```javascript
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
```

### 2. bad auth: authentication failed
**원인**: 연결 문자열의 비밀번호 재확인 필요
**해결**: `.env` 파일 내용 재점검 후 해결

### 3. Render 배포 시 MODULE_NOT_FOUND
**원인**: 파일명 대소문자 차이 (`project.js` vs `Project.js`)
**설명**: Windows는 대소문자를 구분하지 않지만, Render(Linux 기반)는 엄격하게 구분함
**해결**: 
```powershell
git mv models/project.js models/Project.js
```

### 4. Render에서 uri undefined 에러
**원인**: `.env` 파일은 보안상 Git에 올라가지 않으므로, Render 서버엔 환경변수가 없음
**해결**: Render 대시보드 → Environment 탭에서 `MONGO_URI` 직접 등록

## 완성된 아키텍처
React (Netlify)
↕ fetch
Express + Mongoose (Render)
↕
MongoDB Atlas (클라우드 데이터베이스)

## 검증 완료
- 로컬 서버 재시작해도 데이터 유지 확인
- Render 배포 후 "MongoDB 연결 성공!" 로그 확인
- 실제 프로젝트 추가/조회 정상 작동 확인

## 오늘의 교훈
"내 컴퓨터에서 되는 것"과 "배포 환경에서 되는 것"은 다를 수 있다.
특히 대소문자, 환경변수처럼 사소해 보이는 차이가 
배포 시 예상치 못한 에러의 흔한 원인이 된다는 것을 직접 경험함

## 다음 할 것
- MongoDB 데이터 구조를 더 확장 (이미지, 태그 등 필드 추가)
- 에러 핸들링 강화 (try/catch)

## 목표 진행 상황
🎯 최종 목표: 올라운드 풀스택 개발자
- ✅ 프론트엔드 배포
- ✅ 백엔드 배포
- ✅ 진짜 데이터베이스 연동 (MongoDB Atlas)
- ⬜ 인증/로그인 시스템