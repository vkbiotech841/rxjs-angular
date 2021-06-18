import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomObserableService {

  constructor() { }

  public httpCustomObservable(url: string) {
    return new Observable(observer => {
      fetch(url)
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
  }
}
