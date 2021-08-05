import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import * as $ from 'jquery'

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  animations: [trigger("fade", [  // fade animation
    state("void", style({ opacity: 1 })),
    transition("void <=> *", [style({ opacity: 1, width: '0' }),
    animate(300)])
  ])]
})

export class ImagePreviewComponent implements OnInit {
  master: string;
  anomaly: any;
  windowWidth: any;
  masterMagnifyVal = 1;
  selectedSlide: number = 0;
  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  constructor(public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, carouselConfig: NgbCarouselConfig
  ) {
    carouselConfig.interval = 0;
    carouselConfig.wrap = true;
    carouselConfig.keyboard = true;
    carouselConfig.pauseOnHover = false;
    carouselConfig.pauseOnFocus = true;

    // carouselConfig.showNavigationArrows = false;
    // carouselConfig.showNavigationIndicators = false;

    dialogRef.beforeClosed().subscribe(data => {
      console.log("before close");
      dialogRef.close(this.anomaly);
    });
    //carouselConfig. = 2;

    this.windowWidth = window.innerWidth - 50;
    if (data.master == null || data.master == undefined || data.master == "") {
      this.master = "";
      this.windowWidth = this.windowWidth / 2;
    }
    else {
      this.master = '../../../../assets/images/algorithm/' + data.master;
    }


    if (data.anomaly) {
      data.anomaly.forEach((element, index) => {
        if (element.selected == true) {
          this.selectedSlide = index;
        }
      });
    }
    this.anomaly = data.anomaly;
  }

  ngOnInit(): void {

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.key.indexOf("ArrowRight") !== -1) {
      this.myCarousel.arrowRight();
    }
    else if (event.key.indexOf("ArrowLeft") !== -1) {
      this.myCarousel.arrowLeft();
    }
    else if (event.code.indexOf("Space") !== -1) {
      this.closeBox();
    }
  }

  closeBox() {
    this.dialogRef.close();
  }
  zoomScroll(event) {
    console.log(event);
  }

  animateImage() {
    console.log("Toggle");
    $("#zoom1").hide('slide', { direction: 'left' }, 1000);
    //this.div1 = !this.div1;
  }

  prevSlide(event) {

    this.anomaly[event.prev].selected = false;
    this.anomaly[event.current].selected = true;
  }

}
