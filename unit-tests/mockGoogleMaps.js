
export class MockGeocoder {

    geocode(address,callback) {
        let status = true;
        let mapResults = [{
            geometry: {
                location: {
                    lat() { return -34.397 },
                    lng() { return 150.644 }
                }
            }
        }];
        callback(mapResults, status);
    }
}

export class MockMap {
    constructor(element, options) {
        this._element = element;
        this._options = options;
    }
    get options() { return this._options }
    set options(value) { this._options = value;}
    get center() { return this.options.center }
    set center(value) { this.optionscenter = value }
    get zoom() { return this.optionszoom }
    set zoom(value) { this.options = value }

    setCenter(value) {
        center = value;
    }

    setZoom(value) {
        zoom =value;
    }

}


export class MockInfoWindow {
    constructor(options) {
        this._content = options.content;
        this._map;
        this._marker;
    }

    get content() { return this._content; }
    set content(value) { this._content = value; }
    get map() { return this._map; }
    set map(value) { this._map = value; }
    get marker() { return this._marker; }
    set marker(value) { this._marker = value; }

    setContent(content) {
        this.content = content;
    }
    open(map, marker) {
        this.map = true;
        this.marker = true;
    }
    close(map, marker) {
        this.map = false;
        this.marker = false;
    }
}

export class MockGoogleMapsEvent {
    constructor() {
        this._listeners = [];
    }

    get listeners() { return this._listeners }
    set listeners(value) { this._listeners = value }
    
    addListener(marker, event, callback) {
        this.listeners.push({marker: marker, event: event});
        callback();
    }
}

export class MockCoordinates {
    constructor(lat, long) {

    }
}

export class MockMarker {
    
}