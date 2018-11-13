class BaseElement extends HTMLElement {
    constructor(options = {}) {
        super();
        this._options = Object.assign(
            {
                autoRender: true,
                deferRender: true,
            },
            options,
        );
    }
}

export default BaseElement;
