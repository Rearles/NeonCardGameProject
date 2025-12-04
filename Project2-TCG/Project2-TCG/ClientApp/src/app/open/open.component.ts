import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../card/card.component';


@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.css'],
  standalone: false
})
export class OpenComponent implements OnInit {
  Cards: Card[];
  username: string;
  message: string;
  constructor(private http: HttpClient) {

  }
  //userInfo?: User;
  
  onClick() {
    this.username = localStorage.getItem("user");
    if (this.username == null || this.username == "error") {
      this.message = "Not logged in!";
    } else {

      let resp = this.http.get("/api/pack/"+this.username);
      resp.subscribe((result: Card[]) => {
        console.log(result)

        this.Cards = result;

      }, error => console.error(error))
    }
  }
  ngOnInit() {

  }
}
