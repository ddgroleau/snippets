class HttpCache {
    constructor() {
    }
    
    setCookie(name,value,days) {
        let expires ='';
        if(days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/;`; 
    }

    getCookie(name) {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
                                    
        return cookie ? cookie.split('=')[1] : null;
    }

}

export default HttpCache;