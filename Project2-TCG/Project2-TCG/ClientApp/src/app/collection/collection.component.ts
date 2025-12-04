import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../card/card.component';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  standalone: false
})
export class CollectionComponent implements OnInit {
  Cards: Card[];
  username: string;
  message: string;
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.username = localStorage.getItem("user");
    if (this.username == null || this.username == "error") {
      this.message = "Not logged in!";
    } else {
      let resp = this.http.get<any>("/api/user/collection/" + this.username);
      resp.subscribe((result: Card[]) => {
        console.log(result)

        this.Cards = result;

      }, error => console.error(error))
    }
  }
}
