import { InjectionToken, ElementRef, Injectable, Inject, Optional, Directive, ChangeDetectorRef, HostBinding, Input, ContentChildren, HostListener, EventEmitter, Output, NgModule } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Subject, fromEvent, BehaviorSubject } from 'rxjs';
import { auditTime, takeUntil, debounceTime } from 'rxjs/operators';

var ScrollDirectionEnum;
(function (ScrollDirectionEnum) {
    ScrollDirectionEnum["vertical"] = "vertical";
    ScrollDirectionEnum["horizontal"] = "horizontal";
})(ScrollDirectionEnum || (ScrollDirectionEnum = {}));

const defaultElementId = 'window';
const SPY_CONFIG = new InjectionToken(null);
class ScrollSpyService {
    constructor(doc, config) {
        this.doc = doc;
        this._scrollItems = {};
        this._scrollElements = {};
        this._$scrollElementListener = {};
        this._scrollElementListener = {};
        this._onStopListening = new Subject();
        this._resizeEvents = fromEvent(window, 'resize').pipe(auditTime(300), takeUntil(this._onStopListening));
        this._scrollEvents = fromEvent(window, 'scroll').pipe(auditTime(10), takeUntil(this._onStopListening));
        this._initScrollElementListener(defaultElementId, this._generateScrollElement(defaultElementId, new ElementRef(doc.documentElement || doc.body), ScrollDirectionEnum.vertical));
        this._resizeEvents.subscribe(() => this._windowScroll());
        this._scrollEvents.subscribe(() => this._windowScroll());
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
    _initScrollElementListener(scrollElementId, scrollElement) {
        this._scrollElements[scrollElementId] = scrollElement;
        this._scrollElementListener[scrollElementId] = null;
        this._$scrollElementListener[scrollElementId] = new BehaviorSubject(null);
    }
    _windowScroll() {
        this.updateScrollElement(defaultElementId);
    }
    _generateScrollElement(scrollElementId, elementRef, direction, offset = 0) {
        return {
            id: scrollElementId,
            elementRef,
            direction,
            offset
        };
    }
    setOffset(scrollElementId, offset) {
        this._checkScrollElementExists(scrollElementId);
        this._scrollElements[scrollElementId].offset = offset;
    }
    setScrollElement(scrollElementId, elementRef, direction, offset = 0) {
        this._checkScrollElementNotExists(scrollElementId);
        this._initScrollElementListener(scrollElementId, this._generateScrollElement(scrollElementId, elementRef, direction, offset));
    }
    _checkScrollElementNotExists(scrollElementId) {
        if (this._scrollElements[scrollElementId] != null) {
            throw new Error(`ScrollSpyService: The scroll element with the id [${scrollElementId}] exists.`);
        }
    }
    checkScrollElementExists(scrollElementId) {
        return this._scrollElements[scrollElementId] != null;
    }
    setItem(itemId, elementRef, scrollElementId = defaultElementId) {
        this._checkItemNotExists(itemId);
        this._scrollItems[itemId] = this._generateScrollObject(itemId, elementRef, scrollElementId);
        this._setDefaultItem(itemId, scrollElementId);
    }
    _checkItemNotExists(itemId) {
        if (this._scrollItems[itemId] != null) {
            throw new Error(`ScrollSpyService: The scroll item with the id [${itemId}] exists.`);
        }
    }
    _generateScrollObject(id, elementRef, scrollElementId) {
        return {
            id,
            scrollElementId,
            elementRef,
            nativeElement: elementRef.nativeElement
        };
    }
    _setDefaultItem(itemId, scrollElementId) {
        if (this._lookAhead) {
            return;
        }
        const _value = this._scrollElementListener[scrollElementId];
        if (_value == null) {
            this._setScrollElementListener(scrollElementId, this._scrollItems[itemId]);
        }
    }
    _setScrollElementListener(scrollElementId, scrollObject) {
        this._scrollElementListener[scrollElementId] = scrollObject;
        setTimeout(() => this._$scrollElementListener[scrollElementId].next(scrollObject));
    }
    changeScrollElement(itemId, oldElementId, newElementId, override = false) {
        this._checkScrollElementExists(oldElementId);
        this._checkScrollElementExists(newElementId);
        this._checkItemExists(itemId);
        const _scrollItem = this._scrollItems[itemId];
        if ((_scrollItem.scrollElementId !== defaultElementId && override) || _scrollItem.scrollElementId === defaultElementId) {
            this._scrollItems[itemId].scrollElementId = newElementId;
        }
        this._setDefaultItem(itemId, newElementId);
        const _oldElements = this._getElementItems(oldElementId);
        if (_oldElements.length > 0) {
            this._setDefaultItem(_oldElements[0].id, oldElementId);
        }
    }
    _getElementItems(scrollElementId) {
        const _items = [];
        for (const key in this._scrollItems) {
            if (this._scrollItems.hasOwnProperty(key)) {
                const value = this._scrollItems[key];
                if (value.scrollElementId === scrollElementId) {
                    _items.push(value);
                }
            }
        }
        return _items;
    }
    _checkItemExists(itemId) {
        if (this._scrollItems[itemId] == null) {
            throw new Error(`ScrollSpyService: The scroll item with the id [${itemId}] doesn't exist.`);
        }
    }
    observe(scrollElementId = defaultElementId) {
        this._checkScrollElementExists(scrollElementId);
        return this._$scrollElementListener[scrollElementId].asObservable();
    }
    _checkScrollElementExists(scrollElementId) {
        if (this._scrollElements[scrollElementId] == null) {
            throw new Error(`ScrollSpyService: The scroll element with the id [${scrollElementId}] doesn't exist.`);
        }
    }
    updateScrollElement(scrollElementId) {
        this._checkScrollElementExists(scrollElementId);
        const _element = this._scrollElements[scrollElementId];
        const _elementItems = this._getElementItems(scrollElementId);
        const _nextActiveItem = this._getActiveItem(_element, _elementItems);
        const _currentActiveItem = this._scrollElementListener[scrollElementId];
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
    }
    _getActiveItem(scrollElement, listOfElements) {
        const _direction = scrollElement.direction;
        let _scrollObject = null;
        const nativeElement = scrollElement.elementRef.nativeElement;
        listOfElements.forEach((_element) => {
            let _active = false;
            switch (_direction) {
                case ScrollDirectionEnum.horizontal:
                    const _scrollLeft = scrollElement.id.toLowerCase() === 'window' ? (window && window.pageXOffset) || 0 : nativeElement.scrollLeft;
                    _active = _element.nativeElement.offsetLeft <= _scrollLeft + scrollElement.offset;
                    break;
                default: {
                    const _scrollTop = scrollElement.id.toLowerCase() === 'window' ? (window && window.pageYOffset) || 0 : nativeElement.scrollTop;
                    if (this._activateOnlySetItems) {
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
    }
    deleteScrollElement(scrollElementId) {
        if (scrollElementId === 'window') {
            this._setScrollElementListener(scrollElementId, null);
        }
        else {
            this._checkScrollElementExists(scrollElementId);
            delete this._scrollElements[scrollElementId];
            delete this._$scrollElementListener[scrollElementId];
            delete this._scrollElementListener[scrollElementId];
        }
    }
    deleteItem(itemId) {
        if (this._scrollItems[itemId] != null) {
            delete this._scrollItems[itemId];
        }
    }
}
ScrollSpyService.decorators = [
    { type: Injectable }
];
ScrollSpyService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [SPY_CONFIG,] }, { type: Optional }] }
];

class ScrollSpyDirective {
    constructor(_el, _scrollSpyService, _cdr) {
        this._el = _el;
        this._scrollSpyService = _scrollSpyService;
        this._cdr = _cdr;
        this.classActive = false;
        this.scrollElement = 'window';
    }
    ngOnDestroy() {
        if (this._subscriber) {
            this._subscriber.unsubscribe();
        }
        this._scrollSpyService.deleteItem(this.itemId);
    }
    ngAfterViewInit() {
        this._subscriber = this._scrollSpyService.observe(this.scrollElement).subscribe((element) => {
            if (element != null) {
                const _active = element.id === this.itemId;
                setTimeout(() => {
                    this.classActive = _active;
                    this._cdr.markForCheck();
                });
            }
        });
        this._scrollSpyService.setItem(this.itemId, this._el, this.scrollElement);
        let _keyType = 'id';
        if (this._scrollSpyService.attributeType === 'data-id') {
            _keyType = 'data-id';
        }
        this._el.nativeElement.setAttribute(_keyType, this.itemId);
    }
}
ScrollSpyDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uniScrollSpy]'
            },] }
];
ScrollSpyDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ScrollSpyService },
    { type: ChangeDetectorRef }
];
ScrollSpyDirective.propDecorators = {
    classActive: [{ type: HostBinding, args: ['class.active',] }],
    itemId: [{ type: Input, args: ['uniScrollSpy',] }],
    scrollElement: [{ type: Input }]
};

