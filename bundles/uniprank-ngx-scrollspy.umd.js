(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@uniprank/ngx-scrollspy', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.uniprank = global.uniprank || {}, global.uniprank['ngx-scrollspy'] = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, rxjs, operators) { 'use strict';

    (function (ScrollDirectionEnum) {
        ScrollDirectionEnum["vertical"] = "vertical";
        ScrollDirectionEnum["horizontal"] = "horizontal";
    })(exports.ScrollDirectionEnum || (exports.ScrollDirectionEnum = {}));

    var defaultElementId = 'window';
    var SPY_CONFIG = new core.InjectionToken(null);
    var ScrollSpyService = /** @class */ (function () {
        function ScrollSpyService(doc, config) {
            var _this = this;
            this.doc = doc;
            this._scrollItems = {};
            this._scrollElements = {};
            this._$scrollElementListener = {};
            this._scrollElementListener = {};
            this._onStopListening = new rxjs.Subject();
            this._resizeEvents = rxjs.fromEvent(window, 'resize').pipe(operators.auditTime(300), operators.takeUntil(this._onStopListening));
            this._scrollEvents = rxjs.fromEvent(window, 'scroll').pipe(operators.auditTime(10), operators.takeUntil(this._onStopListening));
            this._initScrollElementListener(defaultElementId, this._generateScrollElement(defaultElementId, new core.ElementRef(doc.documentElement || doc.body), exports.ScrollDirectionEnum.vertical));
            this._resizeEvents.subscribe(function () { return _this._windowScroll(); });
            this._scrollEvents.subscribe(function () { return _this._windowScroll(); });
            this._windowScroll();
            if (config !== null) {
                this._lookAhead = config.lookAhead;
                this._activateOnlySetItems = config.activateOnlySetItems;
                this.attributeType = config.attributeType;
            }
            else {
                this._lookAhead = false;
                this._activateOnlySetItems = false;
                this.attributeType = 'id';
            }
        }
        ScrollSpyService.prototype._initScrollElementListener = function (scrollElementId, scrollElement) {
            this._scrollElements[scrollElementId] = scrollElement;
            this._scrollElementListener[scrollElementId] = null;
            this._$scrollElementListener[scrollElementId] = new rxjs.BehaviorSubject(null);
        };
        ScrollSpyService.prototype._windowScroll = function () {
            this.updateScrollElement(defaultElementId);
        };
        ScrollSpyService.prototype._generateScrollElement = function (scrollElementId, elementRef, direction, offset) {
            if (offset === void 0) { offset = 0; }
            return {
                id: scrollElementId,
                elementRef: elementRef,
                direction: direction,
                offset: offset
            };
        };
        ScrollSpyService.prototype.setOffset = function (scrollElementId, offset) {
            this._checkScrollElementExists(scrollElementId);
            this._scrollElements[scrollElementId].offset = offset;
        };
        ScrollSpyService.prototype.setScrollElement = function (scrollElementId, elementRef, direction, offset) {
            if (offset === void 0) { offset = 0; }
            this._checkScrollElementNotExists(scrollElementId);
            this._initScrollElementListener(scrollElementId, this._generateScrollElement(scrollElementId, elementRef, direction, offset));
        };
        ScrollSpyService.prototype._checkScrollElementNotExists = function (scrollElementId) {
            if (this._scrollElements[scrollElementId] != null) {
                throw new Error("ScrollSpyService: The scroll element with the id [" + scrollElementId + "] exists.");
            }
        };
        ScrollSpyService.prototype.checkScrollElementExists = function (scrollElementId) {
            return this._scrollElements[scrollElementId] != null;
        };
        ScrollSpyService.prototype.setItem = function (itemId, elementRef, scrollElementId) {
            if (scrollElementId === void 0) { scrollElementId = defaultElementId; }
            this._checkItemNotExists(itemId);
            this._scrollItems[itemId] = this._generateScrollObject(itemId, elementRef, scrollElementId);
            this._setDefaultItem(itemId, scrollElementId);
        };
        ScrollSpyService.prototype._checkItemNotExists = function (itemId) {
            if (this._scrollItems[itemId] != null) {
                throw new Error("ScrollSpyService: The scroll item with the id [" + itemId + "] exists.");
            }
        };
        ScrollSpyService.prototype._generateScrollObject = function (id, elementRef, scrollElementId) {
            return {
                id: id,
                scrollElementId: scrollElementId,
                elementRef: elementRef,
                nativeElement: elementRef.nativeElement
            };
        };
        ScrollSpyService.prototype._setDefaultItem = function (itemId, scrollElementId) {
            if (this._lookAhead) {
                return;
            }
            var _value = this._scrollElementListener[scrollElementId];
            if (_value == null) {
                this._setScrollElementListener(scrollElementId, this._scrollItems[itemId]);
            }
        };
        ScrollSpyService.prototype._setScrollElementListener = function (scrollElementId, scrollObject) {
            var _this = this;
            this._scrollElementListener[scrollElementId] = scrollObject;
            setTimeout(function () { return _this._$scrollElementListener[scrollElementId].next(scrollObject); });
        };
        ScrollSpyService.prototype.changeScrollElement = function (itemId, oldElementId, newElementId, override) {
            if (override === void 0) { override = false; }
            this._checkScrollElementExists(oldElementId);
            this._checkScrollElementExists(newElementId);
            this._checkItemExists(itemId);
            var _scrollItem = this._scrollItems[itemId];
            if ((_scrollItem.scrollElementId !== defaultElementId && override) || _scrollItem.scrollElementId === defaultElementId) {
                this._scrollItems[itemId].scrollElementId = newElementId;
            }
            this._setDefaultItem(itemId, newElementId);
            var _oldElements = this._getElementItems(oldElementId);
            if (_oldElements.length > 0) {
                this._setDefaultItem(_oldElements[0].id, oldElementId);
            }
        };
        ScrollSpyService.prototype._getElementItems = function (scrollElementId) {
            var _items = [];
            for (var key in this._scrollItems) {
                if (this._scrollItems.hasOwnProperty(key)) {
                    var value = this._scrollItems[key];
                    if (value.scrollElementId === scrollElementId) {
                        _items.push(value);
                    }
                }
            }
            return _items;
        };
        ScrollSpyService.prototype._checkItemExists = function (itemId) {
            if (this._scrollItems[itemId] == null) {
                throw new Error("ScrollSpyService: The scroll item with the id [" + itemId + "] doesn't exist.");
            }
        };
        ScrollSpyService.prototype.observe = function (scrollElementId) {
            if (scrollElementId === void 0) { scrollElementId = defaultElementId; }
            this._checkScrollElementExists(scrollElementId);
            return this._$scrollElementListener[scrollElementId].asObservable();
        };
        ScrollSpyService.prototype._checkScrollElementExists = function (scrollElementId) {
            if (this._scrollElements[scrollElementId] == null) {
                throw new Error("ScrollSpyService: The scroll element with the id [" + scrollElementId + "] doesn't exist.");
            }
        };
        ScrollSpyService.prototype.updateScrollElement = function (scrollElementId) {
            this._checkScrollElementExists(scrollElementId);
            var _element = this._scrollElements[scrollElementId];
            var _elementItems = this._getElementItems(scrollElementId);
            var _nextActiveItem = this._getActiveItem(_element, _elementItems);
            var _currentActiveItem = this._scrollElementListener[scrollElementId];
            if (_currentActiveItem == null) {
                if (_nextActiveItem != null) {
                    this._setScrollElementListener(scrollElementId, _nextActiveItem);
                }
            }
            else if (_nextActiveItem != null) {
                if (_currentActiveItem.id !== _nextActiveItem.id) {
                    this._setScrollElementListener(scrollElementId, _nextActiveItem);
                }
            }
            else if (_nextActiveItem == null && this._lookAhead) {
                this._setScrollElementListener(scrollElementId, null);
            }
        };
        ScrollSpyService.prototype._getActiveItem = function (scrollElement, listOfElements) {
            var _this = this;
            var _direction = scrollElement.direction;
            var _scrollObject = null;
            var nativeElement = scrollElement.elementRef.nativeElement;
            listOfElements.forEach(function (_element) {
                var _active = false;
                switch (_direction) {
                    case exports.ScrollDirectionEnum.horizontal:
                        var _scrollLeft = scrollElement.id.toLowerCase() === 'window' ? (window && window.pageXOffset) || 0 : nativeElement.scrollLeft;
                        _active = _element.nativeElement.offsetLeft <= _scrollLeft + scrollElement.offset;
                        break;
                    default: {
                        var _scrollTop = scrollElement.id.toLowerCase() === 'window' ? (window && window.pageYOffset) || 0 : nativeElement.scrollTop;
                        if (_this._activateOnlySetItems) {
                            _active =
                                _element.nativeElement.offsetTop < _scrollTop + scrollElement.offset &&
                                    _element.nativeElement.offsetTop + _element.nativeElement.offsetHeight > _scrollTop + scrollElement.offset;
                        }
                        else {
                            _active = _element.nativeElement.offsetTop <= _scrollTop + scrollElement.offset;
                        }
                    }
                }
                if (_active) {
                    _scrollObject = _element;
                }
            });
            return _scrollObject;
        };
        ScrollSpyService.prototype.deleteScrollElement = function (scrollElementId) {
            if (scrollElementId === 'window') {
                this._setScrollElementListener(scrollElementId, null);
            }
            else {
                this._checkScrollElementExists(scrollElementId);
                delete this._scrollElements[scrollElementId];
                delete this._$scrollElementListener[scrollElementId];
                delete this._scrollElementListener[scrollElementId];
            }
        };
        ScrollSpyService.prototype.deleteItem = function (itemId) {
            if (this._scrollItems[itemId] != null) {
                delete this._scrollItems[itemId];
            }
        };
        return ScrollSpyService;
    }());
    ScrollSpyService.decorators = [
        { type: core.Injectable }
    ];
    ScrollSpyService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] },
        { type: undefined, decorators: [{ type: core.Inject, args: [SPY_CONFIG,] }, { type: core.Optional }] }
    ]; };

    var ScrollSpyDirective = /** @class */ (function () {
        function ScrollSpyDirective(_el, _scrollSpyService, _cdr) {
            this._el = _el;
            this._scrollSpyService = _scrollSpyService;
            this._cdr = _cdr;
            this.classActive = false;
            this.scrollElement = 'window';
        }
        ScrollSpyDirective.prototype.ngOnDestroy = function () {
            if (this._subscriber) {
                this._subscriber.unsubscribe();
            }
            this._scrollSpyService.deleteItem(this.itemId);
        };
        ScrollSpyDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._subscriber = this._scrollSpyService.observe(this.scrollElement).subscribe(function (element) {
                if (element != null) {
                    var _active_1 = element.id === _this.itemId;
                    setTimeout(function () {
                        _this.classActive = _active_1;
                        _this._cdr.markForCheck();
                    });
                }
            });
            this._scrollSpyService.setItem(this.itemId, this._el, this.scrollElement);
            var _keyType = 'id';
            if (this._scrollSpyService.attributeType === 'data-id') {
                _keyType = 'data-id';
            }
            this._el.nativeElement.setAttribute(_keyType, this.itemId);
        };
        return ScrollSpyDirective;
    }());
    ScrollSpyDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[uniScrollSpy]'
                },] }
    ];
    ScrollSpyDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: ScrollSpyService },
        { type: core.ChangeDetectorRef }
    ]; };
    ScrollSpyDirective.propDecorators = {
        classActive: [{ type: core.HostBinding, args: ['class.active',] }],
        itemId: [{ type: core.Input, args: ['uniScrollSpy',] }],
        scrollElement: [{ type: core.Input }]
    };

    var ScrollElementDirective = /** @class */ (function () {
        function ScrollElementDirective(_el, _scrollSpyService) {
            this._el = _el;
            this._scrollSpyService = _scrollSpyService;
            this._destroy$ = new rxjs.Subject();
            this.direction = exports.ScrollDirectionEnum.vertical;
            this.destroyElementsSubscription = true;
        }
        ScrollElementDirective.prototype.onScroll = function ($event) {
            this._scrollSpyService.updateScrollElement(this.elementId);
        };
        ScrollElementDirective.prototype.ngOnInit = function () {
            if (this.destroyElementsSubscription || !this._scrollSpyService.checkScrollElementExists(this.elementId))
                this._scrollSpyService.setScrollElement(this.elementId, this._el, this.direction);
            if (this._scrollSpyService.attributeType === 'id') {
                this._el.nativeElement.setAttribute('id', this.elementId);
            }
            else {
                this._el.nativeElement.setAttribute('data-id', this.elementId);
            }
        };
        ScrollElementDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._scrollSpyElements.changes.pipe(operators.debounceTime(10), operators.takeUntil(this._destroy$)).subscribe(function (elements) {
                if (elements.length > 0)
                    elements.forEach(function (element) {
                        _this._scrollSpyService.changeScrollElement(element.itemId, element.scrollElement, _this.elementId, true);
                    });
            });
        };
        ScrollElementDirective.prototype.ngOnDestroy = function () {
            if (this.destroyElementsSubscription)
                this._scrollSpyService.deleteScrollElement(this.elementId);
            this._destroy$.next();
        };
        return ScrollElementDirective;
    }());
    ScrollElementDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[uniScrollElement]'
                },] }
    ];
    ScrollElementDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: ScrollSpyService }
    ]; };
    ScrollElementDirective.propDecorators = {
        elementId: [{ type: core.Input, args: ['uniScrollElement',] }],
        direction: [{ type: core.Input }],
        destroyElementsSubscription: [{ type: core.Input }],
        _scrollSpyElements: [{ type: core.ContentChildren, args: [ScrollSpyDirective, { descendants: true },] }],
        onScroll: [{ type: core.HostListener, args: ['scroll', ['$event'],] }]
    };

    var ScrollItemDirective = /** @class */ (function () {
        function ScrollItemDirective(_scrollSpyService, _cdr) {
            this._scrollSpyService = _scrollSpyService;
            this._cdr = _cdr;
            this.classActive = false;
            this.scrollElement = 'window';
            this.activeEvent = new core.EventEmitter();
        }
        ScrollItemDirective.prototype.ngOnDestroy = function () {
            if (this._subscriber) {
                this._subscriber.unsubscribe();
            }
        };
        ScrollItemDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._subscriber = this._scrollSpyService.observe(this.scrollElement).subscribe(function (element) {
                var _active;
                if (element != null) {
                    _active = element.id === _this.itemId;
                    _this.activeEvent.emit(_active);
                }
                else {
                    _active = false;
                }
                setTimeout(function () {
                    _this.classActive = _active;
                    _this._cdr.markForCheck();
                });
            });
        };
        return ScrollItemDirective;
    }());
    ScrollItemDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[uniScrollItem]'
                },] }
    ];
    ScrollItemDirective.ctorParameters = function () { return [
        { type: ScrollSpyService },
        { type: core.ChangeDetectorRef }
    ]; };
    ScrollItemDirective.propDecorators = {
        classActive: [{ type: core.HostBinding, args: ['class.active',] }],
        itemId: [{ type: core.Input, args: ['uniScrollItem',] }],
        scrollElement: [{ type: core.Input }],
        activeEvent: [{ type: core.Output }]
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var directives = [ScrollSpyDirective, ScrollItemDirective, ScrollElementDirective];
    var components = [];
    var providers = [ScrollSpyService];
    var NgxScrollspyModule = /** @class */ (function () {
        function NgxScrollspyModule() {
        }
        NgxScrollspyModule.forRoot = function (parameters) {
            if (parameters === void 0) { parameters = { lookAhead: false }; }
            return {
                ngModule: NgxScrollspyModule,
                providers: __spread(providers, [{ provide: SPY_CONFIG, useValue: parameters }])
            };
        };
        return NgxScrollspyModule;
    }());
    NgxScrollspyModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: __spread(directives, components),
                    exports: __spread(directives, components)
                },] }
    ];

    /*
     * Public API Surface of ngx-scrollspy
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgxScrollspyModule = NgxScrollspyModule;
    exports.ScrollElementDirective = ScrollElementDirective;
    exports.ScrollItemDirective = ScrollItemDirective;
    exports.ScrollSpyDirective = ScrollSpyDirective;
    exports.ScrollSpyService = ScrollSpyService;
    exports.ɵa = SPY_CONFIG;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=uniprank-ngx-scrollspy.umd.js.map
