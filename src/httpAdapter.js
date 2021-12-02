class HttpAdapter {
    constructor() {
    }

    async post(request) {
        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            if (response.ok) {
                return await response.json();
            } 
            else {
                throw new Error(`Request failed for the following reason: ${response.statusText}.`);
            }
        }
        catch(error) {
            throw new Error('Request Failed.');
        }
    }

    async get(request) {
        try {
            const response = await fetch(request.url, {
                headers: request.headers,
            });
            if (response.ok) {
                return await response.json();
            } 
            else {
                throw new Error(`Request failed for the following reason: ${response.statusText}.`);
            }
        }
        catch(error) {
            throw new Error('Request Failed.');
        }
    }

    redirectToPage(urlRelativeToRoot) {
        let root = window.location.origin;
        let redirect = root += urlRelativeToRoot;
        
        return redirect;
    }

}

export default HttpAdapter;
