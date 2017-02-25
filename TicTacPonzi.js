pragma solidity ^0.4.0;

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
    address playerAddress;
    uint paid;
    uint payback;
  }

  struct Underdog {
    address returnAddress;
    uint amount;
  }

  /*Accounts that have paid >= threshold
   that are able to participate in the game*/
  mapping(uint8=>Player) players;

  uint8 num_of_players = 0;

  /*Accounts that have paid < threshold, cannot
  participate in the game but funds will be returned
  when the game ends.*/
  mapping (uint8=>Underdog) underdogs;

  uint8 num_of_underdogs;

  modifier hasValue {
    if (msg.value > 0) {
      _;
    } else {
      throw;
    }
  }

  modifier gameFull {
    if (num_of_players == 2) {
      throw;
    } else {
      _;
    }
  }

  modifier onlyCreator {
    if (msg.sender != creator) {
      throw;
    } else {
      _;
    }
  }

  /** Setting Up Game*/
  function TicTacPonzi() payable hasValue{
    creator = msg.sender;
    threshold = msg.value * uint(11) / uint(10);
    players[1] = Player({
      playerAddress: msg.sender,
      paid: msg.value,
      payback: 0
    });
    num_of_players += 1;
  }

  function challengerJoin() public payable hasValue gameFull{
    if (msg.value < threshold) {
      underdogs[num_of_underdogs] = Underdog({
        returnAddress: msg.sender,
        amount: msg.value
      });
      num_of_underdogs += 1;
    } else {
      players[2] = Player({
        playerAddress: msg.sender,
        paid: msg.value,
        payback: 0
      });
      num_of_players += 1;
    }
  }

  /** Shows players what the current threshold is*/
  function showThreshold() public returns (uint){
    return threshold;
  }

  /** Game Part */
  //Virtual representation of the game board
  uint8[3][3] board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  //Determine player's turn: 1 is payee, 2 is challenger
  uint8 turn = 1;
  //Token of winner
  uint8 winner = 0;

  function makeMove(uint8 _row, uint8 _col) public {
    if (_row > 3 || _col > 3 || players[turn].playerAddress != msg.sender
      || board[_row - 1][_col - 1] != 0) {
      throw;
    } else {
      board[_row - 1][_col - 1] = turn;
      madeMove(turn, _row, _col);
      checkWinner();
      changeTurn();
    }
  }

  function checkWinner() private {
    winner = checkBoard();
    if (winner != 0) {
      Won(winner);
      reset(winner);
      Won(winner);
    }
  }

  function sendMoney(address _recipient, uint _amount) {
    if (!_recipient.send(_amount)) {
      throw;
    }
  }

  /** Resets game depending on who wins*/
  function reset(uint8 winner) private {
    //If payee wins
    if (winner == 1) {
      players[1].payback = players[2].paid - players[1].paid;
      sendMoney(players[1].playerAddress, players[1].payback);
    } else {  //if challenger wins
      sendMoney(players[1].playerAddress, players[1].paid);
      threshold = players[2].paid;
    }
    players[1] = players[2];
    delete players[2];
    resetBoard();
    num_of_players -= 1;
  }

  function resetBoard() {
    for (uint i = 0; i < board.length; i++) {
      board[i][0] = 0;
      board[i][1] = 0;
      board[i][2] = 0;
    }
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

  /** Clear the contract */
  function kill() onlyCreator {
    for (uint8 i = 0; i < num_of_underdogs; i++) {
      sendMoney(underdogs[i].returnAddress, underdogs[i].amount);
    }
    sendMoney(players[1].playerAddress, players[1].paid);
    sendMoney(players[2].playerAddress, players[2].paid);
    suicide(creator);
  }

}
