import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';

import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-changing-task',
  templateUrl: './changing-task.component.html',
  styleUrls: ['./changing-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangingTaskComponent implements OnInit, OnDestroy {

  listOfCategories: string[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<ChangingTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public taskService: TaskService,
    public categoryService: CategoryService) {}
    
  ngOnInit(): void {
    this.categoryService.listOfCategories$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.listOfCategories = list;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  changingTaskForm: FormGroup = new FormGroup({
    idFormControl: new FormControl({value: this.data.id, disabled: true}, Validators.required),
    nameFormControl: new FormControl(this.data.name, Validators.compose([Validators.required, Validators.minLength(3)])),
    startDateFormControl: new FormControl(this.data.startDate),
    endDateFormControl: new FormControl(this.data.endDate),
    priorityFormControl: new FormControl(this.data.priority),
    categoryFormControl: new FormControl(this.data.category)
  }, this.datesValidator('startDateFormControl', 'endDateFormControl'));

  cancel(): void {
    this.dialogRef.close();
  }

  change(): void {
    this.data.id = this.changingTaskForm.getRawValue().idFormControl;
    this.data.name = this.changingTaskForm.getRawValue().nameFormControl;
    this.data.startDate = this.changingTaskForm.getRawValue().startDateFormControl;
    this.data.endDate = this.changingTaskForm.getRawValue().endDateFormControl;
    this.data.priority = this.changingTaskForm.getRawValue().priorityFormControl;
    this.data.category = this.changingTaskForm.getRawValue().categoryFormControl;
  }

  datesValidator(startDate: string, endDate: string): object {
    return (group: FormGroup) => {
      const start = group.controls[startDate];
      const end = group.controls[endDate];
      if(new Date(start.value) > new Date(end.value) && start.value !== null && end.value !== null) {
        return {
          error: true
        };
      }
      return;
    }
  }

}
