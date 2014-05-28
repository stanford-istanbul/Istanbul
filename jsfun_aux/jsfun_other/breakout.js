var STAGE_WIDTH = 400;
var STAGE_HEIGHT = 600;

var app = new GraphicsApp();

/* local game state */
var TOP_GAP = 20; //Gap from top wall to firs brick
var BRICK_GAP = 5; // Gap between bricks
var BRICKS_ROW = 10; // Number of bricks in a row
var NUM_ROWS = 10; // Number of rows of bricks

var BRICK_WIDTH = Math.floor((STAGE_WIDTH - BRICK_GAP*(BRICKS_ROW+2))/BRICKS_ROW);
var BRICK_HEIGHT = 10;

var BALL_RADIUS = 10;

var PADDLE_WIDTH = 80;
var PADDLE_HEIGHT = 20;

var bricksLeft = 100; // number of bricks left on the screen. if 0, player wins

var colors = [Color.red, Color.yellow, Color.magenta, Color.green, Color.blue];

var ball;
var paddle;

/**
 * We create all the gameplay elements here: ball, paddle, and bricks!
 */
function run() {
    app.addCanvas(STAGE_WIDTH, STAGE_HEIGHT);
    for (var i=0; i < NUM_ROWS; ++i) {
        for (var j=0; j < BRICKS_ROW; ++j) {
            var rect = new GRect(BRICK_GAP + (i*(BRICK_WIDTH+BRICK_GAP)), 
                                 TOP_GAP + BRICK_GAP + (j*(BRICK_HEIGHT+BRICK_GAP)), 
                                 BRICK_WIDTH, BRICK_HEIGHT);
            rect.setColor(colors[Math.floor(j/2)]);
            add(rect);
        }
    }
    
    ball = new GCircle(200,400,BALL_RADIUS);
    ball.vx = Math.random()*20-10;
    ball.vy = 6;
    add(ball);
    
    paddle = new GRect(180,550,PADDLE_WIDTH,PADDLE_HEIGHT);
    add(paddle);
}

/**
 * Detect when the ball has hit any of the walls. The ball
 * bounces off the north, east, and west walls, and indicates
 * failure if the ball goes off the bottom of the screen
 */
function detectWalls() {
    if (ball.position.y > STAGE_HEIGHT) {
        var text = new PIXI.Text("YOU LOSE", {font:"50px Arial", fill:"red"});
        text.position.x = STAGE_WIDTH/2 - text._width/2;
        text.position.y = STAGE_HEIGHT/2;
        stage.addChild(text);
        ball.vx = 0;
        ball.vy = 0;
        return;
    } else if (ball.position.x < 0 || ball.position.x > STAGE_WIDTH) {
        ball.vx = -ball.vx;
    } else if (ball.position.y <= 0) {
        ball.vy = -ball.vy;   
    }
}

/**
 * Detect a collision between the ball and another object!
 * If it collides with any element (brick or paddle), we
 * reverse its y direction. In addition, if the collider
 * is a brick, we remove the brick
 */
function detectCollision() {
    
    detectWalls();
    for (var i=0; i<=BALL_RADIUS; i+=BALL_RADIUS) {
        for (var j=0; j<BALL_RADIUS; j+=BALL_RADIUS) {
            var collider = stage.getElementAt(ball.position.x+i, ball.position.y+j);
            if (collider !== null) {
                ball.vy = -ball.vy;
                if (collider !== paddle) {
                    stage.remove(collider);
                    bricksLeft -= 1;
                }
                return;
            }
        }
    }
}

/**
 * This function is called inside a loop to animate the
 * game. Here is where we update the positions of all the
 * elements in the game and remove / add elements
 * with response to gameplay events (collisions, win/loss, etc)
 */
function drawFrame() {
    ball.position.x += ball.vx;
    ball.position.y += ball.vy;
    
    detectCollision();
    
    var mousex = stage.getMousePosition().x;
    if (mousex > 0 && mousex < STAGE_WIDTH-PADDLE_WIDTH) {
        paddle.position.x = mousex;
    }
    if (bricksLeft === 0) {
        var text = new PIXI.Text("YOU WIN", {font:"50px Arial", fill:"red"});
        text.position.x = STAGE_WIDTH/2 - text._width/2;
        text.position.y = STAGE_HEIGHT/2;
        stage.addChild(text);
        ball.vx = 0;
        ball.vy = 0;
    }
}