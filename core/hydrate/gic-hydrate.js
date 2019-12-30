'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};

const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};

let scopeId;
let hostTagName;
let isSvgMode = false;
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if ( propType & 4 /* Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return (propValue === 'false' ? false : propValue === '' || !!propValue);
        }
        if ( propType & 2 /* Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
        if ( propType & 1 /* String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const HYDRATED_CLASS = 'hydrated';
const HYDRATE_ID = 's-id';
const HYDRATE_CHILD_ID = 'c-id';
const rootAppliedStyles = new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    let scopeId =  getScopeId(cmpMeta.$tagName$, mode) ;
    let style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = (styleContainerNode.nodeType === 11 /* DocumentFragment */ ? styleContainerNode : doc);
    if ( !style) {
        scopeId = getScopeId(cmpMeta.$tagName$);
        style = styles.get(scopeId);
    }
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
            }
            if (!appliedStyles.has(scopeId)) {
                {
                    {
                        styleElm = doc.createElement('style');
                        styleElm.setAttribute('data-styles', '');
                        styleElm.innerHTML = style;
                    }
                    {
                        styleElm.setAttribute(HYDRATE_ID, scopeId);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if ( !styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [
                ...styleContainerNode.adoptedStyleSheets,
                style
            ];
        }
    }
    return scopeId;
};
const attachStyles = (elm, cmpMeta, mode) => {
    const scopeId = addStyle( elm.getRootNode(), cmpMeta, mode);
    if ( cmpMeta.$flags$ & 10 /* needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
        if ( cmpMeta.$flags$ & 2 /* scopedCssEncapsulation */) {
            elm.classList.add(scopeId + '-s');
        }
    }
};
const getScopeId = (tagName, mode) => 'sc-' + (( mode) ? tagName + '-' + mode : tagName);
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// const stack: any[] = [];
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let simple = false;
    let lastSimple = false;
    let vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if (simple = typeof nodeName !== 'function' && !isComplexType(child)) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class = typeof classData !== 'object'
                    ? classData
                    : Object.keys(classData)
                        .filter(k => classData[k])
                        .join(' ');
            }
        }
    }
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    return vnode;
};
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null
    };
    {
        vnode.$attrs$ = null;
    }
    return vnode;
};
const Host = {};
const isHost = (node) => {
    return node && node.$tag$ === Host;
};
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue === newValue) {
        return;
    }
    let isProp = isMemberInElement(elm, memberName);
    let ln = memberName.toLowerCase();
    if ( memberName === 'class') {
        const classList = elm.classList;
        const oldClasses = parseClassList(oldValue);
        const newClasses = parseClassList(newValue);
        classList.remove(...oldClasses.filter(c => c && !newClasses.includes(c)));
        classList.add(...newClasses.filter(c => c && !oldClasses.includes(c)));
    }
    else if ( memberName === 'ref') {
        // minifier will clean this up
        if (newValue) {
            newValue(elm);
        }
    }
    else if ( !isProp && memberName[0] === 'o' && memberName[1] === 'n') {
        // Event Handlers
        // so if the member name starts with "on" and the 3rd characters is
        // a capital letter, and it's not already a member on the element,
        // then we're assuming it's an event listener
        if (memberName[2] === '-') {
            // on- prefixed events
            // allows to be explicit about the dom event to listen without any magic
            // under the hood:
            // <my-cmp on-click> // listens for "click"
            // <my-cmp on-Click> // listens for "Click"
            // <my-cmp on-ionChange> // listens for "ionChange"
            // <my-cmp on-EVENTS> // listens for "EVENTS"
            memberName = memberName.slice(3);
        }
        else if (isMemberInElement(win, ln)) {
            // standard event
            // the JSX attribute could have been "onMouseOver" and the
            // member name "onmouseover" is on the window's prototype
            // so let's add the listener "mouseover", which is all lowercased
            memberName = ln.slice(2);
        }
        else {
            // custom event
            // the JSX attribute could have been "onMyCustomEvent"
            // so let's trim off the "on" prefix and lowercase the first character
            // and add the listener "myCustomEvent"
            // except for the first character, we keep the event name case
            memberName = ln[2] + memberName.slice(3);
        }
        if (oldValue) {
            plt.rel(elm, memberName, oldValue, false);
        }
        if (newValue) {
            plt.ael(elm, memberName, newValue, false);
        }
    }
    else {
        // Set property if it exists and it's not a SVG
        const isComplex = isComplexType(newValue);
        if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
            try {
                if (!elm.tagName.includes('-')) {
                    let n = newValue == null ? '' : newValue;
                    // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                    // tslint:disable-next-line: triple-equals
                    if (oldValue == null || elm[memberName] != n) {
                        elm[memberName] = n;
                    }
                }
                else {
                    elm[memberName] = newValue;
                }
            }
            catch (e) { }
        }
        if (newValue == null || newValue === false) {
            {
                elm.removeAttribute(memberName);
            }
        }
        else if ((!isProp || (flags & 4 /* isHost */) || isSvg) && !isComplex) {
            newValue = newValue === true ? '' : newValue;
            {
                elm.setAttribute(memberName, newValue);
            }
        }
    }
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => (!value) ? [] : value.split(parseClassListRegex);
const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = (newVnode.$elm$.nodeType === 11 /* DocumentFragment */ && newVnode.$elm$.host) ? newVnode.$elm$.host : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    let newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    if ( newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else {
        // create element
        elm = newVNode.$elm$ = ( doc.createElement( newVNode.$tag$));
        // add css classes, attrs, props, listeners, etc.
        {
            updateElement(null, newVNode, isSvgMode);
        }
        if ( isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.appendChild(childNode);
                }
            }
        }
    }
    return elm;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = ( parentElm);
    let childNode;
    if ( containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode,  before);
            }
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnode = vnodes[startIdx]) {
            elm = vnode.$elm$;
            callNodeRefs(vnode);
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // Vnode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            {
                // new element
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                {
                    oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$), newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if ( newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
};
const isSameVnode = (vnode1, vnode2) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (vnode1.$tag$ === vnode2.$tag$) {
        return true;
    }
    return false;
};
const patch = (oldVNode, newVNode) => {
    const elm = newVNode.$elm$ = oldVNode.$elm$;
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    if ( newVNode.$text$ === null) {
        // element node
        {
            {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, isSvgMode);
            }
        }
        if ( oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if ( oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if ( oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
    }
    else if ( oldVNode.$text$ !== newVNode.$text$) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.data = newVNode.$text$;
    }
};
const callNodeRefs = (vNode) => {
    {
        vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
        vNode.$children$ && vNode.$children$.forEach(callNodeRefs);
    }
};
const renderVdom = (hostElm, hostRef, cmpMeta, renderFnResults) => {
    hostTagName = hostElm.tagName;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    const rootVnode = isHost(renderFnResults)
        ? renderFnResults
        : h(null, null, renderFnResults);
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = ( hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
};
const attachToAncestor = (hostRef, ancestorComponent) => {
    if ( ancestorComponent && !hostRef.$onRenderResolve$) {
        ancestorComponent['s-p'].push(new Promise(r => hostRef.$onRenderResolve$ = r));
    }
};
const scheduleUpdate = (elm, hostRef, cmpMeta, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* isQueuedForUpdate */;
    }
    if ( hostRef.$flags$ & 4 /* isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* needsRerender */;
        return;
    }
    const ancestorComponent = hostRef.$ancestorComponent$;
    const instance =  hostRef.$lazyInstance$ ;
    const update = () => updateComponent(elm, hostRef, cmpMeta, instance, isInitialLoad);
    const rc = elm['s-rc'];
    attachToAncestor(hostRef, ancestorComponent);
    let promise;
    if (isInitialLoad) {
        {
            hostRef.$flags$ |= 256 /* isListenReady */;
            if (hostRef.$queuedListeners$) {
                hostRef.$queuedListeners$.forEach(([methodName, event]) => safeCall(instance, methodName, event));
                hostRef.$queuedListeners$ = null;
            }
        }
        {
            promise = safeCall(instance, 'componentWillLoad');
        }
    }
    if ( rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.forEach(cb => cb());
        elm['s-rc'] = undefined;
    }
    // there is no ancestorc omponent or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    return then(promise,  () => writeTask(update)
        );
};
const updateComponent = (elm, hostRef, cmpMeta, instance, isInitialLoad) => {
    // updateComponent
    if ( isInitialLoad) {
        // DOM WRITE!
        attachStyles(elm, cmpMeta, hostRef.$modeName$);
    }
    {
        {
            try {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                renderVdom(elm, hostRef, cmpMeta,  (instance.render && instance.render()));
            }
            catch (e) {
                consoleError(e);
            }
        }
    }
    {
        hostRef.$flags$ &= ~16 /* isQueuedForUpdate */;
    }
    {
        try {
            // manually connected child components during server-side hydrate
            serverSideConnected(elm);
            if (isInitialLoad && (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */)) {
                // using only during server-side hydrate
                elm['s-sd'] = true;
            }
        }
        catch (e) {
            consoleError(e);
        }
    }
    {
        hostRef.$flags$ |= 2 /* hasRendered */;
    }
    {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(elm, hostRef, cmpMeta);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
};
const postUpdateComponent = (elm, hostRef, cmpMeta) => {
    const instance =  hostRef.$lazyInstance$ ;
    const ancestorComponent = hostRef.$ancestorComponent$;
    if (!(hostRef.$flags$ & 64 /* hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* hasLoadedComponent */;
        {
            // DOM WRITE!
            // add the css class that this element has officially hydrated
            elm.classList.add(HYDRATED_CLASS);
        }
        {
            safeCall(instance, 'componentDidLoad');
        }
        {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad();
            }
        }
    }
    {
        hostRef.$onInstanceResolve$(elm);
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* needsRerender */) {
            nextTick(() => scheduleUpdate(elm, hostRef, cmpMeta, false));
        }
        hostRef.$flags$ &= ~(4 /* isWaitingForChildren */ | 512 /* needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const appDidLoad = () => {
    // on appload
    // we have finish the first big initial render
    {
        doc.documentElement.classList.add(HYDRATED_CLASS);
    }
};
const safeCall = (instance, method, arg) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e);
        }
    }
    return undefined;
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const serverSideConnected = (elm) => {
    const children = elm.children;
    if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
            const childElm = children[i];
            if (typeof childElm.connectedCallback === 'function') {
                childElm.connectedCallback();
            }
            serverSideConnected(childElm);
        }
    }
};
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const elm =  hostRef.$hostElement$ ;
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance =  hostRef.$lazyInstance$ ;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    if (newVal !== oldVal && ( !(flags & 8 /* isConstructingInstance */) || oldVal === undefined)) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if ( instance) {
            // get an array of method names of watch functions to call
            if ( cmpMeta.$watchers$ && flags & 128 /* isWatchReady */) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.forEach(watchMethodName => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e);
                        }
                    });
                }
            }
            if ( (flags & (2 /* hasRendered */ | 16 /* isQueuedForUpdate */)) === 2 /* hasRendered */) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(elm, hostRef, cmpMeta, false);
            }
        }
    }
};
const proxyComponent = (Cstr, cmpMeta, flags) => {
    if ( cmpMeta.$members$) {
        if ( Cstr.watchers) {
            cmpMeta.$watchers$ = Cstr.watchers;
        }
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.forEach(([memberName, [memberFlags]]) => {
            if ( ((memberFlags & 31 /* Prop */) ||
                (( flags & 2 /* proxyState */) &&
                    (memberFlags & 32 /* State */)))) {
                // proxyComponent - prop
                Object.defineProperty(prototype, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
            else if ( (flags & 1 /* isElementConstructor */) && (memberFlags & 64 /* Method */)) {
                // proxyComponent - method
                Object.defineProperty(prototype, memberName, {
                    value(...args) {
                        const ref = getHostRef(this);
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
                    }
                });
            }
        });
        if ( ( flags & 1 /* isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    this[propName] = newValue === null && typeof this[propName] === 'boolean'
                        ? false
                        : newValue;
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                return attrName;
            });
        }
    }
    return Cstr;
};
const addEventListeners = (elm, hostRef, listeners) => {
    hostRef.$queuedListeners$ = hostRef.$queuedListeners$ || [];
    const removeFns = listeners.map(([flags, name, method]) => {
        const target = ( elm);
        const handler = hostListenerProxy(hostRef, method);
        const opts = hostListenerOpts(flags);
        plt.ael(target, name, handler, opts);
        return () => plt.rel(target, name, handler, opts);
    });
    return () => removeFns.forEach(fn => fn());
};
const hostListenerProxy = (hostRef, methodName) => {
    return (ev) => {
        {
            if (hostRef.$flags$ & 256 /* isListenReady */) {
                // instance is ready, let's call it's member method for this event
                hostRef.$lazyInstance$[methodName](ev);
            }
            else {
                hostRef.$queuedListeners$.push([methodName, ev]);
            }
        }
    };
};
const hostListenerOpts = (flags) =>  (flags & 2 /* Capture */) !== 0;
const modeResolutionChain = [];
const computeMode = (elm) => modeResolutionChain.map(h => h(elm)).find(m => !!m);
// Public
const setMode = (handler) => modeResolutionChain.push(handler);
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ( (hostRef.$flags$ & 32 /* hasInitializedComponent */) === 0) {
        // we haven't initialized this element yet
        hostRef.$flags$ |= 32 /* hasInitializedComponent */;
        if ( hostRef.$modeName$ == null) {
            // initializeComponent
            // looks like mode wasn't set as a property directly yet
            // first check if there's an attribute
            // next check the app's global
            hostRef.$modeName$ = typeof cmpMeta.$lazyBundleIds$ !== 'string' ? computeMode(elm) : '';
        }
        if ( hostRef.$modeName$) {
            elm.setAttribute('s-mode', hostRef.$modeName$);
        }
        {
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                Cstr = await Cstr;
            }
            if ( !Cstr.isProxied) {
                // we'eve never proxied this Constructor before
                // let's add the getters/setters to its prototype before
                // the first time we create an instance of the implementation
                {
                    cmpMeta.$watchers$ = Cstr.watchers;
                }
                proxyComponent(Cstr, cmpMeta, 2 /* proxyState */);
                Cstr.isProxied = true;
            }
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            {
                hostRef.$flags$ |= 8 /* isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e);
            }
            {
                hostRef.$flags$ &= ~8 /* isConstructingInstance */;
            }
            {
                hostRef.$flags$ |= 128 /* isWatchReady */;
            }
        }
        const scopeId =  getScopeId(cmpMeta.$tagName$, hostRef.$modeName$) ;
        if ( !styles.has(scopeId) && Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            if ( typeof style !== 'string') {
                style = style[hostRef.$modeName$];
            }
            registerStyle(scopeId, style);
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(elm, hostRef, cmpMeta, true);
    if ( ancestorComponent && ancestorComponent['s-rc']) {
        // this is the intial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const connectedCallback = (elm, cmpMeta) => {
    if ((plt.$flags$ & 1 /* isTmpDisconnected */) === 0) {
        // connectedCallback
        const hostRef = getHostRef(elm);
        if ( cmpMeta.$listeners$) {
            // initialize our event listeners on the host element
            // we do this now so that we can listening to events that may
            // have fired even before the instance is ready
            hostRef.$rmListeners$ = addEventListeners(elm, hostRef, cmpMeta.$listeners$);
        }
        if (!(hostRef.$flags$ & 1 /* hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* hasConnected */;
            {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = (ancestorComponent.parentNode || ancestorComponent.host))) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if (
                        (ancestorComponent['s-p'])) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
    }
};
const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            return elm.dispatchEvent(new ( win.CustomEvent )(name, {
                bubbles: !!(flags & 4 /* Bubbles */),
                composed: !!(flags & 2 /* Composed */),
                cancelable: !!(flags & 1 /* Cancellable */),
                detail
            }));
        }
    };
};
const getAssetPath = (path) => {
    const assetUrl = new URL(path, plt.$resourcesUrl$);
    return (assetUrl.origin !== win.location.origin)
        ? assetUrl.href
        : assetUrl.pathname;
};
const getConnect = (_ref, tagName) => {
    const componentOnReady = () => {
        let elm = doc.querySelector(tagName);
        if (!elm) {
            elm = doc.createElement(tagName);
            doc.body.appendChild(elm);
        }
        return typeof elm.componentOnReady === 'function' ? elm.componentOnReady() : Promise.resolve(elm);
    };
    const create = (...args) => {
        return componentOnReady()
            .then(el => el.create(...args));
    };
    return {
        create,
        componentOnReady,
    };
};
const getContext = (_elm, context) => {
    if (context in Context) {
        return Context[context];
    }
    else if (context === 'window') {
        return win;
    }
    else if (context === 'document') {
        return doc;
    }
    else if (context === 'isServer' || context === 'isPrerender') {
        return  true ;
    }
    else if (context === 'isClient') {
        return  false ;
    }
    else if (context === 'resourcesUrl' || context === 'publicPath') {
        return getAssetPath('.');
    }
    else if (context === 'queue') {
        return {
            write: writeTask,
            read: readTask,
            tick: {
                then(cb) {
                    return nextTick(cb);
                }
            }
        };
    }
    return undefined;
};
const getElement = (ref) =>  getHostRef(ref).$hostElement$ ;
const insertVdomAnnotations = (doc) => {
    if (doc != null) {
        const docData = {
            hostIds: 0,
            rootLevelIds: 0
        };
        const orgLocationNodes = [];
        parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);
        orgLocationNodes.forEach(orgLocationNode => {
            if (orgLocationNode != null) {
                const nodeRef = orgLocationNode['s-nr'];
                let hostId = nodeRef['s-host-id'];
                let nodeId = nodeRef['s-node-id'];
                let childId = `${hostId}.${nodeId}`;
                if (hostId == null) {
                    hostId = 0;
                    docData.rootLevelIds++;
                    nodeId = docData.rootLevelIds;
                    childId = `${hostId}.${nodeId}`;
                    if (nodeRef.nodeType === 1 /* ElementNode */) {
                        nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
                    }
                    else if (nodeRef.nodeType === 3 /* TextNode */) {
                        if (hostId === 0) {
                            const textContent = nodeRef.nodeValue.trim();
                            if (textContent === '') {
                                // useless whitespace node at the document root
                                orgLocationNode.remove();
                                return;
                            }
                        }
                        const commentBeforeTextNode = doc.createComment(childId);
                        commentBeforeTextNode.nodeValue = `${TEXT_NODE_ID}.${childId}`;
                        nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
                    }
                }
                let orgLocationNodeId = `${ORG_LOCATION_ID}.${childId}`;
                const orgLocationParentNode = orgLocationNode.parentElement;
                if (orgLocationParentNode && orgLocationParentNode['s-sd']) {
                    // ending with a . means that the parent element
                    // of this node's original location is a shadow dom element
                    // and this node is apart of the root level light dom
                    orgLocationNodeId += `.`;
                }
                orgLocationNode.nodeValue = orgLocationNodeId;
            }
        });
    }
};
const parseVNodeAnnotations = (doc, node, docData, orgLocationNodes) => {
    if (node == null) {
        return;
    }
    if (node['s-nr'] != null) {
        orgLocationNodes.push(node);
    }
    if (node.nodeType === 1 /* ElementNode */) {
        node.childNodes.forEach(childNode => {
            const hostRef = getHostRef(childNode);
            if (hostRef != null) {
                const cmpData = {
                    nodeIds: 0
                };
                insertVNodeAnnotations(doc, childNode, hostRef.$vnode$, docData, cmpData);
            }
            parseVNodeAnnotations(doc, childNode, docData, orgLocationNodes);
        });
    }
};
const insertVNodeAnnotations = (doc, hostElm, vnode, docData, cmpData) => {
    if (vnode != null) {
        const hostId = ++docData.hostIds;
        hostElm.setAttribute(HYDRATE_ID, hostId);
        if (hostElm['s-cr'] != null) {
            hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
        }
        if (vnode.$children$ != null) {
            const depth = 0;
            vnode.$children$.forEach((vnodeChild, index) => {
                insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
            });
        }
    }
};
const insertChildVNodeAnnotations = (doc, vnodeChild, cmpData, hostId, depth, index) => {
    const childElm = vnodeChild.$elm$;
    if (childElm == null) {
        return;
    }
    const nodeId = cmpData.nodeIds++;
    const childId = `${hostId}.${nodeId}.${depth}.${index}`;
    childElm['s-host-id'] = hostId;
    childElm['s-node-id'] = nodeId;
    if (childElm.nodeType === 1 /* ElementNode */) {
        childElm.setAttribute(HYDRATE_CHILD_ID, childId);
    }
    else if (childElm.nodeType === 3 /* TextNode */) {
        const parentNode = childElm.parentNode;
        if (parentNode.nodeName !== 'STYLE') {
            const textNodeId = `${TEXT_NODE_ID}.${childId}`;
            const commentBeforeTextNode = doc.createComment(textNodeId);
            parentNode.insertBefore(commentBeforeTextNode, childElm);
        }
    }
    else if (childElm.nodeType === 8 /* CommentNode */) {
        if (childElm['s-sr']) {
            const slotName = (childElm['s-sn'] || '');
            const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}`;
            childElm.nodeValue = slotNodeId;
        }
    }
    if (vnodeChild.$children$ != null) {
        const childDepth = depth + 1;
        vnodeChild.$children$.forEach((vnode, index) => {
            insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
        });
    }
};

function proxyHostElement(elm, cmpMeta) {
    if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = componentOnReady;
    }
    if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate;
    }
    if (cmpMeta.$members$ != null) {
        const hostRef = getHostRef(elm);
        const members = Object.entries(cmpMeta.$members$);
        members.forEach(([memberName, m]) => {
            const memberFlags = m[0];
            if (memberFlags & 31) {
                const attributeName = (m[1] || memberName);
                const attrValue = elm.getAttribute(attributeName);
                if (attrValue != null) {
                    const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
                    hostRef.$instanceValues$.set(memberName, parsedAttrValue);
                }
                const ownValue = elm[memberName];
                if (ownValue !== undefined) {
                    hostRef.$instanceValues$.set(memberName, ownValue);
                    delete elm[memberName];
                }
                Object.defineProperty(elm, memberName, {
                    get() {
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
            else if (memberFlags & 64) {
                Object.defineProperty(elm, memberName, {
                    value() {
                        const ref = getHostRef(this);
                        const args = arguments;
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName].apply(ref.$lazyInstance$, args)).catch(consoleError);
                    }
                });
            }
        });
    }
}
function componentOnReady() {
    return getHostRef(this).$onReadyPromise$;
}
function forceUpdate() { }

function hydrateComponent(win, results, tagName, elm, waitPromises) {
    const Cstr = getComponent(tagName);
    if (Cstr != null) {
        const cmpMeta = Cstr.cmpMeta;
        if (cmpMeta != null) {
            const hydratePromise = new Promise(async (resolve) => {
                try {
                    registerHost(elm);
                    proxyHostElement(elm, cmpMeta);
                    connectedCallback(elm, cmpMeta);
                    await elm.componentOnReady();
                    results.hydratedCount++;
                    const ref = getHostRef(elm);
                    const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
                    if (!results.hydratedComponents.some(c => c.tag === tagName && c.mode === modeName)) {
                        results.hydratedComponents.push({
                            tag: tagName,
                            mode: modeName
                        });
                    }
                }
                catch (e) {
                    win.console.error(e);
                }
                resolve();
            });
            waitPromises.push(hydratePromise);
        }
    }
}

function bootstrapHydrate(win, opts, done) {
    const results = {
        hydratedCount: 0,
        hydratedComponents: []
    };
    plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;
    try {
        const connectedElements = new Set();
        const waitPromises = [];
        const patchedConnectedCallback = function patchedConnectedCallback() {
            connectElements(win, opts, results, this, connectedElements, waitPromises);
        };
        const patchComponent = function (elm) {
            const tagName = elm.nodeName.toLowerCase();
            if (elm.tagName.includes('-')) {
                const Cstr = getComponent(tagName);
                if (Cstr != null) {
                    if (typeof elm.connectedCallback !== 'function') {
                        elm.connectedCallback = patchedConnectedCallback;
                    }
                    elm['s-p'] = [];
                    elm['s-rc'] = [];
                }
            }
        };
        let orgDocumentCreateElement = win.document.createElement;
        win.document.createElement = function patchedCreateElement(tagName) {
            const elm = orgDocumentCreateElement.call(win.document, tagName);
            patchComponent(elm);
            return elm;
        };
        const patchChild = (elm) => {
            if (elm != null && elm.nodeType === 1) {
                patchComponent(elm);
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    patchChild(children[i]);
                }
            }
        };
        patchChild(win.document.body);
        const initConnectElement = (elm) => {
            if (elm != null && elm.nodeType === 1) {
                if (typeof elm.connectedCallback === 'function') {
                    elm.connectedCallback();
                }
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    initConnectElement(children[i]);
                }
            }
        };
        initConnectElement(win.document.body);
        Promise.all(waitPromises)
            .then(() => {
            try {
                waitPromises.length = 0;
                connectedElements.clear();
                if (opts.clientHydrateAnnotations) {
                    insertVdomAnnotations(win.document);
                }
                win.document.createElement = orgDocumentCreateElement;
                win = opts = orgDocumentCreateElement = null;
            }
            catch (e) {
                win.console.error(e);
            }
            done(results);
        })
            .catch(e => {
            try {
                win.console.error(e);
                waitPromises.length = 0;
                connectedElements.clear();
                win.document.createElement = orgDocumentCreateElement;
                win = opts = orgDocumentCreateElement = null;
            }
            catch (e) { }
            done(results);
        });
    }
    catch (e) {
        win.console.error(e);
        win = opts = null;
        done(results);
    }
}
function connectElements(win, opts, results, elm, connectedElements, waitPromises) {
    if (elm != null && elm.nodeType === 1 && results.hydratedCount < opts.maxHydrateCount && shouldHydrate(elm)) {
        const tagName = elm.nodeName.toLowerCase();
        if (tagName.includes('-') && !connectedElements.has(elm)) {
            connectedElements.add(elm);
            hydrateComponent(win, results, tagName, elm, waitPromises);
        }
        const children = elm.children;
        if (children != null) {
            for (let i = 0, ii = children.length; i < ii; i++) {
                connectElements(win, opts, results, children[i], connectedElements, waitPromises);
            }
        }
    }
}
function shouldHydrate(elm) {
    if (elm.nodeType === 9) {
        return true;
    }
    if (NO_HYDRATE_TAGS.has(elm.nodeName)) {
        return false;
    }
    if (elm.hasAttribute('no-prerender')) {
        return false;
    }
    const parentNode = elm.parentNode;
    if (parentNode == null) {
        return true;
    }
    return shouldHydrate(parentNode);
}
const NO_HYDRATE_TAGS = new Set([
    'CODE',
    'HEAD',
    'IFRAME',
    'INPUT',
    'OBJECT',
    'OUTPUT',
    'NOSCRIPT',
    'PRE',
    'SCRIPT',
    'SELECT',
    'STYLE',
    'TEMPLATE',
    'TEXTAREA'
]);

const cstrs = new Map();
const loadModule = (cmpMeta, _hostRef, _hmrVersionId) => {
    return new Promise(resolve => {
        resolve(cstrs.get(cmpMeta.$tagName$));
    });
};
const getComponent = (tagName) => {
    return cstrs.get(tagName);
};
const isMemberInElement = (elm, memberName) => {
    if (elm != null) {
        if (memberName in elm) {
            return true;
        }
        const nodeName = elm.nodeName;
        if (nodeName) {
            const hostRef = getComponent(nodeName.toLowerCase());
            if (hostRef != null && hostRef.cmpMeta != null && hostRef.cmpMeta.$members$ != null) {
                return memberName in hostRef.cmpMeta.$members$;
            }
        }
    }
    return false;
};
const registerComponents = (Cstrs) => {
    Cstrs.forEach(Cstr => {
        cstrs.set(Cstr.cmpMeta.$tagName$, Cstr);
    });
};
const win = window;
const doc = win.document;
const readTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const writeTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const nextTick = (cb) => Promise.resolve().then(cb);
const consoleError = (e) => {
    if (e != null) {
        console.error(e.stack || e.message || e);
    }
};
const Context = {};
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};
const hostRefs = new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);
const registerHost = (elm) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: elm,
        $instanceValues$: new Map(),
    };
    hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    elm['s-p'] = [];
    elm['s-rc'] = [];
    return hostRefs.set(elm, hostRef);
};
const styles = new Map();

const getPlatforms = (win) => setupPlatforms(win);
const isPlatform = (win, platform) => getPlatforms(win).indexOf(platform) > -1;
const setupPlatforms = (win) => {
    win.Gic = win.Gic || {};
    let platforms = win.Gic.platforms;
    if (platforms == null) {
        platforms = win.Gic.platforms = detectPlatforms(win);
        platforms.forEach(p => win.document.documentElement.classList.add(`plt-${p}`));
    }
    return platforms;
};
const isMobileWeb = (win) => isMobile(win) && !isHybrid(win);
const detectPlatforms = (win) => Object.keys(PLATFORMS_MAP).filter(p => PLATFORMS_MAP[p](win));
const isIpad = (win) => testUserAgent(win, /iPad/i);
const isIphone = (win) => testUserAgent(win, /iPhone/i);
const isIOS = (win) => testUserAgent(win, /iPad|iPhone|iPod/i);
const isAndroid = (win) => testUserAgent(win, /android|sink/i);
const isAndroidTablet = (win) => {
    return isAndroid(win) && !testUserAgent(win, /mobile/i);
};
const isPhablet = (win) => {
    const width = win.innerWidth;
    const height = win.innerHeight;
    const smallest = Math.min(width, height);
    const largest = Math.max(width, height);
    return (smallest > 390 && smallest < 520) &&
        (largest > 620 && largest < 800);
};
const isTablet = (win) => {
    const width = win.innerWidth;
    const height = win.innerHeight;
    const smallest = Math.min(width, height);
    const largest = Math.max(width, height);
    return (isIpad(win) ||
        isAndroidTablet(win) ||
        ((smallest > 460 && smallest < 820) &&
            (largest > 780 && largest < 1400)));
};
const isMobile = (win) => matchMedia(win, '(any-pointer:coarse)');
const isDesktop = (win) => !isMobile(win);
const isHybrid = (win) => isCordova(win) || isCapacitorNative(win);
const isCordova = (win) => !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);
const isCapacitorNative = (win) => {
    const capacitor = win['Capacitor'];
    return !!(capacitor && capacitor.isNative);
};
const isElectron = (win) => testUserAgent(win, /electron/);
const isPWA = (win) => win.matchMedia ? (win.matchMedia('(display-mode: standalone)').matches || win.navigator.standalone) : false;
const testUserAgent = (win, expr) => win.navigator && win.navigator.userAgent ? expr.test(win.navigator.userAgent) : false;
const matchMedia = (win, query) => win.matchMedia ? win.matchMedia(query).matches : false;
const PLATFORMS_MAP = {
    'ipad': isIpad,
    'iphone': isIphone,
    'ios': isIOS,
    'android': isAndroid,
    'phablet': isPhablet,
    'tablet': isTablet,
    'cordova': isCordova,
    'capacitor': isCapacitorNative,
    'electron': isElectron,
    'pwa': isPWA,
    'mobile': isMobile,
    'mobileweb': isMobileWeb,
    'desktop': isDesktop,
    'hybrid': isHybrid
};

class Config {
    constructor() {
        this.m = new Map();
    }
    reset(configObj) {
        this.m = new Map(Object.entries(configObj));
    }
    get(key, fallback) {
        const value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    }
    getBoolean(key, fallback = false) {
        const val = this.m.get(key);
        if (val === undefined) {
            return fallback;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    getNumber(key, fallback) {
        const val = parseFloat(this.m.get(key));
        return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    set(key, value) {
        this.m.set(key, value);
    }
}
const config = /*@__PURE__*/ new Config();
const configFromSession = (win) => {
    try {
        const configStr = win.sessionStorage.getItem(GIC_SESSION_KEY);
        return configStr !== null ? JSON.parse(configStr) : {};
    }
    catch (e) {
        return {};
    }
};
const saveConfig = (win, c) => {
    try {
        win.sessionStorage.setItem(GIC_SESSION_KEY, JSON.stringify(c));
    }
    catch (e) {
        return;
    }
};
const configFromURL = (win) => {
    const configObj = {};
    win.location.search.slice(1)
        .split('&')
        .map(entry => entry.split('='))
        .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
        .filter(([key]) => startsWith(key, GIC_PREFIX))
        .map(([key, value]) => [key.slice(GIC_PREFIX.length), value])
        .forEach(([key, value]) => {
        configObj[key] = value;
    });
    return configObj;
};
const startsWith = (input, search) => {
    return input.substr(0, search.length) === search;
};
const GIC_PREFIX = 'gic:';
const GIC_SESSION_KEY = 'gic-persist-config';

let mode;
var global0 = () => {
    const doc = document;
    const win = window;
    Context.config = config;
    const Gic = win.Gic = win.Gic || {};
    // Setup platforms
    setupPlatforms(win);
    // create the Gic.config from raw config object (if it exists)
    // and convert Gic.config into a ConfigApi that has a get() fn
    const configObj = Object.assign(Object.assign(Object.assign(Object.assign({}, configFromSession(win)), { persistConfig: false }), Gic.config), configFromURL(win));
    config.reset(configObj);
    if (config.getBoolean('persistConfig')) {
        saveConfig(win, configObj);
    }
    // first see if the mode was set as an attribute on <html>
    // which could have been set by the user, or by prerendering
    // otherwise get the mode via config settings, and fallback to md
    Gic.config = config;
    Gic.mode = mode = config.get('mode', (doc.documentElement.getAttribute('mode')) || (isPlatform(win, 'ios') ? 'ios' : 'md'));
    config.set('mode', mode);
    doc.documentElement.setAttribute('mode', mode);
    doc.documentElement.classList.add(mode);
    if (config.getBoolean('_testing')) {
        config.set('animated', false);
    }
    setMode((elm) => elm.mode = elm.mode || elm.getAttribute('mode') || mode);
};

const globals = () => {
  global0();
};

let lastId = 0;
const createOverlay = (tagName, opts) => {
    return customElements.whenDefined(tagName).then(() => {
        const doc = document;
        const element = doc.createElement(tagName);
        connectListeners(doc);
        // convert the passed in overlay options into props
        // that get passed down into the new overlay
        Object.assign(element, opts);
        element.classList.add('overlay-hidden');
        const overlayIndex = lastId++;
        element.overlayIndex = overlayIndex;
        if (!element.hasAttribute('id')) {
            element.id = `gic-overlay-${overlayIndex}`;
        }
        // append the overlay element to the document body
        getAppRoot(doc).appendChild(element);
        return element.componentOnReady();
    });
};
const connectListeners = (doc) => {
    if (lastId === 0) {
        lastId = 1;
        // trap focus inside overlays
        doc.addEventListener('focusin', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss && !isDescendant(lastOverlay, ev.target)) {
                const firstInput = lastOverlay.querySelector('input,button');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
        // handle back-button click
        doc.addEventListener('ionBackButton', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss) {
                ev.detail.register(100, () => {
                    return lastOverlay.dismiss(undefined, BACKDROP);
                });
            }
        });
        // handle ESC to close overlay
        doc.addEventListener('keyup', ev => {
            if (ev.key === 'Escape') {
                const lastOverlay = getOverlay(doc);
                if (lastOverlay && lastOverlay.backdropDismiss) {
                    lastOverlay.dismiss(undefined, BACKDROP);
                }
            }
        });
    }
};
const dismissOverlay = (doc, data, role, overlayTag, id) => {
    const overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
};
const getOverlays = (doc, overlayTag) => {
    const overlays = Array.from(getAppRoot(doc).children).filter(c => c.overlayIndex > 0);
    if (overlayTag === undefined) {
        return overlays;
    }
    overlayTag = overlayTag.toUpperCase();
    return overlays.filter(c => c.tagName === overlayTag);
};
const getOverlay = (doc, overlayTag, id) => {
    const overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(o => o.id === id);
};
const present = async (overlay, name, iosEnterAnimation, mdEnterAnimation, opts) => {
    if (overlay.presented) {
        return;
    }
    overlay.presented = true;
    overlay.willPresent.emit();
    // get the user's animation fn if one was provided
    const animationBuilder = (overlay.enterAnimation)
        ? overlay.enterAnimation
        : config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
    const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    if (completed) {
        overlay.didPresent.emit();
    }
};
const dismiss = async (overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) => {
    if (!overlay.presented) {
        return false;
    }
    overlay.presented = false;
    try {
        overlay.willDismiss.emit({ data, role });
        const animationBuilder = (overlay.leaveAnimation)
            ? overlay.leaveAnimation
            : config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
        overlay.didDismiss.emit({ data, role });
    }
    catch (err) {
        console.error(err);
    }
    overlay.el.remove();
    return true;
};
const getAppRoot = (doc) => {
    return doc.querySelector('ion-app') || doc.body;
};
const overlayAnimation = async (overlay, animationBuilder, baseEl, opts) => {
    if (overlay.animation) {
        overlay.animation.destroy();
        overlay.animation = undefined;
        return false;
    }
    // Make overlay visible in case it's hidden
    baseEl.classList.remove('overlay-hidden');
    const aniRoot = baseEl.shadowRoot || overlay.el;
    const animation = await Promise.resolve().then(function () { return index; }).then(mod => mod.create(animationBuilder, aniRoot, opts));
    overlay.animation = animation;
    if (!overlay.animated || !config.getBoolean('animated', true)) {
        animation.duration(0);
    }
    if (overlay.keyboardClose) {
        animation.beforeAddWrite(() => {
            const activeElement = baseEl.ownerDocument.activeElement;
            if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                activeElement.blur();
            }
        });
    }
    await animation.playAsync();
    const hasCompleted = animation.hasCompleted;
    animation.destroy();
    overlay.animation = undefined;
    return hasCompleted;
};
const eventMethod = (element, eventName) => {
    let resolve;
    const promise = new Promise(r => resolve = r);
    onceEvent(element, eventName, (event) => {
        resolve(event.detail);
    });
    return promise;
};
const onceEvent = (element, eventName, callback) => {
    const handler = (ev) => {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
};
const isCancel = (role) => {
    return role === 'cancel' || role === BACKDROP;
};
const isDescendant = (parent, child) => {
    while (child) {
        if (child === parent) {
            return true;
        }
        child = child.parentElement;
    }
    return false;
};
const BACKDROP = 'backdrop';

const getClassList = (classes) => {
    if (classes !== undefined) {
        const array = Array.isArray(classes) ? classes : classes.split(' ');
        return array
            .filter(c => c != null)
            .map(c => c.trim())
            .filter(c => c !== '');
    }
    return [];
};
const getClassMap = (classes) => {
    const map = {};
    getClassList(classes).forEach(c => map[c] = true);
    return map;
};
const hostContext = (selector, el) => {
    return el.closest(selector) !== null;
};

/**
 * iOS Action Sheet Enter Animation
 */
const iosEnterAnimation = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

/**
 * iOS Action Sheet Leave Animation
 */
const iosLeaveAnimation = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.4, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

/**
 * MD Action Sheet Enter Animation
 */
const mdEnterAnimation = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.32);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

/**
 * MD Action Sheet Leave Animation
 */
const mdLeaveAnimation = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.32, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

class ActionSheet {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.presented = false;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */
        this.keyboardClose = true;
        /**
         * If `true`, the action sheet will be dismissed when the backdrop is clicked.
         */
        this.backdropDismiss = true;
        /**
         * If `true`, the action sheet will be translucent. Only applies when the mode is `"ios"` and the device supports backdrop-filter.
         */
        this.translucent = false;
        /**
         * If `true`, the action sheet will animate.
         */
        this.animated = true;
        /**
         * If `true`, the action sheet will show a searchbar for radios and checkboxes
         */
        this.searchBar = false;
        /**
         * If `true`, the action sheet will use a virtual scroll to render radios and checkboxes
         */
        this.useVirtualScroll = false;
        /**
         * The current search string
         */
        this.searchString = '';
        this.processedButtons = [];
        this.onSearchChange = (ev) => {
            const input = ev.target;
            if (input) {
                this.searchString = input.value || '';
            }
        };
        this.resetSearch = () => {
            this.searchString = '';
        };
        this.didPresent = createEvent(this, "ionActionSheetDidPresent", 7);
        this.willPresent = createEvent(this, "ionActionSheetWillPresent", 7);
        this.willDismiss = createEvent(this, "ionActionSheetWillDismiss", 7);
        this.didDismiss = createEvent(this, "ionActionSheetDidDismiss", 7);
        this.config = getContext(this, "config");
    }
    onBackdropTap() {
        this.dismiss(undefined, BACKDROP);
    }
    dispatchCancelHandler(ev) {
        const role = ev.detail.role;
        if (isCancel(role)) {
            const cancelButton = this.getButtons().find(b => b.role === 'cancel');
            this.callButtonHandler(cancelButton);
        }
    }
    /**
     * Present the action sheet overlay after it has been created.
     */
    present() {
        return present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);
    }
    /**
     * Dismiss the action sheet overlay after it has been presented.
     */
    dismiss(data, role) {
        return dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
    }
    /**
     * Returns a promise that resolves when the action-sheet did dismiss.
     */
    onDidDismiss() {
        return eventMethod(this.el, 'ionActionSheetDidDismiss');
    }
    /**
     * Returns a promise that resolves when the action-sheet will dismiss.
     *
     */
    onWillDismiss() {
        return eventMethod(this.el, 'ionActionSheetWillDismiss');
    }
    buttonsChanged() {
        const buttons = this.buttons;
        const search = (this.searchString || '').trim();
        const regex = new RegExp(search, 'i');
        this.processedButtons = search.length === 0 ? buttons : buttons
            .filter(b => {
            if (typeof b !== 'string' && b.role === 'cancel') {
                return true;
            }
            const buttonText = typeof b === 'string' ? b : b.text;
            return regex.test(buttonText || '');
        });
    }
    componentWillLoad() {
        this.buttonsChanged();
    }
    renderSearchBar() {
        if (!this.searchBar || this.buttons.length === 0) {
            return null;
        }
        const searchString = this.searchString || '';
        return (h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" }))));
    }
    async buttonClick(button) {
        const role = button.role;
        if (isCancel(role)) {
            return this.dismiss(undefined, role);
        }
        const shouldDismiss = await this.callButtonHandler(button);
        if (shouldDismiss) {
            return this.dismiss(undefined, button.role);
        }
        return Promise.resolve();
    }
    async callButtonHandler(button) {
        if (button && button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            try {
                const rtn = await button.handler();
                if (rtn === false) {
                    // if the return value of the handler is false then do not dismiss
                    return false;
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return true;
    }
    getButtons() {
        return this.processedButtons.map(b => {
            return (typeof b === 'string')
                ? { text: b }
                : b;
        });
    }
    hostData() {
        return {
            'role': 'dialog',
            'aria-modal': 'true',
            style: {
                zIndex: 20000 + this.overlayIndex,
            },
            class: Object.assign(Object.assign({}, getClassMap(this.cssClass)), { 'action-sheet-translucent': this.translucent })
        };
    }
    renderButton(b) {
        return (h("button", { type: "button", "ion-activatable": true, class: buttonClass(b), onClick: () => this.buttonClick(b) }, h("span", { class: "action-sheet-button-inner" }, b.icon && h("ion-icon", { icon: b.icon, lazy: false, class: "action-sheet-icon" }), b.text), this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    renderButtonNode(el, cell) {
        const hydClass = 'sc-gic-action-sheet-' + this.mode;
        const b = cell.value;
        if (el) {
            const cls = [...Object.keys(buttonClass(b)), hydClass].join(' ');
            el.setAttribute('class', cls);
            const inner = el.querySelector('.action-sheet-button-inner');
            inner.textContent = '';
            if (b.icon !== undefined) {
                inner.textContent += `<ion-icon icon="${b.icon}" lazy="false" class="action-sheet-icon ${hydClass}"></ion-icon>`;
            }
            inner.textContent += `${b.text}`;
            el.onclick = () => this.buttonClick(b);
        }
        return el;
    }
    __stencil_render() {
        const allButtons = this.getButtons();
        const cancelButton = allButtons.find(b => b.role === 'cancel');
        const buttons = allButtons.filter(b => b.role !== 'cancel');
        const hydClass = 'sc-gic-action-sheet-' + this.mode;
        const buttonTemplate = ``
            + `<button type="button">`
            + `<span class="action-sheet-button-inner ${hydClass}"></span>`
            + (this.mode === 'md' ? `<ion-ripple-effect class="${hydClass}"></ion-ripple-effect>` : '')
            + `</button>`;
        return [
            h("ion-backdrop", { tappable: this.backdropDismiss }),
            h("div", { class: "action-sheet-wrapper", role: "dialog" }, h("div", { class: "action-sheet-container" }, h("div", { class: "action-sheet-group" }, this.header !== undefined &&
                h("div", { class: "action-sheet-title" }, this.header, this.subHeader && h("div", { class: "action-sheet-sub-title" }, this.subHeader)), this.searchBar && this.renderSearchBar(), this.useVirtualScroll
                ?
                    h("ion-content", { class: "action-sheet-group-vs" }, h("ion-virtual-scroll", { items: buttons, nodeRender: (el, cell) => this.renderButtonNode(el, cell) }, h("template", { innerHTML: buttonTemplate })))
                : buttons.map(b => this.renderButton(b))), cancelButton &&
                h("div", { class: "action-sheet-group action-sheet-group-cancel" }, h("button", { type: "button", class: buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) }, h("span", { class: "action-sheet-button-inner" }, cancelButton.icon &&
                    h("ion-icon", { icon: cancelButton.icon, lazy: false, class: "action-sheet-icon" }), cancelButton.text)))))
        ];
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "buttons": ["buttonsChanged"],
        "searchString": ["buttonsChanged"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "gic-action-sheet",
        "$members$": {
            "overlayIndex": [2, "overlay-index"],
            "mode": [1],
            "keyboardClose": [4, "keyboard-close"],
            "enterAnimation": [16],
            "leaveAnimation": [16],
            "buttons": [1040],
            "cssClass": [1, "css-class"],
            "backdropDismiss": [4, "backdrop-dismiss"],
            "header": [1],
            "subHeader": [1, "sub-header"],
            "translucent": [4],
            "animated": [4],
            "searchBar": [4, "search-bar"],
            "useVirtualScroll": [4, "use-virtual-scroll"],
            "searchString": [1025, "search-string"],
            "present": [64],
            "dismiss": [64],
            "onDidDismiss": [64],
            "onWillDismiss": [64]
        },
        "$listeners$": [[0, "ionBackdropTap", "onBackdropTap"], [0, "ionActionSheetWillDismiss", "dispatchCancelHandler"]],
        "$lazyBundleIds$": {
            "ios": "-",
            "md": "-"
        },
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData(), this.__stencil_render()); }
}
const buttonClass = (button) => {
    return Object.assign({ 'action-sheet-button': true, 'ion-activatable': true, [`action-sheet-${button.role}`]: button.role !== undefined }, getClassMap(button.cssClass));
};

class ActionSheetController {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.doc = getContext(this, "document");
    }
    /**
     * Create an action sheet overlay with action sheet options.
     */
    create(opts) {
        return createOverlay('gic-action-sheet', opts);
    }
    /**
     * Dismiss the open action sheet overlay.
     */
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'gic-action-sheet', id);
    }
    /**
     * Get the most recently opened action sheet overlay.
     */
    async getTop() {
        return getOverlay(this.doc, 'gic-action-sheet');
    }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "gic-action-sheet-controller",
        "$members$": {
            "create": [64],
            "dismiss": [64],
            "getTop": [64]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

/**
 * iOS Alert Enter Animation
 */
const iosEnterAnimation$1 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

/**
 * iOS Alert Leave Animation
 */
const iosLeaveAnimation$1 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
};

/**
 * Md Alert Enter Animation
 */
const mdEnterAnimation$1 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.32);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 0.9, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(150)
        .add(backdropAnimation)
        .add(wrapperAnimation));
};

/**
 * Md Alert Leave Animation
 */
const mdLeaveAnimation$1 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.32, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(150)
        .add(backdropAnimation)
        .add(wrapperAnimation));
};

class Alert {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.processedInputs = [];
        this.processedButtons = [];
        this.presented = false;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */
        this.keyboardClose = true;
        /**
         * Array of buttons to be added to the alert.
         */
        this.buttons = [];
        /**
         * Array of input to show in the alert.
         */
        this.inputs = [];
        /**
         * If `true`, the alert will be dismissed when the backdrop is clicked.
         */
        this.backdropDismiss = true;
        /**
         * If `true`, the alert will be translucent.
         */
        this.translucent = false;
        /**
         * If `true`, the alert will animate.
         */
        this.animated = true;
        /**
         * If `true`, the alert will show a searchbar for radios and checkboxes
         */
        this.searchBar = false;
        /**
         * If `true`, the alert will use a virtual scroll to render radios and checkboxes
         */
        this.useVirtualScroll = false;
        /**
         * The current search string
         */
        this.searchString = '';
        this.onSearchChange = (ev) => {
            const input = ev.target;
            if (input) {
                this.searchString = input.value || '';
            }
        };
        this.resetSearch = () => {
            this.searchString = '';
        };
        this.didPresent = createEvent(this, "gicAlertDidPresent", 7);
        this.willPresent = createEvent(this, "gicAlertWillPresent", 7);
        this.willDismiss = createEvent(this, "gicAlertWillDismiss", 7);
        this.didDismiss = createEvent(this, "gicAlertDidDismiss", 7);
        this.config = getContext(this, "config");
    }
    buttonsChanged() {
        const buttons = this.buttons;
        this.processedButtons = buttons.map(btn => {
            return (typeof btn === 'string')
                ? { text: btn, role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined }
                : btn;
        });
    }
    inputsChanged() {
        const inputs = this.inputs;
        // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.
        const inputTypes = new Set(inputs.map(i => i.type));
        if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
            console.warn(`Alert cannot mix input types: ${(Array.from(inputTypes.values()).join('/'))}. Please see alert docs for more info.`);
        }
        this.inputType = inputTypes.values().next().value;
        const search = (this.searchString || '').trim();
        const regex = new RegExp(search, 'i');
        this.processedInputs = (search.length === 0 ? inputs : inputs.filter(i => regex.test(i.label || '')))
            .map((i, index) => ({
            type: i.type || 'text',
            name: i.name || `${index}`,
            placeholder: i.placeholder || '',
            value: i.value,
            label: i.label,
            checked: !!i.checked,
            disabled: !!i.disabled,
            id: i.id || `alert-input-${this.overlayIndex}-${index}`,
            handler: i.handler,
            min: i.min,
            max: i.max
        }));
    }
    componentWillLoad() {
        this.inputsChanged();
        this.buttonsChanged();
    }
    onBackdropTap() {
        this.dismiss(undefined, BACKDROP);
    }
    dispatchCancelHandler(ev) {
        const role = ev.detail.role;
        if (isCancel(role)) {
            const cancelButton = this.processedButtons.find(b => b.role === 'cancel');
            this.callButtonHandler(cancelButton);
        }
    }
    /**
     * Present the alert overlay after it has been created.
     */
    present() {
        return present(this, 'alertEnter', iosEnterAnimation$1, mdEnterAnimation$1);
    }
    /**
     * Dismiss the alert overlay after it has been presented.
     */
    dismiss(data, role) {
        return dismiss(this, data, role, 'alertLeave', iosLeaveAnimation$1, mdLeaveAnimation$1);
    }
    /**
     * Returns a promise that resolves when the alert did dismiss.
     *
     */
    onDidDismiss() {
        return eventMethod(this.el, 'gicAlertDidDismiss');
    }
    /**
     * Returns a promise that resolves when the alert will dismiss.
     *
     */
    onWillDismiss() {
        return eventMethod(this.el, 'gicAlertWillDismiss');
    }
    rbClick(selectedInput) {
        for (const input of this.processedInputs) {
            input.checked = input === selectedInput;
        }
        this.activeId = selectedInput.id;
        if (selectedInput.handler) {
            selectedInput.handler(selectedInput);
        }
        this.el.forceUpdate();
    }
    cbClick(selectedInput) {
        selectedInput.checked = !selectedInput.checked;
        if (selectedInput.handler) {
            selectedInput.handler(selectedInput);
        }
        this.el.forceUpdate();
    }
    buttonClick(button) {
        const role = button.role;
        const values = this.getValues();
        if (isCancel(role)) {
            return this.dismiss({ values }, role);
        }
        const returnData = this.callButtonHandler(button, values);
        if (returnData !== false) {
            return this.dismiss(Object.assign({ values }, returnData), button.role);
        }
        return Promise.resolve(false);
    }
    callButtonHandler(button, data) {
        if (button && button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            const returnData = button.handler(data);
            if (returnData === false) {
                // if the return value of the handler is false then do not dismiss
                return false;
            }
            if (typeof returnData === 'object') {
                return returnData;
            }
        }
        return {};
    }
    getValues() {
        if (this.processedInputs.length === 0) {
            // this is an alert without any options/inputs at all
            return undefined;
        }
        if (this.inputType === 'radio') {
            // this is an alert with radio buttons (single value select)
            // return the one value which is checked, otherwise undefined
            const checkedInput = this.processedInputs.find(i => !!i.checked);
            return checkedInput ? checkedInput.value : undefined;
        }
        if (this.inputType === 'checkbox') {
            // this is an alert with checkboxes (multiple value select)
            // return an array of all the checked values
            return this.processedInputs.filter(i => i.checked).map(i => i.value);
        }
        // this is an alert with text inputs
        // return an object of all the values with the input name as the key
        const values = {};
        this.processedInputs.forEach(i => {
            values[i.name] = i.value || '';
        });
        return values;
    }
    renderSearchBar() {
        if (!this.searchBar || this.inputs.length === 0) {
            return null;
        }
        const inputTypes = new Set(this.inputs.map(i => i.type));
        if (!inputTypes.has('checkbox') && !inputTypes.has('radio')) {
            return;
        }
        const searchString = this.searchString || '';
        return (h("div", { class: "alert-search-bar" }, h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" })))));
    }
    renderAlertInputs(labelledBy) {
        switch (this.inputType) {
            case 'checkbox': return this.renderCheckbox(labelledBy);
            case 'radio': return this.renderRadio(labelledBy);
            default: return this.renderInput(labelledBy);
        }
    }
    renderCheckboxNode(el, cell) {
        const i = cell.value;
        if (el) {
            el.setAttribute('aria-checked', `${i.checked}`);
            el.setAttribute('id', `${i.id}`);
            if (i.disabled) {
                el.setAttribute('disabled', 'disabled');
            }
            else {
                el.removeAttribute('disabled');
            }
            el.querySelector('.alert-checkbox-label').textContent = `${i.label}`;
            el.onclick = () => {
                this.cbClick(i);
                el.setAttribute('aria-checked', `${i.checked}`);
            };
        }
        return el;
    }
    renderCheckboxEntry(i) {
        return (h("button", { type: "button", onClick: () => this.cbClick(i), "aria-checked": `${i.checked}`, id: i.id, disabled: i.disabled, tabIndex: 0, role: "checkbox", class: "alert-tappable alert-checkbox alert-checkbox-button ion-focusable" }, h("div", { class: "alert-button-inner" }, h("div", { class: "alert-checkbox-icon" }, h("div", { class: "alert-checkbox-inner" })), h("div", { class: "alert-checkbox-label" }, i.label)), this.mode === 'md' && h("ion-ripple-effect", null)));
    }
    renderCheckbox(labelledby) {
        const hydClass = 'sc-gic-alert-' + this.mode;
        const checkboxTemplate = ``
            + `<button type="button" role="checkbox" class="alert-tappable alert-checkbox alert-checkbox-button ion-focusable ${hydClass}" tabindex="0" role="checkbox">`
            + `<div class="alert-button-inner ${hydClass}">`
            + `<div class="alert-checkbox-icon ${hydClass}">`
            + `<div class="alert-checkbox-inner ${hydClass}"></div>`
            + `</div>`
            + `<div class="alert-checkbox-label ${hydClass}"></div>`
            + `</div>`
            + (this.mode === 'md' ? `<ion-ripple-effect class="${hydClass}"></ion-ripple-effect>` : '')
            + `</button>`;
        const inputs = this.processedInputs;
        if (inputs.length === 0) {
            return null;
        }
        return (h("div", { class: "alert-checkbox-group", "aria-labelledby": labelledby }, this.useVirtualScroll
            ?
                h("ion-content", { class: "alert-checkbox-group-vs" }, h("ion-virtual-scroll", { items: inputs, nodeRender: (el, cell) => this.renderCheckboxNode(el, cell) }, h("template", { innerHTML: checkboxTemplate })))
            : inputs.map(i => this.renderCheckboxEntry(i))));
    }
    renderRadioEntry(i) {
        return (h("button", { type: "button", onClick: () => this.rbClick(i), "aria-checked": `${i.checked}`, disabled: i.disabled, id: i.id, tabIndex: 0, class: "alert-radio-button alert-tappable alert-radio ion-focusable", role: "radio" }, h("div", { class: "alert-button-inner" }, h("div", { class: "alert-radio-icon" }, h("div", { class: "alert-radio-inner" })), h("div", { class: "alert-radio-label" }, i.label))));
    }
    renderRadioNode(el, cell) {
        const i = cell.value;
        if (el) {
            el.setAttribute('aria-checked', `${i.checked}`);
            el.setAttribute('id', `${i.id}`);
            if (i.disabled) {
                el.setAttribute('disabled', 'disabled');
            }
            else {
                el.removeAttribute('disabled');
            }
            el.querySelector('.alert-radio-label').textContent = `${i.label}`;
            el.onclick = () => {
                this.cbClick(i);
                el.parentElement.querySelectorAll('.alert-radio-button')
                    .forEach(b => b.setAttribute('aria-checked', 'false'));
                el.setAttribute('aria-checked', `${i.checked}`);
            };
        }
        return el;
    }
    renderRadio(labelledby) {
        const hydClass = 'sc-gic-alert-' + this.mode;
        const radioTemplate = ``
            + `<button type="button" class="alert-radio-button alert-tappable alert-radio ion-focusable ${hydClass}" tabIndex="0" role="radio">`
            + `<div class="alert-button-inner ${hydClass}">`
            + `<div class="alert-radio-icon ${hydClass}">`
            + `<div class="alert-radio-inner ${hydClass}"></div>`
            + `</div>`
            + `<div class="alert-radio-label ${hydClass}"></div>`
            + `</div>`
            + `</button>`;
        const inputs = this.processedInputs;
        if (inputs.length === 0) {
            return null;
        }
        return (h("div", { class: "alert-radio-group", role: "radiogroup", "aria-labelledby": labelledby, "aria-activedescendant": this.activeId }, this.useVirtualScroll
            ?
                h("ion-content", { class: "alert-checkbox-group-vs" }, h("ion-virtual-scroll", { items: inputs, nodeRender: (el, cell) => this.renderRadioNode(el, cell) }, h("template", { innerHTML: radioTemplate })))
            : inputs.map(i => this.renderRadioEntry(i))));
    }
    renderInput(labelledby) {
        const inputs = this.processedInputs;
        if (inputs.length === 0) {
            return null;
        }
        return (h("div", { class: "alert-input-group", "aria-labelledby": labelledby }, inputs.map(i => (h("div", { class: "alert-input-wrapper" }, h("input", { placeholder: i.placeholder, value: i.value, type: i.type, min: i.min, max: i.max, onInput: e => i.value = e.target.value, id: i.id, disabled: i.disabled, tabIndex: 0, class: "alert-input" }))))));
    }
    hostData() {
        return {
            'role': 'dialog',
            'aria-modal': 'true',
            style: {
                zIndex: 20000 + this.overlayIndex,
            },
            class: Object.assign(Object.assign({}, getClassMap(this.cssClass)), { 'alert-translucent': this.translucent })
        };
    }
    renderAlertButtons() {
        const buttons = this.processedButtons;
        const alertButtonGroupClass = {
            'alert-button-group': true,
            'alert-button-group-vertical': buttons.length > 2
        };
        return (h("div", { class: alertButtonGroupClass }, buttons.map(button => h("button", { type: "button", class: buttonClass$1(button), tabIndex: 0, onClick: () => this.buttonClick(button) }, h("span", { class: "alert-button-inner" }, button.text), this.mode === 'md' && h("ion-ripple-effect", null)))));
    }
    __stencil_render() {
        const hdrId = `alert-${this.overlayIndex}-hdr`;
        const subHdrId = `alert-${this.overlayIndex}-sub-hdr`;
        const msgId = `alert-${this.overlayIndex}-msg`;
        let labelledById;
        if (this.header !== undefined) {
            labelledById = hdrId;
        }
        else if (this.subHeader !== undefined) {
            labelledById = subHdrId;
        }
        return [
            h("ion-backdrop", { tappable: this.backdropDismiss }),
            h("div", { class: "alert-wrapper" }, h("div", { class: "alert-head" }, this.header && h("h2", { id: hdrId, class: "alert-title" }, this.header), this.subHeader && h("h2", { id: subHdrId, class: "alert-sub-title" }, this.subHeader)), h("div", { id: msgId, class: "alert-message", innerHTML: this.message }), this.searchBar && this.renderSearchBar(), this.renderAlertInputs(labelledById), this.renderAlertButtons())
        ];
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "buttons": ["buttonsChanged"],
        "inputs": ["inputsChanged"],
        "searchString": ["inputsChanged"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "gic-alert",
        "$members$": {
            "overlayIndex": [2, "overlay-index"],
            "mode": [1],
            "keyboardClose": [4, "keyboard-close"],
            "enterAnimation": [16],
            "leaveAnimation": [16],
            "cssClass": [1, "css-class"],
            "header": [1],
            "subHeader": [1, "sub-header"],
            "message": [1],
            "buttons": [16],
            "inputs": [1040],
            "backdropDismiss": [4, "backdrop-dismiss"],
            "translucent": [4],
            "animated": [4],
            "searchBar": [4, "search-bar"],
            "useVirtualScroll": [4, "use-virtual-scroll"],
            "searchString": [1025, "search-string"],
            "present": [64],
            "dismiss": [64],
            "onDidDismiss": [64],
            "onWillDismiss": [64]
        },
        "$listeners$": [[0, "ionBackdropTap", "onBackdropTap"], [0, "gicAlertWillDismiss", "dispatchCancelHandler"]],
        "$lazyBundleIds$": {
            "ios": "-",
            "md": "-"
        },
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData(), this.__stencil_render()); }
}
const buttonClass$1 = (button) => {
    return Object.assign({ 'alert-button': true, 'ion-focusable': true, 'ion-activatable': true }, getClassMap(button.cssClass));
};

class AlertController {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.doc = getContext(this, "document");
    }
    /**
     * Create an alert overlay with alert options
     */
    create(opts) {
        return createOverlay('gic-alert', opts);
    }
    /**
     * Dismiss the open alert overlay.
     */
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'gic-alert', id);
    }
    /**
     * Get the most recently opened alert overlay.
     */
    async getTop() {
        return getOverlay(this.doc, 'gic-alert');
    }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "gic-alert-controller",
        "$members$": {
            "create": [64],
            "dismiss": [64],
            "getTop": [64]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

class AutoComplete {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = null;
        /**
         * Any additional options that the `popover` interface
         * can take. See the [PopoverController API docs](../../popover/PopoverController/#create)
         * for the create options for each interface.
         */
        this.interfaceOptions = {};
        this.popoverId = `gic-acpopover-${autocompleteId++}`;
        this.childOpts = [];
        this.options = [];
        this.isOpen = false;
        this.searchValue = '';
        this.onIonFocus = (ev) => {
            this.showHints(ev);
        };
        this.onInput = (ev) => {
            const input = ev.target;
            if (input) {
                this.searchValue = input.value || '';
                if (this.options.indexOf(this.searchValue || '') === -1) {
                    this.value = null;
                }
                this.updateOptionsList();
                this.showHints();
            }
        };
        this.popoverCtrl = getConnect(this, "gic-popover-controller");
        this.win = getContext(this, "window");
    }
    async componentDidLoad() {
        await this.loadOptions();
        this.updateOptionsList();
    }
    /**
     * Close the autocomplete popover.
     */
    close() {
        // TODO check !this.overlay || !this.isFocus()
        if (!this.overlay) {
            return Promise.resolve(false);
        }
        return this.overlay.dismiss();
    }
    updateOptionsList() {
        const options = (this.childOpts || []).map(o => o.value);
        const searchValue = (this.searchValue || '').trim();
        const regex = new RegExp('^' + searchValue, 'i');
        this.options = searchValue.length > 0 ? options.filter(o => regex.test(o)) : options;
    }
    createPopoverOptions(data) {
        return data.map(o => {
            return {
                text: o,
                handler: () => {
                    this.value = o;
                    this.searchValue = '';
                    this.close();
                }
            };
        });
    }
    async loadOptions() {
        this.childOpts = await Promise.all(Array.from(this.el.querySelectorAll('gic-autocomplete-option')).map(o => o.componentOnReady()));
    }
    async showHints(ev) {
        if (ev !== undefined) {
            this.evt = ev;
        }
        if (this.options.indexOf(this.value || '') !== -1) {
            return;
        }
        if (this.overlay === undefined && !this.isOpen) {
            this.isOpen = true;
            this.overlay = await this.createOverlay(ev || this.evt);
            this.overlay.onDidDismiss().then(() => {
                this.overlay = undefined;
                this.isOpen = false;
            });
            this.overlay.present();
        }
        if (this.overlay === undefined) {
            return;
        }
        const popovers = this.overlay.getElementsByTagName('gic-autocomplete-popover');
        if (popovers.length > 0) {
            const popover = popovers.item(0);
            popover.options = this.createPopoverOptions(this.options);
        }
    }
    createOverlay(ev) {
        const interfaceOptions = this.interfaceOptions;
        const popoverOpts = Object.assign(Object.assign({ mode: this.mode }, interfaceOptions), { showBackdrop: false, backdropDismiss: false, translucent: false, animated: false, component: 'gic-autocomplete-popover', cssClass: ['select-popover', interfaceOptions.cssClass], event: ev, id: this.popoverId, componentProps: {
                options: this.createPopoverOptions(this.options)
            } });
        return this.popoverCtrl.create(popoverOpts);
    }
    render() {
        const value = this.value || '';
        return (h("ion-input", { value: value, placeholder: this.placeholder, onIonFocus: this.onIonFocus, onIonChange: this.onInput }));
    }
    get el() { return getElement(this); }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "gic-autocomplete",
        "$members$": {
            "mode": [1],
            "value": [1025],
            "placeholder": [1],
            "interfaceOptions": [8, "interface-options"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": {
            "ios": "-",
            "md": "-"
        },
        "$attrsToReflect$": []
    }; }
}
let autocompleteId = 0;

/**
 * @internal
 */
class AutocompletePopover {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /** Array of options for the popover */
        this.options = [];
        this.onClick = (ev) => {
            const option = this.options.find(o => o.text === ev.target.textContent);
            if (option && option.handler) {
                option.handler();
            }
        };
    }
    render() {
        return (h("ion-list", null, this.options.map(option => h("ion-item", { onClick: this.onClick }, h("ion-label", null, option.text)))));
    }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "gic-autocomplete-popover",
        "$members$": {
            "options": [1040],
            "searchStr": [1025, "search-str"]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const attachComponent = async (delegate, container, component, cssClasses, componentProps) => {
    if (delegate) {
        return delegate.attachViewToDom(container, component, componentProps, cssClasses);
    }
    if (typeof component !== 'string' && !(component instanceof HTMLElement)) {
        throw new Error('framework delegate is missing');
    }
    const el = (typeof component === 'string')
        ? container.ownerDocument && container.ownerDocument.createElement(component)
        : component;
    if (cssClasses) {
        cssClasses.forEach(c => el.classList.add(c));
    }
    if (componentProps) {
        Object.assign(el, componentProps);
    }
    container.appendChild(el);
    if (el.componentOnReady) {
        await el.componentOnReady();
    }
    return el;
};
const detachComponent = (delegate, element) => {
    if (element) {
        if (delegate) {
            const container = element.parentElement;
            return delegate.removeViewFromDom(container, element);
        }
        element.remove();
    }
    return Promise.resolve();
};

const deepReady = async (el) => {
    const element = el;
    if (element) {
        if (element.componentOnReady != null) {
            const stencilEl = await element.componentOnReady();
            if (stencilEl != null) {
                return;
            }
        }
        await Promise.all(Array.from(element.children).map(deepReady));
    }
};

/**
 * iOS Popover Enter Animation
 */
const iosEnterAnimation$2 = (AnimationC, baseEl, ev) => {
    let originY = 'top';
    let originX = 'left';
    const contentEl = baseEl.querySelector('.popover-content');
    const contentDimentions = contentEl.getBoundingClientRect();
    const contentWidth = contentDimentions.width;
    const contentHeight = contentDimentions.height;
    const bodyWidth = baseEl.ownerDocument.defaultView.innerWidth;
    const bodyHeight = baseEl.ownerDocument.defaultView.innerHeight;
    // If ev was passed, use that for target element
    const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
    const targetTop = targetDim != null && 'top' in targetDim ? targetDim.top : bodyHeight / 2 - contentHeight / 2;
    const targetLeft = targetDim != null && 'left' in targetDim ? targetDim.left : bodyWidth / 2;
    const targetWidth = (targetDim && targetDim.width) || 0;
    const targetHeight = (targetDim && targetDim.height) || 0;
    const arrowEl = baseEl.querySelector('.popover-arrow');
    const arrowDim = arrowEl.getBoundingClientRect();
    const arrowWidth = arrowDim.width;
    const arrowHeight = arrowDim.height;
    if (targetDim == null) {
        arrowEl.style.display = 'none';
    }
    const arrowCSS = {
        top: targetTop + targetHeight,
        left: targetLeft + targetWidth / 2 - arrowWidth / 2
    };
    const popoverCSS = {
        top: targetTop + targetHeight + (arrowHeight - 1),
        left: targetLeft + targetWidth / 2 - contentWidth / 2
    };
    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    //
    let checkSafeAreaLeft = false;
    let checkSafeAreaRight = false;
    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    // 25 is a random/arbitrary number. It seems to work fine for ios11
    // and iPhoneX. Is it perfect? No. Does it work? Yes.
    if (popoverCSS.left < POPOVER_IOS_BODY_PADDING + 25) {
        checkSafeAreaLeft = true;
        popoverCSS.left = POPOVER_IOS_BODY_PADDING;
    }
    else if (contentWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left + 25 > bodyWidth) {
        // Ok, so we're on the right side of the screen,
        // but now we need to make sure we're still a bit further right
        // cus....notchurally... Again, 25 is random. It works tho
        checkSafeAreaRight = true;
        popoverCSS.left = bodyWidth - contentWidth - POPOVER_IOS_BODY_PADDING;
        originX = 'right';
    }
    // make it pop up if there's room above
    if (targetTop + targetHeight + contentHeight > bodyHeight && targetTop - contentHeight > 0) {
        arrowCSS.top = targetTop - (arrowHeight + 1);
        popoverCSS.top = targetTop - contentHeight - (arrowHeight - 1);
        baseEl.className = baseEl.className + ' popover-bottom';
        originY = 'bottom';
        // If there isn't room for it to pop up above the target cut it off
    }
    else if (targetTop + targetHeight + contentHeight > bodyHeight) {
        contentEl.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
    }
    arrowEl.style.top = arrowCSS.top + 'px';
    arrowEl.style.left = arrowCSS.left + 'px';
    contentEl.style.top = popoverCSS.top + 'px';
    contentEl.style.left = popoverCSS.left + 'px';
    if (checkSafeAreaLeft) {
        contentEl.style.left = `calc(${popoverCSS.left}px + var(--ion-safe-area-left, 0px))`;
    }
    if (checkSafeAreaRight) {
        contentEl.style.left = `calc(${popoverCSS.left}px - var(--ion-safe-area-right, 0px))`;
    }
    contentEl.style.transformOrigin = originY + ' ' + originX;
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    backdropAnimation.fromTo('opacity', 0.01, 0.08);
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.01, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(100)
        .add(backdropAnimation)
        .add(wrapperAnimation));
};
const POPOVER_IOS_BODY_PADDING = 5;

/**
 * iOS Popover Leave Animation
 */
const iosLeaveAnimation$2 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.99, 0);
    backdropAnimation.fromTo('opacity', 0.08, 0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(500)
        .add(backdropAnimation)
        .add(wrapperAnimation));
};

/**
 * Md Popover Enter Animation
 */
const mdEnterAnimation$2 = (AnimationC, baseEl, ev) => {
    const doc = baseEl.ownerDocument;
    const isRTL = doc.dir === 'rtl';
    let originY = 'top';
    let originX = isRTL ? 'right' : 'left';
    const contentEl = baseEl.querySelector('.popover-content');
    const contentDimentions = contentEl.getBoundingClientRect();
    const contentWidth = contentDimentions.width;
    const contentHeight = contentDimentions.height;
    const bodyWidth = doc.defaultView.innerWidth;
    const bodyHeight = doc.defaultView.innerHeight;
    // If ev was passed, use that for target element
    const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
    // As per MD spec, by default position the popover below the target (trigger) element
    const targetTop = targetDim != null && 'bottom' in targetDim
        ? targetDim.bottom
        : bodyHeight / 2 - contentHeight / 2;
    const targetLeft = targetDim != null && 'left' in targetDim
        ? isRTL
            ? targetDim.left - contentWidth + targetDim.width
            : targetDim.left
        : bodyWidth / 2 - contentWidth / 2;
    const targetHeight = (targetDim && targetDim.height) || 0;
    const popoverCSS = {
        top: targetTop,
        left: targetLeft
    };
    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
        popoverCSS.left = POPOVER_MD_BODY_PADDING;
        // Same origin in this case for both LTR & RTL
        // Note: in LTR, originX is already 'left'
        originX = 'left';
    }
    else if (contentWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left >
        bodyWidth) {
        popoverCSS.left = bodyWidth - contentWidth - POPOVER_MD_BODY_PADDING;
        // Same origin in this case for both LTR & RTL
        // Note: in RTL, originX is already 'right'
        originX = 'right';
    }
    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (targetTop + targetHeight + contentHeight > bodyHeight &&
        targetTop - contentHeight > 0) {
        popoverCSS.top = targetTop - contentHeight - targetHeight;
        baseEl.className = baseEl.className + ' popover-bottom';
        originY = 'bottom';
        // If there isn't room for it to pop up above the target cut it off
    }
    else if (targetTop + targetHeight + contentHeight > bodyHeight) {
        contentEl.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
    }
    contentEl.style.top = popoverCSS.top + 'px';
    contentEl.style.left = popoverCSS.left + 'px';
    contentEl.style.transformOrigin = originY + ' ' + originX;
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    backdropAnimation.fromTo('opacity', 0.01, 0.32);
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.01, 1);
    const contentAnimation = new AnimationC();
    contentAnimation.addElement(baseEl.querySelector('.popover-content'));
    contentAnimation.fromTo('scale', 0.001, 1);
    const viewportAnimation = new AnimationC();
    viewportAnimation.addElement(baseEl.querySelector('.popover-viewport'));
    viewportAnimation.fromTo('opacity', 0.01, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(300)
        .add(backdropAnimation)
        .add(wrapperAnimation)
        .add(contentAnimation)
        .add(viewportAnimation));
};
const POPOVER_MD_BODY_PADDING = 12;

/**
 * Md Popover Leave Animation
 */
const mdLeaveAnimation$2 = (AnimationC, baseEl) => {
    const baseAnimation = new AnimationC();
    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.99, 0);
    backdropAnimation.fromTo('opacity', 0.32, 0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(500)
        .add(backdropAnimation)
        .add(wrapperAnimation));
};

class Popover {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.presented = false;
        /**
         * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
         */
        this.keyboardClose = true;
        /**
         * If `true`, the popover will be dismissed when the backdrop is clicked.
         */
        this.backdropDismiss = true;
        /**
         * If `true`, a backdrop will be displayed behind the popover.
         */
        this.showBackdrop = true;
        /**
         * If `true`, the popover will be translucent.
         */
        this.translucent = false;
        /**
         * If `true`, the popover will animate.
         */
        this.animated = true;
        this.didPresent = createEvent(this, "ionPopoverDidPresent", 7);
        this.willPresent = createEvent(this, "ionPopoverWillPresent", 7);
        this.willDismiss = createEvent(this, "ionPopoverWillDismiss", 7);
        this.didDismiss = createEvent(this, "ionPopoverDidDismiss", 7);
        this.config = getContext(this, "config");
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    onBackdropTap() {
        this.dismiss(undefined, BACKDROP);
    }
    lifecycle(modalEvent) {
        const el = this.usersElement;
        const name = LIFECYCLE_MAP[modalEvent.type];
        if (el && name) {
            const event = new CustomEvent(name, {
                bubbles: false,
                cancelable: false,
                detail: modalEvent.detail
            });
            el.dispatchEvent(event);
        }
    }
    /**
     * Present the popover overlay after it has been created.
     */
    async present() {
        if (this.presented) {
            return;
        }
        const container = this.el.querySelector('.popover-content');
        if (!container) {
            throw new Error('container is undefined');
        }
        const data = Object.assign(Object.assign({}, this.componentProps), { popover: this.el });
        this.usersElement = await attachComponent(this.delegate, container, this.component, ['popover-viewport', this.el['s-sc']], data);
        await deepReady(this.usersElement);
        return present(this, 'popoverEnter', iosEnterAnimation$2, mdEnterAnimation$2, this.event);
    }
    /**
     * Dismiss the popover overlay after it has been presented.
     */
    async dismiss(data, role) {
        const shouldDismiss = await dismiss(this, data, role, 'popoverLeave', iosLeaveAnimation$2, mdLeaveAnimation$2, this.event);
        if (shouldDismiss) {
            await detachComponent(this.delegate, this.usersElement);
        }
        return shouldDismiss;
    }
    /**
     * Returns a promise that resolves when the popover did dismiss.
     */
    onDidDismiss() {
        return eventMethod(this.el, 'ionPopoverDidDismiss');
    }
    /**
     * Returns a promise that resolves when the popover will dismiss.
     */
    onWillDismiss() {
        return eventMethod(this.el, 'ionPopoverWillDismiss');
    }
    hostData() {
        return {
            'aria-modal': 'true',
            'no-router': true,
            style: {
                zIndex: 20000 + this.overlayIndex,
            },
            class: Object.assign(Object.assign({}, getClassMap(this.cssClass)), { 'popover-translucent': this.translucent })
        };
    }
    __stencil_render() {
        return [
            h("ion-backdrop", { tappable: this.backdropDismiss, visible: this.showBackdrop }),
            h("div", { class: "popover-wrapper" }, h("div", { class: "popover-arrow" }), h("div", { class: "popover-content" }))
        ];
    }
    get el() { return getElement(this); }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "gic-popover",
        "$members$": {
            "delegate": [16],
            "overlayIndex": [2, "overlay-index"],
            "mode": [1],
            "enterAnimation": [16],
            "leaveAnimation": [16],
            "component": [1],
            "componentProps": [16],
            "keyboardClose": [4, "keyboard-close"],
            "cssClass": [1, "css-class"],
            "backdropDismiss": [4, "backdrop-dismiss"],
            "event": [8],
            "showBackdrop": [4, "show-backdrop"],
            "translucent": [4],
            "animated": [4],
            "present": [64],
            "dismiss": [64],
            "onDidDismiss": [64],
            "onWillDismiss": [64]
        },
        "$listeners$": [[0, "ionDismiss", "onDismiss"], [0, "ionBackdropTap", "onBackdropTap"], [0, "ionPopoverDidPresent", "lifecycle"], [0, "ionPopoverWillPresent", "lifecycle"], [0, "ionPopoverWillDismiss", "lifecycle"], [0, "ionPopoverDidDismiss", "lifecycle"]],
        "$lazyBundleIds$": {
            "ios": "-",
            "md": "-"
        },
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData(), this.__stencil_render()); }
}
const LIFECYCLE_MAP = {
    'ionPopoverDidPresent': 'ionViewDidEnter',
    'ionPopoverWillPresent': 'ionViewWillEnter',
    'ionPopoverWillDismiss': 'ionViewWillLeave',
    'ionPopoverDidDismiss': 'ionViewDidLeave',
};

class PopoverController {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.doc = getContext(this, "document");
    }
    /**
     * Create a popover overlay with popover options.
     */
    create(opts) {
        return createOverlay('gic-popover', opts);
    }
    /**
     * Dismiss the open popover overlay.
     */
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'gic-popover', id);
    }
    /**
     * Get the most recently opened popover overlay.
     */
    async getTop() {
        return getOverlay(this.doc, 'gic-popover');
    }
    static get cmpMeta() { return {
        "$flags$": 0,
        "$tagName$": "gic-popover-controller",
        "$members$": {
            "create": [64],
            "dismiss": [64],
            "getTop": [64]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

const hasShadowDom = (el) => {
    return !!el.shadowRoot && !!el.attachShadow;
};
const findItemLabel = (componentEl) => {
    const itemEl = componentEl.closest('ion-item');
    if (itemEl) {
        return itemEl.querySelector('ion-label');
    }
    return null;
};
const renderHiddenInput = (always, container, name, value, disabled) => {
    if (always || hasShadowDom(container)) {
        let input = container.querySelector('input.aux-input');
        if (!input) {
            input = container.ownerDocument.createElement('input');
            input.type = 'hidden';
            input.classList.add('aux-input');
            container.appendChild(input);
        }
        input.disabled = disabled;
        input.name = name;
        input.value = value || '';
    }
};

class Select {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.childOpts = [];
        this.inputId = `ion-sel-${selectIds++}`;
        this.didInit = false;
        this.isExpanded = false;
        /**
         * If `true`, the user cannot interact with the select.
         */
        this.disabled = false;
        /**
         * The text to display on the cancel button.
         */
        this.cancelText = 'Cancel';
        /**
         * The text to display on the ok button.
         */
        this.okText = 'OK';
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        /**
         * If `true`, the select can accept multiple values.
         */
        this.multiple = false;
        /**
         * The interface the select should use: `action-sheet`, `popover` or `alert`.
         */
        this.interface = 'alert';
        /**
         * Any additional options that the `alert`, `action-sheet` or `popover` interface
         * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
         * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
         * [PopoverController API docs](../../popover/PopoverController/#create) for the
         * create options for each interface.
         */
        this.interfaceOptions = {};
        /**
         * If `true`, the select will show a searchbar for radios and checkboxes
         */
        this.searchBar = true;
        /**
         * If `true`, the buttons list will be rendered in a virtual scroll
         */
        this.useVirtualScroll = true;
        this.onFocus = () => {
            this.ionFocus.emit();
        };
        this.onBlur = () => {
            this.ionBlur.emit();
        };
        this.ionChange = createEvent(this, "ionChange", 7);
        this.ionCancel = createEvent(this, "ionCancel", 7);
        this.ionFocus = createEvent(this, "ionFocus", 7);
        this.ionBlur = createEvent(this, "ionBlur", 7);
        this.ionStyle = createEvent(this, "ionStyle", 7);
        this.actionSheetCtrl = getConnect(this, "gic-action-sheet-controller");
        this.alertCtrl = getConnect(this, "gic-alert-controller");
        this.popoverCtrl = getConnect(this, "gic-popover-controller");
    }
    disabledChanged() {
        this.emitStyle();
    }
    valueChanged() {
        if (this.didInit) {
            this.updateOptions();
            this.ionChange.emit({
                value: this.value,
            });
            this.emitStyle();
        }
    }
    async selectOptionChanged() {
        await this.loadOptions();
        if (this.didInit) {
            this.updateOptions();
            this.updateOverlayOptions();
            this.emitStyle();
            /**
             * In the event that options
             * are not loaded at component load
             * this ensures that any value that is
             * set is properly rendered once
             * options have been loaded
             */
            if (this.value !== undefined) {
                this.el.forceUpdate();
            }
        }
    }
    onClick(ev) {
        this.setFocus();
        this.open(ev);
    }
    async componentDidLoad() {
        await this.loadOptions();
        if (this.value === undefined) {
            if (this.multiple) {
                // there are no values set at this point
                // so check to see who should be selected
                const checked = this.childOpts.filter(o => o.selected);
                this.value = checked.map(o => o.value);
            }
            else {
                const checked = this.childOpts.find(o => o.selected);
                if (checked) {
                    this.value = checked.value;
                }
            }
        }
        this.updateOptions();
        this.emitStyle();
        this.el.forceUpdate();
        this.didInit = true;
    }
    /**
     * Opens the select overlay, it could be an alert, action-sheet or popover,
     * based in `gic-select` settings.
     */
    async open(ev) {
        if (this.disabled || this.isExpanded) {
            return undefined;
        }
        const overlay = this.overlay = await this.createOverlay(ev);
        this.isExpanded = true;
        overlay.onDidDismiss().then(() => {
            this.overlay = undefined;
            this.isExpanded = false;
            this.setFocus();
        });
        await overlay.present();
        return overlay;
    }
    createOverlay(ev) {
        let selectInterface = this.interface;
        if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
            console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
            selectInterface = 'alert';
        }
        if (selectInterface === 'popover' && !ev) {
            console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
            selectInterface = 'alert';
        }
        if (selectInterface === 'popover') {
            return this.openPopover(ev);
        }
        if (selectInterface === 'action-sheet') {
            return this.openActionSheet();
        }
        return this.openAlert();
    }
    updateOverlayOptions() {
        if (!this.overlay) {
            return;
        }
        const overlay = this.overlay;
        switch (this.interface) {
            case 'action-sheet':
                overlay.buttons = this.createActionSheetButtons(this.childOpts);
                break;
            case 'popover':
                const popover = overlay.querySelector('gic-select-popover');
                if (popover) {
                    popover.options = this.createPopoverOptions(this.childOpts);
                }
                break;
            default:
                const inputType = (this.multiple ? 'checkbox' : 'radio');
                overlay.inputs = this.createAlertInputs(this.childOpts, inputType);
                break;
        }
    }
    createActionSheetButtons(data) {
        const actionSheetButtons = data.map(option => {
            return {
                role: (option.selected ? 'selected' : ''),
                text: option.textContent,
                handler: () => {
                    this.value = option.value;
                }
            };
        });
        // Add "cancel" button
        actionSheetButtons.push({
            text: this.cancelText,
            role: 'cancel',
            handler: () => {
                this.ionCancel.emit();
            }
        });
        return actionSheetButtons;
    }
    createAlertInputs(data, inputType) {
        return data.map(o => {
            return {
                type: inputType,
                label: o.textContent,
                value: o.value,
                checked: o.selected,
                disabled: o.disabled
            };
        });
    }
    createPopoverOptions(data) {
        return data.map(o => {
            return {
                text: o.textContent,
                value: o.value,
                checked: o.selected,
                disabled: o.disabled,
                handler: () => {
                    this.value = o.value;
                    this.close();
                }
            };
        });
    }
    async openPopover(ev) {
        const interfaceOptions = this.interfaceOptions;
        const popoverOpts = Object.assign(Object.assign({ mode: this.mode }, interfaceOptions), { component: 'gic-select-popover', cssClass: ['select-popover', interfaceOptions.cssClass], event: ev, componentProps: {
                header: interfaceOptions.header,
                subHeader: interfaceOptions.subHeader,
                message: interfaceOptions.message,
                value: this.value,
                searchBar: this.searchBar,
                useVirtualScroll: this.useVirtualScroll,
                options: this.createPopoverOptions(this.childOpts)
            } });
        return this.popoverCtrl.create(popoverOpts);
    }
    async openActionSheet() {
        const interfaceOptions = this.interfaceOptions;
        const actionSheetOpts = Object.assign(Object.assign({ mode: this.mode }, interfaceOptions), { searchBar: this.searchBar, useVirtualScroll: this.useVirtualScroll, buttons: this.createActionSheetButtons(this.childOpts), cssClass: ['select-action-sheet', interfaceOptions.cssClass] });
        return this.actionSheetCtrl.create(actionSheetOpts);
    }
    async openAlert() {
        const label = this.getLabel();
        const labelText = (label) ? label.textContent : null;
        const interfaceOptions = this.interfaceOptions;
        const inputType = (this.multiple ? 'checkbox' : 'radio');
        const alertOpts = Object.assign(Object.assign({ mode: this.mode }, interfaceOptions), { header: interfaceOptions.header ? interfaceOptions.header : labelText, inputs: this.createAlertInputs(this.childOpts, inputType), searchBar: this.searchBar, useVirtualScroll: this.useVirtualScroll, buttons: [
                {
                    text: this.cancelText,
                    role: 'cancel',
                    handler: () => {
                        this.ionCancel.emit();
                    }
                },
                {
                    text: this.okText,
                    handler: (selectedValues) => {
                        this.value = selectedValues;
                    }
                }
            ], cssClass: ['select-alert', interfaceOptions.cssClass,
                (this.multiple ? 'multiple-select-alert' : 'single-select-alert')] });
        return this.alertCtrl.create(alertOpts);
    }
    /**
     * Close the select interface.
     */
    close() {
        // TODO check !this.overlay || !this.isFocus()
        if (!this.overlay) {
            return Promise.resolve(false);
        }
        return this.overlay.dismiss();
    }
    async loadOptions() {
        this.childOpts = await Promise.all(Array.from(this.el.querySelectorAll('gic-select-option')).map(o => o.componentOnReady()));
    }
    updateOptions() {
        // iterate all options, updating the selected prop
        let canSelect = true;
        for (const selectOption of this.childOpts) {
            const selected = canSelect && isOptionSelected(this.value, selectOption.value, this.compareWith);
            selectOption.selected = selected;
            // if current option is selected and select is single-option, we can't select
            // any option more
            if (selected && !this.multiple) {
                canSelect = false;
            }
        }
    }
    getLabel() {
        return findItemLabel(this.el);
    }
    hasValue() {
        return this.getText() !== '';
    }
    getText() {
        const selectedText = this.selectedText;
        if (selectedText != null && selectedText !== '') {
            return selectedText;
        }
        return generateText(this.childOpts, this.value, this.compareWith);
    }
    setFocus() {
        if (this.buttonEl) {
            this.buttonEl.focus();
        }
    }
    emitStyle() {
        this.ionStyle.emit({
            'interactive': true,
            'select': true,
            'has-placeholder': this.placeholder != null,
            'has-value': this.hasValue(),
            'interactive-disabled': this.disabled,
            'select-disabled': this.disabled
        });
    }
    hostData() {
        const labelId = this.inputId + '-lbl';
        const label = findItemLabel(this.el);
        if (label) {
            label.id = labelId;
        }
        return {
            'role': 'combobox',
            'aria-disabled': this.disabled ? 'true' : null,
            'aria-expanded': `${this.isExpanded}`,
            'aria-haspopup': 'dialog',
            'aria-labelledby': labelId,
            class: {
                'in-item': hostContext('ion-item', this.el),
                'select-disabled': this.disabled,
            }
        };
    }
    __stencil_render() {
        renderHiddenInput(true, this.el, this.name, parseValue(this.value), this.disabled);
        const labelId = this.inputId + '-lbl';
        const label = findItemLabel(this.el);
        if (label) {
            label.id = labelId;
        }
        let addPlaceholderClass = false;
        let selectText = this.getText();
        if (selectText === '' && this.placeholder != null) {
            selectText = this.placeholder;
            addPlaceholderClass = true;
        }
        const selectTextClasses = {
            'select-text': true,
            'select-placeholder': addPlaceholderClass
        };
        return [
            h("div", { class: selectTextClasses }, selectText),
            h("div", { class: "select-icon", role: "presentation" }, h("div", { class: "select-icon-inner" })),
            h("button", { type: "button", onFocus: this.onFocus, onBlur: this.onBlur, disabled: this.disabled, ref: (el => this.buttonEl = el) })
        ];
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "disabled": ["disabledChanged"],
        "value": ["valueChanged"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "gic-select",
        "$members$": {
            "mode": [1],
            "disabled": [4],
            "cancelText": [1, "cancel-text"],
            "okText": [1, "ok-text"],
            "placeholder": [1],
            "name": [1],
            "selectedText": [1, "selected-text"],
            "multiple": [4],
            "interface": [1],
            "interfaceOptions": [8, "interface-options"],
            "compareWith": [1, "compare-with"],
            "searchBar": [4, "search-bar"],
            "useVirtualScroll": [4, "use-virtual-scroll"],
            "value": [1032],
            "isExpanded": [32],
            "open": [64]
        },
        "$listeners$": [[0, "ionSelectOptionDidLoad", "selectOptionChanged"], [0, "ionSelectOptionDidUnload", "selectOptionChanged"], [0, "click", "onClick"]],
        "$lazyBundleIds$": {
            "ios": "-",
            "md": "-"
        },
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData(), this.__stencil_render()); }
}
const parseValue = (value) => {
    if (value == null) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value.join(',');
    }
    return value.toString();
};
const isOptionSelected = (currentValue, compareValue, compareWith) => {
    if (currentValue === undefined) {
        return false;
    }
    if (Array.isArray(currentValue)) {
        return currentValue.some(val => compareOptions(val, compareValue, compareWith));
    }
    else {
        return compareOptions(currentValue, compareValue, compareWith);
    }
};
const compareOptions = (currentValue, compareValue, compareWith) => {
    if (typeof compareWith === 'function') {
        return compareWith(currentValue, compareValue);
    }
    else if (typeof compareWith === 'string') {
        return currentValue[compareWith] === compareValue[compareWith];
    }
    else {
        return currentValue === compareValue;
    }
};
const generateText = (opts, value, compareWith) => {
    if (value === undefined) {
        return '';
    }
    if (Array.isArray(value)) {
        return value
            .map(v => textForValue(opts, v, compareWith))
            .filter(opt => opt !== null)
            .join(', ');
    }
    else {
        return textForValue(opts, value, compareWith) || '';
    }
};
const textForValue = (opts, value, compareWith) => {
    const selectOpt = opts.find(opt => {
        return compareOptions(opt.value, value, compareWith);
    });
    return selectOpt
        ? selectOpt.textContent
        : null;
};
let selectIds = 0;

class SelectOption {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.optId = `gic-acopt-${autocompleteOptionIds++}`;
        this.ionAutocompleteOptionDidLoad = createEvent(this, "ionAutocompleteOptionDidLoad", 7);
        this.ionAutocompleteOptionDidUnload = createEvent(this, "ionAutocompleteOptionDidUnload", 7);
    }
    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.el.textContent || '';
        }
    }
    componentDidLoad() {
        this.ionAutocompleteOptionDidLoad.emit();
    }
    componentDidUnload() {
        this.ionAutocompleteOptionDidUnload.emit();
    }
    hostData() {
        return {
            'role': 'option',
            'id': this.optId
        };
    }
    get el() { return getElement(this); }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "gic-autocomplete-option",
        "$members$": {
            "value": [1032]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData()); }
}
let autocompleteOptionIds = 0;

class SelectOption$1 {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-selopt-${selectOptionIds++}`;
        /**
         * If `true`, the user cannot interact with the select option.
         */
        this.disabled = false;
        /**
         * If `true`, the element is selected.
         */
        this.selected = false;
        this.ionSelectOptionDidLoad = createEvent(this, "ionSelectOptionDidLoad", 7);
        this.ionSelectOptionDidUnload = createEvent(this, "ionSelectOptionDidUnload", 7);
    }
    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.el.textContent || '';
        }
    }
    componentDidLoad() {
        this.ionSelectOptionDidLoad.emit();
    }
    componentDidUnload() {
        this.ionSelectOptionDidUnload.emit();
    }
    hostData() {
        return {
            'role': 'option',
            'id': this.inputId
        };
    }
    get el() { return getElement(this); }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "gic-select-option",
        "$members$": {
            "disabled": [4],
            "selected": [4],
            "value": [1032]
        },
        "$listeners$": undefined,
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
    render() { return h(Host, this.hostData()); }
}
let selectOptionIds = 0;

