# Day 01 - Node.js + Express 백엔드 시작 (CRUD 완성)

## 오늘 배운 것
- **서버란 무엇인가**: 프론트엔드-백엔드-데이터베이스 구조 이해
- **Node.js + Express**: 서버를 만드는 기본 도구
- **HTTP 메서드**: GET, POST, PUT, DELETE의 차이와 용도
- **CORS**: 다른 포트 간 통신을 위한 보안 설정
- **fs 모듈**: 파일을 실제로 읽고 쓰는 방법 (영구 저장)
- **React ↔ 백엔드 연동**: fetch()로 서버와 통신하기
- **useEffect의 동작 원리**: 언제 다시 데이터를 불러오는지

## 오늘 한 것

### 1. 백엔드 프로젝트 생성
```powershell
mkdir cyberpunk-backend
cd cyberpunk-backend
npm init -y
npm install express
```

### 2. 첫 서버 만들기
```javascript
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('안녕하세요! 서버가 작동 중입니다!');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
```

**핵심 개념:**
- 포트(Port): 컴퓨터의 "문 번호" (React는 3000, 백엔드는 3001)
- `app.get('/', ...)`: 특정 주소로 요청 오면 응답하는 라우트

### 3. GET API 만들기 (프로젝트 목록 조회)
```javascript
app.get('/api/projects', (req, res) => {
  res.json(projects);
});
```

### 4. CORS 에러 해결
**문제**: React(3000)에서 백엔드(3001)로 요청 시 "Failed to fetch" 에러

**원인**: 다른 포트 간 통신을 브라우저가 보안상 차단 (CORS 정책)

**해결**:
```powershell
npm install cors
```
```javascript
const cors = require('cors');
app.use(cors());
```

### 5. React에서 백엔드 데이터 가져오기 (fetch + useEffect)
```jsx
const [projects, setProjects] = useState([]);

useEffect(() => {
  fetch('http://localhost:3001/api/projects')
    .then(response => response.json())
    .then(data => setProjects(data));
}, []);
```

### 6. POST API 만들기 (프로젝트 추가)
```javascript
app.use(express.json());  // 요청 데이터를 JSON으로 이해하게 해줌

app.post('/api/projects', (req, res) => {
  const newProject = req.body;
  projects.push(newProject);
  res.json({ message: '프로젝트가 추가되었습니다!', projects });
});
```

React에서 POST 요청:
```jsx
fetch('http://localhost:3001/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProject)
})
```

### 7. 메모리 저장 vs 파일 저장 (중요한 발견!)
**문제**: 서버를 껐다 켜면 추가했던 데이터가 다 사라짐

**원인**: 데이터가 배열(메모리)에만 있어서, 서버 재시작 시 초기화됨

**해결**: `fs` 모듈로 실제 파일에 저장
```javascript
const fs = require('fs');
const DATA_FILE = './projects.json';

function readProjects() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}
```

**비유**: 메모리 = 화이트보드(지워짐), 파일 = 노트(남아있음)

### 8. DELETE API 만들기 (프로젝트 삭제)
```javascript
app.delete('/api/projects/:index', (req, res) => {
  const projects = readProjects();
  const indexToDelete = parseInt(req.params.index);
  
  projects.splice(indexToDelete, 1);
  saveProjects(projects);
  
  res.json({ message: '프로젝트가 삭제되었습니다!', projects });
});
```

**URL 파라미터(`:index`) 개념**: 주소 자체에 동적인 값을 포함시킴

### 9. 실수로 전체 삭제 → 삭제 확인창 추가
**사고**: 테스트하다가 실제 프로젝트 데이터까지 삭제해버림

**교훈**: 삭제처럼 되돌릴 수 없는 작업엔 반드시 확인 절차 필요

