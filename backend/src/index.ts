import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Rutas de la API
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de La Deolinda funcionando de forma segura 🔒' });
});

app.listen(PORT, async () => {
  console.log(`Servidor seguro corriendo en http://localhost:${PORT}`);
  await testConnection();
});