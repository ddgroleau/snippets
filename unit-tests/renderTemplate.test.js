/**
 * @jest-environment jsdom
 */
import RenderTemplate from '../src/renderTemplate';
import { testTextResult, testTemplateHtml, expectedHeaderHtml, expectedListHtml } from './mockProviderResult';
 
 describe('RenderTemplate tests', () => {
     let renderTemplate;
    
     beforeAll(() => {
         renderTemplate = new RenderTemplate();
     });

     beforeEach(()=> {
        document.body.innerHTML = testTemplateHtml;
     });

     test('execute() replaces variables and adds them to the destination.', () => {
        let headerHtml = renderTemplate.execute([{searchTerm: 'you', distanceLimit: 50}], 
                                "providers-header-template", 
                                "providers-header");
        let listHtml = renderTemplate.execute([testTextResult], 
                                "providers-list-item-template", 
                                "providers-list");

        let actualHeader = document.getElementById('providers-header').innerHTML;
        let actualList = document.getElementById('providers-list').innerHTML;


        expect(actualHeader).toBe(expectedHeaderHtml);
        expect(actualList).toBe(expectedListHtml);
    });

});

