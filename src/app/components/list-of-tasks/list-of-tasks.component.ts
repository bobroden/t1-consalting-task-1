import { Component, ViewChild, OnDestroy, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, take } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { CreatingTaskComponent } from '../creating-task/creating-task.component';
import { ChangingTaskComponent } from '../changing-task/changing-task.component';
import { DeletingTaskComponent } from '../deleting-task/deleting-task.component';

import { TaskService } from '../../services/task.service';

import { Task } from '../../interfaces/task';
import { CdkTableDataSourceInput } from '@angular/cdk/table';


@Component({
  selector: 'app-list-of-tasks',
  templateUrl: './list-of-tasks.component.html',
  styleUrls: ['./list-of-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOfTasksComponent implements AfterViewInit, OnDestroy, OnInit {

  displayedColums: string[] = ['id', 'name', 'startDate', 'endDate', 'priority', 'category', 'actions']
  dataSource: MatTableDataSource<Task>;

  @ViewChild(MatTable) table: MatTable<Task>;
  @ViewChild(MatSort) sort: MatSort;

  destroy$: Subject<boolean> = new Subject<boolean>();

  listOfTasks: Task[] = [];

  tableObs$: Observable<CdkTableDataSourceInput<Task>>;
  
  constructor(public taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.tableObs$ = this.taskService.listOfTasks$.pipe(
      takeUntil(this.destroy$),
      map(tasks => {
        this.listOfTasks = tasks;
        this.dataSource = new MatTableDataSource<Task>(tasks);
        this.dataSource.sort = this.sort;
        return this.dataSource;
      })
    );

    this.taskService.listOfTasks$.pipe(take(1)).subscribe(list => {
      this.dataSource = new MatTableDataSource<Task>(list);
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  openCreatingDialog(): void {
    const dialogRef = this.dialog.open(CreatingTaskComponent, {
      data: {
        id: this.listOfTasks.reduce((acc, curr) => acc.id > curr.id ? acc : curr).id + 1,
        name: '',
        startDate: null,
        endDate: null,
        priority: null,
        category: []
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      try {
        const newTask: Task = {
          id: +result.id,
          name: result.name,
          category: []
        };
        if(new Date(result.startDate) !== null){
          newTask.startDate = result.startDate
        }
        if(new Date(result.endDate) !== null){
          newTask.endDate = result.endDate
        }
        if(result.priority !== null){
          newTask.priority = result.priority
        }
        if(result.category !== null){
          newTask.category = result.category
        }
        this.taskService.add(newTask, this.listOfTasks);
      }
      catch {}
    })
  }

  openChangingDialog(task: Task): void {
    const dialogRef = this.dialog.open(ChangingTaskComponent, {
      data: {
        id: +task.id,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        category: task.category
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      try {
        const changingTask: Task = {
          id: +result.id,
          name: result.name,
          category: result.category
        };
        if(new Date(result.startDate) !== null){
          changingTask.startDate = result.startDate
        }
        if(new Date(result.endDate) !== null){
          changingTask.endDate = result.endDate
        }
        if(result.priority !== null){
          changingTask.priority = result.priority
        }
        if(result.category !== null){
          changingTask.category = result.category
        }
        this.taskService.changeTask(changingTask, this.listOfTasks);
      }
      catch {}
    })
  }

  openDeletingDialog(task: Task): void {
    const dialogRef = this.dialog.open(DeletingTaskComponent, {
      data: {
        id: +task.id,
        name: task.name,
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      try {
        const deletingId = +result.id;
        this.taskService.delete(deletingId, this.listOfTasks);
      }
      catch {}
    })
  }

}