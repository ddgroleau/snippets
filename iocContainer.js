import ConstructionDirector from "./src/constructionDirector";
import HttpAdapter from "./src/httpAdapter";
import MapBuilder from "./src/mapBuilder";
import RenderTemplate from "./src/renderTemplate";
import FormValidator from "./src/formValidator";
import HttpCache from "./src/httpCache";
import TokenFactory from "./src/tokenFactory";

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

export { IocContainer, iocContainer };