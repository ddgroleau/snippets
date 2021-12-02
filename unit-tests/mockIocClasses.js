class TestClass {
    confirmInstantiated() {
        return true;
    }
}

class Car extends TestClass {
    constructor(wheel) {
        super();
        this._wheel = wheel;
    }
}

class Wheel extends TestClass {
    constructor(tire, rotor, rim) {
        super();
        this._tire = tire;
        this._rotor = rotor;
        this._rim = rim;
    }

    get tire() {
        return this._tire;
    }

    get rotor() {
        return this._rotor;
    }

    get rim() {
        return this._rim;
    }
}

class Tire extends TestClass {
    constructor() {
        super();
    }

}

class Rotor extends TestClass {
    constructor(caliper) {
        super();
        this._caliper = caliper;
    }
    get caliper() {
        return this._caliper;
    }
 }

class Caliper extends TestClass {
    constructor() {
        super();
    }
}

class Rim extends TestClass {
    constructor () {
        super();
    }
}


export { Car, Wheel, Tire, Rotor, Rim, Caliper };