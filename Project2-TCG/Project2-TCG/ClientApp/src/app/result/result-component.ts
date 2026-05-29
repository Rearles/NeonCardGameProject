import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResultService } from './result-service'

@Component({
  selector: 'app-result',
  templateUrl: './result-component.html',
  styleUrls: ['./result-component.css']
})
export class ResultComponent {
  Result: number;
  Difficulty: string;
  Message: string;
  currency: number;

  constructor(private _dataService: ResultService, private http: HttpClient) {
    this.Result = this._dataService.getResult();
    this.Difficulty = this._dataService.getDifficulty();
    if (this.Result == 0) {
      if (this.Difficulty == "Easy") {
        this.Message = "You lost to an easy opponent...sad..."
        this.currency = 1;
      } else if (this.Difficulty == "Medium") {
        this.Message = "You lost to a medium opponent... too bad!"
        this.currency = 2;
      } else if (this.Difficulty == "Hard") {
        this.Message = "You lost to an hard opponent...good try."
        this.currency = 3;
      }
    } else if (this.Result == 1) {
      if (this.Difficulty == "Easy") {
        this.Message = "You tied an easy opponent...happy now?"
        this.currency = 2;
      } else if (this.Difficulty == "Medium") {
        this.Message = "You tied a medium opponent."
        this.currency = 3;
      } else if (this.Difficulty == "Hard") {
        this.Message = "You tied a hard opponent...nice job!."
        this.currency = 4;
      }
    } else if (this.Result == 2) {
      if (this.Difficulty == "Easy") {
        this.Message = "You beat an easy opponent!"
        this.currency = 4;
      } else if (this.Difficulty == "Medium") {
        this.Message = "You beat a medium opponent. Nice!"
        this.currency = 6;
      } else if (this.Difficulty == "Hard") {
        this.Message = "You beat a hard opponent. Wow!"
        this.currency = 8;
      }
    }

    this.grantReward();
  }

  // Award the earned currency to the logged-in user and refresh the nav balance.
  grantReward() {
    const username = localStorage.getItem("user");
    if (username && username !== "error" && this.currency != null) {
      this.http.post<any>("/api/game/reward/" + username + "/" + this.currency, {})
        .subscribe(user => {
          if (user && user.currency != null) {
            localStorage.setItem("currency", String(user.currency));
          }
        }, error => console.error(error));
    }
  }
}
