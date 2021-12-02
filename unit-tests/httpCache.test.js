/**
 * @jest-environment jsdom
 */
import HttpCache from '../src/httpCache';

describe('HttpCache tests', () => {
    let httpCache;

    beforeAll(() => {
        httpCache = new HttpCache();
        document.cookie = 'token=testToken;';

    })

    test('getCookie() returns cookie', ()=>{
        const token = httpCache.getCookie('token');
        expect(token).toBe('testToken');
    })

    test('getCookie() returns null if name not found', ()=>{
        const cookie = httpCache.getCookie('cookieThatDoesntExist');
        expect(cookie).toBeNull();
    })

    test('setCookie() sets new cookie without expires if days not provided', ()=> {
        const name = 'testCookie'
        const expectedCookieValue = 'testValue'
        
        httpCache.setCookie(name,expectedCookieValue);
        const actualCookieValue = document.cookie.split('; ')
                            .find(row => row.startsWith(`${name}=`))
                            .split('=')[1];

        const expires = document.cookie.split('; ').find(row => row.startsWith(`expires=`))
    
        expect(actualCookieValue).toBe(expectedCookieValue);
        expect(expires).toBeUndefined();
    });

    test('setCookie() sets new cookie', ()=> {
        const name = 'testCookie'
        const expectedCookieValue = 'testValue'
        const days = 5;
        
        httpCache.setCookie(name,expectedCookieValue, days);
        const actualCookieValue = document.cookie.split('; ')
                            .find(row => row.startsWith(`${name}=`))
                            .split('=')[1];
     
        expect(actualCookieValue).toBe(expectedCookieValue);
    });
})