interface JugadorExcelRow {
    cedula: string;
    nombres: string;
    apellidos: string;
    dorsal: number;
    fecha_nacimiento: string | Date; // Asegúrate de que la fecha sea válida
    canton_juega: string;
    direccion: string;
    telefono: string;
    email: string;
    equipo: string; // El nombre del equipo
    origen: string; // El origen podría ser un texto, por ejemplo "local" o "extranjero"
    foto?: string; // Foto opcional
  }
  