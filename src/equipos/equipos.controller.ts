import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, UseGuards, InternalServerErrorException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
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
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';



@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private cloudinaryService: CloudinaryService,
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createEquipoDto: CreateEquipoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Tipos MIME correctos
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    try {
      console.log('📥 Archivo recibido en el backend:', file);

      if (!file) {
        throw new BadRequestException('No se recibió ninguna imagen.');
      }

      // Definir la carpeta en Cloudinary
      const folderPath = `campeonatos/${createEquipoDto.campeonato}/categorias/${createEquipoDto.categoria}/equipos`;

      // Subir imagen a Cloudinary
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, folderPath);

      if (!cloudinaryResponse.secure_url) {
        throw new InternalServerErrorException('No se pudo obtener la URL de la imagen subida.');
      }

      console.log(`✅ Imagen subida con éxito a Cloudinary: ${cloudinaryResponse.secure_url}`);

      // Crear el equipo con la URL del logo
      return this.equiposService.create(createEquipoDto, cloudinaryResponse.secure_url);
    } catch (error) {
      console.error('⛔ Error al subir la imagen:', error);
      throw new InternalServerErrorException('Error al crear el equipo: ' + error.message);
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
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: number,
    @Body() updateEquipoDto: UpdateEquipoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    try {
      // Buscar el equipo por ID
      const equipo = await this.equiposService.findOne(id);
      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
      }

      // Si el equipo ya tiene un logo en Cloudinary, eliminarlo
      if (equipo.logo) {
        const publicId = this.cloudinaryService.extractPublicId(equipo.logo); // Extrae el ID de Cloudinary
        await this.cloudinaryService.deleteImage(publicId);
        console.log(`🗑️ Imagen anterior eliminada de Cloudinary: ${publicId}`);
      }

      let nuevaRutaLogo = equipo.logo; // Mantiene la imagen actual si no se sube una nueva

      // Si hay un nuevo archivo, subirlo a Cloudinary
      if (file) {
        const folderPath = `campeonatos/${updateEquipoDto.campeonato}/categorias/${updateEquipoDto.categoria}/equipos`;
        const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, folderPath);

        if (!cloudinaryResponse.secure_url) {
          throw new InternalServerErrorException('No se pudo obtener la URL de la nueva imagen subida.');
        }

        console.log(`✅ Nueva imagen subida con éxito: ${cloudinaryResponse.secure_url}`);
        nuevaRutaLogo = cloudinaryResponse.secure_url; // Asignar la nueva URL del logo
      }

      // Actualizar el equipo con la nueva información
      return this.equiposService.update(id, { ...updateEquipoDto, logo: nuevaRutaLogo });

    } catch (error) {
      console.error('⛔ Error al actualizar el equipo:', error);
      throw new InternalServerErrorException('Error al actualizar el equipo: ' + error.message);
    }
  }



  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }
}