/**
 * @internal
 */
class SelectPopover {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /** Array of options for the popover */
        this.options = [];
        /**
         * If `true`, the select popover will show a searchbar for radios and checkboxes
         */
        this.searchBar = false;
        /**
         * If `true`, the select popover will use a virtual scroll to render radios and checkboxes
         */
        this.useVirtualScroll = false;
        /**
         * The current search string
         */
        this.searchString = '';
        this.processedOptions = [];
        this.onSearchChange = (ev) => {
            const input = ev.target;
            if (input) {
                this.searchString = input.value || '';
            }
        };
        this.resetSearch = () => {
            this.searchString = '';
        };
    }
    onSelect(ev) {
        const option = this.options.find(o => o.value === ev.target.value);
        if (option && option.handler) {
            option.handler();
        }
    }
    optionsChanged() {
        const options = this.options;
        const search = (this.searchString || '').trim();
        const regex = new RegExp(search, 'i');
        this.processedOptions = search.length === 0
            ? options
            : options.filter(o => regex.test(o.text || ''));
    }
    componentWillLoad() {
        this.optionsChanged();
    }
    renderSearchBar() {
        if (!this.searchBar || this.options.length === 0) {
            return null;
        }
        const searchString = this.searchString || '';
        return (h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" }))));
    }
    renderRadioNode(el, cell) {
        const option = cell.value;
        if (el) {
            const label = el.querySelector('ion-label');
            label.textContent = `${option.text}`;
            const radio = el.querySelector('ion-radio');
            radio.setAttribute('value', `${option.value}`);
            if (option.checked) {
                radio.setAttribute('checked', 'checked');
            }
            else {
                radio.removeAttribute('checked');
            }
            if (option.disabled) {
                radio.setAttribute('disabled', 'disabled');
            }
            else {
                radio.removeAttribute('disabled');
            }
        }
        return el;
    }
    render() {
        const hydClass = 'sc-gic-alert-' + this.mode;
        const radioTemplate = ``
            + `<ion-item class="${hydClass}">`
            + `<ion-label class="${hydClass}"></ion-label>`
            + `<ion-radio class="${hydClass}"></ion-radio>`
            + `</ion-item>`;
        return (h("ion-list", null, this.header !== undefined && h("ion-list-header", null, this.header), (this.subHeader !== undefined || this.message !== undefined) &&
            h("ion-item", null, h("ion-label", { "text-wrap": true }, this.subHeader !== undefined && h("h3", null, this.subHeader), this.message !== undefined && h("p", null, this.message))), this.searchBar && this.renderSearchBar(), h("ion-radio-group", null, this.useVirtualScroll
            ?
                h("ion-content", { class: "select-popover-vs" }, h("ion-virtual-scroll", { items: this.processedOptions, nodeRender: (el, cell) => this.renderRadioNode(el, cell) }, h("template", { innerHTML: radioTemplate })))
            : this.processedOptions.map(option => h("ion-item", null, h("ion-label", null, option.text), h("ion-radio", { checked: option.checked, value: option.value, disabled: option.disabled }))))));
    }
    static get watchers() { return {
        "options": ["optionsChanged"],
        "searchString": ["optionsChanged"]
    }; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "gic-select-popover",
        "$members$": {
            "header": [1],
            "subHeader": [1, "sub-header"],
            "message": [1],
            "options": [1040],
            "searchBar": [4, "search-bar"],
            "useVirtualScroll": [4, "use-virtual-scroll"],
            "searchString": [1025, "search-string"]
        },
        "$listeners$": [[0, "ionSelect", "onSelect"]],
        "$lazyBundleIds$": "-",
        "$attrsToReflect$": []
    }; }
}

