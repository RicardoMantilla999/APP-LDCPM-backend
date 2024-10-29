import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioRepository.save(createUsuarioDto);
  }

  async findByUsernameWithPassword(username: string) {
    return await this.usuarioRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'rol'],
    });
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOneByUsername(username: string) {
    return await this.usuarioRepository.findOneBy({username});
  }

  async findOne(id: number) {
    return await this.usuarioRepository.findOneBy({id});
  }


  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    //return await this.usuarioRepository.update(id, {updateUsuarioDto});
  }

  remove(id: number) {
    return this.usuarioRepository.softDelete(id);
  }
}
