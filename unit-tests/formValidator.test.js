/**
 * @jest-environment jsdom
 */
 import FormValidator from '../src/formValidator';

 describe('FormValidator tests', ()=> {
     let formValidator;
     let validForm;
     
     beforeAll(()=> {
         validForm = {
             firstName: 'testfirst',
             lastName: 'testlast',
             dob: '2021-01-01',
             zipcode: '09876',
             benefitSelect: 'Acupuncture'
         };
 
         formValidator = new FormValidator();
         
         document.body.innerHTML = 
         '<form id="eligibilityForm">' +
             '<input id="firstName" type="text" placeholder="First Name" maxlength="50" required>' +
             '<input id="lastName" type="text" placeholder="Last Name" maxlength="50" required>' +
             '<input id="dob" type="date" placeholder="Date of Birth" maxlength="6" required>' +
             '<input id="zipcode" type="text" placeholder="Zip Code" maxlength="5" required>' +
             '<select id="benefitSelect">' +
                 '<option value="">Choose Benefit</option>' +
             '</select>' +
             '<button id="submit" type="button">Submit</button>' +
         '</form>';
     });
 
    test('invalidValue() with valid value returns false',()=> {
         let value = 'test';
         let result = formValidator.invalidValue(value);
         expect(result).toBeFalsy();
    });
 
    test('invalidValue() with invalid value returns false',()=> {
         let emptyString = '';
         let nullValue = null;
 
         let result1 = formValidator.invalidValue(emptyString);
         let result2 = formValidator.invalidValue(nullValue);
 
         expect(result1).toBeTruthy();
         expect(result2).toBeTruthy();
     });
 
     test('invalidValue() with malicious value returns false',()=> {
         let sqlInjectionAttack = '; drop table members--';
         let xssAttack = '<script src = "https://evil-site/maliciousScript.js"></script>';
 
         let result1 = formValidator.invalidValue(sqlInjectionAttack);
         let result2 = formValidator.invalidValue(xssAttack);
         
         expect(result1).toBeTruthy();
         expect(result2).toBeTruthy();
     });
 
     test('invalidField() with valid value sets style to empty string and returns false', ()=> {
         let value = 'test';
 
         let result = formValidator.invalidField(value,'firstName');
         let style = document.getElementById('firstName').getAttribute('style');
 
         expect(result).toBeFalsy();
         expect(style).toBe('');
     });
 
     test('invalidField() with invalid value sets error style and returns true', ()=> {
         let value = '';
 
         let result = formValidator.invalidField(value,'firstName');
         let style = document.getElementById('firstName').getAttribute('style');
 
         expect(result).toBeTruthy();
         expect(style).toBe('border-color: red !important;border:2px;border-style:solid');
     });
 
     test('invalidForm() with valid form returns false', ()=> {
         let result = formValidator.invalidForm(validForm);
 
         expect(result).toBeFalsy();
     });
 
     test('invalidForm() with valid form returns false', ()=> {
         let badForm = validForm;
         badForm.dob = '';
 
         let result = formValidator.invalidForm(badForm);
 
         expect(result).toBeTruthy();
     });
 
 });
 