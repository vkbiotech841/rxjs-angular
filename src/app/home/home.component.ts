import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
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
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"])),
                shareReplay()
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

        // In this is async pipe does the subscription and unsubscription together. Hence, prevent memory leaks. This is more appropriate method of data transfer.
        // For this instread of subscribing the Courses observerable, we need to creaete a new observable.

        // asyn subscription 01
        this.beginnerCourses$ = courses$
            .pipe(
                map((courses: Course[]) =>
                    courses.filter(course => course.category === "BEGINNER"))
            );

        // asyn subscription 01
        this.advanceCourses$ = courses$
            .pipe(
                map((courses: Course[]) =>
                    courses.filter(course => course.category === "ADVANCED"))
            );

        // Problem: Here, we have two subscription that means two times api is getting called.Hence this is not a good way. We need to reduce the api calls.

        // Method 03: One api call and sharing of obserable using shareReplay() operator
        // Simply we need to adding shareReply() operator in the first observable.



    }

}
