
class Cell{
  constructor(loc, col, row){
    this.loc = new vector2d(loc.vx, loc.vy);
    this.occupied = false;
    this.color = 'pink';
    this.visited = false
    this.column = col;
    this.row = row;
    this.acc = new vector2d(0,0);
    this.iteration = Number.POSITIVE_INFINITY;

  }

  render(){
    pf.context.strokeStyle = 'white';
    pf.context.strokeRect(this.loc.vx, this.loc.vy, pf.w, pf.w);
    pf.context.fillStyle = this.color;
    pf.context.fillRect(this.loc.vx, this.loc.vy, pf.w, pf.w);
    pf.context.strokeText(this.iteration, this.loc.vx+pf.w/2, this.loc.vy+pf.w/2);
  }
}
