import { ElementRef, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScrollObjectInterface } from './scroll-object.interface';
import { ScrollDirectionEnum } from './scroll-direction.enum';
export declare const SPY_CONFIG: InjectionToken<SpyConfig>;
export interface SpyConfig {
    /**
     * @param boolean lookAhead
     * Set the first scroll item active even when the scroll element has not yet been reached
     */
    lookAhead?: boolean;
    /**
     * @param boolean activateOnlySetItems
     * Set the the scroll items active only when the scroll element reached the set offset and is still in the viewport
     */
    activateOnlySetItems?: boolean;
    /**
     * @param boolean activateOnlySetItems
     * Set the the scroll items active only when the scroll element reached the set offset and is still in the viewport
     */
    attributeType?: 'id' | 'data-id';
}
export declare class ScrollSpyService {
    private doc;
    private _scrollItems;
    private _scrollElements;
    private _$scrollElementListener;
    private _scrollElementListener;
    private _onStopListening;
    private _resizeEvents;
    private _scrollEvents;
    private _lookAhead;
    private _activateOnlySetItems;
    readonly attributeType: 'id' | 'data-id';
    constructor(doc: any, config?: SpyConfig);
    private _initScrollElementListener;
    private _windowScroll;
    private _generateScrollElement;
    setOffset(scrollElementId: string, offset: number): void;
    setScrollElement(scrollElementId: string, elementRef: ElementRef, direction: ScrollDirectionEnum, offset?: number): void;
    private _checkScrollElementNotExists;
    checkScrollElementExists(scrollElementId: string): boolean;
    setItem(itemId: string, elementRef: ElementRef, scrollElementId?: string): void;
    private _checkItemNotExists;
    private _generateScrollObject;
    private _setDefaultItem;
    private _setScrollElementListener;
    changeScrollElement(itemId: string, oldElementId: string, newElementId: string, override?: boolean): void;
    private _getElementItems;
    private _checkItemExists;
    observe(scrollElementId?: string): Observable<ScrollObjectInterface>;
    private _checkScrollElementExists;
    updateScrollElement(scrollElementId: string): void;
    private _getActiveItem;
    deleteScrollElement(scrollElementId: string): void;
    deleteItem(itemId: string): void;
}
