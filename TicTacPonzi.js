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

  //Console logs event when move is made
  event madeMove(uint8 token, uint8 row, uint8 col);

  event Won(uint8 token);

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

  modifier hasValue {
    if (msg.value > 0) {
      _;
    } else {
      throw;
    }
  }

  /** Setting Up Game*/
  function TicTacPonzi(uint _threshold) payable hasValue{
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

  function challengerJoin() public payable hasValue{
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

  function checkThreshold() public {
    return threshold;
  }

  /** Game Part */
  //Virtual representation of the game board
  uint8[3][3] board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  //Determine player's turn: 1 is payee, 2 is challenger
  uint8 turn = 1;
  //Token of winner
  uint8 winner = 0;

  function makeMove(uint8 _row, uint _col) public {
    if (players[msg.sender].isActive == true && turn == players[msg.sender].token && board[_row - 1][_col - 1] == 0) {
      board[_row - 1][_col - 1] = players[msg.sender].token;
      event(players[msg.sender].token, _row, _col);
      checkWinner();
      changeTurn();
    } else {
      throw;
    }
  }

  function checkWinner() private {
    winner = checkBoard();
    if (winner != 0) {

      Won(winner);
    }
  }

  /** Resets game depending on who wins*/
  function reset() private{
    
  }

  /** Modify uint8 turn */
  function changeTurn() private {
    if (turn == 1) {
      turn = 2;
    } else {
      turn = 1;
    }
  }

  //Check all possible ways of winning and return 0, 1, 2 depending on situations
  function checkBoard() private returns (uint8) {
    checkRows();
    checkColumns();
    checkDiags();
    return winner;
  }

  /** Check rows and return winner's token if any, otherwise 0*/
  function checkRows() private {
    for (uint i = 0; i < board.length; i++) {
      if (board[i][0] != 0 && board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
        winner = board[i][0];
      }
    }
  }

  /** Check columns and return winner's token if any, otherwise 0*/
  function checkColumns() private {
    for (uint i = 0; i < board[0].length; i++) {
      if (board[0][i] != 0 && board[0][i] == board[1][i] &&  board[0][i] == board[2][i]) {
        winner = board[0][i];
      }
    }
  }

  /** Check diagonals and return winner's token if any, otherwise 0*/
  function checkDiags() private {
    if (board[1][1] != 0 && board[1][1] == board[0][0] && board[1][1] == board[2][2] || board[1][1] != 0 && board[1][1] == board[0][2] && board[1][1] == board[2][0]) {
      winner = board[1][1];
    }
  }


}
