'use strict'

// wait for the window to load and than call back setup()
window.addEventListener('load', setup, false);

var pf;   // the global path finder object
const TWO_PI = 6.28318530718;
const FRAME_RATE=30;

function setup() {
  pf = new PathFinder();
  window.setTimeout(draw, 100);    // wait 100ms for resources to load then start draw loop

}

function draw() {   // the animation loop
  pf.run();
  window.setTimeout(draw, 1000/FRAME_RATE);  // come back here every interval
}


class PathFinder{

  constructor(){
    this.isRunning = true;
    this.mouseX = 0;
    this.mouseY = 0;
    this.w = 50;
    // get and validate canvas and context
    this.canvas = document.getElementById('canvas');
    if (!this.canvas || !this.canvas.getContext)
    throw "No valid canvas found!";
    this.context = this.canvas.getContext("2d");
    if(!this.context)
    throw "No valid context found!";

    this.grid = [];
    this.cols = Math.floor(this.canvas.width / this.w);
    this.rows = Math.floor(this.canvas.height / this.w);

    // init class methods
    this.init();
    var butt = document.getElementById("pathbutton");
    butt.addEventListener('click', function(){pf.pathNaaberToEndCell(pf.grid[0][0],pf.grid[pf.grid.length-1][pf.grid[0].length-1])}, false);

  }

  init(){
    this.loadGrid();

    //  add listeners
    this.canvas.addEventListener('mousedown',function(evt){
      pf.mouseX = evt.offsetX;
      pf.mouseY = evt.offsetY;
      let row = Math.floor(pf.mouseY/pf.w);
      let col = Math.floor(pf.mouseX/pf.w);
      if(pf.grid[col][row].color === "pink"){
        pf.grid[col][row].color = "black";
        pf.grid[col][row].occupied = true;
      } else if(pf.grid[col][row].color === "black"){
        pf.grid[col][row].color = "pink";
        pf.grid[col][row].occupied = false;
      }


    }, false );

    this.canvas.addEventListener('mousemove',function(evt){
      pf.mouseX = evt.offsetX;
      pf.mouseY = evt.offsetY;
    }, false );

    this.listOfUncheckedCells = []
    this.listOfCheckedCells = []
    this.pathArray = []
    this.localCellNaabers = []
    this.NaabersFound = []
    this.interation1 = 0
    this.emenys = []

  }

  run(){
    this.render();
    for(let i = 0; i < this.emenys.length; i++){
      this.emenys[i].render(this.grid[Math.floor(this.emenys[i].loc.x/this.w)][Math.floor(this.emenys[i].loc.y/this.w)].acc)
    }
  }

