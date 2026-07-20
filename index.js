const express = require('express');
const cors = require('cors');
const fs = require('fs');  
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = './projects.json';

// 파일에서 데이터 읽기
function readProjects() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// 파일에 데이터 쓰기
function saveProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

app.get('/', (req, res) => {
  res.send('안녕하세요! 서버가 작동 중입니다!');
});

app.get('/api/projects', (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const projects = readProjects();
  const newProject = req.body;
  projects.push(newProject);
  saveProjects(projects);
  res.json({ message: '프로젝트가 추가되었습니다!', projects });
});

app.delete('/api/projects/:index', (req, res) => {
  const projects = readProjects();
  const indexToDelete = parseInt(req.params.index);
  
  projects.splice(indexToDelete, 1);
  saveProjects(projects);
  
  res.json({ message: '프로젝트가 삭제되었습니다!', projects });
});

app.put('/api/projects/:index', (req, res) => {
  const projects = readProjects();
  const indexToUpdate = parseInt(req.params.index);
  const updatedProject = req.body;

  projects[indexToUpdate] = updatedProject;
  saveProjects(projects);

  res.json({ message: '프로젝트가 수정되었습니다!', projects });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});