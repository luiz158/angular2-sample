/* tslint:disable:no-unused-variable */

import {
  beforeEach, addProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject, fakeAsync, tick
} from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { provide } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Headers
} from '@angular/http';
import { PostService } from './post.service';

import {Post} from '../model/post.model';

var posts = [
  { id: 1, title: 'Fist Post', content: 'Content of First Post' },
  { id: 2, title: 'Second Post', content: 'Content of Second Post' },
  { id: 3, title: 'Third Post', content: 'Content of Third Post' }
];

console.log(JSON.stringify(posts));

/* import {Http, BaseRequestOptions, Response} from '@angular/http';
    * import {MockBackend} from '@angular/http/testing';
    * import {Injector, provide} from '@angular/core';
    *
    * it('should get a response', () => {
    *   var connection; //this will be set when a new connection is emitted from the backend.
    *   var text; //this will be set from mock response
    *   var injector = Injector.resolveAndCreate([
    *     MockBackend,
    *     {provide: Http, useFactory: (backend, options) => {
    *       return new Http(backend, options);
    *     }, deps: [MockBackend, BaseRequestOptions]}]);
    *   var backend = injector.get(MockBackend);
    *   var http = injector.get(Http);
    *   backend.connections.subscribe(c => connection = c);
    *   http.request('something.json').subscribe(res => {
    *     text = res.text();
    *   });
    *   connection.mockRespond(new Response({body: 'Something'}));
    *   expect(text).toBe('Something');
    * });
*/

describe('Post Service', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      PostService,
      provide(Http, {
        useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
      })
    ]);
  });

  it('get all posts',
    fakeAsync(inject([PostService, MockBackend], (postService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('/api/posts/');
        let response = new ResponseOptions({ body: JSON.stringify(posts) });
        c.mockRespond(new Response(response));
      });
      postService.getPosts().subscribe((response) => {
        res = response;
      });
      tick(1000);

      expect(res[0].title).toBe('Fist Post');
      expect(res[0].content).toBe('Content of First Post');
    }))
  );


  it('get post by id',
    fakeAsync(inject([PostService, MockBackend], (postService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('/api/posts/1');
        let response = new ResponseOptions({ body: JSON.stringify(posts[0]) });
        c.mockRespond(new Response(response));
      });
      postService.getPost(1).subscribe((response) => {
        res = response;
      });
      tick(1000);

      expect(res.title).toBe('Fist Post');
      expect(res.content).toBe('Content of First Post');
    }))
  );


  it('save post',
    fakeAsync(inject([PostService, MockBackend], (postService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('/api/posts/');
        let headers = new Headers();
        headers.append('Location', '/api/posts/1');
        let response = new ResponseOptions({ status: 201, headers: this.headers });
        c.mockRespond(new Response(response));
      });
      postService.save({ title: 'test title', content: 'test content' }).subscribe((response) => {
        res = response;
      });
      tick(1000);

      expect(res.status).toBe(201);
    }))
  );

  it('update post',
    fakeAsync(inject([PostService, MockBackend], (postService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('/api/posts/1');
        let response = new ResponseOptions({ status: 204 });
        c.mockRespond(new Response(response));
      });
      postService.update(1, { title: 'test title', content: 'test content' }).subscribe((response) => {
        res = response;
      });
      tick(1000);

      expect(res.status).toBe(204);
    }))
  );

  it('delete post by id',
    fakeAsync(inject([PostService, MockBackend], (postService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(c => {
        expect(c.request.url).toBe('/api/posts/1');
        let response = new ResponseOptions({ status: 204 });
        c.mockRespond(new Response(response));
      });
      postService.delete(1).subscribe((response) => {
        res = response;
      });
      tick(1000);

      expect(res.status).toBe(204);
    }))
  );

});
