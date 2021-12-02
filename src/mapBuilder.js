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

export default MapBuilder;