import { Controller, Get, Post, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getAllArticles() {
    return this.articlesService.getAllArticles();
  }

  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(Number(id));
  }

  @Post(':id/react')
  async reactToArticle(@Param('id') id: string, @Query('action') action: string) {
    return this.articlesService.reactToArticle(Number(id), action);
  }
}
