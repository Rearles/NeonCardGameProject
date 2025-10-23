import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component'
import { User } from '../login/user';

@Component({
    selector: 'app-login-header',
    templateUrl: './login-header.component.html',
    styleUrls: ['./login-header.component.css'],
    standalone: false
})
export class LoginHeaderComponent implements OnInit {

  constructor() { }

  userInfo?: User;
  username: string = localStorage.getItem("user")
  currency: string = localStorage.getItem("currency")

  ngOnInit(): void {
  }

}
