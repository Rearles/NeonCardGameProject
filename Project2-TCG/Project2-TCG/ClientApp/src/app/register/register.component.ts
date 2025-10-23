import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private http: HttpClient) {

  }

  successMessage?: string;
  errorMessage?: string;

  onClick(username: string, password: string) {
    this.http.post<any>('/api/user/', {  username, password }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(data => {
      console.log(data)
      if (data.username != "error") {
        this.errorMessage = null;
        this.successMessage = "Account created successfully!";
      } else {
        this.successMessage = null;
        this.errorMessage = "That username is taken";
      }
    })
  }
}
