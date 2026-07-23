const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 연결 성공!'))
  .catch((err) => console.log('MongoDB 연결 실패:', err));

app.get('/', (req, res) => {
  res.send('안녕하세요! 서버가 작동 중입니다!');
});

// 전체 조회
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// 추가
app.post('/api/projects', async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  const projects = await Project.find();
  res.json({ message: '프로젝트가 추가되었습니다!', projects });
});

// 수정
app.put('/api/projects/:id', async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, req.body);
  const projects = await Project.find();
  res.json({ message: '프로젝트가 수정되었습니다!', projects });
});

// 삭제
app.delete('/api/projects/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  const projects = await Project.find();
  res.json({ message: '프로젝트가 삭제되었습니다!', projects });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});