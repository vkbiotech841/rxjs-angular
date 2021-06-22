import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    public form: FormGroup;
    public course: Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course
    ) {
        this.course = course;
        this.getFormData();

    }

    ngOnInit() {
        this.saveCourseWhileTyping();


    }

    ngAfterViewInit() {
        this.saveCourseOnSaveButton();
    }

    public getFormData(): void {
        this.form = this.fb.group({
            description: [this.course.description, Validators.required],
            category: [this.course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [this.course.longDescription, Validators.required]
        });
    }


    public saveCourse(changes) {
        // Here, fetch method return a promise. In order to convert this promise to an observerable.
        // fromPromise () operator was used. Hence, saveCourse function return an observable.
        return fromPromise(fetch(`api/courses/${this.course.id}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }

    // Here, we would like to save the form data while typing.
    public saveCourseWhileTyping() {
        // Here, valueChanges of form is an Observable, that can be subscribed.
        // Operators used:
        // (1) filter operator: filters here only the valid course
        // (2) concatMap operator: it helps in sequential chaining observable and map its value to another observable. Internally, first it subscribes and unsubscribe the result of one observable and pass it to another.
        // (3) meregeMap (): if you in parall chaining or contanation of two observable. in this case, we want to use sequenctial concatanation, hence, we are using concatMap().
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                concatMap(changes => this.saveCourse(changes)),
                // mergeMap(changes => this.saveCourse(changes))
            )
            .subscribe();
    }


    //   Here, we want to prevent the multiple clicks on save button and prevent the multiple api calls. Hence, we are using exhaustMap();
    // exhaustMap(): it ignors the coming observabl, if an observalbe is already emitting.Hence,in this way here, we can ignor the multiple api calls in button clicks.
    public saveCourseOnSaveButton() {
        fromEvent(this.saveButton.nativeElement, 'click')
            .pipe(
                exhaustMap(() => this.saveCourse(this.form.value))
            )
            .subscribe()
    }


    public close(): void {
        this.dialogRef.close();
    }

}
