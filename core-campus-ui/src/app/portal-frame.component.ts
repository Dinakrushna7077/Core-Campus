import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-portal-frame',
  standalone: true,
  template: '<iframe class="portal-frame" [src]="frameUrl" [title]="label"></iframe>',
  styles: [':host{display:block;min-height:100vh}.portal-frame{display:block;width:100%;height:100vh;min-height:700px;border:0;background:#f8fafc}']
})
export class PortalFrameComponent {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  frameUrl: SafeResourceUrl;
  label: string;

  constructor() {
    const page = (this.route.snapshot.data['page'] as string) || 'index.html';
    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/legacy/' + page);
    this.label = (this.route.snapshot.data['label'] as string) || 'SmartCampus Portal';
  }
}
