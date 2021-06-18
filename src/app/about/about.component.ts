import { CustomObserableService } from './../common/custom-obserable.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    public customObserableService: CustomObserableService

  ) { }

  ngOnInit() {
  }









}
