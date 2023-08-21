const FILE_EXTENSION = 'html';
const COMPONENTS_FOLDER = './components';
const COMPONENTS_PREFIX = 'app';
const NODE_TYPES = {
    STANDARD: 1,
    TEXT: 3,
    COMMENT: 8,
};

const cache = {};
const styles_caches = {};

const getHTML = async (name) => {
    let path = `${COMPONENTS_FOLDER}/${name}.${FILE_EXTENSION}`;
    if (cache[path]) return cache[path];
    let html = await (await fetch(path)).text();
    cache[path] = html;
    return html;
}

const evalInContext = function (s) {
    // if(s==='this.getStepData(step).repeat') debugger;
    let r = s;
    try {
        r = eval(s);
    } catch (e) {}
    return r;
}

const allNodes = function (node, cb, excludeSelf = false) {

    if (!excludeSelf) {
        let r = cb(node);
        if (r === false) return;
    }

    if (node._if || (node.getAttribute && node.getAttribute('if'))) {

        let v = false;
        const _if = node._if ? node._if.getAttribute('if') : node.getAttribute('if');

        let evalText = _if;
        if(node.hasOwnProperty('dataIndex')) evalText = evalText.replace('$index', node.dataIndex);
        v = evalInContext.call(node.originalContext || this.context, evalText);

        // console.log(_if, v);

        if(v && node._if){
            node.replaceWith(node._if);
            node = node._if;
        }

        if(!v) return;

    }

    let children = Array.from(node.childNodes);

    children.forEach(child => {
        allNodes.bind(this)(child, cb);
    });
}

const parseAttributes = function ($el, context) {

    if (!$el) return;

    let attributes = {};

    if ($el.originalAttributes) attributes = {
        ...$el.originalAttributes
    };
    else {
        Array.from($el.attributes).map(attr => attributes[attr.name] = attr.value);
        $el.originalAttributes = attributes;
    }

    let data = {};

    for (let name in attributes) {

        if($el.hasOwnProperty('dataIndex')) attributes[name] = attributes[name].replace('$index', $el.dataIndex);

        data[name] = evalInContext.call($el.originalContext || context, attributes[name]);
    }

    if ($el.childNodes && $el.childNodes.length) data.children = $el.childNodes;

    return data;
}

const stringParser = function (text, context, replacer = {}) {
    Object.keys(replacer).forEach(t=>{ text = text.replace(t, replacer[t]) });
    return text.replace(/{{(.*?)}}/g, (a, b) => {
        return evalInContext.call(context, b);
    })
}

export class Component {

    constructor(settings = {}) {

        this.settings = settings;

        if (settings.debug) debugger;
        if (settings.parent) this.parent = settings.parent;

        this.name = settings.name;
        this.type = settings.type;
        this.tag = settings.tag;
        this.html = settings.html;
        this.path = settings.path;
        this.context = settings.context || {};
        this.container = settings.container;
        this.dynamic = settings.dynamic;
        this.root = settings.root;

        if (!this.root) this.root = this;

        if (this.root === this) this.components = {};

        if (this.name) window._modular.components[this.name] = this;

        if (this.tag) this.tag._context = this.context;

        window._modular.all.push(this);

        this.init();
    }

    async init() {

        if (this.settings.debugInit) debugger;

        if (this.path) this.html = await getHTML(this.path);

        const parser = new DOMParser;
        this.$element = parser.parseFromString(this.html, 'text/html');

        this.$script = this.$element.getElementsByTagName('script')[0];
        this.$style = this.$element.getElementsByTagName('style')[0];
        this.$body = this.$element.getElementsByTagName('body')[0];

        if (this.$style) {
            this.originalStyle = this.$style.innerHTML;
            if (!styles_caches[this.$style.innerHTML]) {
                document.head.appendChild(this.$style);
            }
            styles_caches[this.$style.innerHTML] = true;
        }

        if (this.$body.innerHTML) {

            let html = this.$body.innerHTML;

            this.container.innerHTML = html;

            this.container.childNodes[0]._component = this;
            this.container = this.container.childNodes[0];

            if (this.tag) {

                this.container.propsContext = this.tag._context;

                try{
                    this.tag.insertAdjacentElement('afterend', this.container);
                }catch(e){
                    debugger;
                }

                try{
                    this.tag.parentElement.removeChild(this.tag);
                }catch(e){}

            }

        }

        this.prepare();

        if (this.$script) {
            let fn = new Function(this.$script.innerText);
            fn.call(this.context);
        }

        this.render();

    }

