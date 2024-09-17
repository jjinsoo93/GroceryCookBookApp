var Board = function(size) {
    this.boardSize = size;
    this.square = new Array(this.boardSize);
    for (var i = 0; i < this.boardSize; i++) {
        this.square[i] = [];
    }
    this.doCheckRep = true;

    this.checkRep = function() {
        if (this.doCheckRep) {
            for (var a in this.square) {
                for (var b in this.square[a]) {
                    if (this.square[a][b]) {
                        var checker = this.square[a][b];
                        assertTrue(checker.row == a && checker.col == b, "Board representation invariant broken, at " + a + "," + b + "!=" + checker.row + "," + checker.col);
                    }
                }
            }
        }
    }
    
    this.safeSpace = function(row, col) {
        if (row >= this.boardSize || col >= this.boardSize) {
            alert("square [" + row + "," + col + "] is not found in this " + size + "x" + size + " board");
            return false;
        }
        return true;
    }

    this.emptySpot = function(row, col) {
        if (this.getCheckerAt(row, col)) {
            alert("square [" + row + "," + col + "] is not empty");
            return false;
        }
        return true;
    }

    function assertTrue(f, s){
        if (!f) {
            alert(s);
        }
    }

    this.size = function() {
        return this.boardSize;
    }

    this.getCheckerAt = function(row, col){
        if (this.safeSpace(row, col)){
            return this.square[row][col];
        }
    }

    this.getLocationOf = function(checker){
        return {row: checker.row, col: checker.col};
    }

    this.getAllCheckers = function(){
        var results = [];
        for (var a in this.square) {
            for (var b in this.square[a]) {
                if (this.square[a][b]) {
                    results.push(this.square[a][b]);
                }
            }
        }
        return results;
    }

    this.add = function(checker, row, col){
        if (this.emptySpot(row, col)){
            var info = {checker: checker, row: row, col: col};
            checker.row = row;
            checker.col = col;
            this.square[row][col] = checker;
            this.checkRep();
            this.dispatchBoardEvent("add", info);
        }
    }

    this.moveTo = function(checker, toRow, toCol){
        if (this.emptySpot(toRow, toCol)){
            var info = {checker: checker, toRow: toRow, toCol: toCol, fromRow: checker.row, fromCol: checker.col};
            delete this.square[checker.row][checker.col];
            this.square[toRow][toCol] = checker;

            if (this.canBeKing(checker, toRow, toCol)){
                this.promote(checker);
            }

            checker.row = toRow;
            checker.col = toCol;
            this.checkRep();
            this.dispatchBoardEvent("move", info);
        }
    }

    this.remove = function(checker) {
        var info = {checker: checker, row: checker.row, col: checker.col};
        delete this.square[checker.row][checker.col];
        this.checkRep();
        this.dispatchBoardEvent("remove", info);
    }

    this.removeAt = function(row, col) {
        if (!this.square[row][col]){
            alert("no checker at " + row + "," + col);
        } else {
            var info = {checker: this.square[row][col], row: row, col: col};
            delete this.square[row][col];
            this.checkRep();
            this.dispatchBoardEvent("remove", info);
        }
    }

    this.clear = function() {
        for (var a in this.square) {
            for (var b in this.square[a]) {
                if (this.square[a][b]) {
                    this.removeAt(a, b);
                }
            }
        }
    }

    this.promote = function(checker) {
        checker.isKing = true;
        this.dispatchBoardEvent("promote", {checker: checker});
    }

    this.allHandlers = new Array();

    this.dispatchBoardEvent = function(type, info){
        var newEvent = new BoardEvent(type, info);

        if (this.allHandlers[type]){
            for (var i in this.allHandlers[type]){
                this.allHandlers[type][i](newEvent);
            }
        }
    }

    this.addEventListener = function(eventType, handler){
        if (!this.allHandlers[eventType])
            this.allHandlers[eventType] = [];
        this.allHandlers[eventType].push(handler);
    }

    this.prepareNewGame = function(){
        this.checkRep();
        this.clear();
        for (var i = 0; i < this.boardSize; i++){
            var chkRed = new Checker("red", false);
            var chkBlack = new Checker("black", false);
            this.add(chkRed, (1 - i % 2), i);
            this.add(chkBlack , (this.boardSize - 1 - i % 2), i);
        }
    }

    this.getRandomChecker = function(){
        var allCheckers = this.getAllCheckers();
        if (allCheckers.length > 0){
            return allCheckers[Math.floor(Math.random() * allCheckers.length)];
        }
    }

    this.getRandomNonKing = function(){
        var allCheckers = this.getAllCheckers();
        var allNonKings = [];
        for (var i in allCheckers){
            if (!allCheckers[i].isKing){
                allNonKings.push(allCheckers[i]);
            }
        }
        if (allNonKings.length > 0){
            return allNonKings[Math.floor(Math.random() * allNonKings.length)];
        }
    }

    this.getRandomEmptyLocation = function(){
        var availLocs = [];
        for (var a = 0; a < this.boardSize; ++a) {
            for (var b = 0; b < this.boardSize; ++b) {
                if (!this.square[a][b]) {
                    availLocs.push({row: a, col: b});
                }
            }
        }
        if (availLocs.length > 0){
            return availLocs[Math.floor(Math.random() * availLocs.length)];
        }
    }

    this.canBeKing = function(checker, row, col){
        if (checker.color == "red"){
            return row == this.boardSize - 1;
        } else {
            return row == 0;
        }
    }

    this.toString = function() {
        var result = "";
        for (var a = 0; a < this.boardSize; ++a) {
            for (var b = 0; b < this.boardSize; ++b) {
                var checker = this.square[a][b];
                if (checker) {
                    result += checker.toString().charAt(0) + " ";
                } else {
                    result += "_ ";
                }
            }
            result += "<br/>";
        }
        return result.toString();
    }
}
