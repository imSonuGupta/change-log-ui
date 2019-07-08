import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { DataService } from '../data.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  urlQuery: string;
  createForm: FormGroup;
  editForm: FormGroup;
  tableData: any;
  isEditing: boolean;

  constructor(
    private data: DataService,
    private form: FormBuilder
  ) {
    this.isEditing = false;
  }

  ngOnInit() {
    this.tableData = this.getObject();
    this.createForm = this.form.group({
      'date': [null],
      'name': [null],
    })
  }

  onEdit(id) {
    this.isEditing = true;
    this.tableData.forEach(element => {
      if (element['id'] == id) {
        this.editForm = this.form.group({
          'id': [element['id']],
          'date': [element['date']],
          'name': [element['name']],
        });
      }
    });
  }

  onDelete(id) {
    this.deleteObject(id);
  }

  getObject() {
    this.data.getObject().subscribe(res => {
      this.tableData = res;
      console.log('success');
    },
      err => {
        console.error('err', err);
      })
  }

  updateObject() {
    this.data.updateObject(this.editForm.value).subscribe(res => {
      this.getObject();
      this.isEditing = false;
      console.log('success');
    },
      err => {
        console.error('err', err);
      })
  }

  addObject() {
    this.data.addObject(this.createForm.value).subscribe(res => {
      this.getObject();
      console.log('success');
      this.createForm.reset();
    },
      err => {
        console.error('err', err);
      })
  }

  deleteObject(id) {
    this.data.deleteObject(id).subscribe(res => {
      this.getObject();
      console.log('success');
    },
      err => {
        console.error('err', err);
      })
  }
}
