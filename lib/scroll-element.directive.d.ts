import { ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ScrollDirectionEnum } from './scroll-direction.enum';
import { ScrollSpyService } from './scroll-spy.service';
export declare class ScrollElementDirective implements OnInit, AfterViewInit, OnDestroy {
    private _el;
    private _scrollSpyService;
    private _destroy$;
    elementId: string;
    direction: ScrollDirectionEnum;
    destroyElementsSubscription: boolean;
    private _scrollSpyElements;
    onScroll($event: any): void;
    constructor(_el: ElementRef, _scrollSpyService: ScrollSpyService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
