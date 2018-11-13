import BaseElement from './BaseElement';

function html(literals, ...vars) {
    let raw = literals.raw,
        result = '',
        i = 1,
        len = arguments.length,
        str,
        variable;

    while (i < len) {
        str = raw[i - 1];
        variable = vars[i - 1];
        result += str + variable;
        i++;
    }
    result += raw[raw.length - 1];
    return result;
}

function style(literals, ...vars) {
    return html(literals, ...vars);
}

function render(template, data) {
    if (!template) return;
    if (typeof data === 'string') {
        // Handle primitive type:
        return template(data);
    } else if (typeof data === 'object' && !Array.isArray(data)) {
        // Handle object:
        return template(data);
    } else if (Array.isArray(data)) {
        // Handle array:
        return data.map(item => template(item)).join('');
    }
}

class TemplateElement extends BaseElement {
    constructor(template, options = {}) {
        super(Object.assign({ deferRender: false }, options));
        this._template = template;
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    style() {
        return style``;
    }

    template() {
        return html``;
    }

    render(context = this) {
        this._shadowRoot.innerHTML = `
            <style>${this.style()}</style>
            ${render(this._template || this.template(), context)}
        `;

        super.render();
    }

    data() {
        return {
            name: 'John',
            age: () => {},
            address: {
                value: 'Some street',
                attribute: true,
                notify: true,
                watch: () => {},
            },
        };
    }
}

export { TemplateElement, html, style };
