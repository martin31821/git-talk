import { Component, OnInit, QueryList, ContentChildren, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SlideComponent } from '../slide/slide.component';

@Component({
  selector: 'chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements AfterViewInit {
  @ContentChildren(SlideComponent) private _slides: QueryList<SlideComponent>;

  public order = 0;
  public prevOrder = 0;
  public prevOrderSubject = new BehaviorSubject<number>(0);
  public chapter = 0;
  public chapterSubject = new BehaviorSubject<number>(0);

  constructor(private changeDetector: ChangeDetectorRef) {
    this.chapterSubject.subscribe(v => {
      this.chapter = v;
    });
    this.prevOrderSubject.subscribe(v => {
      this.prevOrder = v;
    });
  }

  public change(): void {
    this.changeDetector.detectChanges();
  }

  public assignSlidePositions(start: number): number {
    this._slides.forEach(slide => {
      slide.position.next(++start);
    });

    return start;
  }

  public setSlideCount(count: number): void {
    this._slides.forEach(slide => {
      slide.slideCount.next(count);
    });
  }

  public ngAfterViewInit(): void {
    this._slides.forEach((slide) => {
      slide.subscribe(this.prevOrderSubject, this.chapterSubject);
      slide.order = this.order++;
    });
    this.order--;
  }
}
