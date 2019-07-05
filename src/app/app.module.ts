import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { MatDialogModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LogViewComponent } from './log-view/log-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestComponent } from './test/test.component';
import { LogDetailComponent } from './log-detail/log-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
    TestComponent,
    LogDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule, MatTableModule, MatSortModule,
    RouterModule.forRoot([
      { path : 'obj', component : TestComponent },
      { path : '', component : LogViewComponent }
    ]),
    MatDialogModule, MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ LogDetailComponent ]
})
export class AppModule { }
