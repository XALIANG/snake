class ConfigInterface {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.direction = 'right';
    this.clear = null;
    this.body = [{
        x: 2,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 0,
        y: 0
      }
    ]
    this.obstacle = [{
        x: 10,
        y: 0
      }, {
        x: 10,
        y: 1
      }, {
        x: 10,
        y: 2
      },
      {
        x: 10,
        y: 3
      },
      {
        x: 10,
        y: 4
      }
    ]
  }
  $(el) {
    return document.getElementById(el);
  }
  node(el) {
    return document.querySelector(el);
  }
  append(el, node) {
    return el.appendChild(node);
  }
  removeElement(el, node) {
    return el.removeChild(node);
  }
  reomveElementId() {
    return removeEle.parentNode.remove(removeELe);
  }
  removeElementByClass(className) {
    let elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0])
    }
  }
  click(el, event, callback) {
    return el.addEventListener(event, callback);
  }
  warningAlert(content, callback) {
    return alert(content, callback)
  }
}

class Games {
  constructor(option) {
    Object.assign(this, option);
    this.score = 0; //分数
    this.Grade = 100; //困难度
    this.createObstacles();
    console.log('障碍物', this.obstacle)
  }
  initGame() {
    this.score = 0;
  }
  createObstacles() { //障碍物
    for (let i = 0; i < this.obstacle.length; i++) {
      const wall = document.createElement('div');
      this.obstacle[i].wall = wall;
      wall.style.width = this.width + 'px';
      wall.style.height = this.height + 'px';
      wall.style.backgroundColor = '#000';
      wall.style.position = 'absolute';
      wall.style.left = this.obstacle[i].x * this.width + 'px';
      wall.style.top = this.obstacle[i].y * this.height + 'px';
      wall.setAttribute("class", 'walls');
      this.map.append(wall);
    }
  }
}

class Food {
  constructor(option) {
    Object.assign(this, option);
    this.food_x = 0;
    this.food_y = 0;

  }
  displayFood() {
    const food = document.createElement('div');
    food.style.width = this.width + 'px';
    food.style.height = this.height + 'px';
    food.style.backgroundColor = 'blue';
    food.style.position = 'absolute';
    this.food_x = Math.floor(Math.random() * (this.map.offsetWidth / this.width));
    this.food_y = Math.floor(Math.random() * (this.map.offsetHeight / this.height));
    food.style.left = this.food_x * this.width + 'px';
    food.style.top = this.food_y * this.height + 'px';
    food.setAttribute('class', 'food');
    this.map.append(food);
  }
}

class Snake extends ConfigInterface {
  constructor(option) {
    super();
    this.map = this.node(option.el);
    this.food = new Food(this);
    this.games = new Games(this);
    this.start = this.node(option.btn);
    this.scoreDom = this.$('score');
    this.scoresDom = this.$('scores'); //最高分
    console.log('地图', this.map)

  }
  init() {
    this.#onKeyboard();
    this.food.displayFood();
    this.#displayCreateBody();
    this.body[0].flag['style'].backgroundColor = '#000';
    this.click(this.start, 'click', () => {
      clearInterval(this.clear);
      this.clear = setInterval(() => {
        this.#run()
      }, this.games.Grade)
    })
  }
  #reloadGame() {
    alert('游戏结束');
    clearInterval(this.clear);
    this.removeElementByClass('snake');
    this.removeElementByClass('food');
    this.scoresDom.innerHTML = this.games.score;
    this.games.score = 0;
    this.scoreDom.innerHTML = 0;
    this.body = [{
        x: 2,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 0,
        y: 0
      }
    ];
    this.#onKeyboard();
    this.food.displayFood();
    this.#displayCreateBody();


  }
  #run() {
    //脖子和和屁屁交换位置
    let i;
    for (i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y
    }

    //让蛇扭起来
    switch (this.direction) {
      case 'left':
        this.body[i].x -= 1;
        break;
      case 'right':
        this.body[i].x += 1;
        break;
      case 'up':
        this.body[i].y -= 1;
        break;
      case 'down':
        this.body[i].y += 1;
        break;
      default:
        break;
    }

    //蛇头坐标和食物坐标
    if (this.body[0].x === this.food.food_x && this.body[0].y === this.food.food_y) {
      this.games.score += 1;
      this.scoreDom.innerHTML = this.games.score;
      let snakeTail_x = this.body[this.body.length - 1]['x'];
      let snakeTail_y = this.body[this.body.length - 1]['y'];

      switch (this.direction) {
        case 'left':
          this.body.push({
            x: snakeTail_x - 1,
            y: snakeTail_y
          })
          break;
        case 'right':
          this.body.push({
            x: snakeTail_x + 1,
            y: snakeTail_y
          })
          break;
        case 'up':
          this.body.push({
            x: snakeTail_x,
            y: snakeTail_y - 1
          })
          break;
        case 'down':
          this.body.push({
            x: snakeTail_x,
            y: snakeTail_y + 1
          })
          break;
        default:
          break;
      }
      console.log(this.body)
      this.removeElementByClass('food');
      this.food.displayFood();
    }
    //撞墙监听
    console.log(this.body[0])
    if (this.body[0].x < 0 || this.body[0].x >= this.width || this.body[0].y < 0 || this.body[0].y >= this.height) {
      this.#reloadGame();

      return;
    }
    //监听蛇自杀
    let snakeHeader_x = this.body[0]['x'];
    let snakeHeader_y = this.body[0]['y'];
    for (let i = 1; i < this.body.length; i++) {
      let moveSnakeBody_x = this.body[i].x;
      let moveSnakeBody_y = this.body[i].y;
      if (snakeHeader_x === moveSnakeBody_x && snakeHeader_y === moveSnakeBody_y) {
        this.#reloadGame();
        return;
      }
    }

    //删除小尾巴
    this.removeElementByClass('snake');
    this.#displayCreateBody() //刷新
  }
  #displayCreateBody() {
    for (let i = 0; i < this.body.length; i++) {
      const dom = document.createElement('div');
      this.body[i].flag = dom; //暂存
      dom.style.width = this.width + 'px';
      dom.style.height = this.height + 'px';
      dom.style.backgroundColor = 'red';
      dom.style.position = 'absolute';
      dom.style.left = this.body[i].x * this.width + 'px';
      dom.style.top = this.body[i].y * this.height + 'px';
      dom.setAttribute('class', 'snake');
      this.map.append(dom)
    }
  }
  #onKeyboard() {
    document.body.onkeydown = (event) => {
      const e = event || window.event;
      const t = e.target;
      switch (e.keyCode) {
        case 73: //up
          if (this.direction !== 'down') {
            this.direction = 'up';
          }
          break;
        case 75: //down
          if (this.direction !== 'up') {
            this.direction = 'down';
          }
          break;
        case 74: //left
          if (this.direction !== 'right') {
            this.direction = 'left';
          }
          break;
        case 76: //right
          if (this.direction !== 'left') {
            this.direction = 'right';
          }
          break;
        default:
          break;
      }
    }
  }
}



window.onload = () => {
  //初始化实例
  const snake = new Snake({
    el: '#map',
    btn: '#begin'
  });
  console.log('蛇', snake)
  snake.init();


}