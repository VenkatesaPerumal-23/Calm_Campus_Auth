import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ArticlesModule } from '../article/article.module';


@Module({
  imports: [PrismaModule,AuthModule,ArticlesModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}