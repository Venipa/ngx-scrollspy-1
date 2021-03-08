import { Directive, Input, ElementRef, HostBinding, ChangeDetectorRef } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
export class ScrollSpyDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWJyYXJ5L25neC1zY3JvbGxzcHkvc3JjL2xpYi9zY3JvbGwtc3B5LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFpQixLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBYSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd2SCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUt4RCxNQUFNLE9BQU8sa0JBQWtCO0lBUTdCLFlBQW9CLEdBQWUsRUFBVSxpQkFBbUMsRUFBVSxJQUF1QjtRQUE3RixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQVUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQW1CO1FBUHBGLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBR3hDLGtCQUFhLEdBQUcsUUFBUSxDQUFDO0lBSWtGLENBQUM7SUFFckgsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFGLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtnQkFDbkIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO29CQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDdEQsUUFBUSxHQUFHLFNBQVMsQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7OztZQXJDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7O1lBUHlDLFVBQVU7WUFHM0MsZ0JBQWdCO1lBSHFELGlCQUFpQjs7OzBCQVM1RixXQUFXLFNBQUMsY0FBYztxQkFFMUIsS0FBSyxTQUFDLGNBQWM7NEJBQ3BCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEFmdGVyVmlld0luaXQsIElucHV0LCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgT25EZXN0cm95LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFNjcm9sbFNweVNlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC1zcHkuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t1bmlTY3JvbGxTcHldJ1xufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxTcHlEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmFjdGl2ZScpIGNsYXNzQWN0aXZlID0gZmFsc2U7XG5cbiAgQElucHV0KCd1bmlTY3JvbGxTcHknKSBpdGVtSWQ6IHN0cmluZztcbiAgQElucHV0KCkgc2Nyb2xsRWxlbWVudCA9ICd3aW5kb3cnO1xuXG4gIHByaXZhdGUgX3N1YnNjcmliZXI6IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfc2Nyb2xsU3B5U2VydmljZTogU2Nyb2xsU3B5U2VydmljZSwgcHJpdmF0ZSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaWJlcikge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zY3JvbGxTcHlTZXJ2aWNlLmRlbGV0ZUl0ZW0odGhpcy5pdGVtSWQpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX3N1YnNjcmliZXIgPSB0aGlzLl9zY3JvbGxTcHlTZXJ2aWNlLm9ic2VydmUodGhpcy5zY3JvbGxFbGVtZW50KS5zdWJzY3JpYmUoKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgX2FjdGl2ZSA9IGVsZW1lbnQuaWQgPT09IHRoaXMuaXRlbUlkO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsYXNzQWN0aXZlID0gX2FjdGl2ZTtcbiAgICAgICAgICB0aGlzLl9jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3Njcm9sbFNweVNlcnZpY2Uuc2V0SXRlbSh0aGlzLml0ZW1JZCwgdGhpcy5fZWwsIHRoaXMuc2Nyb2xsRWxlbWVudCk7XG5cbiAgICBsZXQgX2tleVR5cGUgPSAnaWQnO1xuICAgIGlmICh0aGlzLl9zY3JvbGxTcHlTZXJ2aWNlLmF0dHJpYnV0ZVR5cGUgPT09ICdkYXRhLWlkJykge1xuICAgICAgX2tleVR5cGUgPSAnZGF0YS1pZCc7XG4gICAgfVxuICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKF9rZXlUeXBlLCB0aGlzLml0ZW1JZCk7XG4gIH1cbn1cbiJdfQ==