    prepare() {

        this.context.render = this.render.bind(this);
        this.context._component = this;
        this.context._ = this.root;
        this.context._container = this.container;

        this.container._context = this.context;

        allNodes.bind(this)(this.container, (node) => {

            if (node._component && node != this.container) {
                return false;
            }

            if (node.nodeType == NODE_TYPES.STANDARD) {

                if (node.getAttribute('ref')) this.context[node.getAttribute('ref')] = node;

            }

        })

    }

    async bindNode($el) {

        if (!$el || !$el.hasAttribute) return;

        if ($el.hasAttribute('debug')) debugger;

        const tagName = $el.tagName.toLowerCase();

        if (tagName.startsWith(`${COMPONENTS_PREFIX}-`) || _modular.setup?.components[tagName]) {

            let type, path;

            if (tagName.startsWith(`${COMPONENTS_PREFIX}-`)) {

                type = tagName.split(`${COMPONENTS_PREFIX}-`)[1];
                path = tagName.split(`${COMPONENTS_PREFIX}-`)[1];

            } else {

                type = tagName;
                path = _modular.setup?.components[tagName];

            }

            let props = parseAttributes($el, this.context);
            let name = $el.attributes.getNamedItem('_name')?.value;

            let $element = document.createElement('div');

            new Component({
                parent: this,
                root: this.root,
                type,
                tag: $el,
                html: await getHTML(path),
                name,
                container: $element,
                context: {
                    props,
                    _parent: this,
                    _root: this.root,
                }
            })

        }

        // attributes

        if (!$el._attributes) $el._attributes = {};

        let attributes = Array.from($el.attributes);

        attributes.forEach((attr) => {

            let attrName = attr.name;
            let attrValue = attr.value;

            if (attrName.startsWith('on')) { // events

                $el[attrName] = function (ev) {
                    attrValue = attrValue.replace('$event', 'arguments[0]');
                    attrValue = attrValue.replace('$data', 'arguments[1]');
                    attrValue = attrValue.replace('$index', 'arguments[2]');
                    if ($el.dataName) attrValue = attrValue.replace($el.dataName, 'arguments[1]');
                    let fn = new Function(attrValue);
                    fn.apply($el.originalContext || this.context, [ev, $el.data, $el.dataIndex]);
                }.bind(this)

            } else if (attrName == 'ref') {
                this.context[attrValue] = $el;
            } else {

                if ($el._attributes[attrName]) attrValue = $el._attributes[attrName];
                else $el._attributes[attrName] = attrValue;

                try {

                    if ($el.hasOwnProperty('dataIndex')) attrValue = attrValue.replace('$index', $el.dataIndex);

                    let parsedValue = stringParser(attrValue, $el.originalContext || this.context);

                    $el[attrName] = parsedValue;
                    $el.setAttribute(attrName, parsedValue);

                } catch (e) {
                    // console.warn(e);
                }

            }

        })

    }