  render(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.grid[i][j].render();
      }
    }

  }

  loadGrid(){

    for(let i = 0; i < this.cols; i++){
      this.grid[i] = [];
      for(let j = 0; j < this.rows; j++){
        this.grid[i].push(new Cell(new vector2d((i*this.w), (j*this.w)),i,j));
      }
    }

    this.Start = this.grid[0][0];
    this.End = this.grid[this.grid.length-1][this.grid[0].length-1];

    this.Start.color = "blue";
    this.End.color = "blue";

    console.log("Starting point: (" + this.Start.loc.x + ", " + this.Start.loc.y + ")");
    console.log("Ending Point: (" + this.End.loc.x + ", " + this.End.loc.y + ")")

    this.makeEmenys()
  }




  //finds a path to the endCell from the startCell
  pathNaaberToEndCell(startCell, endCell){
    this.interation1 = 0
    this.listOfUncheckedCells.push(startCell)
    while (!this.listOfUncheckedCells.includes(endCell)){
      this.findNaabersToEnd(this.findClosetUncheckNaaber(endCell),endCell)
    }

    this.findPath(startCell, endCell)
    this.makeVectors()
    console.log(this.pathArray)
  }
    //while if this.listOfUncheckedCells does not includes endcell then do this
      //findNaabers(this.listOfUncheckedCells[findClosetUncheckNaaber()])
      //iteration number incease by one


    //findPath(startCell, endCell)


  //finds the path from end cell to startCell
  findPath(startCell, endCell){
    //while if this.pathArray does not includes startCell then do this
      //find naabers of the last cell in the this.pathArray and assign it to the this.localCellNaabers
        //takes the the last cell's naaber's that has the lowest iteration value and adds it to the path array
        //clears this.localCellNaabers array
        endCell.color = "purple"
        this.pathArray.push(endCell)

        while (!this.pathArray.includes(startCell)) {
          this.findNaabersToStart(this.pathArray[0], startCell)
        }

  }

  //finds the nabers of the cell and it is marked
  findNaabersToEnd(cell,endCell){
    if(this.grid[cell.column+1]
      && this.grid[cell.column+1][cell.row]
      && !this.grid[cell.column+1][cell.row].occupied
      && !this.listOfUncheckedCells.includes(this.grid[cell.column+1][cell.row])){
        this.listOfUncheckedCells.push(this.grid[cell.column+1][cell.row])
        this.grid[cell.column+1][cell.row].color = "green"
    }
    if(this.grid[cell.column-1]
      && this.grid[cell.column-1][cell.row]
      && !this.grid[cell.column-1][cell.row].occupied
      && !this.listOfUncheckedCells.includes(this.grid[cell.column-1][cell.row])){
        this.listOfUncheckedCells.push(this.grid[cell.column-1][cell.row])
        this.grid[cell.column-1][cell.row].color = "green"
    }
    if(this.grid[cell.column]
      && this.grid[cell.column][cell.row+1]
      && !this.grid[cell.column][cell.row+1].occupied
      && !this.listOfUncheckedCells.includes(this.grid[cell.column][cell.row+1])){
        this.listOfUncheckedCells.push(this.grid[cell.column][cell.row+1])
        this.grid[cell.column][cell.row+1].color = "green"
    }
    if(this.grid[cell.column]
      && this.grid[cell.column][cell.row-1]
      && !this.grid[cell.column][cell.row-1].occupied
      && !this.listOfUncheckedCells.includes(this.grid[cell.column][cell.row-1])){
        this.listOfUncheckedCells.push(this.grid[cell.column][cell.row-1])
        this.grid[cell.column][cell.row-1].color = "green"
    }
    //  cell is checked
    cell.visited = true
    cell.color = "red"
    cell.render()
    //  cell interation value  = iteration value
    cell.iteration = this.interation1 +1
    this.interation1 += 1
    if(this.listOfUncheckedCells.includes(endCell)){
      endCell.iteration = this.interation1
    }

  }

  findNaabersToStart(cell, startCell){
    this.localCellNaabers = []
    if(this.grid[(cell.column)+1]
      && this.grid[cell.column+1][cell.row]
      && !this.grid[cell.column+1][cell.row].occupied
      && !this.pathArray.includes(this.grid[cell.column+1][cell.row])
      && this.grid[cell.column+1][cell.row].visited){
        this.localCellNaabers.push(this.grid[cell.column+1][cell.row])
    }
    if(this.grid[cell.column-1]
      && this.grid[cell.column-1][cell.row]
      && !this.grid[cell.column-1][cell.row].occupied
      && !this.pathArray.includes(this.grid[cell.column-1][cell.row])
      && this.grid[cell.column-1][cell.row].visited){
        this.localCellNaabers.push(this.grid[cell.column-1][cell.row])
    }
    if(this.grid[cell.column]
      && this.grid[cell.column][cell.row+1]
      && !this.grid[cell.column][cell.row+1].occupied
      && !this.pathArray.includes(this.grid[cell.column][cell.row+1])
      && this.grid[cell.column][cell.row+1].visited){
        this.localCellNaabers.push(this.grid[cell.column][cell.row+1])
    }
    if(this.grid[cell.column]
      && this.grid[cell.column][cell.row-1]
      && !this.grid[cell.column][cell.row-1].occupied
      && !this.pathArray.includes(this.grid[cell.column][cell.row-1])
      && this.grid[cell.column][cell.row-1].visited){
        this.localCellNaabers.push(this.grid[cell.column][cell.row-1])
    }
    var closetCell = this.localCellNaabers[0];
    /*
    for(let i = 1; i < this.localCellNaabers.length; i++){
      if(closetCell.loc.dist(startCell) < this.localCellNaabers[i].loc.dist(startCell)){
        closetCell = this.localCellNaabers[i]
      }
    }
    */

    for(let i = 1; i < this.localCellNaabers.length; i++){
      if(closetCell.iteration > this.localCellNaabers[i].iteration){
        closetCell = this.localCellNaabers[i]
      }
    }
    closetCell.color = "purple"
    this.pathArray.splice(0,0 , closetCell)
  }

  //this will go through the array of all marked but not visited
  //cells and choose the one that is the closeet to the endcell
  findClosetUncheckNaaber(endCell){
    var closetCell = this.listOfUncheckedCells[0];
    for(let i = 0; i < this.listOfUncheckedCells.length ; i++){
      //console.log(closetCell.loc.dist(endCell.loc))
      //console.log(closetCell.loc)
      //console.log(endCell.loc)
      if(!this.listOfUncheckedCells[i].visited
        && this.listOfUncheckedCells[i].loc.sub(endCell.loc) < closetCell.loc.sub(endCell.loc)
          ){
        closetCell = this.listOfUncheckedCells[i]
      }
    }
    return closetCell
  }

  makeVectors(){
    for(let i = 0; i < this.grid.length; i++){
      for(let j = 0; j < this.grid[i].length; j++){
        this.localCellNaabers = []

        if(this.grid[i+1]
          && this.grid[i+1][j]
          && !this.grid[i+1][j].occupied){
            this.localCellNaabers.push(this.grid[i+1][j])
        }
        if(this.grid[i-1]
          && this.grid[i-1][j]
          && !this.grid[i-1][j].occupied){
            this.localCellNaabers.push(this.grid[i-1][j])
        }
        if(this.grid[i]
          && this.grid[i][j+1]
          && !this.grid[i][j+1].occupied){
            this.localCellNaabers.push(this.grid[i][j+1])
        }
        if(this.grid[i]
          && this.grid[i][j-1]
          && !this.grid[i][j-1].occupied){
            this.localCellNaabers.push(this.grid[i][j-1])
        }

        var closetCell = this.localCellNaabers[0];

        for(let k = 1; k < this.localCellNaabers.length; k++){
          if(closetCell.iteration < this.localCellNaabers[k].iteration){
            closetCell = this.localCellNaabers[k]
          }
        }
        this.grid[i][j].acc = new vector2d((closetCell.loc.x - this.grid[i][j].loc.x),(closetCell.loc.y - this.grid[i][j].loc.y))
      }
    }
  }

  makeEmenys(){
    this.emenys = []
    for(let i = 0; i < 50; i++){
      this.emenys[i] = new Emeny(0,0)
    }
  }



}
