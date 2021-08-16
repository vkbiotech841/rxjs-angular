import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { CustomObserableService } from '../common/custom-obserable.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public beginnerCourses: Course[];
    public advanceCourses: Course[];

    public beginnerCourses$: Observable<Course[]>;
    public advanceCourses$: Observable<Course[]>;

    constructor(
        public customObserableService: CustomObserableService
    ) {

    }

    ngOnInit() {
        this.callingHttpObservable();
    }


    public callingHttpObservable() {
        // First observalbe
        const https$ = this.customObserableService.httpCustomObservable('/api/courses');

        // second observable and map() operator
        const courses$ = https$
            .pipe(
                // catchError(err => {
                //     console.log("Error Occurred", err)
                //     return throwError(err)
                // }),
                // finalize(() => {
                //     console.log("Finished executed..")
                // }),
                tap((value) => console.log("HTTP request executed", value)),
                map(res => Object.values(res["payload"])),
                shareReplay(),
                // catchError(err => of([
                //     {
                //         id: 0,
                //         description: "RxJs In Practice Course",
                //         iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                //         courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                //         longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
                //         category: 'BEGINNER',
                //         lessonsCount: 10
                //     }
                // ])),
                retryWhen(errors => errors
                    .pipe(delayWhen(() => timer(2000)))
                )

            );



        // Subscribing 

        // Method 01: subscribing the at the component level

        // Here, we are subscribing and passing the beginnerCourses and advanceCoures as an input to child component.Hence,we need to unsubscribe manually.

        // courses$
        //     .subscribe((courses: Course[]) => {
        //         this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
        //         this.advanceCourses = courses.filter(course => course.category === 'ADVANCED');
        //         console.log("coureses", this.advanceCourses, this.advanceCourses);
        //     },
        //         () => { },
        //         () => console.log("completed")
        //     )

        // Method 02: Using async pipe in the html

        // In this is async pipe does the subscription and unsubscription together. Hence, prevent memory leaks. This is more appropriate method of data transfer.For this instead of subscribing the Courses observerable, we need to creaete a new observable and subscribe it using async pipe in the HTML.

        // asyn subscription 01
        this.beginnerCourses$ = courses$
            .pipe(
                map((courses: Course[]) =>
                    courses.filter(course => course.category === "BEGINNER"))
            );

        // asyn subscription 02
        this.advanceCourses$ = courses$
            .pipe(
                map((courses: Course[]) =>
                    courses.filter(course => course.category === "ADVANCED"))
            );

        // Problem: Here, we have two subscription (one for beginnerCourses$ and another for advanceCourses$  ) that means two times api is getting called. Hence this is not a good way. We need to reduce the api calls.

        // Method 03: One api call and sharing of obserable using shareReplay() operator
        // Simply we need to adding shareReply() operator in the first observable and it will not call two APIs. Instead it will share the result on subscribtion.


        // ERROR Handling stretegy:
        // (1) Catch the error (catchError() operator): it will catch the error and provide an alternative observable in replacement to the actual observable. Here, we are using of () operator which gives only one value and we are return only only course description.
        // (2) throwError method: first we can throwError then we can release the memory spaces using finalize () operator.
        // (2) Retry method: retryWhen() operator



    }

}
