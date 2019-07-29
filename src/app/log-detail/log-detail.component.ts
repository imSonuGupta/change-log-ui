import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.css']
})
export class LogDetailComponent implements OnInit {

  dataSource = new MatTableDataSource();
  logObject : any;
  primaryCols: string[];

  constructor(
    private dialogRef: MatDialogRef<LogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.primaryCols = [];
    this.dataSource = new MatTableDataSource(data.dataSource);
    this.logObject = data.dataSource[0];
    this.createPrimaryCols(this.logObject);
  }

  ngOnInit() {
    // console.log(this.dataSource.data);
  }
  
  close() {
    this.dialogRef.close();
  }

  createPrimaryCols(obj: object){
    if(obj['item_id']){
      var itemId = obj['item_id'];
      Object.keys(itemId).forEach(key => {
        this.primaryCols.push(key);
      })
    }
  }

  displayedColumns: string[] = ['field_name', 'old_value', 'new_value'];
}
