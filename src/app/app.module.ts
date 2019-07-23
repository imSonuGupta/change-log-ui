import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatImportModule } from './mat-import/mat-import.module';

import { AppComponent } from './app.component';
import { LogViewComponent } from './log-view/log-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestComponent } from './test/test.component';
import { LogDetailComponent } from './log-detail/log-detail.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { DisableControlDirective } from './disable-control.directive';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
    TestComponent,
    LogDetailComponent,
    DisableControlDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path : 'obj', component : TestComponent },
      { path : '', component : LogViewComponent }
    ]),
    MatImportModule
  ],
  providers: [
    {provide : MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ LogDetailComponent ]
})
export class AppModule { }
