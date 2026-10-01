import { Directive, ElementRef, inject, Input, input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appIfElse]',
})
export class IfElse implements OnChanges {

  appIfElse = input<string[]>([], { alias: 'appIfElse' });
  tr = inject(TemplateRef);
  vc = inject(ViewContainerRef);
  currentRole = 'admin';
  ngOnChanges(changes: SimpleChanges): void {
    this.vc.clear();
    if (this.appIfElse().includes(this.currentRole)) {
      this.vc.createEmbeddedView(this.tr);
    }
  }

}
