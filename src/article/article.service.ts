import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async getAllArticles() {
    const articles = await this.prisma.article.findMany();

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      sub_description: article.sub_description,
      image_url: article.image_url, 
      contents: [{
        source_url: article.sourceUrl,
        category: article.category,
        author: article.author,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        likes: article.likes,
        dislikes: article.dislikes,
      }],
    }));
  }  

  async getArticleById(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    return {
      id: article.id,
      title: article.title,
      sub_description: article.sub_description, 
      image_url: article.image_url,
      contents: [{
        source_url: article.sourceUrl,
        category: article.category,
        author: article.author,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        likes: article.likes,
        dislikes: article.dislikes,
      }],
    };
  }

  async reactToArticle(id: number, action: string) {
    if (action === 'like') {
      return this.prisma.article.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
    } else if (action === 'dislike') {
      return this.prisma.article.update({
        where: { id },
        data: { dislikes: { increment: 1 } },
      });
    } else {
      throw new BadRequestException('Invalid action. Use "like" or "dislike".');
    }
  }
}
