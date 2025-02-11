import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any; // Aquí puedes definir el tipo específico del usuario si lo tienes
}
