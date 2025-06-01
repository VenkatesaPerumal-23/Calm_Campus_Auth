import { Controller, Get, Post, Param, UseGuards,Req, Query } from '@nestjs/common';
import { Request } from 'express';
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
  @Post(':id/mark-as-read')
  async markArticleAsRead(@Param('id') id:string, @Req() req:Request){
    const userId = String(req.user?.user_id)
    return this.articlesService.markArticleAsRead(Number(id), userId);
  }
}
    