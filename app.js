const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {

      this.velocity = {
        x: 0,
        y: 0
      }

      this.rotation = 0;

      const image = new Image();
      image.src = './sprites/spaceship.png'
      image.onload = () => {
        const scale = 0.15;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: canvas.width / 2 - this.width / 2,
          y: canvas.height - this.height - 20
        }
      }
    }

  draw() {
    // c.fillStyle = 'green';
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.save();
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotation);

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

      c.drawImage(
        this.image,
        this.position.x,
        this.position.y, 
        this.width, 
        this.height
      );

    c.restore();
  }
  update() {
    if (this.image){
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'gold';
    c.fill()
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image();
    image.src = './sprites/invader.png'
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
  // c.fillStyle = 'green';
  // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
  update({velocity}) {
  if (this.image){
    this.draw();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
}
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 2,
      y: 0
    }

    this.invaders = []

    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)

    this.width = columns * 30;
    this.height = rows * 30;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
      this.invaders.push(
          new Invader({
            position: {
              x: x * 40,
              y: y * 40
            }
          })
        )
      }
    }
  }

    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  
      const rightmostPosition = this.position.x + this.width;
      const leftmostPosition = this.position.x;
      
      this.velocity.y = 0;
      if (rightmostPosition >= canvas.width || leftmostPosition <= 0) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 30;

        if (rightmostPosition >= canvas.width) {
          this.position.x = canvas.width - this.width;
        } else if (leftmostPosition <= 0) {
          this.position.x = 0;
        }
      }
    }
  }

const player = new Player();
const projectiles = [];
const grids = []

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500) + 500;

console.log(randomInterval);
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  projectiles.forEach(projectile => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
      projectiles.splice(projectiles.indexOf(projectile), 1);
      }, 0);
    }
    projectile.update();
  });

  grids.forEach(grid => {
    grid.update();
      grid.invaders.forEach((invader, i) => {
        invader.update({velocity: grid.velocity});
        projectiles.forEach((projectile, j) => {
          const distance = Math.hypot(
            invader.position.x - projectile.position.x,
            invader.position.y - projectile.position.y
          );
          if (distance - invader.width / 2 - projectile.radius < 1) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find(invader2 => 
                invader2 === invader
              )
              const projectileFound = projectiles.find(projectile2 => {
                return projectile2 === projectile;

              })
              if (invaderFound && projectileFound) {

                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);
              }
              if (grid.invaders.length > 0) {
                let minX = grid.invaders[0].position.x;
                let maxX = grid.invaders[0].position.x;
          
                grid.invaders.forEach(invader => {
                  if (invader.position.x < minX) minX = invader.position.x;
                  if (invader.position.x > maxX) maxX = invader.position.x;
                });
          
                grid.width = maxX - minX + grid.invaders[0].width;
              }
            }, 0);
          }
        }
      );
    });
  });


  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.15;
  } else if (keys.d.pressed && player.position.x <= canvas.width - player.width) {
    player.velocity.x = 5;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
  console.log(frames);

  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500) + 500;
    frames = 0;
    console.log(randomInterval, 'randomInterval');
  }
frames++;
}

animate();

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      console.log('left');
      keys.a.pressed = true;
      break;
    case 'd':
      console.log('right');
      keys.d.pressed = true;
      break;
    case ' ':
      console.log('shoot');
      projectiles.push(new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
          velocity: {
            x: 0,
            y: -8
          } 
        }
      ));
      keys.space.pressed = true;
      break;
  }
});

addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
      // console.log('left');
      keys.a.pressed = false;
      break;
    case 'd':
      // console.log('right');
      keys.d.pressed = false;
      break;
    case ' ':
      // console.log('shoot');
      keys.space.pressed = false;

      // console.log(projectiles);
      break;
  }
});