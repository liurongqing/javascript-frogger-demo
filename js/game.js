const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')

let screenWidth = 1000
let screenHeight = 500
let width = 50
let isGameLive = true
const sprites = {}
let rightKeyPressed = false
let leftKeyPressed = false

const loadSprites = () => {
  sprites.player = new Image()
  sprites.player.src = 'images/hero.png'

  sprites.background = new Image()
  sprites.background.src = 'images/floor.png'

  sprites.enemy = new Image()
  sprites.enemy.src = 'images/enemy.png'

  sprites.goal = new Image()
  sprites.goal.src = 'images/chest.png'
}

class GameCharacter {
  constructor(x, y, width, height, color, speed) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.speed = speed
    this.maxSpeed = 4
  }
  moveVertically() {
    if (this.y > screenHeight - 100 || this.y < 50) {
      this.speed *= -1
    }
    this.y += this.speed
  }
  moveHorizontally() {
    this.x += this.speed
  }
}

const enemies = [
  new GameCharacter(200, 225, width, width, 'rgb(0, 0, 255)', 2),
  new GameCharacter(450, screenHeight - 100, width, width, 'rgb(0, 0, 255)', 3),
  new GameCharacter(700, 50, width, width, 'rgb(0, 0, 255)', 4)
]
const player = new GameCharacter(50, 200, width, width, 'rgb(0, 255, 0)', 0)
const goal = new GameCharacter(
  screenWidth - width - 20,
  200,
  width,
  100,
  'rgb(0, 0, 0)',
  0
)

// 按下键盘
document.onkeydown = event => {
  let keyPressed = event.keyCode
  // 箭头右
  if (keyPressed === 39 && !leftKeyPressed) {
    player.speed = player.maxSpeed
    rightKeyPressed = true
    // 箭头左
  } else if (keyPressed === 37 && !rightKeyPressed) {
    player.speed = -player.maxSpeed
    leftKeyPressed = true
  }
}

// 抬起键盘
document.onkeyup = event => {
  let keyReleased = event.keyCode
  if (keyReleased === 39) {
    rightKeyPressed = false
  } else if (keyReleased === 37) {
    leftKeyPressed = false
  }
  if (!leftKeyPressed && !rightKeyPressed) {
    player.speed = 0
  }
}

// 检测碰撞
const checkCollisions = (rect1, rect2) => {
  // return (
  //   rect1.x < rect2.x + rect2.width && // rect1 第 1 点在 rect2 第 2 点的左侧
  //   rect1.x + rect1.width > rect2.x && // rect1 第 2 点在 rect2 第 1 点的右侧
  //   rect1.y < rect2.y + rect2.height && // rect1 第 1 点在 rect2 第 3 点的上面
  //   rect1.y + rect1.height > rect2.y // rect1 第 3 点在 rect2 第 1 点的下面
  // )
  // 取反操作
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect1.x > rect2.x + rect2.width ||
    rect1.y + rect1.height < rect2.y ||
    rect1.y > rect2.y + rect2.height
  )
}

const gameOver = msg => {
  isGameLive = false
  alert(msg)
}

const update = () => {
  if (checkCollisions(player, goal)) {
    gameOver('你赢了！')
    window.location.reload() // 重置页面
  }
  player.moveHorizontally()

  enemies.forEach(function(element) {
    if (checkCollisions(player, element)) {
      gameOver('游戏结束')
      window.location.reload() // 重置页面
    }
    element.moveVertically()
  })
}

const draw = () => {
  ctx.clearRect(0, 0, screenWidth, screenHeight)
  ctx.drawImage(sprites.background, 0, 0)
  ctx.drawImage(sprites.player, player.x, player.y)
  ctx.drawImage(sprites.goal, goal.x, goal.y)
  enemies.forEach(function(element) {
    ctx.drawImage(sprites.enemy, element.x, element.y)
  })
}

const step = () => {
  update()
  draw()
  if (isGameLive) {
    window.requestAnimationFrame(step)
  }
}
loadSprites()
step()
