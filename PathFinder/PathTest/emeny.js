
class Emeny{
  constructor(x,y){
    this.loc = new vector2d(x,y)
    this.color = "green"
    this.velo = new vector2d(0,0)
    this.acc = new vector2d(0,0)
  }

  render(acc){
    if(pf.width <= this.loc.x && pf.height <= this.loc.y){
      pf.context.strokeStyle = 'black';
      pf.context.strokeRect(this.loc.vx, this.loc.vy, 20, 20);
      pf.context.fillStyle = this.color;
      pf.context.fillRect(this.loc.vx, this.loc.vy, 20, 20);
      this.loc.vx += this.velo.vx
      this.velo.vx += this.acc.vx
      this.loc.vy += this.velo.vy
      this.velo.vy += this.acc.vy
      this.acc = acc
    }
  }



}
