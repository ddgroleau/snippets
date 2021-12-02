/**
 * @jest-environment jsdom
 */
import MapBuilder from '../src/mapBuilder';
import { MockGeocoder, MockMap,  MockMarker, MockInfoWindow, MockGoogleMapsEvent, MockCoordinates } from './mockGoogleMaps';

describe('MapBuilder tests', () => {
    let mapBuilder;

    beforeAll(() => {
        mapBuilder = new MapBuilder();
        mapBuilder.setConfiguration({
            mapClass: MockMap,
            markerClass: MockMarker,
            geocoder: new MockGeocoder(),
            geocoderStatus: { OK: true },
            infoWindowClass: MockInfoWindow,
            eventTarget: new MockGoogleMapsEvent(),
            coordinateClass: MockCoordinates
        });
    })

    test('buildMapCenter() sets mapCenter', () => {
        let expectedMapCenter = { 
            center: { lat: -34.397, lng: 150.644},
            zoom: 11
        };

        mapBuilder.buildMapCenter('85224', 11, ()=> {});
        
        expect(mapBuilder.mapCenter).toStrictEqual(expectedMapCenter);
    });

    test('buildMap() sets map value', () => {
        mapBuilder.mapCenter = { 
            center: { lat: -34.397, lng: 150.644},
            zoom: 11
        };
        document.body.innerHTML = '<div id="map"></div>';
        mapBuilder.buildMap()
        expect(mapBuilder.map).toStrictEqual(new MockMap(document.getElementById('map'), mapBuilder.mapCenter));
    });

    test('buildMap() with no map center does not set map value', () => {
        mapBuilder.map = undefined;
        mapBuilder.mapCenter = { 
            center: {
                lat: null,
                lng: null
            },
            zoom: null
        };;
        document.body.innerHTML = '<div id="map"></div>';
        mapBuilder.buildMap()
        expect(mapBuilder.map).toBeUndefined()
    });

    test('buildMapCenter() throws error if Geocoder status is unexpected', () => {
        mapBuilder.configuration.geocoderStatus.OK = false;
        expect(() =>mapBuilder.buildMapCenter('85224', 11)).toThrow();
    });

    test('buildMarker() returns marker options object', () => {
        mapBuilder.map = new mapBuilder.configuration.mapClass();
        let providerAddress = { FirstName: "TestProvider", Latitude: -34.397, Longitude: 150.644 };
        let expectedMarker = new MockMarker({ marker: "TestProvider", position: new MockCoordinates(-34.397, 150.644), map: new MockMap() });

        mapBuilder.buildMarker(providerAddress);

        expect(mapBuilder.markers[0]).toStrictEqual(expectedMarker);
    });

    test('buildMarker() with missing provider data returns marker options object', () => {
        let providerAddress = { FirstName: "", Latitude: null, Longitude: null };
        
        expect(()=> mapBuilder.buildMarker(providerAddress)).toThrow();
    });

    test('buildMarkerInfo() with coming_soon returns correct HTML', ()=> {
        let index = 0;
        let providerAddress = {
            FirstName: "Test",
            LastName: "User",
            Address1: "10 Test St.",
            City: "TestCity",
            State: "TestState",
            Phone: "TestPhone",
            status: "coming_soon"
        }
        let expectedHTML = `<div class='location_popup'><p><strong>${providerAddress.FirstName} ${providerAddress.LastName}</strong></p>`+
                            `<p class='coming_soon'>Coming Soon</p>`+	
                            `<p>${providerAddress.Address1}<br>` +		
                            `${providerAddress.City}, ${providerAddress.State}<br>` +		
                               providerAddress.Phone + "</p></div>";
        
        mapBuilder.buildMarkerInfo(providerAddress,index);
        expect(mapBuilder.markerInfo[0]).toBe(expectedHTML);
    });

    test('buildMarkerInfo() without coming_soon status returns correct HTML', ()=> {
        let index = 1;
        let providerAddress = {
            FirstName: "Test",
            LastName: "User",
            Address1: "10 Test St.",
            City: "TestCity",
            State: "TestState",
            Phone: "TestPhone",
            status: "none"
        }
        let expectedHTML = `<div class='location_popup'><p><strong>${providerAddress.FirstName} ${providerAddress.LastName}</strong></p>`+
                            `<p>${providerAddress.Address1}<br>` +		
                            `${providerAddress.City}, ${providerAddress.State}<br>` +		
                               providerAddress.Phone + "</p></div>";

                               
        mapBuilder.buildMarkerInfo(providerAddress,index);
        expect(mapBuilder.markerInfo[1]).toBe(expectedHTML);
    });

    test('buildTextResult() returns providerAddress object with HTML', ()=> {
        mapBuilder.mapCenter.center.lat = -34.397;
        mapBuilder.mapCenter.center.lng = 150.644;
        let expectedOrigin = '-34.397,150.644';
        let storeId = 1;
        let providerAddress = {
            Latitude: -34.397,
            Longitude: 150.644,
            Phone: '1234567891',
            Website: 'https://provider.com',
            SpecialtyList: ["Chiro","Massage"]
        };
        let expected = {
            StoreMap:`<a href="https://www.google.com/maps/dir/${expectedOrigin}/${providerAddress.Latitude},${providerAddress.Longitude}"` +
                      ` target="_blank">Get Directions</a>`,
            MarkerId: 1,
            Latitude: -34.397,
            Longitude: 150.644,
            Phone: '123-456-7891',
            Website: `<a href="${providerAddress.Website}">Visit Site</a>`,
            SpecialtyList:`<ul><li>${providerAddress.SpecialtyList[0]}</li><li>${providerAddress.SpecialtyList[1]}</li></ul>`
        }

        mapBuilder.buildTextResult(providerAddress, storeId);
        expect(mapBuilder.textResults[0]).toStrictEqual(expected);
    });

    test('buildTextResult() with false IF statement results returns providerAddress object with HTML', ()=> {
        mapBuilder.textResults = [];
        let storeId = 1;
        let providerAddress = {
            Latitude: '',
            Longitude: '',
            Phone: '',
            Website: '',
            SpecialtyList: ''
        };
        let expected = {
            StoreMap: '<div class="grayed">Get Directions</div>',
            MarkerId: storeId,
            Latitude: '',
            Longitude: '',
            Phone: '',
            Website: '<div class="grayed">Visit Site</div>',
            SpecialtyList: ''
        }

        mapBuilder.buildTextResult(providerAddress, storeId);
        expect(mapBuilder.textResults[0]).toStrictEqual(expected);
    });

    test('buildEventListeners() adds two event listeners to the event target', ()=> {
        let infoWindow = new MockInfoWindow({content: ''});
        mapBuilder.markers = [];
        mapBuilder.markers.push(new MockMarker({ position:new MockCoordinates(-34.397, 150.644) }));
        document.body.innerHTML = '<div id="marker-0"></div>';
        let expectedListeners = [ {marker: mapBuilder.markers[0], event: "mouseover"},{marker: mapBuilder.markers[0], event: "mouseout"}]

        mapBuilder.buildEventListeners(infoWindow, 0)

        expect(mapBuilder.configuration.eventTarget.listeners).toStrictEqual(expectedListeners);
    });
});