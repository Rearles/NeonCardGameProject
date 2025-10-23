import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.css'],
    standalone: false
})
export class PlayComponent /*implements OnInit*/ {

  constructor(private router: Router) {

  }
  easyGame() {
    localStorage.setItem("difficulty", "Easy");
    this.router.navigate(['/deck']);
  }
  mediumGame() {
    localStorage.setItem("difficulty", "Medium");
    this.router.navigate(['/deck']);
  }
  hardGame() {
    localStorage.setItem("difficulty", "Hard");
    this.router.navigate(['/deck']);

  }
}
