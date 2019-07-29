import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { DataService } from '../data.service';
import { LogDetailComponent } from '../log-detail/log-detail.component';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css'],
})
export class LogViewComponent implements OnInit {
  isLoading: boolean;     //display mat-spinner
  isFromHidden: boolean;  //display clear option on 'from'
  isToHidden: boolean;    //display clear option on 'to'
  noResult: boolean;      //display message 'no result found'
  urlQuery: string;       //search query
  searchForm: FormGroup;
  logData: any;           //store server response
  dataSource = new MatTableDataSource([]);
  primaryCols : string[];  //create a list of primary key cols

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
    this.isFromHidden = true;
    this.isToHidden = true;
    
  }

  ngOnInit() {
    this.logData = null;
    this.searchForm = this.form.group({
      'user_id': new FormControl(null),
      'method': new FormControl(null),
      'database_name': new FormControl(null, [Validators.required]),
      'table_name': new FormControl(null, [Validators.required]),
      'from': new FormControl(null, [Validators.required]),
      'to': new FormControl(null),
    })
    // this.searchForm.get('to').disable();
    this.onChange();
  }

  //display status of 'clear' button
  onChange() {
    this.searchForm.get('from').valueChanges
      .subscribe(value => {
        if (value) {
          this.isFromHidden = false;
        }
        // if (value && this.searchForm.controls.from.status === 'VALID') {
        //   this.searchForm.get('to').enable();
        // }
        // else {
        //   this.searchForm.get('to').disable();
        // }
      })

    this.searchForm.get('to').valueChanges
      .subscribe(value => {
        if (value) {
          this.isToHidden = false;
        }
      })
  }

  clearFrom() {
    this.searchForm.controls.from.reset();
    this.isFromHidden = true;
  }

  clearTo() {
    this.searchForm.controls.to.reset();
    this.isToHidden = true;
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
    let selectedDtlRow = this.logData.reply.filter(key => {
      return key.change_id === changeID;
    })
    callback(selectedDtlRow)
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
    // console.log(this.urlQuery);
  }

  getLog(url: string) {
    this.data.getLog(url).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      if (this.logData.status) {
        if (this.logData.reply.length > 0) {
          let resVar = this.createLogHash(this.logData.reply);
          this.isLoading = false;
          console.log(resVar);
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
    let hashObj = {};
    let resp = [];
    data.forEach(element => {
      if (!hashObj[element.change_id]) {
        resp.push(element);
        hashObj[element.change_id] = true;
      }
    });
    // console.log(resp);
    this.createPrimaryCols(resp[0]);
    return resp;
  }

  createPrimaryCols(obj: object){
    this.primaryCols = [];
    this.displayedColumns = ['user_id', 'log_date', 'log_time', 'method', 'table_name'];
    if(obj['item_id']){
      let itemId = obj['item_id'];
      Object.keys(itemId).forEach(key => {
        this.displayedColumns.push(key);
        this.primaryCols.push(key);
      })
    }
  }

  // displayedColumns: string[] = ['user_id', 'log_date', 'log_time', 'database_name', 'table_name', 'method'];
  displayedColumns: string[];
}
