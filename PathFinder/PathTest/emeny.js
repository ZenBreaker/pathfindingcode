
class Emeny{
  constructor(x,y){
    this.loc = new vector2d(x,y)
    this.color = "green"
    this.velo = new vector2d(0,0)
    this.acc = new vector2d(0,0)
  }

  render(acc){
    pf.context.strokeStyle = 'black';
    pf.context.strokeRect(this.loc.x, this.loc.y, 20, 20);
    pf.context.fillStyle = this.color;
    pf.context.fillRect(this.loc.x, this.loc.y, 20, 20);
    this.loc.x += this.velo.x
    this.velo.x += this.acc.x
    this.loc.y += this.velo.y
    this.velo.y += this.acc.y
    this.acc = acc
  }



}
