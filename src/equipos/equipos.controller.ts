import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const { campeonato, categoria, nombre } = req.body;

        console.log('Datos recibidos:', req.body); // Log para verificar los datos

        if (!campeonato || !categoria || !nombre) {
          return cb(new Error('Faltan datos necesarios para la carga del archivo'), null);
        }

        const sanitizedNombre = nombre.replace(/ /g, '-').toUpperCase();

        const uploadPath = path.resolve('media', campeonato, categoria, sanitizedNombre, 'logo');

        try {
          fs.mkdirSync(uploadPath, { recursive: true });
          console.log(`Directorio creado: ${uploadPath}`);
        } catch (error) {
          console.error('Error al crear el directorio:', error);
          return cb(new Error('Error al crear el directorio de carga'), null);
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        cb(null, `logo${fileExt}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      console.log('Archivo recibido:', file); // Log para verificar el archivo
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new Error('Solo se permiten imágenes JPG y PNG'), false);
      }
      cb(null, true);
    },
  }))
  async create(@Body() createEquipoDto: CreateEquipoDto, @UploadedFile() logo: Express.Multer.File) {
    try {

      // Reemplazar espacios por guiones en los nombres
      const sanitizedNombre = createEquipoDto.nombre.replace(/ /g, '-');

      // Aquí se puede continuar con la creación del equipo como antes
      const rutaLogo = `${createEquipoDto.campeonato}/${createEquipoDto.categoria}/${sanitizedNombre}/logo/${logo.filename}`;
      return this.equiposService.create(createEquipoDto, rutaLogo);
    } catch (error) {
      // Manejo de errores
      throw new Error('Error al crear el equipo: ' + error.message);
    }
  }


  @Get('/bycampeonato/:id')
  findAll(@Param('id') id: string) {
    return this.equiposService.findAll(+id);
  }

  @Get('/bycategoria/:id')
  filtrarEquiposByCategoria(@Param('id') id: string) {
    return this.equiposService.filtrarEquiposByCategoria(+id);
  }
  @Get('/bycategoria/:categoriaId/bycampeonato/:campeonatoId')
  getEquiposByCategoriaAndCampeonato(@Param('categoriaId') categoriaId: string, @Param('campeonatoId') campeonatoId: string) {
    return this.equiposService.getEquiposByCategoriaAndCampeonato(+categoriaId, +campeonatoId);
  }

  @Patch('/actualizar-nro-sorteo')
  async actualizarNroSorteo(
    @Body() equipos: { id: number; nro_sorteo: number }[],
  ): Promise<any> {
    return await this.equiposService.actualizarNroSorteo(equipos);
  }



  @Get('/count/:id')
  contarEquipos(@Param('id') id: string) {
    return this.equiposService.contarEquipos(+id);
  }

  @Get('/count/:categoriaid/:campeonatoid')
  contarEquiposByCategoria(@Param('categoriaid') idcat: string, @Param('campeonatoid') idcam: string) {
    return this.equiposService.contarEquiposByCategoria(+idcat, +idcam);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equiposService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const { campeonato, categoria, nombre } = req.body;
        const uploadPath = `./media/${campeonato}/${categoria}/${nombre}/logo`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const fileExt = extname(file.originalname);
        cb(null, `logo${fileExt}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new Error('Solo se permiten imágenes JPG y PNG'), false);
      }
      cb(null, true);
    },
  }))
  async update(@Param('id') id: number, @Body() updateEquipoDto: UpdateEquipoDto, @UploadedFile() logo: Express.Multer.File) {
    const equipo = await this.equiposService.findOne(id);
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    const campeonato = await this.equiposService.getCampeonatoById(updateEquipoDto.campeonato);
    const categoria = await this.equiposService.getCategoriaById(updateEquipoDto.categoria);

    let rutaLogo = equipo.logo;
    if (logo) {
      rutaLogo = `${campeonato.id}/${categoria.id}/${updateEquipoDto.nombre}/logo/${logo.filename}`;
    }

    return this.equiposService.update(id, { ...updateEquipoDto, logo: rutaLogo });
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }
}
