import { test, expect } from '@playwright/test';
import { PostsAPI } from '../api/postsAPI';
import { postPayload } from '../test-data/postsData';

test.describe('Posts API Tests', () => {

  test('GET request to retrieve posts', async ({ request }) => {

    const postsAPI = new PostsAPI(request);
    
    const startTime = Date.now();
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const response = await postsAPI.getPosts();

    expect(response.status()).toBe(200);

    const body = await response.json();
     console.log("Status Code:", response.status());

  // Print Response Time
  console.log("Response Time:", responseTime + "ms");

  // Print Headers
  console.log("Headers:", response.headers());
    
  // Pretty Print Body
  console.log("Response Body:\n", JSON.stringify(body, null, 2));

   // console.log("Response Body:", body);
    expect(body.length).toBeGreaterThan(0);

    expect(body[0]).toHaveProperty('userId');
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('title');
    expect(body[0]).toHaveProperty('body');

  });

  test('POST request to create a post', async ({ request }) => {

    const postsAPI = new PostsAPI(request);
    const startTime = Date.now();
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const response = await postsAPI.createPost(postPayload);

    expect(response.status()).toBe(201);

    const body = await response.json();
     
    console.log("Status Code:", response.status());

  // Print Response Time
  console.log("Response Time:", responseTime + "ms");

  // Print Headers
  console.log("Headers:", response.headers());

  // Print Payload
  console.log("Request Payload:", postPayload);

  console.log("Response Body:\n", JSON.stringify(body, null, 2));

   // console.log("POST Response:", body);
    expect(body.title).toBe(postPayload.title);
    expect(body.body).toBe(postPayload.body);
    expect(body.userId).toBe(postPayload.userId);

    expect(body).toHaveProperty('id');

  });

});