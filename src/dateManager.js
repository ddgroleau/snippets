// use this class with custom date input element, i.e. <input type="text" id="dateElement" />

class DateManager {
    constructor () {

    }

    resetDateValue(dateElement) {
        if(!dateElement) throw new Error('Invalid HTML element.');
        dateElement.value ='MM/DD/YYYY';
        dateElement.setSelectionRange(0,2);
     };
    
     selectDateSegment(dateElement) {
        if(!dateElement) throw new Error('Invalid HTML element.');
        
        let monthPattern = new RegExp('[0-9]{2}\/DD\/YYYY'); 
        let monthDayPattern = new RegExp('[0-9]{2}\/[0-9]{2}\/YYYY');
        
        if(monthPattern.test(dateElement.value)) {
            document.getElementById("dob").setSelectionRange(3,5);
            return monthPattern;
        } else if (monthDayPattern.test(dateElement.value)) {
            document.getElementById("dob").setSelectionRange(6,10);
            return monthDayPattern;
        }
        return;
     };
    
     validateDatePattern(dateElement, errorCallback) {
        if(!dateElement) throw new Error('Invalid HTML element.');

        let dateValue = dateElement.value.substring(0,10);
        let slashesPattern = new RegExp('[0-1][0-9]\/[0-3][0-9]\/[1-2](0|9)[0-9]{2}'); // Matches MM/DD/YYYY format
        let dashesPattern = new RegExp('[1-2](0|9)[0-9]{2}-[0-1][0-9]-[0-3][0-9]'); // Matches YYYY-MM-DD format
        if (!slashesPattern.test(dateValue) && !dashesPattern.test(dateValue)) {
            dateElement.value = 'MM/DD/YYYY';
            return errorCallback();
        }
        if (slashesPattern.test(dateValue)) return`${dateValue.substring(6,10)}-${dateValue.substring(0,2)}-${dateValue.substring(3,5)}`;
        return dateValue;
    };
    
    createDateEventListeners(dateElement) {
        if(!dateElement) throw new Error('Invalid HTML element.');

        dateElement.addEventListener('click', () => {
            if(dateElement.value.length === 0) this.resetDateValue(dateElement)
            else if (dateElement.value === 'MM/DD/YYYY') this.resetDateValue(dateElement)
            else this.selectDateSegment(dateElement);
        });
       
        dateElement.addEventListener('blur', () => {
           if(dateElement.value === 'MM/DD/YYYY') dateElement.value = '';
       });
       
       dateElement.addEventListener('keyup', () => {
           if(dateElement.value.length === 0 || dateElement.value.length < 6) this.resetDateValue(dateElement);
           this.selectDateSegment(dateElement);
       });
    }
}

export default DateManager;