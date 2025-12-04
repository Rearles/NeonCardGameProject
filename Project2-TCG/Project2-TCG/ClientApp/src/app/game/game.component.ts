import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { DeckService } from '../deck-maker/deck-service';
import { HttpClient } from '@angular/common/http';
import { Card } from '../card/card.component';
import { ResultService } from '../result/result-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: false
})

export class GameComponent implements OnInit{
  Deck: Card[] = this._dataService.getDeck();
  difficulty: string = localStorage.getItem("difficulty"); // easy, medium, hard
  playerHealth: number = 25; //players health
  playerMana: number = 1; //mana is needed for the player to play cards based on cost
  enemyHealth: number; //easy 15 medium 25 hard 35
  turnNumber: number = 1;// turn number
  descriptionText: string = "Game Start"; //a description of what action the player or enemy just took
  currentPlayerCard = new Card();; //the card currently on the board for the player
  currentEnemyCard = new Card();; //the card currently on the board for the enemy
  Hand = new Array<Card>(0); //the players hand html includes on click and index elemnets per card
  EnemyHand = new Array<Card>(0); //the enemies hand, just card backs on html
  Win: number; //0 = loss 1 = tie 2 = win
  cardsRemaining: number = 10;
  draw: number;
  going: boolean = false;

  constructor(private _dataService: DeckService, private http: HttpClient, private _resServe: ResultService, private router: Router) {

  }
  //function to run the cycle of a typcial game, 10 turn limit
  gameSetUp() {
    //initizlize with 2 cards in each hand
    //initialize enemy health based on difficulty
    //remember to splice card out of deck when drawn
    //remember to splice card out of hand when played
    this.playerDraw();
    this.playerDraw();
    try {
      let resp = this.http.get("/api/game/card/" + this.difficulty);

      resp.subscribe((result: Card) => {
        console.log(result)

        this.EnemyHand.push(result);

      }, error => console.error(error))
    } catch (err) {
      console.log(err);
    }
    if (this.difficulty == "Easy") {
      this.enemyHealth = 15;
    } else if (this.difficulty == "Medium") {
      this.enemyHealth = 25;
    } else if (this.difficulty == "Hard") {
      this.enemyHealth = 30;
    } else {
      //no difficulty given, return to home
    }


  }

  playCard(card: Card, index: number) {
    if (!this.going) {
      if (this.currentPlayerCard.id == -1) {
        if (card.cost <= this.playerMana) {
          this.currentPlayerCard = card;
          this.Hand.splice(index, 1);
          this.playerMana = this.playerMana - card.cost;
          this.descriptionText = "You played " + card.name;
          this.enemyTurn();
          this.turnNumber++;
        } else {
          this.descriptionText = "Not enough Mana!"
        }

      } else {
        this.descriptionText = "Already have a card in play!";
      }
  }
  }
  playerDraw() {
    if (this.cardsRemaining > 0 && this.Hand.length < 5) {
      this.draw = Math.floor(Math.random() * this.cardsRemaining);
      this.cardsRemaining--;
      this.Hand.push(this.Deck[this.draw]);
      this.Deck.splice(this.draw, 1);
    }
  }

  //a players half of the turn, can play a card, or attack enemies card/ enemy
  //draws card every turn, 1 mana added at the end of turn
  playerTurn() {
    if (this.turnNumber > 11) {
      if (this.playerHealth == this.enemyHealth) {
        this.Win = 1;
      } else if (this.playerHealth > this.enemyHealth) {
        this.Win = 2;
      } else if (this.enemyHealth > this.playerHealth) {
        this.Win = 0;
      }
    }
    this.checkWin()
    this.playerDraw();
    this.playerMana++;
  }

