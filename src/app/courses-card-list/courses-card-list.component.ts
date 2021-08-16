import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { Course } from '../model/course';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.scss']
})
export class CoursesCardListComponent implements OnInit {

    @Input() public courses: Course[];

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {

    }

    public editCourse(course: Course) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = course;
        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
    }

}









