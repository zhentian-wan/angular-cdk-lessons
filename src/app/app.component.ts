import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DialogComponent } from './overlay-example/dialog/dialog.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayPositionBuilder,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Platform } from '@angular/cdk/platform';
import { map } from 'rxjs/operators';
import { DropDownSearchComponent } from './overlay-example/drop-down-search/drop-down-search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-cdk-lessons';
  isWideScreen$: Observable<boolean>;
  @ViewChild(DropDownSearchComponent, { read: ElementRef, static: true })
  dropdown;

  constructor(
    private overly: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    public platform: Platform,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    if (this.breakpointObserver.isMatched('(max-width: 600px)')) {
      console.info('The screen width is less than 600px');
    }
    this.isWideScreen$ = this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape])
      .pipe(map(({ matches }) => matches));
  }

  createDialog() {
    const overlayRef = this.overly.create({
      hasBackdrop: true,
      positionStrategy: this.positionBuilder
        .global()
        .centerHorizontally()
        .centerVertically(),
      // .flexibleConnectedTo(this.dropdown)
      // .withPositions([
      //   {
      //     // here, top-left of the overlay is connected to bottom-left of the origin;
      //     // of course, you can change this object or generate it dynamically;
      //     // moreover, you can specify multiple objects in this array for CDK to find the most suitable option
      //     originX: 'center',
      //     originY: 'bottom',
      //     overlayX: 'center',
      //     overlayY: 'top',
      //   } as ConnectedPosition,
      // ])
      // .withPush(false),
    });
    const dialogPortal = new ComponentPortal(DialogComponent);
    overlayRef.attach(dialogPortal);
    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }
}