globals();
const cmps = [
  ActionSheet,
  ActionSheetController,
  Alert,
  AlertController,
  AutoComplete,
  AutocompletePopover,
  Popover,
  PopoverController,
  Select,
  SelectOption,
  SelectOption$1,
  SelectPopover,
];
registerComponents(cmps);
styles.set('sc-gic-action-sheet-ios','.sc-gic-action-sheet-ios-h{--color:initial;--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:100%;--max-height:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;font-family:var(--ion-font-family,inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-action-sheet-ios-h{display:none}.action-sheet-wrapper.sc-gic-action-sheet-ios{left:0;right:0;bottom:0;margin-top:auto;margin-bottom:auto;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}.action-sheet-button.sc-gic-action-sheet-ios{width:100%;border:0;outline:none;font-family:inherit}.action-sheet-button.activated.sc-gic-action-sheet-ios{background:var(--background-activated)}.action-sheet-button-inner.sc-gic-action-sheet-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.action-sheet-container.sc-gic-action-sheet-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:100%}.action-sheet-group.sc-gic-action-sheet-ios{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:scroll;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}.action-sheet-group.sc-gic-action-sheet-ios::-webkit-scrollbar{display:none}.action-sheet-group-cancel.sc-gic-action-sheet-ios{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-group-vs.sc-gic-action-sheet-ios{min-height:20%}.sc-gic-action-sheet-ios-h{--background:var(--ion-overlay-background-color,var(--ion-color-step-100,#f9f9f9));--background-selected:var(--ion-background-color,#fff);--background-activated:rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),0.08);text-align:center}.action-sheet-wrapper.sc-gic-action-sheet-ios{margin-left:auto;margin-right:auto;margin-top:var(--ion-safe-area-top,0);margin-bottom:var(--ion-safe-area-bottom,0)}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-wrapper.sc-gic-action-sheet-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.action-sheet-container.sc-gic-action-sheet-ios{padding-left:8px;padding-right:8px;padding-top:0;padding-bottom:0}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-container.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.action-sheet-group.sc-gic-action-sheet-ios{border-radius:13px;margin-bottom:8px;overflow:hidden}.action-sheet-group.sc-gic-action-sheet-ios:first-child{margin-top:10px}.action-sheet-group.sc-gic-action-sheet-ios:last-child{margin-bottom:10px}\@supports ((-webkit-backdrop-filter:blur(0)) or (backdrop-filter:blur(0))){.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-group.sc-gic-action-sheet-ios{background-color:transparent;-webkit-backdrop-filter:saturate(280%) blur(20px);backdrop-filter:saturate(280%) blur(20px)}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-button.sc-gic-action-sheet-ios, .action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-title.sc-gic-action-sheet-ios{background-color:transparent;background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(var(--ion-background-color-rgb,255,255,255),.8)),to(rgba(var(--ion-background-color-rgb,255,255,255),.8))),-webkit-gradient(linear,left bottom,left top,from(rgba(var(--ion-background-color-rgb,255,255,255),.4)),color-stop(50%,rgba(var(--ion-background-color-rgb,255,255,255),.4)),color-stop(50%,rgba(var(--ion-background-color-rgb,255,255,255),.8)));background-image:linear-gradient(0deg,rgba(var(--ion-background-color-rgb,255,255,255),.8),rgba(var(--ion-background-color-rgb,255,255,255),.8) 100%),linear-gradient(0deg,rgba(var(--ion-background-color-rgb,255,255,255),.4),rgba(var(--ion-background-color-rgb,255,255,255),.4) 50%,rgba(var(--ion-background-color-rgb,255,255,255),.8) 0);background-repeat:no-repeat;background-position:top,bottom;background-size:100% calc(100% - 1px),100% 1px;-webkit-backdrop-filter:saturate(120%);backdrop-filter:saturate(120%)}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-button.activated.sc-gic-action-sheet-ios{background-color:rgba(var(--ion-background-color-rgb,255,255,255),.7);background-image:none}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-cancel.sc-gic-action-sheet-ios{background:var(--background-selected)}}.action-sheet-button.sc-gic-action-sheet-ios, .action-sheet-title.sc-gic-action-sheet-ios{background-color:transparent;background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.08)),color-stop(50%,rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.08)),color-stop(50%,transparent));background-image:linear-gradient(0deg,rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.08),rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.08) 50%,transparent 0);background-repeat:no-repeat;background-position:bottom;background-size:100% 1px}.action-sheet-title.sc-gic-action-sheet-ios{padding-left:10px;padding-right:10px;padding-top:14px;padding-bottom:13px;color:var(--color,var(--ion-color-step-400,#999));font-size:13px;font-weight:400;text-align:center}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-title.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:10px;padding-inline-start:10px;-webkit-padding-end:10px;padding-inline-end:10px}}.action-sheet-sub-title.sc-gic-action-sheet-ios{padding-left:0;padding-right:0;padding-top:15px;padding-bottom:0;font-size:12px}.action-sheet-button.sc-gic-action-sheet-ios{padding-left:18px;padding-right:18px;padding-top:18px;padding-bottom:18px;height:56px;color:var(--color,var(--ion-color-primary,#3880ff));font-size:20px;contain:strict}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-button.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:18px;padding-inline-start:18px;-webkit-padding-end:18px;padding-inline-end:18px}}.action-sheet-button.sc-gic-action-sheet-ios .action-sheet-icon.sc-gic-action-sheet-ios{margin-right:.1em;font-size:28px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-button.sc-gic-action-sheet-ios .action-sheet-icon.sc-gic-action-sheet-ios{margin-right:unset;-webkit-margin-end:.1em;margin-inline-end:.1em}}.action-sheet-button.sc-gic-action-sheet-ios:last-child{background-image:none}.action-sheet-selected.sc-gic-action-sheet-ios{background:var(--background-selected);font-weight:700}.action-sheet-destructive.sc-gic-action-sheet-ios{color:var(--ion-color-danger,#f04141)}.action-sheet-cancel.sc-gic-action-sheet-ios{background:var(--background-selected);font-weight:600}.action-sheet-group-vs.sc-gic-action-sheet-ios{min-height:240px}');
styles.set('sc-gic-action-sheet-md','.sc-gic-action-sheet-md-h{--color:initial;--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:100%;--max-height:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;font-family:var(--ion-font-family,inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-action-sheet-md-h{display:none}.action-sheet-wrapper.sc-gic-action-sheet-md{left:0;right:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-wrapper.sc-gic-action-sheet-md{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.action-sheet-button.sc-gic-action-sheet-md{width:100%;border:0;outline:none;font-family:inherit}.action-sheet-button.activated.sc-gic-action-sheet-md{background:var(--background-activated)}.action-sheet-button-inner.sc-gic-action-sheet-md{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.action-sheet-container.sc-gic-action-sheet-md{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:100%}.action-sheet-group.sc-gic-action-sheet-md{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:scroll;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}.action-sheet-group.sc-gic-action-sheet-md::-webkit-scrollbar{display:none}.action-sheet-group-cancel.sc-gic-action-sheet-md{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-selected.sc-gic-action-sheet-md{background:var(--background-selected)}.action-sheet-group-vs.sc-gic-action-sheet-md{min-height:20%}.sc-gic-action-sheet-md-h{--background:var(--ion-overlay-background-color,var(--ion-background-color,#fff));--background-selected:var(--background,);--background-activated:var(--background)}.action-sheet-title.sc-gic-action-sheet-md{padding-left:16px;padding-right:16px;padding-top:20px;padding-bottom:17px;min-height:60px;color:var(--color,rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.54));font-size:16px;text-align:start}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-title.sc-gic-action-sheet-md{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.action-sheet-sub-title.sc-gic-action-sheet-md{padding-left:0;padding-right:0;padding-top:16px;padding-bottom:0;font-size:14px}.action-sheet-group.sc-gic-action-sheet-md:first-child{padding-top:0}.action-sheet-group.sc-gic-action-sheet-md:last-child{padding-bottom:0}.action-sheet-button.sc-gic-action-sheet-md{padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:0;position:relative;height:52px;background:transparent;color:var(--color,var(--ion-color-step-850,#262626));font-size:16px;text-align:start;contain:strict;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-button.sc-gic-action-sheet-md{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.action-sheet-icon.sc-gic-action-sheet-md{padding-bottom:4px;margin-left:0;margin-right:32px;margin-top:0;margin-bottom:0;color:var(--color,rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.54));font-size:24px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.action-sheet-icon.sc-gic-action-sheet-md{margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:32px;margin-inline-end:32px}}.action-sheet-button-inner.sc-gic-action-sheet-md{-ms-flex-pack:start;justify-content:flex-start}.action-sheet-selected.sc-gic-action-sheet-md{font-weight:700}.action-sheet-group-vs.sc-gic-action-sheet-md{min-height:240px}');
styles.set('sc-gic-alert-ios','.sc-gic-alert-ios-h{--min-width:250px;--width:auto;--min-height:auto;--height:auto;--max-height:90%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-family:var(--ion-font-family,inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-alert-ios-h{display:none}.alert-top.sc-gic-alert-ios-h{padding-top:50px;-ms-flex-align:start;align-items:flex-start}.alert-wrapper.sc-gic-alert-ios{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:content;opacity:0;z-index:10}.alert-title.sc-gic-alert-ios{margin-top:0}.alert-sub-title.sc-gic-alert-ios, .alert-title.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-sub-title.sc-gic-alert-ios{margin-top:5px;font-weight:400}.alert-message.sc-gic-alert-ios{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-overflow-scrolling:touch;overflow-y:scroll;overscroll-behavior-y:contain}.alert-checkbox-group.sc-gic-alert-ios::-webkit-scrollbar, .alert-message.sc-gic-alert-ios::-webkit-scrollbar, .alert-radio-group.sc-gic-alert-ios::-webkit-scrollbar{display:none}.alert-input.sc-gic-alert-ios{padding-left:0;padding-right:0;padding-top:10px;padding-bottom:10px;width:100%;border:0;background:inherit;font:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.alert-button-group.sc-gic-alert-ios{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;width:100%}.alert-button-group-vertical.sc-gic-alert-ios{-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:nowrap;flex-wrap:nowrap}.alert-button.sc-gic-alert-ios{display:block;border:0;font-size:14px;line-height:20px;z-index:0}.alert-button.ion-focused.sc-gic-alert-ios, .alert-tappable.ion-focused.sc-gic-alert-ios{background:var(--ion-color-step-100,#e6e6e6)}.alert-button-inner.sc-gic-alert-ios{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;height:100%}.alert-button-inner.sc-gic-alert-ios, .alert-tappable.sc-gic-alert-ios{display:-ms-flexbox;display:flex;width:100%}.alert-tappable.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;border:0;background:transparent;font-size:inherit;line-height:normal;text-align:start;-webkit-appearance:none;-moz-appearance:none;appearance:none;contain:strict}.alert-button.sc-gic-alert-ios, .alert-checkbox.sc-gic-alert-ios, .alert-input.sc-gic-alert-ios, .alert-radio.sc-gic-alert-ios{outline:none}.alert-checkbox-icon.sc-gic-alert-ios, .alert-checkbox-inner.sc-gic-alert-ios, .alert-radio-icon.sc-gic-alert-ios{-webkit-box-sizing:border-box;box-sizing:border-box}.alert-checkbox-group-vs.sc-gic-alert-ios{min-height:90%}.sc-gic-alert-ios-h{--background:var(--ion-overlay-background-color,var(--ion-color-step-100,#f9f9f9));--max-width:270px;font-size:14px}.alert-wrapper.sc-gic-alert-ios{border-radius:13px;-webkit-box-shadow:none;box-shadow:none;overflow:hidden}.alert-translucent.sc-gic-alert-ios-h .alert-wrapper.sc-gic-alert-ios{background:rgba(var(--ion-background-color-rgb,255,255,255),.9);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.alert-head.sc-gic-alert-ios{padding-left:16px;padding-right:16px;padding-top:12px;padding-bottom:7px;text-align:center}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-head.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.alert-title.sc-gic-alert-ios{margin-top:8px;color:var(--ion-text-color,#000);font-size:17px;font-weight:600}.alert-sub-title.sc-gic-alert-ios{color:var(--ion-color-step-600,#666);font-size:14px}.alert-input-group.sc-gic-alert-ios, .alert-message.sc-gic-alert-ios{padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:21px;color:var(--ion-text-color,#000);font-size:13px;text-align:center}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-input-group.sc-gic-alert-ios, .alert-message.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.alert-message.sc-gic-alert-ios{max-height:240px}.alert-message.sc-gic-alert-ios:empty{padding-left:0;padding-right:0;padding-top:0;padding-bottom:12px}.alert-input.sc-gic-alert-ios{border-radius:4px;margin-top:10px;padding-left:6px;padding-right:6px;padding-top:6px;padding-bottom:6px;border:.55px solid var(--ion-color-step-250,#bfbfbf);background-color:var(--ion-background-color,#fff);-webkit-appearance:none;-moz-appearance:none;appearance:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-input.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:6px;padding-inline-start:6px;-webkit-padding-end:6px;padding-inline-end:6px}}.alert-input.sc-gic-alert-ios::-webkit-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-moz-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios:-ms-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-ms-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-ms-clear{display:none}.alert-checkbox-group-vs.sc-gic-alert-ios, .alert-checkbox-group-vs.sc-gic-alert-ios ion-virtual-scroll.sc-gic-alert-ios{min-height:240px}.alert-checkbox-group.sc-gic-alert-ios, .alert-radio-group.sc-gic-alert-ios{-ms-scroll-chaining:none;overscroll-behavior:contain;max-height:240px;border-top:.55px solid rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.2);overflow-y:scroll;-webkit-overflow-scrolling:touch}.alert-tappable.sc-gic-alert-ios{height:44px}.alert-radio-label.sc-gic-alert-ios{padding-left:13px;padding-right:13px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;-ms-flex-order:0;order:0;color:var(--ion-text-color,#000);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-radio-label.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:13px;padding-inline-start:13px;-webkit-padding-end:13px;padding-inline-end:13px}}[aria-checked=true].sc-gic-alert-ios .alert-radio-label.sc-gic-alert-ios{color:var(--ion-color-primary,#3880ff)}.alert-radio-icon.sc-gic-alert-ios{position:relative;-ms-flex-order:1;order:1;min-width:30px}[aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios{left:7px;top:-7px;position:absolute;width:6px;height:12px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:2px;border-top-width:0;border-left-width:0;border-style:solid;border-color:var(--ion-color-primary,#3880ff)}[dir=rtl].sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios, [dir=rtl] .sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios, [dir=rtl].sc-gic-alert-ios [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios{left:unset;right:unset;right:7px}.alert-checkbox-label.sc-gic-alert-ios{padding-left:13px;padding-right:13px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-text-color,#000);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-checkbox-label.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:13px;padding-inline-start:13px;-webkit-padding-end:13px;padding-inline-end:13px}}.alert-checkbox-icon.sc-gic-alert-ios{border-radius:50%;margin-left:16px;margin-right:6px;margin-top:10px;margin-bottom:10px;position:relative;width:24px;height:24px;border-width:1px;border-style:solid;border-color:var(--ion-item-border-color,var(--ion-border-color,var(--ion-color-step-250,#c8c7cc)));background-color:var(--ion-item-background,var(--ion-background-color,#fff));contain:strict}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-checkbox-icon.sc-gic-alert-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:6px;margin-inline-end:6px}}[aria-checked=true].sc-gic-alert-ios .alert-checkbox-icon.sc-gic-alert-ios{border-color:var(--ion-color-primary,#3880ff);background-color:var(--ion-color-primary,#3880ff)}[aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios{left:9px;top:4px;position:absolute;width:5px;height:12px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:1px;border-top-width:0;border-left-width:0;border-style:solid;border-color:var(--ion-background-color,#fff)}[dir=rtl].sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios, [dir=rtl] .sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios, [dir=rtl].sc-gic-alert-ios [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios{left:unset;right:unset;right:9px}.alert-button-group.sc-gic-alert-ios{margin-right:-.55px;-ms-flex-wrap:wrap;flex-wrap:wrap}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-button-group.sc-gic-alert-ios{margin-right:unset;-webkit-margin-end:-.55px;margin-inline-end:-.55px}}.alert-button.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;border-radius:0;-ms-flex:1 1 auto;flex:1 1 auto;min-width:50%;height:44px;border-top:.55px solid rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.2);border-right:.55px solid rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.2);background-color:transparent;color:var(--ion-color-primary,#3880ff);font-size:17px;overflow:hidden}[dir=rtl].sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:first-child, [dir=rtl] .sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:first-child, [dir=rtl].sc-gic-alert-ios .alert-button.sc-gic-alert-ios:first-child{border-right:0}.alert-button.sc-gic-alert-ios:last-child{border-right:0;font-weight:700}[dir=rtl].sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:last-child, [dir=rtl] .sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:last-child, [dir=rtl].sc-gic-alert-ios .alert-button.sc-gic-alert-ios:last-child{border-right:.55px solid rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.2)}.alert-button.activated.sc-gic-alert-ios{background-color:rgba(var(--ion-text-color-rgb,var(--ion-text-color-rgb,0,0,0)),.1)}');
styles.set('sc-gic-alert-md','.sc-gic-alert-md-h{--min-width:250px;--width:auto;--min-height:auto;--height:auto;--max-height:90%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-family:var(--ion-font-family,inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-alert-md-h{display:none}.alert-top.sc-gic-alert-md-h{padding-top:50px;-ms-flex-align:start;align-items:flex-start}.alert-wrapper.sc-gic-alert-md{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:content;opacity:0;z-index:10}.alert-title.sc-gic-alert-md{margin-top:0}.alert-sub-title.sc-gic-alert-md, .alert-title.sc-gic-alert-md{margin-left:0;margin-right:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-sub-title.sc-gic-alert-md{margin-top:5px;font-weight:400}.alert-message.sc-gic-alert-md{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-overflow-scrolling:touch;overflow-y:scroll;overscroll-behavior-y:contain}.alert-checkbox-group.sc-gic-alert-md::-webkit-scrollbar, .alert-message.sc-gic-alert-md::-webkit-scrollbar, .alert-radio-group.sc-gic-alert-md::-webkit-scrollbar{display:none}.alert-input.sc-gic-alert-md{padding-left:0;padding-right:0;padding-top:10px;padding-bottom:10px;width:100%;border:0;background:inherit;font:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.alert-button-group.sc-gic-alert-md{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;width:100%}.alert-button-group-vertical.sc-gic-alert-md{-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:nowrap;flex-wrap:nowrap}.alert-button.sc-gic-alert-md{margin-right:0;display:block;border:0;font-size:14px;line-height:20px;z-index:0}.alert-button.ion-focused.sc-gic-alert-md, .alert-tappable.ion-focused.sc-gic-alert-md{background:var(--ion-color-step-100,#e6e6e6)}.alert-button-inner.sc-gic-alert-md{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;height:100%}.alert-button-inner.sc-gic-alert-md, .alert-tappable.sc-gic-alert-md{display:-ms-flexbox;display:flex;width:100%}.alert-tappable.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;border:0;background:transparent;font-size:inherit;line-height:normal;text-align:start;-webkit-appearance:none;-moz-appearance:none;appearance:none;contain:strict}.alert-button.sc-gic-alert-md, .alert-checkbox.sc-gic-alert-md, .alert-input.sc-gic-alert-md, .alert-radio.sc-gic-alert-md{outline:none}.alert-checkbox-icon.sc-gic-alert-md, .alert-checkbox-inner.sc-gic-alert-md, .alert-radio-icon.sc-gic-alert-md{-webkit-box-sizing:border-box;box-sizing:border-box}.alert-checkbox-group-vs.sc-gic-alert-md{min-height:90%}.sc-gic-alert-md-h{--background:var(--ion-overlay-background-color,var(--ion-background-color,#fff));--max-width:280px;font-size:14px}.alert-wrapper.sc-gic-alert-md{border-radius:4px;-webkit-box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)}.alert-head.sc-gic-alert-md{padding-left:23px;padding-right:23px;padding-top:20px;padding-bottom:15px;text-align:start}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-head.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:23px;padding-inline-start:23px;-webkit-padding-end:23px;padding-inline-end:23px}}.alert-title.sc-gic-alert-md{font-size:20px;font-weight:500}.alert-sub-title.sc-gic-alert-md, .alert-title.sc-gic-alert-md{color:var(--ion-text-color,#000)}.alert-sub-title.sc-gic-alert-md{font-size:16px}.alert-input-group.sc-gic-alert-md, .alert-message.sc-gic-alert-md{padding-left:24px;padding-right:24px;padding-top:20px;padding-bottom:20px;color:var(--ion-color-step-550,#737373)}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-input-group.sc-gic-alert-md, .alert-message.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:24px;padding-inline-end:24px}}.alert-message.sc-gic-alert-md{max-height:240px;font-size:16px}.alert-message.sc-gic-alert-md:empty{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-head.sc-gic-alert-md + .alert-message.sc-gic-alert-md{padding-top:0}.alert-input.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:5px;margin-bottom:5px;border-bottom:1px solid var(--ion-color-step-150,#d9d9d9);color:var(--ion-text-color,#000)}.alert-input.sc-gic-alert-md::-webkit-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-moz-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md:-ms-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-ms-input-placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::placeholder{color:var(--ion-placeholder-color,var(--ion-color-step-400,#999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-ms-clear{display:none}.alert-input.sc-gic-alert-md:focus{margin-bottom:4px;border-bottom:2px solid var(--ion-color-primary,#3880ff)}.alert-checkbox-group-vs.sc-gic-alert-md, .alert-checkbox-group-vs.sc-gic-alert-md ion-virtual-scroll.sc-gic-alert-md{min-height:240px}.alert-checkbox-group.sc-gic-alert-md, .alert-radio-group.sc-gic-alert-md{position:relative;max-height:240px;border-top:1px solid var(--ion-color-step-150,#d9d9d9);border-bottom:1px solid var(--ion-color-step-150,#d9d9d9);overflow:auto}.alert-tappable.sc-gic-alert-md{position:relative;height:48px;overflow:hidden}.alert-radio-label.sc-gic-alert-md{padding-left:52px;padding-right:26px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-color-step-850,#262626);font-size:16px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-radio-label.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:52px;padding-inline-start:52px;-webkit-padding-end:26px;padding-inline-end:26px}}.alert-radio-icon.sc-gic-alert-md{left:26px;top:0;border-radius:50%;display:block;position:relative;width:20px;height:20px;border-width:2px;border-style:solid;border-color:var(--ion-color-step-550,#737373)}[dir=rtl].sc-gic-alert-md-h .alert-radio-icon.sc-gic-alert-md, [dir=rtl] .sc-gic-alert-md-h .alert-radio-icon.sc-gic-alert-md, [dir=rtl].sc-gic-alert-md .alert-radio-icon.sc-gic-alert-md{left:unset;right:unset;right:26px}.alert-radio-inner.sc-gic-alert-md{left:3px;top:3px;border-radius:50%;position:absolute;width:10px;height:10px;-webkit-transform:scale3d(0,0,0);transform:scale3d(0,0,0);-webkit-transition:-webkit-transform .28s cubic-bezier(.4,0,.2,1);transition:-webkit-transform .28s cubic-bezier(.4,0,.2,1);transition:transform .28s cubic-bezier(.4,0,.2,1);transition:transform .28s cubic-bezier(.4,0,.2,1),-webkit-transform .28s cubic-bezier(.4,0,.2,1);background-color:var(--ion-color-primary,#3880ff)}[dir=rtl].sc-gic-alert-md-h .alert-radio-inner.sc-gic-alert-md, [dir=rtl] .sc-gic-alert-md-h .alert-radio-inner.sc-gic-alert-md, [dir=rtl].sc-gic-alert-md .alert-radio-inner.sc-gic-alert-md{left:unset;right:unset;right:3px}[aria-checked=true].sc-gic-alert-md .alert-radio-label.sc-gic-alert-md{color:var(--ion-color-step-850,#262626)}[aria-checked=true].sc-gic-alert-md .alert-radio-icon.sc-gic-alert-md{border-color:var(--ion-color-primary,#3880ff)}[aria-checked=true].sc-gic-alert-md .alert-radio-inner.sc-gic-alert-md{-webkit-transform:scaleX(1);transform:scaleX(1)}.alert-checkbox-label.sc-gic-alert-md{padding-left:53px;padding-right:26px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-color-step-850,#262626);font-size:16px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-checkbox-label.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:53px;padding-inline-start:53px;-webkit-padding-end:26px;padding-inline-end:26px}}.alert-checkbox-icon.sc-gic-alert-md{left:26px;top:0;border-radius:2px;position:relative;width:16px;height:16px;border-width:2px;border-style:solid;border-color:var(--ion-color-step-550,#737373);contain:strict}[dir=rtl].sc-gic-alert-md-h .alert-checkbox-icon.sc-gic-alert-md, [dir=rtl] .sc-gic-alert-md-h .alert-checkbox-icon.sc-gic-alert-md, [dir=rtl].sc-gic-alert-md .alert-checkbox-icon.sc-gic-alert-md{left:unset;right:unset;right:26px}[aria-checked=true].sc-gic-alert-md .alert-checkbox-icon.sc-gic-alert-md{border-color:var(--ion-color-primary,#3880ff);background-color:var(--ion-color-primary,#3880ff)}[aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md{left:3px;top:0;position:absolute;width:6px;height:10px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:2px;border-top-width:0;border-left-width:0;border-style:solid;border-color:var(--ion-color-primary-contrast,#fff)}[dir=rtl].sc-gic-alert-md-h [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md, [dir=rtl] .sc-gic-alert-md-h [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md, [dir=rtl].sc-gic-alert-md [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md{left:unset;right:unset;right:3px}.alert-button-group.sc-gic-alert-md{padding-left:8px;padding-right:8px;padding-top:8px;padding-bottom:8px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse;-ms-flex-pack:end;justify-content:flex-end}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-button-group.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.alert-button.sc-gic-alert-md{border-radius:2px;margin-left:0;margin-right:8px;margin-top:0;margin-bottom:0;padding-left:10px;padding-right:10px;padding-top:10px;padding-bottom:10px;position:relative;background-color:transparent;color:var(--ion-color-primary,#3880ff);font-weight:500;text-align:end;text-transform:uppercase;overflow:hidden}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.alert-button.sc-gic-alert-md{margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:8px;margin-inline-end:8px;padding-left:unset;padding-right:unset;-webkit-padding-start:10px;padding-inline-start:10px;-webkit-padding-end:10px;padding-inline-end:10px}}.alert-button-inner.sc-gic-alert-md{-ms-flex-pack:end;justify-content:flex-end}');
styles.set('sc-gic-autocomplete-ios','');
styles.set('sc-gic-autocomplete-md','');
styles.set('sc-gic-autocomplete-popover','.sc-gic-autocomplete-popover-h ion-list.sc-gic-autocomplete-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-gic-autocomplete-popover-h ion-label.sc-gic-autocomplete-popover, .sc-gic-autocomplete-popover-h ion-list-header.sc-gic-autocomplete-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}');
styles.set('sc-gic-popover-ios','.sc-gic-popover-ios-h{--background:var(--ion-background-color,#fff);--min-width:0;--min-height:0;--max-width:auto;--height:auto;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;color:var(--ion-text-color,#000);z-index:1001}.overlay-hidden.sc-gic-popover-ios-h{display:none}.popover-wrapper.sc-gic-popover-ios{opacity:0;z-index:10}.popover-content.sc-gic-popover-ios{display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:auto;z-index:10}.popover-viewport.sc-gic-popover-ios{--ion-safe-area-top:0px;--ion-safe-area-right:0px;--ion-safe-area-bottom:0px;--ion-safe-area-left:0px}.sc-gic-popover-ios-h{--width:200px;--max-height:90%;--box-shadow:none}.popover-content.sc-gic-popover-ios{border-radius:10px}.popover-arrow.sc-gic-popover-ios{display:block;position:absolute;width:20px;height:10px;overflow:hidden}.popover-arrow.sc-gic-popover-ios:after{left:3px;top:3px;border-radius:3px;position:absolute;width:14px;height:14px;-webkit-transform:rotate(45deg);transform:rotate(45deg);background:var(--background);content:\"\";z-index:10}[dir=rtl].sc-gic-popover-ios-h .popover-arrow.sc-gic-popover-ios:after, [dir=rtl] .sc-gic-popover-ios-h .popover-arrow.sc-gic-popover-ios:after, [dir=rtl].sc-gic-popover-ios .popover-arrow.sc-gic-popover-ios:after{left:unset;right:unset;right:3px}.popover-bottom.sc-gic-popover-ios-h .popover-arrow.sc-gic-popover-ios{top:auto;bottom:-10px}.popover-bottom.sc-gic-popover-ios-h .popover-arrow.sc-gic-popover-ios:after{top:-6px}.popover-translucent.sc-gic-popover-ios-h .popover-arrow.sc-gic-popover-ios:after, .popover-translucent.sc-gic-popover-ios-h .popover-content.sc-gic-popover-ios{background:rgba(var(--ion-background-color-rgb,255,255,255),.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}');
styles.set('sc-gic-popover-md','.sc-gic-popover-md-h{--background:var(--ion-background-color,#fff);--min-width:0;--min-height:0;--max-width:auto;--height:auto;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;color:var(--ion-text-color,#000);z-index:1001}.overlay-hidden.sc-gic-popover-md-h{display:none}.popover-wrapper.sc-gic-popover-md{opacity:0;z-index:10}.popover-content.sc-gic-popover-md{display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:auto;z-index:10}.popover-viewport.sc-gic-popover-md{--ion-safe-area-top:0px;--ion-safe-area-right:0px;--ion-safe-area-bottom:0px;--ion-safe-area-left:0px}.sc-gic-popover-md-h{--width:250px;--max-height:90%;--box-shadow:0 5px 5px -3px rgba(0,0,0,0.2),0 8px 10px 1px rgba(0,0,0,0.14),0 3px 14px 2px rgba(0,0,0,0.12)}.popover-content.sc-gic-popover-md{border-radius:4px;-webkit-transform-origin:left top;transform-origin:left top}[dir=rtl].sc-gic-popover-md-h .popover-content.sc-gic-popover-md, [dir=rtl] .sc-gic-popover-md-h .popover-content.sc-gic-popover-md, [dir=rtl].sc-gic-popover-md .popover-content.sc-gic-popover-md{-webkit-transform-origin:right top;transform-origin:right top}.popover-viewport.sc-gic-popover-md{-webkit-transition-delay:.1s;transition-delay:.1s}');
styles.set('sc-gic-select-ios','/*!\@:host*/.sc-gic-select-ios-h{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;font-family:var(--ion-font-family,inherit);overflow:hidden;z-index:2}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){/*!\@:host*/.sc-gic-select-ios-h{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}/*!\@:host(.in-item)*/.in-item.sc-gic-select-ios-h{position:static;max-width:45%}/*!\@:host(.select-disabled)*/.select-disabled.sc-gic-select-ios-h{opacity:.4;pointer-events:none}/*!\@:host(.ion-focused) button*/.ion-focused.sc-gic-select-ios-h button.sc-gic-select-ios{border:2px solid #5e9ed6}/*!\@.select-placeholder*/.select-placeholder.sc-gic-select-ios{color:currentColor;opacity:.33}/*!\@button*/button.sc-gic-select-ios{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}/*!\@:host-context([dir=rtl]) button,[dir=rtl] button*/[dir=rtl].sc-gic-select-ios-h button.sc-gic-select-ios, [dir=rtl] .sc-gic-select-ios-h button.sc-gic-select-ios, [dir=rtl].sc-gic-select-ios button.sc-gic-select-ios{left:unset;right:unset;right:0}/*!\@button::-moz-focus-inner*/button.sc-gic-select-ios::-moz-focus-inner{border:0}/*!\@.select-icon*/.select-icon.sc-gic-select-ios{position:relative}/*!\@.select-text*/.select-text.sc-gic-select-ios{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}/*!\@.select-icon-inner*/.select-icon-inner.sc-gic-select-ios{left:5px;top:50%;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:.33;pointer-events:none}/*!\@:host-context([dir=rtl]) .select-icon-inner,[dir=rtl] .select-icon-inner*/[dir=rtl].sc-gic-select-ios-h .select-icon-inner.sc-gic-select-ios, [dir=rtl] .sc-gic-select-ios-h .select-icon-inner.sc-gic-select-ios, [dir=rtl].sc-gic-select-ios .select-icon-inner.sc-gic-select-ios{left:unset;right:unset;right:5px}/*!\@:host*/.sc-gic-select-ios-h{--padding-top:10px;--padding-end:8px;--padding-bottom:10px;--padding-start:16px}/*!\@.select-icon*/.select-icon.sc-gic-select-ios{width:12px;height:18px}');
styles.set('sc-gic-select-md','/*!\@:host*/.sc-gic-select-md-h{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;font-family:var(--ion-font-family,inherit);overflow:hidden;z-index:2}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){/*!\@:host*/.sc-gic-select-md-h{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}/*!\@:host(.in-item)*/.in-item.sc-gic-select-md-h{position:static;max-width:45%}/*!\@:host(.select-disabled)*/.select-disabled.sc-gic-select-md-h{opacity:.4;pointer-events:none}/*!\@:host(.ion-focused) button*/.ion-focused.sc-gic-select-md-h button.sc-gic-select-md{border:2px solid #5e9ed6}/*!\@.select-placeholder*/.select-placeholder.sc-gic-select-md{color:currentColor;opacity:.33}/*!\@button*/button.sc-gic-select-md{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}/*!\@:host-context([dir=rtl]) button,[dir=rtl] button*/[dir=rtl].sc-gic-select-md-h button.sc-gic-select-md, [dir=rtl] .sc-gic-select-md-h button.sc-gic-select-md, [dir=rtl].sc-gic-select-md button.sc-gic-select-md{left:unset;right:unset;right:0}/*!\@button::-moz-focus-inner*/button.sc-gic-select-md::-moz-focus-inner{border:0}/*!\@.select-icon*/.select-icon.sc-gic-select-md{position:relative}/*!\@.select-text*/.select-text.sc-gic-select-md{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}/*!\@.select-icon-inner*/.select-icon-inner.sc-gic-select-md{left:5px;top:50%;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:.33;pointer-events:none}/*!\@:host-context([dir=rtl]) .select-icon-inner,[dir=rtl] .select-icon-inner*/[dir=rtl].sc-gic-select-md-h .select-icon-inner.sc-gic-select-md, [dir=rtl] .sc-gic-select-md-h .select-icon-inner.sc-gic-select-md, [dir=rtl].sc-gic-select-md .select-icon-inner.sc-gic-select-md{left:unset;right:unset;right:5px}/*!\@:host*/.sc-gic-select-md-h{--padding-top:10px;--padding-end:0;--padding-bottom:11px;--padding-start:16px}/*!\@.select-icon*/.select-icon.sc-gic-select-md{width:19px;height:19px}');
styles.set('sc-gic-autocomplete-option','');
styles.set('sc-gic-select-option','/*!\@:host*/.sc-gic-select-option-h{display:none}');
styles.set('sc-gic-select-popover','.sc-gic-select-popover-h ion-list.sc-gic-select-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-gic-select-popover-h ion-label.sc-gic-select-popover, .sc-gic-select-popover-h ion-list-header.sc-gic-select-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.select-popover-vs.sc-gic-select-popover, .select-popover-vs.sc-gic-select-popover ion-virtual-scroll.sc-gic-select-popover{min-height:240px}');

