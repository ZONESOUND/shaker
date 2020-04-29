var Example = Example || {};

class BallPool{
    constructor() {
        this.width = window.innerWidth;
        this.height = 600;

        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composites = Matter.Composites,
            Common = Matter.Common,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Events = Matter.Events;

        this.Body = Matter.Body;
        this.Composite = Matter.Composite;
        // create engine
        var engine = Engine.create();
        this.world = engine.world;

        // create renderer
        var render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: this.width,
                height: this.height,
                showAngleIndicator: true
            }
        });

        Render.run(render);

        // create runner
        var runner = Runner.create();
        Runner.run(runner, engine);
        // add bodies
        World.add(this.world, [
            Bodies.rectangle(this.width/2, this.height, this.width, 20, { isStatic: true }),
            Bodies.rectangle(this.width/2, 0, this.width, 20, { isStatic: true }),
            Bodies.rectangle(0, this.height/2, 20, this.height, { isStatic: true }),
            Bodies.rectangle(this.width, this.height/2, 20, this.height, { isStatic: true })
        ]);

        this.stack = Composites.stack(this.width/2, this.height/2, 2, 2, 10, 10, function(x, y) {
            return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
        });
        
        World.add(this.world, [this.stack]);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        World.add(this.world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

        Events.on(engine, 'collisionStart', function(event) {
            //console.log();
            if (recordedChunks.length > 0)
                playBuffer(recordedChunks);
        });

        // fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: this.width, y: this.height }
        });
    }

    // start() {
        

    //     Matter.Body.applyForce(body, position, force)

    setGravity({x, y}) {
        this.world.gravity.x = x;
        this.world.gravity.y = y;
    }
        
    // }
    applyForce(force) {
        //console.log('applyForce', this.stack.bodies);
        this.stack.bodies.forEach((b) => {//b.position
            //let tforce = {x: Math.max(b.position.x, Math.min(this.width-b.position.x,force.x)), y:0}
            console.log(force);
            this.Body.applyForce(b, b.position, force)
        })
    }


}

Example.ballPool = function() {

    var width = window.innerWidth;
    var height = 600;

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: width,
            height: height,
            showAngleIndicator: true
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    World.add(world, [
        Bodies.rectangle(width/2, height, width, 1, { isStatic: true }),
        Bodies.rectangle(width/2, 0, width, 1, { isStatic: true }),
        Bodies.rectangle(0, height/2, 1, height, { isStatic: true }),
        Bodies.rectangle(width, height/2, 1, height, { isStatic: true })
    ]);

    var stack = Composites.stack(width/2, height/2, 2, 2, 10, 10, function(x, y) {
        return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.1, friction: 1 });
    });
    
    World.add(world, [stack]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Events.on(engine, 'collisionStart', function(event) {
        //var pairs = event.pairs;
        [world.gravity.x, world.gravity.y] = getGravityXY();
        console.log('collide!');
    });

    //Matter.Body.applyForce(body, position, force)

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width, y: height }
    });
    return;
    
};

// Example.ballPool();
let ballPool = new BallPool();

const modeButton = document.getElementById('mode');
modeButton.addEventListener('click', function() {
    ballPool.applyForce({x:0.05, y: 0});
})