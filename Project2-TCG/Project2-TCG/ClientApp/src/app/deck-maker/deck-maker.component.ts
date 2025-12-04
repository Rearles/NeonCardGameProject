import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../card/card.component';
import { DeckService } from './deck-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './deck-maker.component.html',
  styleUrls: ['./deck-maker.component.css'],
  standalone: false
})

export class DeckComponent implements OnInit {
  Cards: Card[];
  username: string;
  message: string;
  numCards: number = 10;
  cardName: string;
  Deck = new Array<Card>(0);
  constructor(private http: HttpClient, private router: Router, private _dataService: DeckService) {
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
  addToDeck(card: Card, index:number) {
    this.numCards--;
    this.cardName = card.name;
    this.Deck.push(card);
    this.Cards.splice(index, 1);
    if (this.numCards == 0) {
      this._dataService.setDeck(this.Deck);
      this.router.navigate(['/game']);
    }
  }
}