const transitionEnd = (el, callback) => {
    let unRegTrans;
    const opts = { passive: true };
    const unregister = () => {
        if (unRegTrans) {
            unRegTrans();
        }
    };
    const onTransitionEnd = (ev) => {
        if (el === ev.target) {
            unregister();
            callback(ev);
        }
    };
    if (el) {
        el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
        el.addEventListener('transitionend', onTransitionEnd, opts);
        unRegTrans = () => {
            el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
            el.removeEventListener('transitionend', onTransitionEnd, opts);
        };
    }
    return unregister;
};

const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
const DURATION_MIN = 32;
const TRANSITION_END_FALLBACK_PADDING_MS = 400;
const TRANSFORM_PROPS = {
    'translateX': 1,
    'translateY': 1,
    'translateZ': 1,
    'scale': 1,
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'rotate': 1,
    'rotateX': 1,
    'rotateY': 1,
    'rotateZ': 1,
    'skewX': 1,
    'skewY': 1,
    'perspective': 1
};
const win$1 = typeof window !== 'undefined' ? window : {};
const raf = win$1.requestAnimationFrame
    ? win$1.requestAnimationFrame.bind(win$1)
    : (f) => f(Date.now());
class Animator {
    constructor() {
        this._hasDur = false;
        this._hasTweenEffect = false;
        this._isAsync = false;
        this._isReverse = false;
        this._destroyed = false;
        this.hasChildren = false;
        this.isPlaying = false;
        this.hasCompleted = false;
    }
    addElement(el) {
        if (el != null) {
            if (el.length > 0) {
                for (let i = 0; i < el.length; i++) {
                    this._addEl(el[i]);
                }
            }
            else {
                this._addEl(el);
            }
        }
        return this;
    }
    /**
     * NO DOM
     */
    _addEl(el) {
        if (el.nodeType === 1) {
            (this._elements = this._elements || []).push(el);
        }
    }
    /**
     * Add a child animation to this animation.
     */
    add(childAnimation) {
        childAnimation.parent = this;
        this.hasChildren = true;
        (this._childAnimations = this._childAnimations || []).push(childAnimation);
        return this;
    }
    /**
     * Get the duration of this animation. If this animation does
     * not have a duration, then it'll get the duration from its parent.
     */
    getDuration(opts) {
        if (opts && opts.duration !== undefined) {
            return opts.duration;
        }
        else if (this._duration !== undefined) {
            return this._duration;
        }
        else if (this.parent) {
            return this.parent.getDuration();
        }
        return 0;
    }
    /**
     * Returns if the animation is a root one.
     */
    isRoot() {
        return !this.parent;
    }
    /**
     * Set the duration for this animation.
     */
    duration(milliseconds) {
        this._duration = milliseconds;
        return this;
    }
    /**
     * Get the easing of this animation. If this animation does
     * not have an easing, then it'll get the easing from its parent.
     */
    getEasing() {
        if (this._isReverse && this._reversedEasingName !== undefined) {
            return this._reversedEasingName;
        }
        return this._easingName !== undefined ? this._easingName : (this.parent && this.parent.getEasing()) || null;
    }
    /**
     * Set the easing for this animation.
     */
    easing(name) {
        this._easingName = name;
        return this;
    }
    /**
     * Set the easing for this reversed animation.
     */
    easingReverse(name) {
        this._reversedEasingName = name;
        return this;
    }
    /**
     * Add the "from" value for a specific property.
     */
    from(prop, val) {
        this._addProp('from', prop, val);
        return this;
    }
    /**
     * Add the "to" value for a specific property.
     */
    to(prop, val, clearProperyAfterTransition = false) {
        const fx = this._addProp('to', prop, val);
        if (clearProperyAfterTransition) {
            // if this effect is a transform then clear the transform effect
            // otherwise just clear the actual property
            this.afterClearStyles(fx.trans ? ['transform', '-webkit-transform'] : [prop]);
        }
        return this;
    }
    /**
     * Shortcut to add both the "from" and "to" for the same property.
     */
    fromTo(prop, fromVal, toVal, clearProperyAfterTransition) {
        return this.from(prop, fromVal).to(prop, toVal, clearProperyAfterTransition);
    }
    /**
     * NO DOM
     */
    _getProp(name) {
        if (this._fxProperties) {
            return this._fxProperties.find(prop => prop.effectName === name);
        }
        return undefined;
    }
    _addProp(state, prop, val) {
        let fxProp = this._getProp(prop);
        if (!fxProp) {
            // first time we've see this EffectProperty
            const shouldTrans = (TRANSFORM_PROPS[prop] === 1);
            fxProp = {
                effectName: prop,
                trans: shouldTrans,
                // add the will-change property for transforms or opacity
                wc: (shouldTrans ? 'transform' : prop)
            };
            (this._fxProperties = this._fxProperties || []).push(fxProp);
        }
        // add from/to EffectState to the EffectProperty
        const fxState = {
            val,
            num: 0,
            effectUnit: '',
        };
        fxProp[state] = fxState;
        if (typeof val === 'string' && val.indexOf(' ') < 0) {
            const r = val.match(CSS_VALUE_REGEX);
            if (r) {
                const num = parseFloat(r[1]);
                if (!isNaN(num)) {
                    fxState.num = num;
                }
                fxState.effectUnit = (r[0] !== r[2] ? r[2] : '');
            }
        }
        else if (typeof val === 'number') {
            fxState.num = val;
        }
        return fxProp;
    }
    /**
     * Add CSS class to this animation's elements
     * before the animation begins.
     */
    beforeAddClass(className) {
        (this._beforeAddClasses = this._beforeAddClasses || []).push(className);
        return this;
    }
    /**
     * Remove CSS class from this animation's elements
     * before the animation begins.
     */
    beforeRemoveClass(className) {
        (this._beforeRemoveClasses = this._beforeRemoveClasses || []).push(className);
        return this;
    }
    /**
     * Set CSS inline styles to this animation's elements
     * before the animation begins.
     */
    beforeStyles(styles) {
        this._beforeStyles = styles;
        return this;
    }
    /**
     * Clear CSS inline styles from this animation's elements
     * before the animation begins.
     */
    beforeClearStyles(propertyNames) {
        this._beforeStyles = this._beforeStyles || {};
        for (const prop of propertyNames) {
            this._beforeStyles[prop] = '';
        }
        return this;
    }
    /**
     * Add a function which contains DOM reads, which will run
     * before the animation begins.
     */
    beforeAddRead(domReadFn) {
        (this._readCallbacks = this._readCallbacks || []).push(domReadFn);
        return this;
    }
    /**
     * Add a function which contains DOM writes, which will run
     * before the animation begins.
     */
    beforeAddWrite(domWriteFn) {
        (this._writeCallbacks = this._writeCallbacks || []).push(domWriteFn);
        return this;
    }
    /**
     * Add CSS class to this animation's elements
     * after the animation finishes.
     */
    afterAddClass(className) {
        (this._afterAddClasses = this._afterAddClasses || []).push(className);
        return this;
    }
    /**
     * Remove CSS class from this animation's elements
     * after the animation finishes.
     */
    afterRemoveClass(className) {
        (this._afterRemoveClasses = this._afterRemoveClasses || []).push(className);
        return this;
    }
    /**
     * Set CSS inline styles to this animation's elements
     * after the animation finishes.
     */
    afterStyles(styles) {
        this._afterStyles = styles;
        return this;
    }
    /**
     * Clear CSS inline styles from this animation's elements
     * after the animation finishes.
     */
    afterClearStyles(propertyNames) {
        this._afterStyles = this._afterStyles || {};
        for (const prop of propertyNames) {
            this._afterStyles[prop] = '';
        }
        return this;
    }
    /**
     * Play the animation.
     */
    play(opts) {
        // If the animation was already invalidated (it did finish), do nothing
        if (this._destroyed) {
            return;
        }
        // this is the top level animation and is in full control
        // of when the async play() should actually kick off
        // if there is no duration then it'll set the TO property immediately
        // if there is a duration, then it'll stage all animations at the
        // FROM property and transition duration, wait a few frames, then
        // kick off the animation by setting the TO property for each animation
        this._isAsync = this._hasDuration(opts);
        // ensure all past transition end events have been cleared
        this._clearAsync();
        // recursively kicks off the correct progress step for each child animation
        // ******** DOM WRITE ****************
        this._playInit(opts);
        // doubling up RAFs since this animation was probably triggered
        // from an input event, and just having one RAF would have this code
        // run within the same frame as the triggering input event, and the
        // input event probably already did way too much work for one frame
        raf(() => {
            raf(() => {
                this._playDomInspect(opts);
            });
        });
    }
    playAsync(opts) {
        return new Promise(resolve => {
            this.onFinish(resolve, { oneTimeCallback: true, clearExistingCallbacks: true });
            this.play(opts);
            return this;
        });
    }
    playSync() {
        // If the animation was already invalidated (it did finish), do nothing
        if (!this._destroyed) {
            const opts = { duration: 0 };
            this._isAsync = false;
            this._clearAsync();
            this._playInit(opts);
            this._playDomInspect(opts);
        }
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _playInit(opts) {
        // always default that an animation does not tween
        // a tween requires that an Animation class has an element
        // and that it has at least one FROM/TO effect
        // and that the FROM/TO effect can tween numeric values
        this._hasTweenEffect = false;
        this.isPlaying = true;
        this.hasCompleted = false;
        this._hasDur = (this.getDuration(opts) > DURATION_MIN);
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._playInit(opts);
            }
        }
        if (this._hasDur) {
            // if there is a duration then we want to start at step 0
            // ******** DOM WRITE ****************
            this._progress(0);
            // add the will-change properties
            // ******** DOM WRITE ****************
            this._willChange(true);
        }
    }
    /**
     * DOM WRITE
     * NO RECURSION
     * ROOT ANIMATION
     */
    _playDomInspect(opts) {
        // fire off all the "before" function that have DOM READS in them
        // elements will be in the DOM, however visibily hidden
        // so we can read their dimensions if need be
        // ******** DOM READ ****************
        // ******** DOM WRITE ****************
        this._beforeAnimation();
        // for the root animation only
        // set the async TRANSITION END event
        // and run onFinishes when the transition ends
        const dur = this.getDuration(opts);
        if (this._isAsync) {
            this._asyncEnd(dur, true);
        }
        // ******** DOM WRITE ****************
        this._playProgress(opts);
        if (this._isAsync && !this._destroyed) {
            // this animation has a duration so we need another RAF
            // for the CSS TRANSITION properties to kick in
            raf(() => {
                this._playToStep(1);
            });
        }
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _playProgress(opts) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._playProgress(opts);
            }
        }
        if (this._hasDur) {
            // set the CSS TRANSITION duration/easing
            // ******** DOM WRITE ****************
            this._setTrans(this.getDuration(opts), false);
        }
        else {
            // this animation does not have a duration, so it should not animate
            // just go straight to the TO properties and call it done
            // ******** DOM WRITE ****************
            this._progress(1);
            // since there was no animation, immediately run the after
            // ******** DOM WRITE ****************
            this._setAfterStyles();
            // this animation has no duration, so it has finished
            // other animations could still be running
            this._didFinish(true);
        }
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _playToStep(stepValue) {
        if (!this._destroyed) {
            const children = this._childAnimations;
            if (children) {
                for (const child of children) {
                    // ******** DOM WRITE ****************
                    child._playToStep(stepValue);
                }
            }
            if (this._hasDur) {
                // browser had some time to render everything in place
                // and the transition duration/easing is set
                // now set the TO properties which will trigger the transition to begin
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
        }
    }
    /**
     * DOM WRITE
     * NO RECURSION
     * ROOT ANIMATION
     */
    _asyncEnd(dur, shouldComplete) {
        const self = this;
        const onTransitionEnd = () => {
            // congrats! a successful transition completed!
            // ensure transition end events and timeouts have been cleared
            self._clearAsync();
            // ******** DOM WRITE ****************
            self._playEnd();
            // transition finished
            self._didFinishAll(shouldComplete, true, false);
        };
        const onTransitionFallback = () => {
            // oh noz! the transition end event didn't fire in time!
            // instead the fallback timer when first
            // if all goes well this fallback should never fire
            // clear the other async end events from firing
            self._timerId = undefined;
            self._clearAsync();
            // set the after styles
            // ******** DOM WRITE ****************
            self._playEnd(shouldComplete ? 1 : 0);
            // transition finished
            self._didFinishAll(shouldComplete, true, false);
        };
        // set the TRANSITION END event on one of the transition elements
        self._unregisterTrnsEnd = transitionEnd(self._transEl(), onTransitionEnd);
        // set a fallback timeout if the transition end event never fires, or is too slow
        // transition end fallback: (animation duration + XXms)
        self._timerId = setTimeout(onTransitionFallback, (dur + TRANSITION_END_FALLBACK_PADDING_MS));
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _playEnd(stepValue) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._playEnd(stepValue);
            }
        }
        if (this._hasDur) {
            if (stepValue !== undefined) {
                // too late to have a smooth animation, just finish it
                // ******** DOM WRITE ****************
                this._setTrans(0, true);
                // ensure the ending progress step gets rendered
                // ******** DOM WRITE ****************
                this._progress(stepValue);
            }
            // set the after styles
            // ******** DOM WRITE ****************
            this._setAfterStyles();
            // remove the will-change properties
            // ******** DOM WRITE ****************
            this._willChange(false);
        }
    }
    /**
     * NO DOM
     * RECURSION
     */
    _hasDuration(opts) {
        if (this.getDuration(opts) > DURATION_MIN) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDuration(opts)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * NO DOM
     * RECURSION
     */
    _hasDomReads() {
        if (this._readCallbacks && this._readCallbacks.length > 0) {
            return true;
        }
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                if (child._hasDomReads()) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Immediately stop at the end of the animation.
     */
    stop(stepValue = 1) {
        // ensure all past transition end events have been cleared
        this._clearAsync();
        this._hasDur = true;
        this._playEnd(stepValue);
    }
    /**
     * NO DOM
     * NO RECURSION
     */
    _clearAsync() {
        if (this._unregisterTrnsEnd) {
            this._unregisterTrnsEnd();
        }
        if (this._timerId) {
            clearTimeout(this._timerId);
        }
        this._timerId = this._unregisterTrnsEnd = undefined;
    }
    /**
     * DOM WRITE
     * NO RECURSION
     */
    _progress(stepValue) {
        // bread 'n butter
        let val;
        const elements = this._elements;
        const effects = this._fxProperties;
        if (!elements || elements.length === 0 || !effects || this._destroyed) {
            return;
        }
        // flip the number if we're going in reverse
        if (this._isReverse) {
            stepValue = 1 - stepValue;
        }
        let i = 0;
        let j = 0;
        let finalTransform = '';
        let fx;
        for (i = 0; i < effects.length; i++) {
            fx = effects[i];
            if (fx.from && fx.to) {
                const fromNum = fx.from.num;
                const toNum = fx.to.num;
                const tweenEffect = (fromNum !== toNum);
                if (tweenEffect) {
                    this._hasTweenEffect = true;
                }
                if (stepValue === 0) {
                    // FROM
                    val = fx.from.val;
                }
                else if (stepValue === 1) {
                    // TO
                    val = fx.to.val;
                }
                else if (tweenEffect) {
                    // EVERYTHING IN BETWEEN
                    const valNum = (((toNum - fromNum) * stepValue) + fromNum);
                    const unit = fx.to.effectUnit;
                    val = valNum + unit;
                }
                if (val !== null) {
                    const prop = fx.effectName;
                    if (fx.trans) {
                        finalTransform += prop + '(' + val + ') ';
                    }
                    else {
                        for (j = 0; j < elements.length; j++) {
                            // ******** DOM WRITE ****************
                            elements[j].style.setProperty(prop, val);
                        }
                    }
                }
            }
        }
        // place all transforms on the same property
        if (finalTransform.length > 0) {
            if (!this._isReverse && stepValue !== 1 || this._isReverse && stepValue !== 0) {
                finalTransform += 'translateZ(0px)';
            }
            for (i = 0; i < elements.length; i++) {
                // ******** DOM WRITE ****************
                elements[i].style.setProperty('transform', finalTransform);
                elements[i].style.setProperty('-webkit-transform', finalTransform);
            }
        }
    }
    /**
     * DOM WRITE
     * NO RECURSION
     */
    _setTrans(dur, forcedLinearEasing) {
        // Transition is not enabled if there are not effects
        const elements = this._elements;
        if (!elements || elements.length === 0 || !this._fxProperties) {
            return;
        }
        // set the TRANSITION properties inline on the element
        const easing = (forcedLinearEasing ? 'linear' : this.getEasing());
        const durString = dur + 'ms';
        for (const { style } of elements) {
            if (dur > 0) {
                // ******** DOM WRITE ****************
                style.transitionDuration = durString;
                // each animation can have a different easing
                if (easing !== null) {
                    // ******** DOM WRITE ****************
                    style.transitionTimingFunction = easing;
                }
            }
            else {
                style.transitionDuration = '0';
            }
        }
    }
    /**
     * DOM READ
     * DOM WRITE
     * RECURSION
     */
    _beforeAnimation() {
        // fire off all the "before" function that have DOM READS in them
        // elements will be in the DOM, however visibily hidden
        // so we can read their dimensions if need be
        // ******** DOM READ ****************
        this._fireBeforeReadFunc();
        // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
        // fire off all the "before" function that have DOM WRITES in them
        // ******** DOM WRITE ****************
        this._fireBeforeWriteFunc();
        // stage all of the before css classes and inline styles
        // ******** DOM WRITE ****************
        this._setBeforeStyles();
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _setBeforeStyles() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._setBeforeStyles();
            }
        }
        const elements = this._elements;
        // before the animations have started
        // only set before styles if animation is not reversed
        if (!elements || elements.length === 0 || this._isReverse) {
            return;
        }
        const addClasses = this._beforeAddClasses;
        const removeClasses = this._beforeRemoveClasses;
        for (const el of elements) {
            const elementClassList = el.classList;
            // css classes to add before the animation
            if (addClasses) {
                for (const c of addClasses) {
                    // ******** DOM WRITE ****************
                    elementClassList.add(c);
                }
            }
            // css classes to remove before the animation
            if (removeClasses) {
                for (const c of removeClasses) {
                    // ******** DOM WRITE ****************
                    elementClassList.remove(c);
                }
            }
            // inline styles to add before the animation
            if (this._beforeStyles) {
                for (const [key, value] of Object.entries(this._beforeStyles)) {
                    // ******** DOM WRITE ****************
                    el.style.setProperty(key, value);
                }
            }
        }
    }
    /**
     * DOM READ
     * RECURSION
     */
    _fireBeforeReadFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM READ ****************
                child._fireBeforeReadFunc();
            }
        }
        const readFunctions = this._readCallbacks;
        if (readFunctions) {
            for (const callback of readFunctions) {
                // ******** DOM READ ****************
                callback();
            }
        }
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _fireBeforeWriteFunc() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._fireBeforeWriteFunc();
            }
        }
        const writeFunctions = this._writeCallbacks;
        if (writeFunctions) {
            for (const callback of writeFunctions) {
                // ******** DOM WRITE ****************
                callback();
            }
        }
    }
    /**
     * DOM WRITE
     */
    _setAfterStyles() {
        const elements = this._elements;
        if (!elements) {
            return;
        }
        for (const el of elements) {
            const elementClassList = el.classList;
            // remove the transition duration/easing
            // ******** DOM WRITE ****************
            el.style.transitionDuration = el.style.transitionTimingFunction = '';
            if (this._isReverse) {
                // finished in reverse direction
                // css classes that were added before the animation should be removed
                const beforeAddClasses = this._beforeAddClasses;
                if (beforeAddClasses) {
                    for (const c of beforeAddClasses) {
                        elementClassList.remove(c);
                    }
                }
                // css classes that were removed before the animation should be added
                const beforeRemoveClasses = this._beforeRemoveClasses;
                if (beforeRemoveClasses) {
                    for (const c of beforeRemoveClasses) {
                        elementClassList.add(c);
                    }
                }
                // inline styles that were added before the animation should be removed
                const beforeStyles = this._beforeStyles;
                if (beforeStyles) {
                    for (const propName of Object.keys(beforeStyles)) {
                        // ******** DOM WRITE ****************
                        el.style.removeProperty(propName);
                    }
                }
            }
            else {
                // finished in forward direction
                // css classes to add after the animation
                const afterAddClasses = this._afterAddClasses;
                if (afterAddClasses) {
                    for (const c of afterAddClasses) {
                        // ******** DOM WRITE ****************
                        elementClassList.add(c);
                    }
                }
                // css classes to remove after the animation
                const afterRemoveClasses = this._afterRemoveClasses;
                if (afterRemoveClasses) {
                    for (const c of afterRemoveClasses) {
                        // ******** DOM WRITE ****************
                        elementClassList.remove(c);
                    }
                }
                // inline styles to add after the animation
                const afterStyles = this._afterStyles;
                if (afterStyles) {
                    for (const [key, value] of Object.entries(afterStyles)) {
                        el.style.setProperty(key, value);
                    }
                }
            }
        }
    }
    /**
     * DOM WRITE
     * NO RECURSION
     */
    _willChange(addWillChange) {
        let wc;
        const effects = this._fxProperties;
        let willChange;
        if (addWillChange && effects) {
            wc = [];
            for (const effect of effects) {
                const propWC = effect.wc;
                if (propWC === 'webkitTransform') {
                    wc.push('transform', '-webkit-transform');
                }
                else if (propWC !== undefined) {
                    wc.push(propWC);
                }
            }
            willChange = wc.join(',');
        }
        else {
            willChange = '';
        }
        const elements = this._elements;
        if (elements) {
            for (const el of elements) {
                // ******** DOM WRITE ****************
                el.style.setProperty('will-change', willChange);
            }
        }
    }
    /**
     * Start the animation with a user controlled progress.
     */
    progressStart() {
        // ensure all past transition end events have been cleared
        this._clearAsync();
        // ******** DOM READ/WRITE ****************
        this._beforeAnimation();
        // ******** DOM WRITE ****************
        this._progressStart();
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _progressStart() {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._progressStart();
            }
        }
        // force no duration, linear easing
        // ******** DOM WRITE ****************
        this._setTrans(0, true);
        // ******** DOM WRITE ****************
        this._willChange(true);
    }
    /**
     * Set the progress step for this animation.
     * progressStep() is not debounced, so it should not be called faster than 60FPS.
     */
    progressStep(stepValue) {
        // only update if the last update was more than 16ms ago
        stepValue = Math.min(1, Math.max(0, stepValue));
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child.progressStep(stepValue);
            }
        }
        // ******** DOM WRITE ****************
        this._progress(stepValue);
    }
    /**
     * End the progress animation.
     */
    progressEnd(shouldComplete, currentStepValue, dur = -1) {
        if (this._isReverse) {
            // if the animation is going in reverse then
            // flip the step value: 0 becomes 1, 1 becomes 0
            currentStepValue = 1 - currentStepValue;
        }
        const stepValue = shouldComplete ? 1 : 0;
        const diff = Math.abs(currentStepValue - stepValue);
        if (dur < 0) {
            dur = this._duration || 0;
        }
        else if (diff < 0.05) {
            dur = 0;
        }
        this._isAsync = (dur > 30);
        this._progressEnd(shouldComplete, stepValue, dur, this._isAsync);
        if (this._isAsync) {
            // for the root animation only
            // set the async TRANSITION END event
            // and run onFinishes when the transition ends
            // ******** DOM WRITE ****************
            this._asyncEnd(dur, shouldComplete);
            // this animation has a duration so we need another RAF
            // for the CSS TRANSITION properties to kick in
            if (!this._destroyed) {
                raf(() => {
                    this._playToStep(stepValue);
                });
            }
        }
    }
    /**
     * DOM WRITE
     * RECURSION
     */
    _progressEnd(shouldComplete, stepValue, dur, isAsync) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                // ******** DOM WRITE ****************
                child._progressEnd(shouldComplete, stepValue, dur, isAsync);
            }
        }
        if (!isAsync) {
            // stop immediately
            // set all the animations to their final position
            // ******** DOM WRITE ****************
            this._progress(stepValue);
            this._willChange(false);
            this._setAfterStyles();
            this._didFinish(shouldComplete);
        }
        else {
            // animate it back to it's ending position
            this.isPlaying = true;
            this.hasCompleted = false;
            this._hasDur = true;
            // ******** DOM WRITE ****************
            this._willChange(true);
            this._setTrans(dur, false);
        }
    }
    /**
     * Add a callback to fire when the animation has finished.
     */
    onFinish(callback, opts) {
        if (opts && opts.clearExistingCallbacks) {
            this._onFinishCallbacks = this._onFinishOneTimeCallbacks = undefined;
        }
        if (opts && opts.oneTimeCallback) {
            this._onFinishOneTimeCallbacks = this._onFinishOneTimeCallbacks || [];
            this._onFinishOneTimeCallbacks.push(callback);
        }
        else {
            this._onFinishCallbacks = this._onFinishCallbacks || [];
            this._onFinishCallbacks.push(callback);
        }
        return this;
    }
    /**
     * NO DOM
     * RECURSION
     */
    _didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child._didFinishAll(hasCompleted, finishAsyncAnimations, finishNoDurationAnimations);
            }
        }
        if (finishAsyncAnimations && this._isAsync || finishNoDurationAnimations && !this._isAsync) {
            this._didFinish(hasCompleted);
        }
    }
    /**
     * NO RECURSION
     */
    _didFinish(hasCompleted) {
        this.isPlaying = false;
        this.hasCompleted = hasCompleted;
        if (this._onFinishCallbacks) {
            // run all finish callbacks
            for (const callback of this._onFinishCallbacks) {
                callback(this);
            }
        }
        if (this._onFinishOneTimeCallbacks) {
            // run all "onetime" finish callbacks
            for (const callback of this._onFinishOneTimeCallbacks) {
                callback(this);
            }
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    /**
     * Reverse the animation.
     */
    reverse(shouldReverse = true) {
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.reverse(shouldReverse);
            }
        }
        this._isReverse = !!shouldReverse;
        return this;
    }
    /**
     * Recursively destroy this animation and all child animations.
     */
    destroy() {
        this._didFinish(false);
        this._destroyed = true;
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                child.destroy();
            }
        }
        this._clearAsync();
        if (this._elements) {
            this._elements.length = 0;
        }
        if (this._readCallbacks) {
            this._readCallbacks.length = 0;
        }
        if (this._writeCallbacks) {
            this._writeCallbacks.length = 0;
        }
        this.parent = undefined;
        if (this._childAnimations) {
            this._childAnimations.length = 0;
        }
        if (this._onFinishCallbacks) {
            this._onFinishCallbacks.length = 0;
        }
        if (this._onFinishOneTimeCallbacks) {
            this._onFinishOneTimeCallbacks.length = 0;
        }
    }
    /**
     * NO DOM
     */
    _transEl() {
        // get the lowest level element that has an Animator
        const children = this._childAnimations;
        if (children) {
            for (const child of children) {
                const targetEl = child._transEl();
                if (targetEl) {
                    return targetEl;
                }
            }
        }
        return (this._hasTweenEffect &&
            this._hasDur &&
            this._elements !== undefined &&
            this._elements.length > 0 ?
            this._elements[0] : null);
    }
}

const create = (animationBuilder, baseEl, opts) => {
    if (animationBuilder) {
        return animationBuilder(Animator, baseEl, opts);
    }
    return Promise.resolve(new Animator());
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create
});

exports.bootstrapHydrate = bootstrapHydrate;
