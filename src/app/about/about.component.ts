import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, Observable } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    this.httpCustomObservable();

  }


  // Creating Custome Observable:

  public httpCustomObservable() {

    const https$ = Observable.create(observer => {
      fetch('/api/courses')
        .then(response => {
          return response.json();
        })
        .then(body => {

          observer.next(body);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        })
    })

    https$.subscribe(
      courses => console.log("courses", courses),
      () => { },
      () => console.log("completed")
    )

  }






}
