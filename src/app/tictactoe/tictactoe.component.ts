import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { retry } from 'rxjs';


@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrl: './tictactoe.component.css'
})
export class TictactoeComponent implements OnInit{

  ngOnInit(): void
    {
      let allCells = localStorage.getItem("allCellsKey");
      this.cells = allCells ? JSON.parse(allCells):Array(10).fill(null);
      let allMovesStr = localStorage.getItem("allMovesKey");
      this.allMoves = allMovesStr ? JSON.parse(allMovesStr): [];
    }

  // Player Creation
  playerA: Player = new Player("PlayerA", "X", true, false);
  playerB: Player = new Player("PlayerB", "O", false, false);

  // Array to store player moves
  cells : string[] = Array(10).fill(null);
  gameStatus : string = "gameActive";

  allMoves: string[] = [];
  winGridComb: Number[] = [];


  updatePlayerName(playerLabel: string){
    if(playerLabel === 'A') {this.playerA.isEditing = !this.playerA.isEditing; }
    if(playerLabel === 'B') { this.playerB.isEditing = !this.playerB.isEditing; }
  }

  makeMove(index: number){

    // If slot not free return
    if(this.cells[index] != null || this.gameStatus !== "gameActive") return;

    // find the correct player turn = true;
    const player = this.playerA.isTurn ? this.playerA : this.playerB;

    // reflect at html
    this.cells[index] = player.symbol;
    this.allMoves.push(player.name + " plays " + player.symbol + " at " + index);

    localStorage.setItem("allCellsKey", JSON.stringify(this.cells));
    localStorage.setItem("allMovesKey", JSON.stringify(this.allMoves));

    this.checkGameState();

    // FLip the turn
    if(this.gameStatus === 'gameActive'){
      this.playerA.isTurn = !this.playerA.isTurn;
      this.playerB.isTurn = !this.playerB.isTurn;
    }

  }

  checkGameState(){

    // Find the correct player turn = true;
    const player = this.playerA.isTurn ? this.playerA : this.playerB;
    // For Win
    const winCombinations = [
      [1,2,3], [4,5,6], [7,8,9],
      [1,4,7], [2,5,8], [3,6,9],
      [1,5,9], [3,5,7]
    ];

    for (let comb of winCombinations){

      let [a,b,c] = comb;
      if(this.cells[a] == player.symbol &&
        this.cells[b] == player.symbol &&
        this.cells[c] == player.symbol){
        this.gameStatus = player.name + " has won !!";
        this.winGridComb = comb;
        return;
      }
    }

    // for Draw
    let isDraw = true;
    for(let i=1; i<10; i++){
      if(this.cells[i] == null){
        isDraw = false;
      }
    }
    if(isDraw) {
      this.gameStatus = "Game Draw !!";
      //return;
    }
  }

  resetGame(){
    this.playerA.isTurn = true;
    this.playerB.isTurn = false;
    this.cells  = Array(10).fill(null);
    this.gameStatus  = "gameActive";

    this.allMoves = [];
    this.winGridComb = [];

    // Clearing local storage
    localStorage.clear();

  }
}

class Player{

  name: string;
  symbol: string; // X or O;
  isTurn: boolean;
  isEditing: boolean;

  constructor(name: string, symbol: string, isTurn: boolean, isEditing: boolean){
    this.name = name;
    this.symbol = symbol;
    this.isTurn = isTurn;
    this.isEditing = isEditing;
  }
}