class ScrollElementDirective {
    constructor(_el, _scrollSpyService) {
        this._el = _el;
        this._scrollSpyService = _scrollSpyService;
        this._destroy$ = new Subject();
        this.direction = ScrollDirectionEnum.vertical;
        this.destroyElementsSubscription = true;
    }
    onScroll($event) {
        this._scrollSpyService.updateScrollElement(this.elementId);
    }
    ngOnInit() {
        if (this.destroyElementsSubscription || !this._scrollSpyService.checkScrollElementExists(this.elementId))
            this._scrollSpyService.setScrollElement(this.elementId, this._el, this.direction);
        if (this._scrollSpyService.attributeType === 'id') {
            this._el.nativeElement.setAttribute('id', this.elementId);
        }
        else {
            this._el.nativeElement.setAttribute('data-id', this.elementId);
        }
    }
    ngAfterViewInit() {
        this._scrollSpyElements.changes.pipe(debounceTime(10), takeUntil(this._destroy$)).subscribe((elements) => {
            if (elements.length > 0)
                elements.forEach((element) => {
                    this._scrollSpyService.changeScrollElement(element.itemId, element.scrollElement, this.elementId, true);
                });
        });
    }
    ngOnDestroy() {
        if (this.destroyElementsSubscription)
            this._scrollSpyService.deleteScrollElement(this.elementId);
        this._destroy$.next();
    }
}
ScrollElementDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uniScrollElement]'
            },] }
];
ScrollElementDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ScrollSpyService }
];
ScrollElementDirective.propDecorators = {
    elementId: [{ type: Input, args: ['uniScrollElement',] }],
    direction: [{ type: Input }],
    destroyElementsSubscription: [{ type: Input }],
    _scrollSpyElements: [{ type: ContentChildren, args: [ScrollSpyDirective, { descendants: true },] }],
    onScroll: [{ type: HostListener, args: ['scroll', ['$event'],] }]
};

