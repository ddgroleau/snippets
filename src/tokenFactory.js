class TokenFactory {
    constructor(httpAdapter) {
        this._httpAdapter = httpAdapter;
        this._tokenRequest;
    }
    
    get httpAdapter() { return this._httpAdapter; }

    get tokenRequest() { return this._tokenRequest; }
    set tokenRequest(request) { this._tokenRequest = request }

    setTokenRequest(request) {
        this.tokenRequest = request;
    }

    async createToken() {
        const token = await this.httpAdapter.post(this.tokenRequest);
        return token;
    }
}

export default TokenFactory;
