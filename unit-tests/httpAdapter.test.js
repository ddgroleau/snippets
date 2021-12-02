/**
 * @jest-environment jsdom
 */
import HttpAdapter from '../src/httpAdapter';

 describe('HttpAdapter tests', ()=> {
    let httpAdapter;
    
    beforeAll(()=> {
        httpAdapter = new HttpAdapter();
    });

    test('redirectToPage() redirect to parameter relative to root', ()=> {
        let expectedUrl = 'http://localhost/provider-results';
        let actualUrl = httpAdapter.redirectToPage('/provider-results');
        expect(actualUrl).toBe(expectedUrl);
    });
});