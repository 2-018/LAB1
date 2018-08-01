class Rules {
    constructor(board){
        this.scoring = false;
        this.board = board;
    }

    sweep() {
        let vm = this;
        vm.horizontalCrushes = [];
        vm.verticalCrushes = [];
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                let continuousHorizontalLength = vm.checkMatchesHorizontal(vm.getCandyAt(i, j));
                if (continuousHorizontalLength > 2) {
                    let currentCrush = []
                    for (var k = 0; k < continuousHorizontalLength; k++) {
                        // vm.surface[i][j + k] = 0;
                        currentCrush[currentCrush.length] = vm.board.surface[i][j + k]    
                    }
                    vm.horizontalCrushes.push(currentCrush);
                }
                let continuousVerticalLength = vm.checkMatchesVertical(vm.getCandyAt(i, j));
                if (continuousVerticalLength > 2) {
                    let currentCrush = []
                    for(var k = 0; k < continuousVerticalLength; k++){
                        currentCrush[currentCrush.length] = vm.board.surface[i+k][j];
                    }
                    vm.verticalCrushes.push(currentCrush);
                }
            }
        }
    }

    checkMatchesHorizontal(candy) {
        let vm = this;
        if (!(candy.row > this.row - 3)) {
            let matchCount = 1;
            let nextCandy = vm.surface[row][col + matchCount]
            while (nextCandy && nextCandy.color == candy.color) {
                nextCandy = vm.getCandyAt(row, col + (++matchCount));
            }
            return matchCount;
        } else "candy in second last or last column";
    }

    checkMatchesVertical(candy) {
        let vm = this;
        if (!(candy.row > this.row - 3)) {
            let matchCount = 0;
            let nextCandy = vm.surface[row][col + 1]
            while (nextCandy && nextCandy.color == candy.color) {
                matchCount++;
                nextCandy = vm.surface[row][col + matchCount + 1];
            }
            return matchCount;
        } else "candy in second last or last row";
    }

    /*
    *
    *   Returns true if flipping fromCandy with the candy in the direction
    *   specified (["up", "down", "left", "right"]) is valid
    *   (according to the rules), else returns false.
    *
    */
    isMoveTypeValid(fromCandy, direction) {
        // Your code here
        let vm = this;
        if(vm.getCandyInDirection(fromCandy, direction)) return true;
        else return false;
    }

    /*
    *   Returns a list of all candy crushes on the board. A crush is a list of three
    *   candies in a single row or column that have the same color. Each crush is returned 
    *   as a list of lists
    */
    getCandyCrushes() {
        //Your code here
        let vm = this;
        vm.sweep();
        return vm.horizontalCrushes.concat(vm.verticalCrushes);
    }


    /* 
    *   Deletes all candies in listOfListsOfCrushes. If the game has already began, incremements 
    *   the board score. Does not move the candies down at all. 
    */
    removeCrushes(listOfListsOfCrushes) {
        //Your code here 
        let vm = this;
        let crushes = vm.getCandyCrushes();
        for(var i = 0; i < crushes.length; i++){
            let candyFetchedFromBoard = vm.board.surface[crushes[i].row][crushes[i].col];
            vm.board.surface[crushes[i].row][crushes[i].col] = null;
            vm.board.candies = vm.board.candies.filter(function(boardCandy){
                return boardCandy.id !== candyFetchedFromBoard.id;
            })
            vm.board.incrememtScore(candyFetchedFromBoard, candyFetchedFromBoard.row, candyFetchedFromBoard.col);
        }
        
    }


    /* 
    *   Moves candies down as far as there are spaces. Issues calls to Board.moveTo which generates move 
    *   events. If there are holes created by moving the candies down, populates the board with new random candies
    */
    moveCandiesDown() {
        //Your code here 
        let vm = this;
        let holeFound = 0;
        for(var i = vm.board.col-1; i >= 0; i--){
            let holesInColumn = vm.getHolesInColumn(i);
            for(var j = vm.board.row-1; j >= 0; ){
                if (vm.board.surface[j][i] == null){
                    holeFound++;
                    vm.board.surface[j][i] = vm.board.surface[--j][i];
                } else j--;
            }
            if(holeFound == true) vm.moveCandiesDown();
        }
        
    }

    holesInColumn(col){
        let vm = this;
        let holeCount = 0;
        for(var i = 0; i < vm.board.rows; i++){
            if(vm.board.surface[i][col] == null) holeCount++;
        }
        return holeCount;
    }

    /* 
    *   If there is a valid move on the board, returns an object with two properties: candy: a candy that can be moved 
    *   and direction: the direction to be moved. If there are no valid moves, returns null. The move is selected 
    *   randomly from available moves. 
    */
    getRandomValidMove() {
        //Your code here
        let vm = this;
        let upCrushRes, downCrushRes, leftCrushRes, rightCrushRes = [];
        for(var i = 0; i < vm.board.boardSize; i++){
            for (var j = 0; j < vm.board.boardSize; j++){
                let upCrushResLength = upCrushRes.length;
                upCrushRes = vm.getCandiesToCrushGivenMove(vm.board.surface[i][j], 'up');
                if(upCrushResLength > upCrushRes.length)
                downCrushRes = vm.getCandiesToCrushGivenMove(vm.board.surface[i][j], 'down');
                
                leftCrushRes = vm.getCandiesToCrushGivenMove(vm.board.surface[i][j], 'left');
                
                rightCrushRes = vm.getCandiesToCrushGivenMove(vm.board.surface[i][j], 'right');
            }
        }
    }


    /* 
    *   Populates the board with random candies
    */
    populateBoard() {
        //Your code here
        let vm = this;
        
    }

    /*
    *   Returns a list of candies that would be crushed if fromCandy were to be moved in the direction
    *   specified by direction. If no candies are to be crushed, returns an empty list.  
    */
    getCandiesToCrushGivenMove(fromCandy, direction) {
        //your code here
    }

    /*
    *   Returns number of sets of candies that would be crushed if the candy was moved in the specified
    *   direction
    */
    numberCandiesCrushedByMove(fromCandy, direction) {
        //Your code here
    }


    /*
    *   prepares new game with no sets of crushable candies. Sets the score to zero so that player doesn't 
    *   get crushes by luck 
    */
    prepareNewGame() {
        //Your code here 
    }
}