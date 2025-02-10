import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import multer, { diskStorage, memoryStorage } from 'multer';
import * as fs from 'fs';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { SupabaseService } from 'src/common/cloudinary/cloudinary.service';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private cloudinaryService: SupabaseService,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createEquipoDto: CreateEquipoDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    try {
      console.log('📥 Archivo recibido en el backend:', logo);

      if (!logo) {
        throw new Error('No se recibió ninguna imagen.');
      }

      const folderPath = `media/campeonatos/${createEquipoDto.campeonato}/categorias/${createEquipoDto.categoria}/equipos`;
      const logoUrl = await this.cloudinaryService.uploadImage(logo, folderPath);

      console.log(`✅ Imagen subida con éxito a Cloudinary: ${logoUrl}`);

      return this.equiposService.create(createEquipoDto, logoUrl);
    } catch (error) {
      console.error('⛔ Error al subir la imagen:', error);
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
