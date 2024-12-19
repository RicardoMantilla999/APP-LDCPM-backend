import * as fs from 'fs';
import * as path from 'path';

const basePath = path.join(__dirname, '..','..', '..', 'media');

export function createFolderStructure(campeonatoId: number, categoriaId: number, equipoNombre: string): string {
  //const basePath = path.join(__dirname, '..', '..', 'media');
  const folderPath = path.join(basePath, `${campeonatoId}/${categoriaId}/${equipoNombre}/Jugadores`);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
}

export function generateFileName(dorsal: number, apellido: string): string {
  return `${dorsal}-${apellido}.png`;
}
