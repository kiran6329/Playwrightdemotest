import { APIRequestContext } from '@playwright/test';

export class PostsAPI {

  private baseURL = 'https://jsonplaceholder.typicode.com';

  constructor(private request: APIRequestContext) {}

  async getPosts() {
    return await this.request.get(`${this.baseURL}/posts`);
  }

  async createPost(payload: any) {
    return await this.request.post(`${this.baseURL}/posts`, {
      data: payload
    });
  }
}