import { Observable } from "rxjs";

// Creating Custome Observable:
// The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses.

export function httpCustomObservable(url: string) {
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