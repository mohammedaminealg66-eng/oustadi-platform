import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany();
  }
}