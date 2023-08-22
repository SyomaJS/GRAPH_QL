import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from '../post/post.service';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  async getAllPost(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => Post)
  async getOnePost(@Args('id') id: number): Promise<Post> {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Args('createPost') createPostDto: CreatePostDto,
  ): Promise<Post> {
    return this.postService.create(createPostDto);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: number,
    @Args('updatePost') updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto);
  }

  @Mutation(() => Number)
  async removePost(@Args('id') id: number) {
    return this.postService.remove(id);
  }
}
