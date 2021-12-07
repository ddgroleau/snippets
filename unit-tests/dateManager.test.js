/**
 * @jest-environment jsdom
 */
 import DateManager from '../src/dateManager.js';
 
 describe('DateManager tests', () => {
    let dateManager;
    let dateElement;
    let isError;
    let invalidElement;

     beforeAll(()=> {
        dateManager = new DateManager();
     });

     beforeEach(() => {
        document.body.innerHTML = '<input type="text" id="dob" />';
        dateElement = document.getElementById('dob');
        isError = false;
        invalidElement = document.getElementById('non-existent');
     });
 
     test('resetDateValue() with valid date element changes element value', ()=> {
        dateManager.resetDateValue(dateElement);
         expect(dateElement.value).toBe('MM/DD/YYYY');
     });

     test('resetDateValue() with invalid date element throws error', ()=> {
        expect(()=>dateManager.resetDateValue(invalidElement)).toThrow();
     });

     test('validateDatePattern() with valid date in MM/DD/YYYY format', () => {
        dateElement.value = '12/02/1993';
        let actual = dateManager.validateDatePattern(dateElement,()=> isError = true);
        expect(actual).toBe('1993-12-02');
        expect(isError).toBeFalsy();
     });

     test('validateDatePattern() with valid date in YYYY-MM-DD format', () => {
        dateElement.value = '1993-12-02';
        let actual = dateManager.validateDatePattern(dateElement,()=> isError = true);
        expect(actual).toBe(dateElement.value);
        expect(isError).toBeFalsy();
     });

    test('validateDatePattern() with invalid date sets element value to MM/DD/YYYY', () => {
        dateElement.value = '12/MM/YYYY';
        dateManager.validateDatePattern(dateElement,()=> isError = true);
        expect(dateElement.value).toBe('MM/DD/YYYY');
        expect(isError).toBeTruthy();
    });

    test('validateDatePattern() with out of range date sets element value to MM/DD/YYYY', () => {
        dateElement.value = '12/34/1898';
        dateManager.validateDatePattern(dateElement,()=> isError = true);
        expect(dateElement.value).toBe('MM/DD/YYYY');
        expect(isError).toBeTruthy();
    });

    test('validateDatePattern() with invalid date element throws error', ()=> {
        expect(()=>dateManager.validateDatePattern(invalidElement,()=> isError = true)).toThrow();
    });

    test('selectDateSegment() with month completed returns month pattern', ()=> {
        dateElement.value = '12/DD/YYYY';
        expect(dateManager.selectDateSegment(dateElement)).toStrictEqual(new RegExp('[0-9]{2}\/DD\/YYYY'));
    });

    test('selectDateSegment() with month and day completed returns month-day pattern', ()=> {
        dateElement.value = '12/02/YYYY';
        expect(dateManager.selectDateSegment(dateElement)).toStrictEqual(new RegExp('[0-9]{2}\/[0-9]{2}\/YYYY'));
    });

    test('selectDateSegment() with no fields completed returns undefined', ()=> {
        dateElement.value = 'MM/DD/YYYY';
        expect(dateManager.selectDateSegment(dateElement)).toBeUndefined();
    });

    test('selectDateSegment() with all fields completed returns undefined', ()=> {
        dateElement.value = '12/02/1967';
        expect(dateManager.selectDateSegment(dateElement)).toBeUndefined();
    });

    test('selectDateSegment() with invalid date element throws error', ()=> {
        expect(()=>dateManager.selectDateSegment(invalidElement)).toThrow();
    });

    test('createDateEventListeners() adds click event that will set input value to MM/DD/YYYY if it is empty', ()=> {
        dateManager.createDateEventListeners(dateElement);
        dateElement.click();
        expect(dateElement.value).toBe('MM/DD/YYYY'); 
    });

    test('createDateEventListeners() adds blur event that will set input value to an empty string if it is MM/DD/YYYY', ()=> {
        dateManager.createDateEventListeners(dateElement);
        dateElement.value = 'MM/DD/YYYY';
        dateElement.focus();
        dateElement.blur();
        expect(dateElement.value).toBe(''); 
    });

    test('createDateEventListeners() with invalid date element throws error', ()=> {
        expect(()=>dateManager.createDateEventListeners(invalidElement)).toThrow();
    });
 
 });