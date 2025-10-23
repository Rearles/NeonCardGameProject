import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    standalone: false
})
export class CardComponent implements OnInit {
  @Input() card?: Card;
  constructor() { }


  ngOnInit(): void {
  }

}
export class Card {
  public id: number;
  public cost: number;
  public attack: number;
  public defense: number;
  public name: string;
  public color: string;
  public rarity: string;

}
