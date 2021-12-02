class ConstructionDirector {
    constructor(builder, renderTemplate) {
        this._builder = builder;
        this._renderTemplate = renderTemplate;
    }

    get builder() { return this._builder; }
    get renderTemplate() { return this._renderTemplate }

    constructMap(providerResult) {
            this.builder.buildMap();
            const sortedProviders = providerResult.sort((a, b) => {
                                    if(a.Distance === b.Distance) return 0;
                                    return a.Distance > b.Distance ? 1 : -1;
                                });
                                
            for (let i = 0; i < sortedProviders.length; i++) {
                this.builder.buildMarker(sortedProviders[i]);
                this.builder.buildMarkerInfo(sortedProviders[i], i);
                this.builder.buildTextResult(sortedProviders[i], i);
            }

            this.renderTemplate.execute([{searchTerm: 'you', distanceLimit: this.builder.distanceLimitInMiles}], "providers-header-template", "providers-header");
            this.renderTemplate.execute(this.builder.textResults, "providers-list-item-template", "providers-list");

            const infoWindow = new this.builder.configuration.infoWindowClass({content:''});
            for (let i = 0; i < sortedProviders.length; i++) {
                this.builder.buildEventListeners(infoWindow, i)
            }

            return this.builder.map;
        };
}

class FormValidator {
    constructor() {
        
    }

