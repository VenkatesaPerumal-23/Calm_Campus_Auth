import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { ProgressService } from '../progress/progress.service';


@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService,
    private progressService: ProgressService
  ) {}

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
async markArticleAsRead(articleId: number, userId: string) {
  const article = await this.prisma.article.findUnique({ where: { id: articleId } });

  if (!article) {
    throw new Error('Article not found');
  }

  const existingRead = await this.prisma.userarticleread.findFirst({
    where: {
      article_id: articleId,
      user_id: userId,
    },
  });

  if (!existingRead) {
    await this.prisma.userarticleread.create({
      data: {
        article_id: articleId,
        user_id: userId,
      },
    });

    await this.progressService.updateProgress(userId, { articlesRead: 1 });

    return { message: 'Article marked as read' };
  }

  return { message: 'Article already marked as read' };
}

}
