import { EventEmitter, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
export declare class ScrollItemDirective implements OnDestroy, AfterViewInit {
    private _scrollSpyService;
    private _cdr;
    classActive: boolean;
    itemId: string;
    scrollElement: string;
    activeEvent: EventEmitter<boolean>;
    private _subscriber;
    constructor(_scrollSpyService: ScrollSpyService, _cdr: ChangeDetectorRef);
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
}
