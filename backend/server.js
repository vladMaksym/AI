import express from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;
const FILE_PATH = 'tasks.json';

app.use(cors());
app.use(bodyParser.json());

const readTasks = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
};

const writeTasks = (tasks) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
};

app.get('/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = { id: uuidv4(), text: req.body.text, completed: false };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map(task => task.id === req.params.id ? { ...task, completed: req.body.completed } : task);
  writeTasks(tasks);
  res.json({ success: true });
});

app.delete('/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== req.params.id);
  writeTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});