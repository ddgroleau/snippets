class RenderTemplate {
    constructor() {

    }

    execute(array, templateSource, renderDestination) {
        let templateHtml = document.getElementById(templateSource).innerHTML;
        let htmlString = '';
    
        for (let i = 0; i < array.length; i++) {
            htmlString += this._insertTemplateVariables(array[i], templateHtml)
        }
    
        if (renderDestination) document.getElementById(renderDestination).innerHTML = htmlString;
    }

    _insertTemplateVariables(object, templateHtml) {
        for (let [key, value] of Object.entries(object)) {
            let replace = new RegExp(`{{${key}}}`, "g");
            templateHtml = templateHtml.replace(replace, value);
        }
        return templateHtml;
    }
}

export default RenderTemplate;