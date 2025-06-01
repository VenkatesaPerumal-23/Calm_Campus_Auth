import { Module } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProgressService } from 'src/progress/progress.service';
@Module({
  imports:[PrismaModule,AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, ProgressService],
})
export class ArticlesModule {}
