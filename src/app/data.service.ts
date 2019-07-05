import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http : HttpClient
  ) { }

  getLog(url : string){
    return this.http.get('http://localhost:3000/LOG' + url);
  }

  getObject(){
    return this.http.get('http://localhost:3000/GET');
  }

  updateObject(object){
    return this.http.put("http://localhost:3000/PUT", object, httpOptions);
  }

  addObject(object){
    return this.http.post("http://localhost:3000/POST", object, httpOptions);
  }

  deleteObject(id){
    return this.http.delete("http://localhost:3000/DELETE/" + id, httpOptions);
  }
}


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
}