import { Directive, HostListener, ElementRef, Input, ContentChildren, QueryList } from '@angular/core';
import { ScrollDirectionEnum } from './scroll-direction.enum';
import { ScrollSpyService } from './scroll-spy.service';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
export class ScrollElementDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWVsZW1lbnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicmFyeS9uZ3gtc2Nyb2xsc3B5L3NyYy9saWIvc2Nyb2xsLWVsZW1lbnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQXFCLGVBQWUsRUFBRSxTQUFTLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXpJLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUt6RCxNQUFNLE9BQU8sc0JBQXNCO0lBY2pDLFlBQW9CLEdBQWUsRUFBVSxpQkFBbUM7UUFBNUQsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFieEUsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFL0IsY0FBUyxHQUF3QixtQkFBbUIsQ0FBQyxRQUFRLENBQUM7UUFDOUQsZ0NBQTJCLEdBQVksSUFBSSxDQUFDO0lBVThCLENBQUM7SUFKcEYsUUFBUSxDQUFDLE1BQU07UUFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFJRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsMkJBQTJCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVMLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUU7WUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQThCLEVBQUUsRUFBRTtZQUM3SCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ3BELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUcsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBRyxJQUFJLENBQUMsMkJBQTJCO1lBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hCLENBQUM7OztZQXZDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjthQUMvQjs7O1lBVmlDLFVBQVU7WUFHbkMsZ0JBQWdCOzs7d0JBVXRCLEtBQUssU0FBQyxrQkFBa0I7d0JBQ3hCLEtBQUs7MENBQ0wsS0FBSztpQ0FFTCxlQUFlLFNBQUMsa0JBQWtCLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFO3VCQUd6RCxZQUFZLFNBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQsIE9uRGVzdHJveSwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU2Nyb2xsRGlyZWN0aW9uRW51bSB9IGZyb20gJy4vc2Nyb2xsLWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7IFNjcm9sbFNweVNlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC1zcHkuc2VydmljZSc7XG5pbXBvcnQgeyBTY3JvbGxTcHlEaXJlY3RpdmUgfSBmcm9tICcuL3Njcm9sbC1zcHkuZGlyZWN0aXZlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbdW5pU2Nyb2xsRWxlbWVudF0nXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEVsZW1lbnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgQElucHV0KCd1bmlTY3JvbGxFbGVtZW50JykgZWxlbWVudElkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uRW51bSA9IFNjcm9sbERpcmVjdGlvbkVudW0udmVydGljYWw7XG4gIEBJbnB1dCgpIGRlc3Ryb3lFbGVtZW50c1N1YnNjcmlwdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihTY3JvbGxTcHlEaXJlY3RpdmUsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgcHJpdmF0ZSBfc2Nyb2xsU3B5RWxlbWVudHM6IFF1ZXJ5TGlzdDxTY3JvbGxTcHlEaXJlY3RpdmU+O1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3Njcm9sbCcsIFsnJGV2ZW50J10pXG4gIG9uU2Nyb2xsKCRldmVudCkge1xuICAgIHRoaXMuX3Njcm9sbFNweVNlcnZpY2UudXBkYXRlU2Nyb2xsRWxlbWVudCh0aGlzLmVsZW1lbnRJZCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsU3B5U2VydmljZTogU2Nyb2xsU3B5U2VydmljZSkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZXN0cm95RWxlbWVudHNTdWJzY3JpcHRpb24gfHwgIXRoaXMuX3Njcm9sbFNweVNlcnZpY2UuY2hlY2tTY3JvbGxFbGVtZW50RXhpc3RzKHRoaXMuZWxlbWVudElkKSkgdGhpcy5fc2Nyb2xsU3B5U2VydmljZS5zZXRTY3JvbGxFbGVtZW50KHRoaXMuZWxlbWVudElkLCB0aGlzLl9lbCwgdGhpcy5kaXJlY3Rpb24pO1xuICAgIGlmICh0aGlzLl9zY3JvbGxTcHlTZXJ2aWNlLmF0dHJpYnV0ZVR5cGUgPT09ICdpZCcpIHtcbiAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuZWxlbWVudElkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmVsZW1lbnRJZCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX3Njcm9sbFNweUVsZW1lbnRzLmNoYW5nZXMucGlwZShkZWJvdW5jZVRpbWUoMTApLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKGVsZW1lbnRzOiBTY3JvbGxTcHlEaXJlY3RpdmVbXSkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsU3B5U2VydmljZS5jaGFuZ2VTY3JvbGxFbGVtZW50KGVsZW1lbnQuaXRlbUlkLCBlbGVtZW50LnNjcm9sbEVsZW1lbnQsIHRoaXMuZWxlbWVudElkLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYodGhpcy5kZXN0cm95RWxlbWVudHNTdWJzY3JpcHRpb24pIHRoaXMuX3Njcm9sbFNweVNlcnZpY2UuZGVsZXRlU2Nyb2xsRWxlbWVudCh0aGlzLmVsZW1lbnRJZCk7XG4gICAgdGhpcy5fZGVzdHJveSQubmV4dCgpO1xuICB9XG59XG4iXX0=