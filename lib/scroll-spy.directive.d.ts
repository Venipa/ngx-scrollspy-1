import { AfterViewInit, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
export declare class ScrollSpyDirective implements AfterViewInit, OnDestroy {
    private _el;
    private _scrollSpyService;
    private _cdr;
    classActive: boolean;
    itemId: string;
    scrollElement: string;
    private _subscriber;
    constructor(_el: ElementRef, _scrollSpyService: ScrollSpyService, _cdr: ChangeDetectorRef);
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
}
