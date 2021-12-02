export const testResult = {
    ProviderList: [],
    IsEligible: true,
    Message: ""
};

export const testProvider = {
    Longitude: 150.644,
    Latitude: -35.397,
    Email:"provider@provider.com",
    Phone:"1234567891",
    ZipCode:"85224",
    State:"AZ",
    City:"Chandler",
    Address1:"100 Provider St",
    Website:"https://clinic.com", 
    ClinicName:"Medical Clinic",
    SpecialtyList:["Acupuncture"],
    LastName:"TestLast", 
    FirstName:"TestFirst", 
    ProviderId:"TestId",
    Distance:5
};

export const testTextResult = {
    StoreMap: '<div class="grayed">Get Directions</div>',
    SourceLatitude: -34.397, 
    SourceLongitude: 150.644, 
    Longitude: 150.644,
    Latitude: -35.397,
    Email:"provider@provider.com",
    PhoneExtension:"123",
    Phone:"123-456-7891",
    ZipCode:"85224",
    State:"AZ",
    City:"Chandler",
    Address1:"100 Provider St",
    Website:'<a href="https://clinic.com">Visit Site</a>', 
    ClinicName:"Medical Clinic",
    LocationSequence:"01",
    SpecialtyList:'<ul><li>Acupuncture</li></ul>',
    LastName:"TestLast", 
    FirstName:"TestFirst", 
    ProviderId:"H123456789",
    Address2:"",
    Distance:5
}

export const testTemplateHtml = 
'<div id="providers-header"></div>'+
'<div id="providers-list"></div>'+
'<script id="providers-header-template" type="text/template">'+      
'<div class="list_header">'+
    '<h4>Locations closest to {{searchTerm}}:</h4>'+
    '<p><strong>Within {{distanceLimit}} miles.</strong> For other results, use the search bar above</p>'+
'</div>'+
'</script>'+
'<script id="providers-list-item-template" type="text/template">'+
    '<div>'+
        '<h5 class="map-link">{{LastName}}, {{FirstName}}'+
        '<a data-lat="{{Latitude}}" data-lng="{{Longitude}}"><i class="fa fa-map-marker"></i></a>'+
        '</h5>'+
        '<p class="miles_away"><strong>about {{Distance}} miles away</strong></p>'+
        '<p>{{Address1}}</p>'+
        '<p>{{City}}, {{State}}</p>'+
        '<div><p class="phone"><strong><a href="tel:{{Phone}}">{{Phone}}</a></strong></p></div>'+
        '{{SpecialtyList}}'+
        '<div>{{StoreMap}}</div>'+
        '<div>{{Website}}</div>'+
    '</div>'+
'</script>';

export const expectedHeaderHtml = '<div class="list_header"><h4>Locations closest to you:</h4>'+
'<p><strong>Within 50 miles.</strong> For other results, use the search bar above</p></div>';

export const expectedListHtml = 
'<div>'+
    '<h5 class="map-link">TestLast, TestFirst'+
        '<a data-lat="-35.397" data-lng="150.644"><i class="fa fa-map-marker"></i></a>'+
        '</h5>'+
        '<p class="miles_away"><strong>about 5 miles away</strong></p>'+
        '<p>100 Provider St</p>'+
        '<p>Chandler, AZ</p>'+
        '<div><p class="phone"><strong><a href="tel:123-456-7891">123-456-7891</a></strong></p></div>'+
        '<ul><li>Acupuncture</li></ul>'+
        '<div><div class="grayed">Get Directions</div></div>'+
    '<div><a href="https://clinic.com">Visit Site</a></div>'+
'</div>';

