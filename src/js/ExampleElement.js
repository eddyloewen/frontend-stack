import { TemplateElement } from './TemplateElement';
import style from './ExampleElement.css';

class ExampleElement extends TemplateElement {
    constructor(options = {}) {
        super(Object.assign({ style: style }, options));
        console.log('foo');
    }
}

export { ExampleElement };
