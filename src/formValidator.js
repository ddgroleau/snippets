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

export default FormValidator;