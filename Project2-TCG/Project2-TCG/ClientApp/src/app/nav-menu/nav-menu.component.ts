import { Component } from '@angular/core';
import { User } from '../login/user';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: false
})
export class NavMenuComponent {

  isExpanded = false;

  constructor() {
    if (this.username == null || this.username == "error") {
      this.loggedIn = false
    } else {
      this.loggedIn = true
    }
  }
  loggedIn: boolean;
  userInfo?: User;
  username: string = localStorage.getItem("user");
  currency: string = localStorage.getItem("currency");

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
