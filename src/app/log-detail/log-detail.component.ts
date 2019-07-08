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

  constructor(
    private dialogRef: MatDialogRef<LogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.dataSource = new MatTableDataSource(data.dataSource);
    this.logObject = data.dataSource[0];
  }

  ngOnInit() {
    console.log(this.dataSource.data);
  }
  
  close() {
    this.dialogRef.close();
  }

  displayedColumns: string[] = ['field_name', 'old_value', 'new_value'];
}
