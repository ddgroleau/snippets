import HttpAdapter from '../src/httpAdapter'; 
import TokenFactory from '../src/tokenFactory';

jest.mock('../src/httpAdapter')

describe('TokenFactory tests', () => {
    let httpAdapter;
    let tokenFactory;

    beforeAll(()=> {
        httpAdapter = new HttpAdapter();
        tokenFactory = new TokenFactory(httpAdapter); 
    });

    test('setTokenRequest() sets the tokenRequest property', ()=> {
        let request = {
            method: "POST",
            url: "https://test-url.com",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            body: new URLSearchParams({
                'client_id': '214deda57ede4ccfb70e16635bc37a97',
                'grant_type': 'password'
            })
        };

        tokenFactory.setTokenRequest(request);
        expect(tokenFactory.tokenRequest).toStrictEqual(request);
    });

    test('createToken() creates a new access token', () => {
        const mockToken = {
            access_token: "testToken"
        };

        httpAdapter.post.mockReturnValueOnce(Promise.resolve(mockToken));

        Promise.resolve(tokenFactory.createToken()).then(token => 
            expect(token.access_token).toBe(mockToken.access_token)
        );
    });

});