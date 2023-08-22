import { DataSource, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.userRepo.findOne({
      where: { id: createPostDto.authorId },
    });
    if (!user) throw new NotFoundException('User not found');

    const newPost = new Post();
    newPost.title = createPostDto.title;
    newPost.body = createPostDto.body;
    newPost.author = user;

    await this.postRepository.save(newPost);

    return newPost;
  }

  async findAll() {
    return this.postRepository.find({
      relations: {
        author: {
          posts: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.postRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const postToUpdate = await this.postRepository.findOne({
      where: { id: id },
    });
    if (!postToUpdate) {
      throw new Error(`Post with ID ${id} not found`);
    }

    this.postRepository.merge(postToUpdate, updatePostDto);
    await this.postRepository.save(postToUpdate);
    return postToUpdate;
  }

  async remove(id: number) {
    const postToRemove = await this.postRepository.findOne({
      where: { id: id },
    });
    if (!postToRemove) {
      throw new Error(`Post with ID ${id} not found`);
    }

    await this.postRepository.remove(postToRemove);
    return `Post with ID ${id} has been removed`;
  }
}
