import { Directive, Input, Output, EventEmitter, HostBinding, ChangeDetectorRef } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
export class ScrollItemDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGlicmFyeS9uZ3gtc2Nyb2xsc3B5L3NyYy9saWIvc2Nyb2xsLWl0ZW0uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQWEsV0FBVyxFQUFpQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdqSSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUt4RCxNQUFNLE9BQU8sbUJBQW1CO0lBVTVCLFlBQW9CLGlCQUFtQyxFQUFVLElBQXVCO1FBQXBFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQVQzRCxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUd4QyxrQkFBYSxHQUFHLFFBQVEsQ0FBQztRQUV4QixnQkFBVyxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBSXlCLENBQUM7SUFFNUYsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2xDO0lBQ0wsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3hGLElBQUksT0FBTyxDQUFDO1lBQ1osSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO2dCQUNqQixPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNsQztpQkFBTTtnQkFDSCxPQUFPLEdBQUcsS0FBSyxDQUFDO2FBQ25CO1lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztnQkFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7O1lBcENKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsaUJBQWlCO2FBQzlCOzs7WUFKUSxnQkFBZ0I7WUFIK0QsaUJBQWlCOzs7MEJBU3BHLFdBQVcsU0FBQyxjQUFjO3FCQUUxQixLQUFLLFNBQUMsZUFBZTs0QkFDckIsS0FBSzswQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgSG9zdEJpbmRpbmcsIEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU2Nyb2xsU3B5U2VydmljZSB9IGZyb20gJy4vc2Nyb2xsLXNweS5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbdW5pU2Nyb2xsSXRlbV0nXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEl0ZW1EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuYWN0aXZlJykgY2xhc3NBY3RpdmUgPSBmYWxzZTtcblxuICAgIEBJbnB1dCgndW5pU2Nyb2xsSXRlbScpIGl0ZW1JZDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNjcm9sbEVsZW1lbnQgPSAnd2luZG93JztcblxuICAgIEBPdXRwdXQoKSBhY3RpdmVFdmVudDogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2Nyb2xsU3B5U2VydmljZTogU2Nyb2xsU3B5U2VydmljZSwgcHJpdmF0ZSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fc3Vic2NyaWJlcikge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zdWJzY3JpYmVyID0gdGhpcy5fc2Nyb2xsU3B5U2VydmljZS5vYnNlcnZlKHRoaXMuc2Nyb2xsRWxlbWVudCkuc3Vic2NyaWJlKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgX2FjdGl2ZTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBfYWN0aXZlID0gZWxlbWVudC5pZCA9PT0gdGhpcy5pdGVtSWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVFdmVudC5lbWl0KF9hY3RpdmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NBY3RpdmUgPSBfYWN0aXZlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=