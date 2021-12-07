/**
 * @jest-environment jsdom
 */
 import HttpAdapter from '../src/httpAdapter';

 global.fetch = jest.fn(() => Promise.resolve(
                     { 
                         ok: true, 
                         statusText:"OK",
                         statusCode: 200,
                         json: () => Promise.resolve( { "testPasses":true } )
                     }
                 ));
 
  describe('HttpAdapter tests', ()=> {
     let httpAdapter;
     const postRequest = {
         url: "http://test.com",
         method: "POST",
         header: { 
             "Content-Type": "application/json"
         },
         body: JSON.stringify({"data":"test"})
     }
     const getRequest = {
         url: "http://test.com",
         header: { 
             "Content-Type": "application/json"
         }
     }
     
     beforeAll(()=> {
         httpAdapter = new HttpAdapter();
     });
 
     test('redirectToPage() redirect to parameter relative to root', ()=> {
         let expectedUrl = 'http://localhost/provider-results';
         let actualUrl = httpAdapter.redirectToPage('/provider-results');
         expect(actualUrl).toBe(expectedUrl);
     });
 
     test('post() returns valid response', () => {
         return Promise.resolve(httpAdapter.post(postRequest)).then(response => {
             expect(response.testPasses).toBeTruthy();
         });
     });
 
     test('post() throws error if response is not 200', () => {
         fetch.mockImplementationOnce(() => Promise.reject({ 
             ok: false, 
             statusText:"Not Found",
             statusCode: 404,
             json: () => Promise.resolve( { "testPasses":true } )
         }));
         return expect(httpAdapter.post(postRequest)).rejects.toThrow();
     });
 
     test('post() throws error if catch block is reached', () => {
         fetch.mockImplementationOnce(() => Promise.reject(new Error("Bad Request")));
         return expect(httpAdapter.post(postRequest)).rejects.toThrow(new Error('Request Failed.'));
     });
 
     test('get() returns valid response', () => {
         return Promise.resolve(httpAdapter.get(getRequest)).then(response => {
             expect(response.testPasses).toBeTruthy();
         });
     });
 
     test('get() throws error if response is not 200', () => {
         fetch.mockImplementationOnce(() => Promise.reject({ 
             ok: false, 
             statusText:"Not Found",
             statusCode: 404,
             json: () => Promise.resolve( { "testPasses":true } )
         }));
         return expect(httpAdapter.get(getRequest)).rejects.toThrow();
     });
 
     test('get() throws error if catch block is reached', () => {
         fetch.mockImplementationOnce(() => Promise.reject(new Error("Bad Request")));
         return expect(httpAdapter.get(getRequest)).rejects.toThrow(new Error('Request Failed.'));
     });
 
  });