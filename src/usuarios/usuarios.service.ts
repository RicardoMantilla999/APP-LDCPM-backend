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
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioRepository.save(createUsuarioDto);
  }

  async findByEmailWithPassword(email: string) {
    return await this.usuarioRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password', 'rol'],
    });
  }

  async findAllUser(id: number) {
    return await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'username', 'password','email', 'rol'],
    });
  }


  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOneByUsernameOrEmail(username: string, email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  async findOneByEmail(email: string): Promise<Usuario | undefined> {
    console.log('Buscando usuario con email:', email);  // Agregar log para verificar
    return this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: number) {
    return await this.usuarioRepository.findOneBy({ id });
  }


  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    //return await this.usuarioRepository.update(id, {updateUsuarioDto});
  }

  remove(id: number) {
    return this.usuarioRepository.softDelete(id);
  }
}