class ScrollItemDirective {
    constructor(_scrollSpyService, _cdr) {
        this._scrollSpyService = _scrollSpyService;
        this._cdr = _cdr;
        this.classActive = false;
        this.scrollElement = 'window';
        this.activeEvent = new EventEmitter();
    }
    ngOnDestroy() {
        if (this._subscriber) {
            this._subscriber.unsubscribe();
        }
    }
    ngAfterViewInit() {
        this._subscriber = this._scrollSpyService.observe(this.scrollElement).subscribe((element) => {
            let _active;
            if (element != null) {
                _active = element.id === this.itemId;
                this.activeEvent.emit(_active);
            }
            else {
                _active = false;
            }
            setTimeout(() => {
                this.classActive = _active;
                this._cdr.markForCheck();
            });
        });
    }
}
ScrollItemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uniScrollItem]'
            },] }
];
ScrollItemDirective.ctorParameters = () => [
    { type: ScrollSpyService },
    { type: ChangeDetectorRef }
];
ScrollItemDirective.propDecorators = {
    classActive: [{ type: HostBinding, args: ['class.active',] }],
    itemId: [{ type: Input, args: ['uniScrollItem',] }],
    scrollElement: [{ type: Input }],
    activeEvent: [{ type: Output }]
};

const directives = [ScrollSpyDirective, ScrollItemDirective, ScrollElementDirective];
const components = [];
const providers = [ScrollSpyService];
class NgxScrollspyModule {
    static forRoot(parameters = { lookAhead: false }) {
        return {
            ngModule: NgxScrollspyModule,
            providers: [...providers, { provide: SPY_CONFIG, useValue: parameters }]
        };
    }
}
NgxScrollspyModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [...directives, ...components],
                exports: [...directives, ...components]
            },] }
];

/*
 * Public API Surface of ngx-scrollspy
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxScrollspyModule, ScrollDirectionEnum, ScrollElementDirective, ScrollItemDirective, ScrollSpyDirective, ScrollSpyService, SPY_CONFIG as ɵa };
//# sourceMappingURL=uniprank-ngx-scrollspy.js.map
