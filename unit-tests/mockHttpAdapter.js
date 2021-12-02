export class MockHttpAdapter {
    constructor(response) {
        this._response = response;
    }

    get response() {return this._response;}

    post(request) {
        return new Promise((resolve, reject)=> {
            resolve(this.response);
        });
    }

    get(request) {
        return new Promise((resolve, reject)=> {
            resolve(this.response);
        });
    }
}

export class MockResponse {
    constructor(body, status, ok, statusText) {
        this._body = body;
        this._status = status;
        this._ok = ok;
        this._statusText = statusText;
    }
    get body() { return this._body; }
    get status() { return this._status; }
    get ok() { return this._ok; }
    get statusText() { return this._statusText; }
}