    invalidValue(value) {
        if(value === '' 
        || value === null 
        || value.match(/--|;/gi)
        || value.match(/[<>=\/\.\"\:]+/gi))
        {
            return true
        }
        return false
    }

    invalidField(elementValue, elementId) {
        let documentElement = document.getElementById(elementId);
        if (this.invalidValue(elementValue)) {
            documentElement.setAttribute('style','border-color: red !important;border:2px;border-style:solid');
            return true;
        }
        documentElement.setAttribute('style','');
        return false;
    }

    invalidForm(form) {
        for (let [key, value] of Object.entries(form)) {
            if (this.invalidField(value, key)) return true;
        }
        return false;
    }
}

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

class MapBuilder {
    constructor() {
        this._mapCenter = {
            center: {
                lat: null,
                lng: null
            },
            zoom: null
        };
        this._distanceLimitInMiles = 50;
        this._markers = [];
        this._markerInfo = [];
        this._textResults = [];
        this._map;
        this._configuration;
    }
    get configuration() { return this._configuration; }
    set configuration(config) { this._configuration = config; }

    get markers() { return this._markers; }
    set markers(value) { this._markers = value; }
    
    get markerInfo() { return this._markerInfo; }
    set markerInfo(value) { this._markerInfo = value; }
    
    get map() { return this._map; }
    set map(value) { this._map = value; }

    get textResults() { return this._textResults; }
    set textResults(value) { this._textResults = value; }
    
    get mapCenter() { return this._mapCenter; }
    set mapCenter(center) { this._mapCenter = center; }
    
    get distanceLimitInMiles() { return this._distanceLimitInMiles; }

    setConfiguration(configuration) {
        this.configuration = configuration;
    }

    buildMapCenter(searchAddress, zoom, callback) {
        this.configuration.geocoder.geocode({ 'address': searchAddress },  (mapResults, status) => {
            if (status == this.configuration.geocoderStatus.OK) {
                let latitude = mapResults[0].geometry.location.lat();
                let longitude = mapResults[0].geometry.location.lng();
                this.mapCenter = { 
                    center: { lat: latitude, lng: longitude},
                    zoom: zoom
                };
                return callback();
            }
            let error = new Error('Failed to set lat/long for map center.');
            return callback(error);
        });
    }

    buildMap() {
        if(this.mapCenter.center.lat && this.mapCenter.center.lng) {
            this.map = new this.configuration.mapClass(document.getElementById('map'), this.mapCenter);
        }
    }

    buildMarker(providerAddress) {
        if (!providerAddress.Latitude || !providerAddress.Longitude) throw new Error('Address lat/long is invalid.');
        let marker = new this.configuration.markerClass({
                    marker: providerAddress.FirstName,
                    position: new this.configuration.coordinateClass(providerAddress.Latitude, providerAddress.Longitude),
                    map: this.map
                });
        this.markers.push(marker);
    }

    buildMarkerInfo(providerAddress, index) {
        let markerInfo = `<div class='location_popup'><p><strong>${providerAddress.FirstName} ${providerAddress.LastName}</strong></p>`;
            
        if(providerAddress.status == "coming_soon") {
            markerInfo += "<p class='coming_soon'>Coming Soon</p>";	
        }		

        markerInfo += `<p>${providerAddress.Address1}<br>` +		
                `${providerAddress.City}, ${providerAddress.State}<br>` +		
                   providerAddress.Phone + "</p></div>";

        this.markerInfo.push(markerInfo);
    }

    buildTextResult(providerAddress, index) {
        const origin = `${this.mapCenter.center.lat},${this.mapCenter.center.lng}`;
        providerAddress.StoreMap = '<div class="grayed">Get Directions</div>';
        providerAddress.MarkerId = index;
    
        if(providerAddress.Latitude && providerAddress.Longitude && origin) {
            providerAddress.StoreMap = `<a href="https://www.google.com/maps/dir/${origin}/${providerAddress.Latitude},${providerAddress.Longitude}"` +
                                       ` target="_blank">Get Directions</a>`;    
        }
        
        if (providerAddress.Phone) {
            let phone = providerAddress.Phone;
            providerAddress.Phone = phone.substring(0, 3) + '-' + phone.substring(3, 6) + '-' + phone.substring(6, 10);
        }
        
        if(providerAddress.Website) {
            providerAddress.Website = `<a href="${providerAddress.Website}">Visit Site</a>`;
        }
        else {
            providerAddress.Website = '<div class="grayed">Visit Site</div>';
        }
    
        if(providerAddress.SpecialtyList) {
            let specialtyList = '';
            for (let specialty = 0; specialty < providerAddress.SpecialtyList.length; specialty++) {
                specialtyList += `<li>${providerAddress.SpecialtyList[specialty]}</li>`;
            }              
            providerAddress.SpecialtyList = "<ul>"+specialtyList+"</ul>"
        }   
        
        this.textResults.push(providerAddress);
    }

    buildEventListeners(infoWindow, index) {
        this.configuration.eventTarget.addListener(this.markers[index], 'mouseover', () => { 
            infoWindow.setContent(this.markerInfo[index]); 
            infoWindow.open(this.map, this.markers[index]); 
        }); 

        this.configuration.eventTarget.addListener(this.markers[index], 'mouseout', () => {
            infoWindow.close(this.map, this.markers[index]); 
        });

        document.getElementById(`marker-${index}`).addEventListener("click", ()=> {
                this.map.setCenter(this.markers[index].position);
                this.map.setZoom(13);
                this.configuration.eventTarget.trigger(this.markers[index], 'mouseover');
            });
    }

}

class RenderTemplate {
    constructor() {

    }

    execute(array, templateSource, renderDestination) {
        let templateHtml = document.getElementById(templateSource).innerHTML;
        let htmlString = '';
    
        for (let i = 0; i < array.length; i++) {
            htmlString += this._insertTemplateVariables(array[i], templateHtml)
        }
    
        if (renderDestination) document.getElementById(renderDestination).innerHTML = htmlString;
    }

    _insertTemplateVariables(object, templateHtml) {
        for (let [key, value] of Object.entries(object)) {
            let replace = new RegExp(`{{${key}}}`, "g");
            templateHtml = templateHtml.replace(replace, value);
        }
        return templateHtml;
    }
}









class IocContainer {
    constructor() {
        this._services = {};
        this._dependencies = {};
    }

    get services() {
        return this._services;
    }

    get dependencies() {
       return this._dependencies;
    }

    injectService(serviceName) {
        let dependencies = this._resolveDependencies(serviceName);
        let instance = new this.services[serviceName](...dependencies);
        return instance;
    }

    _registerService(serviceName, className, dependencies) {
        /* Register services by exact class name, class, dependency array.
        Dependency array must maintain the same order as the parameters in 
        the class constructor. Independent classes must be registered first. */
        this.services[serviceName] = className;
        if(dependencies) {
            this.dependencies[serviceName] = dependencies; 
        } else {
            this.dependencies[serviceName] = [];
        }
    }

    _resolveDependencies(serviceName) {
        let dependencyInstances = [];
        let serviceDependencies = this._dependencies[serviceName];
        if(serviceDependencies) {
            serviceDependencies.forEach(dependency => {
            let instance = this.injectService(`${dependency}`.split(" ")[1]);
            dependencyInstances.push(instance);
           });
        }
        return dependencyInstances;
    }
}

const iocContainer = new IocContainer();

iocContainer._registerService("HttpCache", HttpCache);
iocContainer._registerService("MapBuilder", MapBuilder);
iocContainer._registerService("HttpAdapter", HttpAdapter);
iocContainer._registerService("FormValidator", FormValidator);
iocContainer._registerService("RenderTemplate", RenderTemplate);
iocContainer._registerService("TokenFactory", TokenFactory, [HttpAdapter]);
iocContainer._registerService("ConstructionDirector", ConstructionDirector, [MapBuilder, RenderTemplate]);

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


