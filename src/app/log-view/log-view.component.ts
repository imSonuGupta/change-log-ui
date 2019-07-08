import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { DataService } from '../data.service';
import { LogDetailComponent } from '../log-detail/log-detail.component';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css']
})
export class LogViewComponent implements OnInit {

  urlQuery: string;
  searchForm: FormGroup;
  logData: any;
  dataSource = new MatTableDataSource([]);

  private sort : MatSort;
  private paginator : MatPaginator;

  @ViewChild(MatSort, { }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator, { }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private data: DataService,
    private form: FormBuilder,
    private dialog: MatDialog
  ) {
    this.urlQuery = '';
  }

  ngOnInit() {
    this.logData = null;
    this.searchForm = this.form.group({
      'user_id': [null],
      'method': [null],
      'table_name': [null],
      'item_id': [null],
      'from': [null],
      'to': [null],
    })
  }

  openDialog(id) {
    this.getSelectedData(id, res => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.minWidth = "40vw";
      dialogConfig.data = {
        dataSource : res 
      }
      this.dialog.open(LogDetailComponent, dialogConfig)
        // .afterClosed().subscribe(result => {})
    })
  }

  getSelectedData(changeID, callback){
    // console.log(this.logData.reply);
    var selectedDtlRow = this.logData.reply.filter(key => {
      return key.change_id === changeID;
    })
    callback(selectedDtlRow)
  }

  onReset() {
    this.searchForm.reset();
  }

  onSubmit() {
    this.createQuery(this.searchForm.value, (query) => {
      // console.log(query);
      this.getLog(query);
    });
  }

  createQuery(value, callback) {
    this.urlQuery = '?';
    // console.log(value);
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (value[key]) {
          this.urlQuery += key + '=' + value[key] + '&';
        }
      })
      this.urlQuery = this.urlQuery.slice(0, -1);
    }
    callback(this.urlQuery);
  }

  getLog(url: string) {
    this.data.getLog(url).subscribe(res => {
      this.logData = res;
      this.dataSource = new MatTableDataSource(this.logData.reply);
    },
      err => {
        console.log('err', err);
      })
  }

  displayedColumns: string[] = ['user_id', 'log_date', 'table_name', 'method'];

}
