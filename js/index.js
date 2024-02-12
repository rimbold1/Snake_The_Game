const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width/blockSize;
let heightInBlocks = height/blockSize;

let score = 0;

let drawBorder = () => {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Функція котра виводить показник очок на екран.
let drawScore = () => {
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("score: " + score, blockSize, blockSize);
};

// Функція котра завершує гру.
const gameOver = () => {
    clearInterval(intervalId);
    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", width/2, height/2);
};

// функція котра створює коло по заданим параметрам: Х і У координат,
// радіус і запитує тип відмалювання (заповнене чи пусте коло).
const circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

// Конструктор блоку і його методи
const Block = function (col, row) {
    this.col = col;
    this.row = row;    
};

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize/2;
    let centerY = this.row * blockSize + blockSize/2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize/2, true);
};

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Конструктор змійки
const Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
};

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        const element = this.segments[i];
        element.drawSquare('blue');
    }
};

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;
    
    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    }else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    }else if (this.direction === "left") {
       newHead = new Block(head.col - 1, head.row); 
    }else if (this. direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    }else {
        this.segments.pop();
    }
};

Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    }else if (this.direction === "right" && newDirection === "left") {
        return;
    }else if (this.direction === "down" && newDirection === "up") {
        return;
    }else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};


// Конструктор яблучка
const Apple = function () {
    this.position = new Block(10, 10);
}

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random()*(widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random()*(widthInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};


let snake = new Snake();
let apple = new Apple();


let intervalId = setInterval(() => {
    ctx.clearRect(0,0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

$("body").keydown((event) => {
    let newDirection = directions[event.keyCode];
    console.log(newDirection);
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});



// --------------------------------------------------------------------------------------------------------------------




// let blocksArr = [];
// let posX = 1;
// let posY = 1;

// for (let posX = 1; posX <= 39; posX++) {
//     blocksArr.push(new Block(posX, posY))
//     for (let posY = 1; posY <= 39; posY++) {
//         blocksArr.push(new Block(posX, posY));
//     }
// };

// for (let i = 0; i < blocksArr.length; i++) {
//     const element = blocksArr[i];

//     const red = Math.floor(Math.random() * 256);
//     const green = Math.floor(Math.random() * 256);
//     const blue = Math.floor(Math.random() * 256);
    
//     // Формуємо рядок у форматі RGB
//     const randomColor = `rgb(${red}, ${green}, ${blue})`;

//     // element.drawSquare(randomColor);
//     element.drawCircle(randomColor);
// };

// console.log(blocksArr)