import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 1. Endpoint para Registrar un nuevo usuario de forma segura
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role_id } = req.body;

  // Validación rápida de campos obligatorios
  if (!name || !email || !password || !role_id) {
    res.status(400).json({ message: 'Todos los campos (name, email, password, role_id) son requeridos.' });
    return;
  }

  try {
    // Verificar si el correo electrónico ya está registrado
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
      return;
    }

    // Hashear la contraseña con bcrypt (10 rondas de salting para máxima seguridad)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role_id]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente 🎉',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.' });
  }
};