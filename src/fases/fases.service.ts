import { Injectable } from '@nestjs/common';
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';

@Injectable()
export class FasesService {
  create(createFaseDto: CreateFaseDto) {
    return 'This action adds a new fase';
  }

  findAll() {
    return `This action returns all fases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fase`;
  }

  update(id: number, updateFaseDto: UpdateFaseDto) {
    return `This action updates a #${id} fase`;
  }

  remove(id: number) {
    return `This action removes a #${id} fase`;
  }
}
