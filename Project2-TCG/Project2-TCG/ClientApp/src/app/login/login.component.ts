import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { LoginHeaderComponent } from '../login-header/login-header.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {

  constructor(private http: HttpClient, private loginHeaderComponent: LoginHeaderComponent) {

  }

  errorMessage?: string;
  user?: User;

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("currency")
    window.location.reload();
  }

  onClick(username: string, password: string) {
    this.http.post<any>('/api/login/', { username, password }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(data => {
      this.user = {username: data.username, password: data.password, currency: data.currency}
      console.log(this.user.username)
      if (data.username != "error") {
        this.logout()
        localStorage.setItem("user", data.username)
        localStorage.setItem("currency", data.currency)
        window.location.reload();
      } else {
        this.errorMessage = "That user does not exist."
      }    
    }) 
  }
}

