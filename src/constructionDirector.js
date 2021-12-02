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

export default ConstructionDirector;