**해결**:
```jsx
const deleteProject = (index) => {
  const isConfirmed = window.confirm('정말 이 프로젝트를 삭제하시겠습니까?');
  
  if (isConfirmed) {
    fetch(`http://localhost:3001/api/projects/${index}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => setProjects(data.projects));
  }
};
```

### 10. PUT API 만들기 (프로젝트 수정)
```javascript
app.put('/api/projects/:index', (req, res) => {
  const projects = readProjects();
  const indexToUpdate = parseInt(req.params.index);
  const updatedProject = req.body;

  projects[indexToUpdate] = updatedProject;
  saveProjects(projects);

  res.json({ message: '프로젝트가 수정되었습니다!', projects });
});
```

**DELETE vs PUT 차이:**
- DELETE(`splice`): 배열에서 항목을 제거 (배열 길이가 줄어듦)
- PUT(`projects[index] = ...`): 그 자리의 내용만 교체 (배열 길이 그대로)

### 11. React에서 수정 기능 구현
```jsx
const [editingIndex, setEditingIndex] = useState(null);
const [editTitle, setEditTitle] = useState('');

const saveEdit = (index) => {
  const updatedProject = {
    ...projects[index],  // 기존 데이터 복사
    title: editTitle      // title만 교체
  };

  fetch(`http://localhost:3001/api/projects/${index}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProject)
  })
    .then(response => response.json())
    .then(data => {
      setProjects(data.projects);
      setEditingIndex(null);
    });
};
```

**새로운 개념: 스프레드 연산자(`...`)**
```jsx
{ ...projects[index], title: editTitle }
```
기존 객체를 통째로 복사하고, 특정 속성(title)만 새 값으로 덮어씀

### 12. 조건부 렌더링으로 수정 모드 구현
```jsx
{editingIndex === index ? (
  <input value={editTitle} onChange={...} />  // 수정 모드
) : (
  <ProjectCard ... />  // 보기 모드
)}
```

## 트러블슈팅 경험

| 문제 | 원인 | 해결 |
|------|------|------|
| Failed to fetch | CORS 정책 | `cors` 패키지 설치 및 적용 |
| cors is not defined | 패키지 미설치 상태에서 코드만 작성 | `npm install cors` 재실행 |
| deleteProject is not defined | 함수가 다른 함수 안에 중첩됨 | 함수를 같은 레벨로 이동 |
| 파일 수정해도 화면 반영 안 됨 | useEffect가 페이지 로드 시 한 번만 실행 | React 새로고침으로 재요청 |
| 테스트 중 실제 데이터 삭제 | 삭제 확인 절차 없음 | window.confirm() 추가 |

## HTTP 메서드 정리
| 메서드 | 용도 | 비유 |
|--------|------|------|
| GET | 조회 | 메뉴판 보여주세요 |
| POST | 생성 | 새 주문 넣어주세요 |
| PUT | 수정 | 주문 내용 바꿔주세요 |
| DELETE | 삭제 | 주문 취소해주세요 |

## 완성된 아키텍처
React (localhost:3000, 프론트엔드)
↕ fetch (GET/POST/PUT/DELETE)
Express 서버 (localhost:3001, 백엔드)
↕ fs 모듈
projects.json (영구 저장소)

## CRUD 완성!
- ✅ Create (POST) - 프로젝트 추가
- ✅ Read (GET) - 프로젝트 조회
- ✅ Update (PUT) - 프로젝트 수정
- ✅ Delete (DELETE) - 프로젝트 삭제 (확인창 포함)

## 다음 할 것
- 진짜 데이터베이스(MongoDB) 학습
- 프로젝트 추가 시 제목뿐 아니라 설명/링크도 수정 가능하게 확장
- React 프론트엔드 UI/UX 개선 (수정 폼 스타일링)
- 배포 (백엔드도 실제 서버에 올리기 - Render, Railway 등)

## 목표 진행 상황
🎯 최종 목표: 올라운드 풀스택 개발자
- ✅ 프론트엔드 (React, Router, 상태관리)
- ✅ 백엔드 (Node.js, Express, CRUD API)
- ✅ 파일 기반 영구 저장
- ⬜ 진짜 데이터베이스 (MongoDB)
- ⬜ 배포 (백엔드 서버 호스팅)
- ⬜ 디자인 시스템
- ⬜ 사운드 디자인 (게임에서 이미 시작함!)

## 오늘의 개발자 마인드
직접 실수(CORS 에러, 데이터 전체 삭제, 함수 중첩 에러)를 겪고 해결하면서
"왜 이런 문제가 생기는지" 원리를 이해함. 
단순히 따라 치는 게 아니라, 실제로 무슨 일이 일어나는지 확인하며 진행한 알찬 하루.