
class Cell{
  constructor(loc, col, row){
    this.loc = new MyVector(loc.x, loc.y);
    this.occupied = false;
    this.color = 'pink';
    this.visited = false
    this.column = col;
    this.row = row;
    this.iteration = 10000000;

  }

  render(){
    pf.context.strokeStyle = 'white';
    pf.context.strokeRect(this.loc.x, this.loc.y, pf.w, pf.w);
    pf.context.fillStyle = this.color;
    pf.context.fillRect(this.loc.x, this.loc.y, pf.w, pf.w);
  }
}
