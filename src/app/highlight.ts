import { Directive, ElementRef, HostBinding, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class Highlight {

  highlight = input<string>('yellow');
  er = inject(ElementRef);


  @HostListener('mouseenter')
  mouseEnter() {
    console.log("Called", this.highlight());

    this.bg = this.highlight()
  }

  @HostBinding('style.backgroundColor')
  bg: string = 'yellow'

}
