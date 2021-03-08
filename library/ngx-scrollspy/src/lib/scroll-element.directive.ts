import { Directive, HostListener, ElementRef, Input, OnInit, OnDestroy, ContentChildren, QueryList, AfterViewInit } from '@angular/core';

import { ScrollDirectionEnum } from './scroll-direction.enum';
import { ScrollSpyService } from './scroll-spy.service';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[uniScrollElement]'
})
export class ScrollElementDirective implements OnInit, AfterViewInit, OnDestroy {
  private _destroy$ = new Subject<void>();
  @Input('uniScrollElement') elementId: string;
  @Input() direction: ScrollDirectionEnum = ScrollDirectionEnum.vertical;
  @Input() destroyElementsSubscription: boolean = true;

  @ContentChildren(ScrollSpyDirective, { descendants: true })
  private _scrollSpyElements: QueryList<ScrollSpyDirective>;

  @HostListener('scroll', ['$event'])
  onScroll($event) {
    this._scrollSpyService.updateScrollElement(this.elementId);
  }

  constructor(private _el: ElementRef, private _scrollSpyService: ScrollSpyService) {}

  ngOnInit(): void {
    if (this.destroyElementsSubscription || !this._scrollSpyService.checkScrollElementExists(this.elementId)) this._scrollSpyService.setScrollElement(this.elementId, this._el, this.direction);
    if (this._scrollSpyService.attributeType === 'id') {
      this._el.nativeElement.setAttribute('id', this.elementId);
    } else {
      this._el.nativeElement.setAttribute('data-id', this.elementId);
    }
  }

  ngAfterViewInit(): void {
    this._scrollSpyElements.changes.pipe(debounceTime(10), takeUntil(this._destroy$)).subscribe((elements: ScrollSpyDirective[]) => {
      if (elements.length > 0) elements.forEach((element) => {
        this._scrollSpyService.changeScrollElement(element.itemId, element.scrollElement, this.elementId, true);
      });
    });
  }

  ngOnDestroy(): void {
    if(this.destroyElementsSubscription) this._scrollSpyService.deleteScrollElement(this.elementId);
    this._destroy$.next();
  }
}
