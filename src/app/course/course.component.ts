import { CustomObserableService } from './../common/custom-obserable.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(
        private route: ActivatedRoute,
        public customObserableService: CustomObserableService
    ) {


    }

    ngOnInit() {
        this.getCouseId();
        this.getCouse();
    }

    ngAfterViewInit() {
        this.searchTextOndebouce();
    }

    public getCouseId(): void {
        this.courseId = this.route.snapshot.params['id'];
    }

    public getCouse(): void {
        this.course$ = this.customObserableService.httpCustomObservable(`/api/courses/${this.courseId}`);
    }


    public loadLessons(search = ''): Observable<Lesson[]> {
        return this.customObserableService.httpCustomObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }


    // debounceTime(): Use debouce Time to emit the observable
    // distinctUntilChanged(): it gives the unique value
    public searchTextOndebouce(): void {
        const searchLessons$: Observable<Lesson[]> = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            )


        const initialLessons$: Observable<Lesson[]> = this.loadLessons();

        this.lessons$ = concat(initialLessons$, searchLessons$);


        console.log("lesson", this.lessons$);
        // Note : while concat two observable. Do not subscribe any of the the observable. if you subscribe any of the observable, then final observable will not be compatable and it wom't work. Behind the scene, concat method itself subscribe both the observable.
    }




}