    render( $el = this.container ) {

        if (this.settings.debugRender) debugger;

        if (this.$style && this.originalStyle) {
            this.$style.innerHTML = stringParser(this.originalStyle, this.context);
        }

        allNodes.bind(this)($el, (node) => {

            window._debug.nodes.push(node);

            if (!node.originalTextContent) node.originalTextContent = node.textContent;
            if (!node.originalContext) node.originalContext = this.context;

            if (node._component && node != $el) {

                let component = node._component;

                let props = parseAttributes(component.tag, this.context);

                component.context.props = props;
                component.render();

                return false;
            }

            if (node.nodeType == NODE_TYPES.TEXT) {

                let text = node.originalTextContent;

                text = stringParser(text, node.originalContext || this.context);

                if (text.indexOf("[object NodeList]") !== -1) {
                    const nodesList = evalInContext.call(this.context, node.originalTextContent);
                    const nodes = [...Array.from(nodesList)];
                    node.replaceWith(...nodes);
                    nodes.forEach((n) => {
                        this.bindNode(n);
                    })
                    return;
                }

                node.textContent = text;

                return;
            }

            if (node.nodeType == NODE_TYPES.STANDARD || node.doProcess) {

                if (node._if || (node.getAttribute && node.getAttribute('if'))) {

                    if (node._if) {
                        node.replaceWith(node._if);
                        node = node._if;
                    }

                    let v = false;
                    const _if = node.getAttribute('if');

                    if (node.getAttribute('if')) {
                        let evalText = _if;
                        if(node.hasOwnProperty('dataIndex')) evalText = evalText.replace('$index', node.dataIndex);
                        v = evalInContext.call(node.originalContext || this.context, evalText);
                    }

                    if (!v) {
                        const commentNode = document.createComment('if');
                        commentNode._if = node;
                        commentNode.originalContext = node.originalContext;
                        commentNode.doProcess = true;
                        node.replaceWith(commentNode);
                        return;
                    }

                }

                if (node._for || node.getAttribute('for')) {

                    if (node._for) {
                        node._context = node._context;
                        node.replaceWith(node._for);
                        node = node._for;
                    }

                    // node.hidden = false;

                    if (node._children) node._children.forEach((c) => c.parentElement.removeChild(c))

                    node._children = [];

                    let d = node.getAttribute('for').split(' in ');

                    let _for = d[0];
                    let _in = evalInContext.call(node.originalContext || this.context, d[1]);

                    _in.forEach((item, i) => {

                        let _prototype = node.cloneNode(true);

                        _prototype.removeAttribute('for');

                        node.insertAdjacentElement('beforebegin', _prototype);

                        node._children.push(_prototype);

                        _prototype.parent = this;
                        _prototype.context = node.originalContext || this.context;
                        _prototype.originalContext = node.originalContext || this.context;
                        _prototype.data = item;
                        _prototype.dataName = _for;
                        _prototype.dataIndex = i;

                        allNodes.bind(this)(_prototype, (child) => {

                            child.dataIndex = i;
                            child.originalContext = node.originalContext || this.context;

                            window[_for] = item; // need to watch out

                            const replacer = {
                                $index: i,
                            };

                            if( child.attributes && child.attributes.getNamedItem('for') ) this.render(child);

                            if (child.nodeType == NODE_TYPES.TEXT) {

                                let text = stringParser(child.textContent, node.originalContext || this.context, replacer);

                                child.textContent = text;

                            } else {
                                this.bindNode(child);
                            }

                        }, true)

                        this.bindNode(_prototype);

                    })

                    // node.hidden = true;

                    const commentNode = document.createComment('for');
                    commentNode._for = node;
                    commentNode.originalContext = node.originalContext;
                    commentNode._context = this.context;
                    commentNode.doProcess = true;
                    node.replaceWith(commentNode);

                    return false;

                }

            }

            if (node.nodeType == NODE_TYPES.COMMENT) return;

            this.bindNode.call(this, node);

        })

        if (this.context.onrender) this.context.onrender();

    }
}

export default class Modular {

    constructor(settings = {}) {

        const DEFAULTS = {
            app: 'app', // path to entry point app file
            context: {}, // init context to pass to app
            container: document.body,
        };

        this.settings = Object.assign(DEFAULTS, settings);

        this.init();

    }

    async init() {

        try {
            _modular.setup = JSON.parse(await (await fetch(`${COMPONENTS_FOLDER}/setup.json`)).text());
        } catch (e) {
            _modular.setup = {};
        }

        this.app = new Component({
            name: 'app',
            html: await getHTML(this.settings.app),
            context: this.settings.context,
            container: this.settings.container,
        });

    }

}

window.allNodes = allNodes;

window._modular = {
    Modular,
    Component,
    components: {},
    all: [],
    setup: {},
    utils: {
        stringParser,
        parseAttributes,
        allNodes,
        evalInContext,
        getHTML
    },
    preload: (arr=[])=>{
        arr.forEach((str)=>{
            getHTML(str);
        })
    }
};

_modular.createComponent = (settings = {}, name) => {
    settings.dynamic = true;
    return new Component(settings);
}

window._debug = {
    nodes: []
};