  //an enemys half of the turn, can play a card, or attack players card/player
  //draw a card every turn
 sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  async enemyTurn() {
    this.going = true;
    await this.sleep(3000);
    if (this.cardsRemaining > 0) {
      try {
        let resp = this.http.get("/api/game/card/" + this.difficulty);

        resp.subscribe((result: Card) => {
          console.log(result)

          this.EnemyHand.push(result);

        }, error => console.error(error))
      } catch (err) {
        console.log(err);
      }
    }
    if (this.currentEnemyCard.id == -1) {
      if (this.EnemyHand.length > 0) {
        this.currentEnemyCard = this.EnemyHand[0];
        this.EnemyHand.splice(0, 1);
        this.descriptionText = "Opponent played " + this.currentEnemyCard.name;
      }
    } else {
      this.draw = Math.floor(Math.random() * 2);
      if (this.draw == 0 && this.currentPlayerCard.id != -1) {
        this.CardBattle();
      } else {
        this.attackPlayer();
      }
    }
    this.going = false;
    this.playerTurn();
  }

  endTurn() {
    if (!this.going) {
      this.turnNumber++;
      this.enemyTurn();
    }
  }

  Concede() {
    this.Win = 0;
    this.checkWin();
  }
  //enemy card attack is subtracted from player card health, and player card attack is subtracted from enemy card
  CardBattle() {
    this.currentEnemyCard.defense -= this.currentPlayerCard.attack;
    this.currentPlayerCard.defense -= this.currentEnemyCard.attack;
    this.descriptionText = this.currentEnemyCard.name + " fought " + this.currentPlayerCard.name+"!";
    if (this.currentEnemyCard.defense < 1) {
      this.emptyEnemyCard();
    }
    if (this.currentPlayerCard.defense < 1) {
      this.emptyPlayerCard();
    }
  }

  CardBattlePlayer() {
    if (!this.going) {
      if (this.currentPlayerCard.id != -1 || this.currentEnemyCard.id != -1) {
        this.CardBattle();
        this.enemyTurn();
        this.turnNumber++;
      } else {
        this.descriptionText = "No Card in Play!";
      }
    }

  }

  //attack a players health pool with current card, this removes the current card from play (empty instance)
  attackPlayer() {
    this.playerHealth -= this.currentEnemyCard.attack;
    this.descriptionText = "You were attacked by " + this.currentEnemyCard.name;
    this.emptyEnemyCard();  
    if (this.playerHealth < 0) {
      this.Win = 0;
    }
    this.checkWin();
  }

  //attack an enemys health pool with current card, this removes the current card from play (empty instance)
  attackEnemy() {
    if (!this.going) {
      if (this.currentPlayerCard.id != -1) {
        this.enemyHealth -= this.currentPlayerCard.attack;
        this.descriptionText = "You attacked with " + this.currentPlayerCard.name;
        this.emptyPlayerCard();
        if (this.enemyHealth < 0) {
          this.Win = 2;
        }
        this.checkWin();
        this.enemyTurn();
        this.turnNumber++;
      } else {
        this.descriptionText = "No Card in play!";
      }
    }

  }

  //sets the currentplayercard slot to an empty instance of a card
  emptyPlayerCard() {
    this.currentPlayerCard = new Card();
    this.currentPlayerCard.id = -1;
    this.currentPlayerCard.name = "Empty";
    this.currentPlayerCard.color = "Empty";
    this.currentPlayerCard.rarity = "Empty";
  }

  // sets the currentenemycard slot to an empty instance of a card
  emptyEnemyCard() {
    this.currentEnemyCard = new Card();
    this.currentEnemyCard.id = -1;
    this.currentEnemyCard.name = "Empty";
    this.currentEnemyCard.color = "Empty";
    this.currentEnemyCard.rarity = "Empty";
  }

  checkWin() {
    if (this.Win != null) {
      this._resServe.setResult(this.Win, this.difficulty);
      this.router.navigate(['/result'])
    }
  }
  ngOnInit() {
    this.currentPlayerCard.id = -1;
    this.currentPlayerCard.name = "Empty";
    this.currentPlayerCard.color = "Empty";
    this.currentPlayerCard.rarity = "Empty";
    this.currentEnemyCard.id = -1;
    this.currentEnemyCard.name = "Empty";
    this.currentEnemyCard.color = "Empty";
    this.currentEnemyCard.rarity = "Empty";
    this.gameSetUp();
  }
}
