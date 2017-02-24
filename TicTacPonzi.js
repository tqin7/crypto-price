pragma solidity ^0.4.0;

contract mortal {
  address public owner;

  function mortal() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) {
      throw;
    } else {
      _;
    }
  }

  function kill() onlyOwner{
    suicide(owner);
  }
}

//@title Tic-Tac-Toe combined with Ponzi scheme
contract TicTacPonzi {
  //Deployer of the game contract
  address public creator;
  //Minimum amount of ether required to participate
  uint threshold;
  //Token of winner
  uint8 winner;

  //Console logs event when move is made
  event madeMove(address player, uint8 move);

  //A complex type that represents a player
  struct Player {
    bool isActive;
    bool isPayee;
    uint balance;
    uint8 token;
  }

  /*Accounts that have paid >= threshold
   that are able to participate in the game*/
  mapping (address=>Player) players;

  /*Accounts that have paid < threshold, cannot
  participate in the game but funds will be returned
  when the game ends.*/
  mapping (address=>uint) underdogs;

  /** Setting Up Game*/
  function TicTacPonzi(uint _threshold) payable {
    if (_threshold > msg.value) {
      throw;
    }
    creator = msg.sender;
    threshold = _threshold;
    players[creator] = Player({
      isActive: true,
      isPayee: true,
      balance: msg.value,
      token: 1
    });
  }

  function challengerJoin() payable {
    if (msg.value < threshold) {
      underdogs[msg.sender] = msg.value;
    } else {
      players[msg.sender] = Player({
        isActive: true,
        isPayee: false,
        balance: msg.value,
        token: 2
      });
    }
  }

  /** Game Part */
  //Virtual representation of the game board
  uint8[3][3] board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  //Check
  function checkBoard() returns (uint8){
    checkRows();
    checkColumns();
    checkDiags();
    return winner;
  }

  /** Check rows and return winner's token if any, otherwise 0*/
  function checkRows() {
    for (uint i = 0; i < board.length; i++) {
      if (board[i][0] != 0 && board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
        winner = board[i][0];
      }
    }
  }

  /** Check columns and return winner's token if any, otherwise 0*/
  function checkColumns() {
    for (uint i = 0; i < board[0].length; i++) {
      if (board[0][i] != 0 && board[0][i] == board[1][i] &&  board[0][i] == board[2][i]) {
        winner = board[0][i];
      }
    }
  }

  /** Check diagonals and return winner's token if any, otherwise 0*/
  function checkDiags() {
    if (board[1][1] != 0 && board[1][1] == board[0][0] && board[1][1] == board[2][2] || board[1][1] != 0 && board[1][1] == board[0][2] && board[1][1] == board[2][0]) {
      winner = board[1][1];
    }
  }


}
