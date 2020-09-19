//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex,trex_running,trex_collided,cloud,cloud1,CloudsGroup;
var ground,invisibleGround,gImage;
var obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6,ObstaclesGroup;
var count=0;
var gameOver,restart,goImage,rImage;
localStorage["Highest Score"]=0;

function preload(){
trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  gImage=loadImage("ground2.png");
  goImage=loadImage("gameOver.png");
  rImage=loadImage("restart.png");
  
  cloud1=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
}
function setup(){
createCanvas(600,200);
 trex = createSprite(50,150,20,20);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(300,175,600,20);
  ground.addImage("ground",gImage);
  ground.velocityX = -2
  ground.x=ground.width/2;
  
  invisibleGround = createSprite(300,185,600,20);
  invisibleGround.visible = false;
  CloudsGroup = createGroup();
  ObstaclesGroup = createGroup();

//place gameOver and restart icon on the screen
 gameOver = createSprite(300,120);
 restart = createSprite(300,150);
gameOver.addImage(goImage);
gameOver.scale = 0.5;
restart.addImage(rImage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

}
function draw() {
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 500, 50);
  console.log(gameState);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count + Math.round(World.frameRate/60);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 151){
      trex.velocityY = -12 ;
      
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
     
      gameState = END;
     
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
  localStorage["HighestScore"]=score
  }
  count = 0;
  
}

function spawnClouds(){
  if(World.frameCount%80===0){
    
cloud=createSprite(590,random(80,120),10,10);
  cloud.addAnimation("clouds",cloud1);
  cloud.scale=0.5;
  cloud.velocityX=-6
   cloud.lifetime = 134;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    CloudsGroup.add(cloud);

  }
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
     obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    var rand = Math.round(random(1,6)); 
    switch(rand) 
    { 
      case 1: obstacle.addImage(obstacle1); 
        break; 
        case 2: obstacle.addImage(obstacle2); 
        break; 
      case 3: obstacle.addImage(obstacle3);
        break; 
        case 4: obstacle.addImage(obstacle4); 
        break; 
        case 5: obstacle.addImage(obstacle5);
        break;
        case 6: obstacle.addImage(obstacle6);
        break; 
        default: break;
        
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    ObstaclesGroup.add(obstacle);
  }
}
