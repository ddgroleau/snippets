import { IocContainer } from "../iocContainer";
import { Car, Wheel, Tire, Rotor, Rim, Caliper } from'./mockIocClasses.js' ;

describe('IocContainer tests', () => {
    let iocContainer;

    beforeAll(()=> {
        iocContainer = new IocContainer();
        iocContainer._registerService("Rim", Rim);
        iocContainer._registerService("Tire", Tire);
        iocContainer._registerService("Caliper", Caliper);
        iocContainer._registerService("Rotor", Rotor, [Caliper]);
        iocContainer._registerService("Wheel", Wheel, [Tire, Rotor, Rim]);
        iocContainer._registerService("Car", Car, [Wheel]);
    });

    test('_registerService() added services and dependencies', ()=> {
        let expectedDependencies = {
            "Rim":[],
            "Tire": [],
            "Caliper":[],
            "Rotor":[Caliper],
            "Wheel":[Tire, Rotor, Rim],
            "Car":[Wheel]
        }
        expect(iocContainer.dependencies).toStrictEqual(expectedDependencies);
    });

    test('_resolveDependencies() with with no dependencies should return empty array', ()=>{
        let dependencies = iocContainer._resolveDependencies("Rim");
        expect(dependencies).toStrictEqual([]);
    });

    test('_resolveDependencies() with with one dependency should return array with instance', ()=>{
        let dependencies = iocContainer._resolveDependencies("Rotor");
        expect(dependencies[0]).toStrictEqual(new Caliper());
        expect(dependencies[0].confirmInstantiated()).toBeTruthy();
    });

    test('_resolveDependencies() with with complex dependencies should return array with 3 instances', ()=>{
        let dependencies = iocContainer._resolveDependencies("Wheel");
        expect(dependencies).toStrictEqual([new Tire(), new Rotor(new Caliper()), new Rim()]);
        expect(dependencies[0].confirmInstantiated()).toBeTruthy();
        expect(dependencies[1].confirmInstantiated()).toBeTruthy();
        expect(dependencies[1].caliper.confirmInstantiated()).toBeTruthy();
        expect(dependencies[2].confirmInstantiated()).toBeTruthy();
    });

    test('injectService() with no dependencies returns instance', ()=> {
        let instance = iocContainer.injectService("Tire");
        expect(instance.confirmInstantiated()).toBeTruthy();
    });

    test('injectService() with one dependency returns instance with dependency instance', ()=> {
        let instance = iocContainer.injectService("Rotor");
        expect(instance.confirmInstantiated()).toBeTruthy();
        expect(instance.caliper.confirmInstantiated()).toBeTruthy();
    });

    test('injectService() with complex dependencies returns instance with dependency instances', ()=> {
        let instance = iocContainer.injectService("Wheel");
        expect(instance.confirmInstantiated()).toBeTruthy();
        expect(instance).toStrictEqual(new Wheel(new Tire(), new Rotor(new Caliper()), new Rim()));
        expect(instance.tire.confirmInstantiated()).toBeTruthy();
        expect(instance.tire).toStrictEqual(new Tire());
        expect(instance.rotor.confirmInstantiated()).toBeTruthy();
        expect(instance.rotor).toStrictEqual(new Rotor(new Caliper()));
        expect(instance.rotor.caliper.confirmInstantiated()).toBeTruthy();
        expect(instance.rotor.caliper).toStrictEqual(new Caliper());
        expect(instance.rim.confirmInstantiated()).toBeTruthy();
        expect(instance.rim).toStrictEqual(new Rim());
    });
});
