import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { DataService } from '../data.service';
import { LogDetailComponent } from '../log-detail/log-detail.component';

import { Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css'],
})
export class LogViewComponent implements OnInit {
  isLoading: boolean;
  noResult: boolean;
  urlQuery: string;
  searchForm: FormGroup;
  logData: any;
  dataSource = new MatTableDataSource([]);

  private sort: MatSort;
  private paginator: MatPaginator;

  @ViewChild(MatSort, {}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator, {}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private data: DataService,
    private form: FormBuilder,
    private dialog: MatDialog
  ) {
    this.urlQuery = '';
    this.isLoading = false;
    this.noResult = false;
  }

  ngOnInit() {
    this.logData = null;
    this.searchForm = this.form.group({
      'user_id': new FormControl(null),
      'method': new FormControl(null),
      'table_name': new FormControl(null),
      'item_id': new FormControl(null),
      'from': new FormControl(null),
      'to': new FormControl(null),
    })
    this.searchForm.get('to').disable();
    this.onChange();
  }

  onChange(){
    this.searchForm.get('from').valueChanges
      .subscribe(value => {
        if(value && this.searchForm.controls.from.status === 'VALID'){
          this.searchForm.get('to').enable();
        }
        else {
          this.searchForm.get('to').disable();
        }
      })
  }

  clearFrom(){
    this.searchForm.controls.from.reset();
    // this.searchForm.controls.to.reset();
  }

  clearTo(){
    this.searchForm.controls.to.reset();
  }

  openDialog(id) {
    this.getSelectedData(id, res => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.minWidth = "40vw";
      dialogConfig.data = {
        dataSource: res
      }
      this.dialog.open(LogDetailComponent, dialogConfig)
    })
  }

  getSelectedData(changeID, callback) {
    var selectedDtlRow = this.logData.reply.filter(key => {
      return key.change_id === changeID;
    })
    callback(selectedDtlRow)
  }

  onReset() {
    this.searchForm.reset();
  }

  onSubmit() {
    this.isLoading = true;
    this.createQuery(this.searchForm.value)
    // console.log(this.urlQuery);
    this.getLog(this.urlQuery);
  }

  createQuery(value) {
    // console.log(value);
    this.urlQuery = '?';
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (value[key]) {
          this.urlQuery += key + '=' + value[key] + '&';
        }
      })
      this.urlQuery = this.urlQuery.slice(0, -1);
    }
    console.log(this.urlQuery);
  }

  getLog(url: string) {
    this.data.getLog(url).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      if (this.logData.status) {
        if (this.logData.reply.length > 0) {
          let resVar;
          resVar = this.createLogHash(this.logData.reply);
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(resVar);
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.noResult = true;
        }
      }
      else {
        this.isLoading = false;
        console.log(this.logData);
      }
    },
      err => {
        this.isLoading = false;
        console.log('err', err);
      });
  }

  createLogHash(data) {
    var hashObj = {};
    var resp = [];
    data.forEach(element => {
      if (!hashObj[element.change_id]) {
        resp.push(element);
        hashObj[element.change_id] = true;
      }
    });
    return resp;
  }

  displayedColumns: string[] = ['user_id', 'log_date', 'table_name', 'method'];
}
