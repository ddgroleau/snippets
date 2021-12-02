/**
 * @jest-environment jsdom
 */
 import MapBuilder from '../src/mapBuilder';
 import ConstructionDirector from '../src/constructionDirector';
 import RenderTemplate from '../src/renderTemplate';
 import { MockGeocoder, MockMap,  MockMarker, MockInfoWindow, MockGoogleMapsEvent, MockCoordinates } from './mockGoogleMaps';
 import { testResult, testProvider} from './mockProviderResult';
 
 describe('ConstructionDirector tests', () => {
     let mapBuilder;
     let renderTemplate;
     let director;
    
     beforeAll(() => {
         mapBuilder = new MapBuilder();
         renderTemplate = new RenderTemplate();
         mapBuilder.setConfiguration({
             mapClass: MockMap,
             markerClass: MockMarker,
             geocoder: new MockGeocoder(),
             geocoderStatus: { OK: true },
             infoWindowClass: MockInfoWindow,
             eventTarget: new MockGoogleMapsEvent(),
             coordinateClass: MockCoordinates
         });
         director = new ConstructionDirector(mapBuilder, renderTemplate);
         document.body.innerHTML = '<div id="map">' +
                                        '<div id="marker-0"></div>'+
                                        '<div id="providers-header"></div>'+
                                        '<div id="providers-list"></div>'+
                                        '<script id="providers-header-template"></script>' +
                                        '<script id="providers-list-item-template"></script>' +
                                    '</div>';
     });

     test('constructMap() runs complete builder process without error and returns map object', () => {
        let providerResult = testResult.ProviderList;
        providerResult.push(testProvider);
        let expectedCenter = { 
            center: { lat: -34.397, lng: 150.644},
            zoom: 11
        };

        mapBuilder.mapCenter = expectedCenter;

        let map = director.constructMap(providerResult);

        expect(map).toStrictEqual(new MockMap(document.getElementById('map'),expectedCenter));
    });

});

