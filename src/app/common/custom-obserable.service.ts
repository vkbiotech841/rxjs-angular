import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomObserableService {

  constructor() { }

  public httpCustomObservable(url: string): Observable<any> {
    return new Observable(observer => {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(url, { signal })
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

      return () => controller.abort()
    })
  }
}
