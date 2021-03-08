import { Injectable, ElementRef, Inject, InjectionToken, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { ScrollDirectionEnum } from './scroll-direction.enum';
const defaultElementId = 'window';
export const SPY_CONFIG = new InjectionToken(null);
export class ScrollSpyService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicmFyeS9uZ3gtc2Nyb2xsc3B5L3NyYy9saWIvc2Nyb2xsLXNweS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkUsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUl0RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztBQUVsQyxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQVksSUFBSSxDQUFDLENBQUM7QUFxQjlELE1BQU0sT0FBTyxnQkFBZ0I7SUFnQjNCLFlBQXNDLEdBQVEsRUFBa0MsTUFBa0I7UUFBNUQsUUFBRyxHQUFILEdBQUcsQ0FBSztRQWZ0QyxpQkFBWSxHQUFnRCxFQUFFLENBQUM7UUFDL0Qsb0JBQWUsR0FBMEQsRUFBRSxDQUFDO1FBQzVFLDRCQUF1QixHQUEwRSxFQUFFLENBQUM7UUFFcEcsMkJBQXNCLEdBQXlELEVBQUUsQ0FBQztRQUVsRixxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ2pDLGtCQUFhLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FB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Q0FBQztZQUM3QyxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNyRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7SUFFTSxVQUFVLENBQUMsTUFBYztRQUM5QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7OztZQXhPRixVQUFVOzs7NENBaUJJLE1BQU0sU0FBQyxRQUFROzRDQUFxQixNQUFNLFNBQUMsVUFBVSxjQUFHLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGF1ZGl0VGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTY3JvbGxPYmplY3RJbnRlcmZhY2UgfSBmcm9tICcuL3Njcm9sbC1vYmplY3QuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNjcm9sbEVsZW1lbnRJbnRlcmZhY2UgfSBmcm9tICcuL3Njcm9sbC1lbGVtZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTY3JvbGxEaXJlY3Rpb25FbnVtIH0gZnJvbSAnLi9zY3JvbGwtZGlyZWN0aW9uLmVudW0nO1xuXG5jb25zdCBkZWZhdWx0RWxlbWVudElkID0gJ3dpbmRvdyc7XG5cbmV4cG9ydCBjb25zdCBTUFlfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPFNweUNvbmZpZz4obnVsbCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3B5Q29uZmlnIHtcbiAgLyoqXG4gICAqIEBwYXJhbSBib29sZWFuIGxvb2tBaGVhZFxuICAgKiBTZXQgdGhlIGZpcnN0IHNjcm9sbCBpdGVtIGFjdGl2ZSBldmVuIHdoZW4gdGhlIHNjcm9sbCBlbGVtZW50IGhhcyBub3QgeWV0IGJlZW4gcmVhY2hlZFxuICAgKi9cbiAgbG9va0FoZWFkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwYXJhbSBib29sZWFuIGFjdGl2YXRlT25seVNldEl0ZW1zXG4gICAqIFNldCB0aGUgdGhlIHNjcm9sbCBpdGVtcyBhY3RpdmUgb25seSB3aGVuIHRoZSBzY3JvbGwgZWxlbWVudCByZWFjaGVkIHRoZSBzZXQgb2Zmc2V0IGFuZCBpcyBzdGlsbCBpbiB0aGUgdmlld3BvcnRcbiAgICovXG4gIGFjdGl2YXRlT25seVNldEl0ZW1zPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwYXJhbSBib29sZWFuIGFjdGl2YXRlT25seVNldEl0ZW1zXG4gICAqIFNldCB0aGUgdGhlIHNjcm9sbCBpdGVtcyBhY3RpdmUgb25seSB3aGVuIHRoZSBzY3JvbGwgZWxlbWVudCByZWFjaGVkIHRoZSBzZXQgb2Zmc2V0IGFuZCBpcyBzdGlsbCBpbiB0aGUgdmlld3BvcnRcbiAgICovXG4gIGF0dHJpYnV0ZVR5cGU/OiAnaWQnIHwgJ2RhdGEtaWQnO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2Nyb2xsU3B5U2VydmljZSB7XG4gIHByaXZhdGUgX3Njcm9sbEl0ZW1zOiB7IFtpdGVtSWQ6IHN0cmluZ106IFNjcm9sbE9iamVjdEludGVyZmFjZSB9ID0ge307XG4gIHByaXZhdGUgX3Njcm9sbEVsZW1lbnRzOiB7IFtzY3JvbGxFbGVtZW50SWQ6IHN0cmluZ106IFNjcm9sbEVsZW1lbnRJbnRlcmZhY2UgfSA9IHt9O1xuICBwcml2YXRlIF8kc2Nyb2xsRWxlbWVudExpc3RlbmVyOiB7IFtzY3JvbGxFbGVtZW50SWQ6IHN0cmluZ106IEJlaGF2aW9yU3ViamVjdDxTY3JvbGxPYmplY3RJbnRlcmZhY2U+IH0gPSB7fTtcblxuICBwcml2YXRlIF9zY3JvbGxFbGVtZW50TGlzdGVuZXI6IHsgW3Njcm9sbEVsZW1lbnRJZDogc3RyaW5nXTogU2Nyb2xsT2JqZWN0SW50ZXJmYWNlIH0gPSB7fTtcblxuICBwcml2YXRlIF9vblN0b3BMaXN0ZW5pbmcgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIF9yZXNpemVFdmVudHMgPSBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJykucGlwZShhdWRpdFRpbWUoMzAwKSwgdGFrZVVudGlsKHRoaXMuX29uU3RvcExpc3RlbmluZykpO1xuICBwcml2YXRlIF9zY3JvbGxFdmVudHMgPSBmcm9tRXZlbnQod2luZG93LCAnc2Nyb2xsJykucGlwZShhdWRpdFRpbWUoMTApLCB0YWtlVW50aWwodGhpcy5fb25TdG9wTGlzdGVuaW5nKSk7XG5cbiAgcHJpdmF0ZSBfbG9va0FoZWFkOiBib29sZWFuO1xuICBwcml2YXRlIF9hY3RpdmF0ZU9ubHlTZXRJdGVtczogYm9vbGVhbjtcblxuICByZWFkb25seSBhdHRyaWJ1dGVUeXBlOiAnaWQnIHwgJ2RhdGEtaWQnO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jOiBhbnksIEBJbmplY3QoU1BZX0NPTkZJRykgQE9wdGlvbmFsKCkgY29uZmlnPzogU3B5Q29uZmlnKSB7XG4gICAgdGhpcy5faW5pdFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihcbiAgICAgIGRlZmF1bHRFbGVtZW50SWQsXG4gICAgICB0aGlzLl9nZW5lcmF0ZVNjcm9sbEVsZW1lbnQoZGVmYXVsdEVsZW1lbnRJZCwgbmV3IEVsZW1lbnRSZWYoZG9jLmRvY3VtZW50RWxlbWVudCB8fCBkb2MuYm9keSksIFNjcm9sbERpcmVjdGlvbkVudW0udmVydGljYWwpXG4gICAgKTtcblxuICAgIHRoaXMuX3Jlc2l6ZUV2ZW50cy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fd2luZG93U2Nyb2xsKCkpO1xuICAgIHRoaXMuX3Njcm9sbEV2ZW50cy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fd2luZG93U2Nyb2xsKCkpO1xuICAgIHRoaXMuX3dpbmRvd1Njcm9sbCgpO1xuICAgIGlmIChjb25maWcgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2xvb2tBaGVhZCA9IGNvbmZpZy5sb29rQWhlYWQ7XG4gICAgICB0aGlzLl9hY3RpdmF0ZU9ubHlTZXRJdGVtcyA9IGNvbmZpZy5hY3RpdmF0ZU9ubHlTZXRJdGVtcztcbiAgICAgIHRoaXMuYXR0cmlidXRlVHlwZSA9IGNvbmZpZy5hdHRyaWJ1dGVUeXBlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sb29rQWhlYWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2FjdGl2YXRlT25seVNldEl0ZW1zID0gZmFsc2U7XG4gICAgICB0aGlzLmF0dHJpYnV0ZVR5cGUgPSAnaWQnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRTY3JvbGxFbGVtZW50TGlzdGVuZXIoc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcsIHNjcm9sbEVsZW1lbnQ6IFNjcm9sbEVsZW1lbnRJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICB0aGlzLl9zY3JvbGxFbGVtZW50c1tzY3JvbGxFbGVtZW50SWRdID0gc2Nyb2xsRWxlbWVudDtcbiAgICB0aGlzLl9zY3JvbGxFbGVtZW50TGlzdGVuZXJbc2Nyb2xsRWxlbWVudElkXSA9IG51bGw7XG4gICAgdGhpcy5fJHNjcm9sbEVsZW1lbnRMaXN0ZW5lcltzY3JvbGxFbGVtZW50SWRdID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dpbmRvd1Njcm9sbCgpIHtcbiAgICB0aGlzLnVwZGF0ZVNjcm9sbEVsZW1lbnQoZGVmYXVsdEVsZW1lbnRJZCk7XG4gIH1cblxuICBwcml2YXRlIF9nZW5lcmF0ZVNjcm9sbEVsZW1lbnQoXG4gICAgc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbkVudW0sXG4gICAgb2Zmc2V0OiBudW1iZXIgPSAwXG4gICk6IFNjcm9sbEVsZW1lbnRJbnRlcmZhY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogc2Nyb2xsRWxlbWVudElkLFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9mZnNldFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc2V0T2Zmc2V0KHNjcm9sbEVsZW1lbnRJZDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrU2Nyb2xsRWxlbWVudEV4aXN0cyhzY3JvbGxFbGVtZW50SWQpO1xuICAgIHRoaXMuX3Njcm9sbEVsZW1lbnRzW3Njcm9sbEVsZW1lbnRJZF0ub2Zmc2V0ID0gb2Zmc2V0O1xuICB9XG5cbiAgcHVibGljIHNldFNjcm9sbEVsZW1lbnQoc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcsIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uRW51bSwgb2Zmc2V0OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxFbGVtZW50Tm90RXhpc3RzKHNjcm9sbEVsZW1lbnRJZCk7XG4gICAgdGhpcy5faW5pdFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihzY3JvbGxFbGVtZW50SWQsIHRoaXMuX2dlbmVyYXRlU2Nyb2xsRWxlbWVudChzY3JvbGxFbGVtZW50SWQsIGVsZW1lbnRSZWYsIGRpcmVjdGlvbiwgb2Zmc2V0KSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1Njcm9sbEVsZW1lbnROb3RFeGlzdHMoc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2Nyb2xsRWxlbWVudHNbc2Nyb2xsRWxlbWVudElkXSAhPSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjcm9sbFNweVNlcnZpY2U6IFRoZSBzY3JvbGwgZWxlbWVudCB3aXRoIHRoZSBpZCBbJHtzY3JvbGxFbGVtZW50SWR9XSBleGlzdHMuYCk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBjaGVja1Njcm9sbEVsZW1lbnRFeGlzdHMoc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudHNbc2Nyb2xsRWxlbWVudElkXSAhPSBudWxsO1xuICB9XG5cbiAgcHVibGljIHNldEl0ZW0oaXRlbUlkOiBzdHJpbmcsIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHNjcm9sbEVsZW1lbnRJZCA9IGRlZmF1bHRFbGVtZW50SWQpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0l0ZW1Ob3RFeGlzdHMoaXRlbUlkKTtcbiAgICB0aGlzLl9zY3JvbGxJdGVtc1tpdGVtSWRdID0gdGhpcy5fZ2VuZXJhdGVTY3JvbGxPYmplY3QoaXRlbUlkLCBlbGVtZW50UmVmLCBzY3JvbGxFbGVtZW50SWQpO1xuICAgIHRoaXMuX3NldERlZmF1bHRJdGVtKGl0ZW1JZCwgc2Nyb2xsRWxlbWVudElkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrSXRlbU5vdEV4aXN0cyhpdGVtSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zY3JvbGxJdGVtc1tpdGVtSWRdICE9IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2Nyb2xsU3B5U2VydmljZTogVGhlIHNjcm9sbCBpdGVtIHdpdGggdGhlIGlkIFske2l0ZW1JZH1dIGV4aXN0cy5gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZW5lcmF0ZVNjcm9sbE9iamVjdChpZDogc3RyaW5nLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBzY3JvbGxFbGVtZW50SWQ6IHN0cmluZyk6IFNjcm9sbE9iamVjdEludGVyZmFjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkLFxuICAgICAgc2Nyb2xsRWxlbWVudElkLFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIG5hdGl2ZUVsZW1lbnQ6IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9zZXREZWZhdWx0SXRlbShpdGVtSWQ6IHN0cmluZywgc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbG9va0FoZWFkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IF92YWx1ZSA9IHRoaXMuX3Njcm9sbEVsZW1lbnRMaXN0ZW5lcltzY3JvbGxFbGVtZW50SWRdO1xuICAgIGlmIChfdmFsdWUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2V0U2Nyb2xsRWxlbWVudExpc3RlbmVyKHNjcm9sbEVsZW1lbnRJZCwgdGhpcy5fc2Nyb2xsSXRlbXNbaXRlbUlkXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0U2Nyb2xsRWxlbWVudExpc3RlbmVyKHNjcm9sbEVsZW1lbnRJZDogc3RyaW5nLCBzY3JvbGxPYmplY3Q6IFNjcm9sbE9iamVjdEludGVyZmFjZSk6IHZvaWQge1xuICAgIHRoaXMuX3Njcm9sbEVsZW1lbnRMaXN0ZW5lcltzY3JvbGxFbGVtZW50SWRdID0gc2Nyb2xsT2JqZWN0O1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fJHNjcm9sbEVsZW1lbnRMaXN0ZW5lcltzY3JvbGxFbGVtZW50SWRdLm5leHQoc2Nyb2xsT2JqZWN0KSk7XG4gIH1cblxuICBwdWJsaWMgY2hhbmdlU2Nyb2xsRWxlbWVudChpdGVtSWQ6IHN0cmluZywgb2xkRWxlbWVudElkOiBzdHJpbmcsIG5ld0VsZW1lbnRJZDogc3RyaW5nLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxFbGVtZW50RXhpc3RzKG9sZEVsZW1lbnRJZCk7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxFbGVtZW50RXhpc3RzKG5ld0VsZW1lbnRJZCk7XG4gICAgdGhpcy5fY2hlY2tJdGVtRXhpc3RzKGl0ZW1JZCk7XG5cbiAgICBjb25zdCBfc2Nyb2xsSXRlbSA9IHRoaXMuX3Njcm9sbEl0ZW1zW2l0ZW1JZF07XG4gICAgaWYgKChfc2Nyb2xsSXRlbS5zY3JvbGxFbGVtZW50SWQgIT09IGRlZmF1bHRFbGVtZW50SWQgJiYgb3ZlcnJpZGUpIHx8IF9zY3JvbGxJdGVtLnNjcm9sbEVsZW1lbnRJZCA9PT0gZGVmYXVsdEVsZW1lbnRJZCkge1xuICAgICAgdGhpcy5fc2Nyb2xsSXRlbXNbaXRlbUlkXS5zY3JvbGxFbGVtZW50SWQgPSBuZXdFbGVtZW50SWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0RGVmYXVsdEl0ZW0oaXRlbUlkLCBuZXdFbGVtZW50SWQpO1xuXG4gICAgY29uc3QgX29sZEVsZW1lbnRzID0gdGhpcy5fZ2V0RWxlbWVudEl0ZW1zKG9sZEVsZW1lbnRJZCk7XG4gICAgaWYgKF9vbGRFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9zZXREZWZhdWx0SXRlbShfb2xkRWxlbWVudHNbMF0uaWQsIG9sZEVsZW1lbnRJZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RWxlbWVudEl0ZW1zKHNjcm9sbEVsZW1lbnRJZDogc3RyaW5nKTogQXJyYXk8U2Nyb2xsT2JqZWN0SW50ZXJmYWNlPiB7XG4gICAgY29uc3QgX2l0ZW1zID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fc2Nyb2xsSXRlbXMpIHtcbiAgICAgIGlmICh0aGlzLl9zY3JvbGxJdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fc2Nyb2xsSXRlbXNba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlLnNjcm9sbEVsZW1lbnRJZCA9PT0gc2Nyb2xsRWxlbWVudElkKSB7XG4gICAgICAgICAgX2l0ZW1zLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfaXRlbXM7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0l0ZW1FeGlzdHMoaXRlbUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2Nyb2xsSXRlbXNbaXRlbUlkXSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjcm9sbFNweVNlcnZpY2U6IFRoZSBzY3JvbGwgaXRlbSB3aXRoIHRoZSBpZCBbJHtpdGVtSWR9XSBkb2Vzbid0IGV4aXN0LmApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvYnNlcnZlKHNjcm9sbEVsZW1lbnRJZDogc3RyaW5nID0gZGVmYXVsdEVsZW1lbnRJZCk6IE9ic2VydmFibGU8U2Nyb2xsT2JqZWN0SW50ZXJmYWNlPiB7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxFbGVtZW50RXhpc3RzKHNjcm9sbEVsZW1lbnRJZCk7XG4gICAgcmV0dXJuIHRoaXMuXyRzY3JvbGxFbGVtZW50TGlzdGVuZXJbc2Nyb2xsRWxlbWVudElkXS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrU2Nyb2xsRWxlbWVudEV4aXN0cyhzY3JvbGxFbGVtZW50SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zY3JvbGxFbGVtZW50c1tzY3JvbGxFbGVtZW50SWRdID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2Nyb2xsU3B5U2VydmljZTogVGhlIHNjcm9sbCBlbGVtZW50IHdpdGggdGhlIGlkIFske3Njcm9sbEVsZW1lbnRJZH1dIGRvZXNuJ3QgZXhpc3QuYCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVNjcm9sbEVsZW1lbnQoc2Nyb2xsRWxlbWVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja1Njcm9sbEVsZW1lbnRFeGlzdHMoc2Nyb2xsRWxlbWVudElkKTtcblxuICAgIGNvbnN0IF9lbGVtZW50ID0gdGhpcy5fc2Nyb2xsRWxlbWVudHNbc2Nyb2xsRWxlbWVudElkXTtcbiAgICBjb25zdCBfZWxlbWVudEl0ZW1zID0gdGhpcy5fZ2V0RWxlbWVudEl0ZW1zKHNjcm9sbEVsZW1lbnRJZCk7XG5cbiAgICBjb25zdCBfbmV4dEFjdGl2ZUl0ZW0gPSB0aGlzLl9nZXRBY3RpdmVJdGVtKF9lbGVtZW50LCBfZWxlbWVudEl0ZW1zKTtcbiAgICBjb25zdCBfY3VycmVudEFjdGl2ZUl0ZW0gPSB0aGlzLl9zY3JvbGxFbGVtZW50TGlzdGVuZXJbc2Nyb2xsRWxlbWVudElkXTtcblxuICAgIGlmIChfY3VycmVudEFjdGl2ZUl0ZW0gPT0gbnVsbCkge1xuICAgICAgaWYgKF9uZXh0QWN0aXZlSXRlbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NldFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihzY3JvbGxFbGVtZW50SWQsIF9uZXh0QWN0aXZlSXRlbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfbmV4dEFjdGl2ZUl0ZW0gIT0gbnVsbCkge1xuICAgICAgaWYgKF9jdXJyZW50QWN0aXZlSXRlbS5pZCAhPT0gX25leHRBY3RpdmVJdGVtLmlkKSB7XG4gICAgICAgIHRoaXMuX3NldFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihzY3JvbGxFbGVtZW50SWQsIF9uZXh0QWN0aXZlSXRlbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfbmV4dEFjdGl2ZUl0ZW0gPT0gbnVsbCAmJiB0aGlzLl9sb29rQWhlYWQpIHtcbiAgICAgIHRoaXMuX3NldFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihzY3JvbGxFbGVtZW50SWQsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldEFjdGl2ZUl0ZW0oc2Nyb2xsRWxlbWVudDogU2Nyb2xsRWxlbWVudEludGVyZmFjZSwgbGlzdE9mRWxlbWVudHM6IEFycmF5PFNjcm9sbE9iamVjdEludGVyZmFjZT4pOiBTY3JvbGxPYmplY3RJbnRlcmZhY2Uge1xuICAgIGNvbnN0IF9kaXJlY3Rpb24gPSBzY3JvbGxFbGVtZW50LmRpcmVjdGlvbjtcbiAgICBsZXQgX3Njcm9sbE9iamVjdCA9IG51bGw7XG5cbiAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gc2Nyb2xsRWxlbWVudC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGlzdE9mRWxlbWVudHMuZm9yRWFjaCgoX2VsZW1lbnQpID0+IHtcbiAgICAgIGxldCBfYWN0aXZlID0gZmFsc2U7XG4gICAgICBzd2l0Y2ggKF9kaXJlY3Rpb24pIHtcbiAgICAgICAgY2FzZSBTY3JvbGxEaXJlY3Rpb25FbnVtLmhvcml6b250YWw6XG4gICAgICAgICAgY29uc3QgX3Njcm9sbExlZnQgPSBzY3JvbGxFbGVtZW50LmlkLnRvTG93ZXJDYXNlKCkgPT09ICd3aW5kb3cnID8gKHdpbmRvdyAmJiB3aW5kb3cucGFnZVhPZmZzZXQpIHx8IDAgOiBuYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAgICAgX2FjdGl2ZSA9IF9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCA8PSBfc2Nyb2xsTGVmdCArIHNjcm9sbEVsZW1lbnQub2Zmc2V0O1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBjb25zdCBfc2Nyb2xsVG9wID0gc2Nyb2xsRWxlbWVudC5pZC50b0xvd2VyQ2FzZSgpID09PSAnd2luZG93JyA/ICh3aW5kb3cgJiYgd2luZG93LnBhZ2VZT2Zmc2V0KSB8fCAwIDogbmF0aXZlRWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgaWYgKHRoaXMuX2FjdGl2YXRlT25seVNldEl0ZW1zKSB7XG4gICAgICAgICAgICBfYWN0aXZlID1cbiAgICAgICAgICAgICAgX2VsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgPCBfc2Nyb2xsVG9wICsgc2Nyb2xsRWxlbWVudC5vZmZzZXQgJiZcbiAgICAgICAgICAgICAgX2VsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgKyBfZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCA+IF9zY3JvbGxUb3AgKyBzY3JvbGxFbGVtZW50Lm9mZnNldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2FjdGl2ZSA9IF9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIDw9IF9zY3JvbGxUb3AgKyBzY3JvbGxFbGVtZW50Lm9mZnNldDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfYWN0aXZlKSB7XG4gICAgICAgIF9zY3JvbGxPYmplY3QgPSBfZWxlbWVudDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gX3Njcm9sbE9iamVjdDtcbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVTY3JvbGxFbGVtZW50KHNjcm9sbEVsZW1lbnRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHNjcm9sbEVsZW1lbnRJZCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgIHRoaXMuX3NldFNjcm9sbEVsZW1lbnRMaXN0ZW5lcihzY3JvbGxFbGVtZW50SWQsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jaGVja1Njcm9sbEVsZW1lbnRFeGlzdHMoc2Nyb2xsRWxlbWVudElkKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY3JvbGxFbGVtZW50c1tzY3JvbGxFbGVtZW50SWRdO1xuICAgICAgZGVsZXRlIHRoaXMuXyRzY3JvbGxFbGVtZW50TGlzdGVuZXJbc2Nyb2xsRWxlbWVudElkXTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY3JvbGxFbGVtZW50TGlzdGVuZXJbc2Nyb2xsRWxlbWVudElkXTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlSXRlbShpdGVtSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zY3JvbGxJdGVtc1tpdGVtSWRdICE9IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY3JvbGxJdGVtc1tpdGVtSWRdO1xuICAgIH1cbiAgfVxufVxuIl19