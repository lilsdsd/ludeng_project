<template>
  <div
    class="waves relative"
    @mousemove="updateMouse"
    @contextmenu.prevent="debugRender = !debugRender"
  >
    <div v-show="debugRender" ref="renderer" class="absolute top-0 left-0 bottom-0 right-0"/>

    <svg
      width="100%"
      height="100%"
      class="relative"
      :style="{ visibility: debugRender ? 'hidden' : 'visible' }"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#274869;stop-opacity:1"></stop>
          <stop offset="100%" style="stop-color:#274869;stop-opacity:0.5"></stop>
        </linearGradient>
      </defs>
      <!-- <circle v-for="(item, index) in positions"
              :key="index"
              r="5"
              :cx="item.x"
      :cy="item.y" />-->
      <path class="water" :d="lineGen(positions)"></path>

      <path v-if="true" class="top" :d="topGen(positions)"></path>
    </svg>
  </div>
</template>

<script>
import {
  Engine,
  Render,
  Runner,
  Composites,
  Bodies,
  Constraint,
  Body,
  Composite,
  World,
  Mouse,
  Vector
  // Events
} from "matter-js";

import { line, curveNatural, area } from "d3";
export default {
  props: {
    /**
     * Amount of points along the x axis
     * @type {Vue.PropOptions<number>}
     */
    segments: {
      type: Number,
      default: 25
    },

    /**
     * Amount of turbulence
     * @type {Vue.PropOptions<number>}
     */
    turbulence: {
      type: Number,
      default: 0.4,

      /** @param {number} val */
      validator(val) {
        return val <= 1;
      }
    },

    gravity: {
      type: Object,
      default: () => ({
        scale: 0.001,
        x: 0,
        y: 0
      })
    }
  },
  data() {
    return {
      engine: Engine.create(),
      runner: Runner.create(),
      debugRender: false,
      /** @type {Matter.Render?} */
      render: null,
      /** @type {Matter.Vector[]} */
      positions: [],
      height: 0,
      mp: {
        x: 0,
        y: 0
      },
      beginSpring: {
        x: 0,
        y: 0
      },

      endSpring: {
        x: 0,
        y: 0
      },

      /** @type {Matter.Body} */
      bb: null,

      /** @type {Matter.ICollisionFilter} */
      cf: null
    };
  },
  computed: {
    /** @returns {d3.Area<Matter.Vector>} */
    lineGen() {
      /** @type {() => d3.Area<Matter.Vector>} */
      const _area = area;

      return _area()
        .x(v => v.x)
        .y0(v => v.y)
        .y1(this.height)
        .curve(curveNatural);
    },

    /** @returns {d3.Line<Matter.Vector>} */
    topGen() {
      /** @type {() => d3.Line<Matter.Vector>} */
      const _line = line;
      return _line()
        .x(v => v.x)
        .y(v => v.y)
        .curve(curveNatural);
    },

    oscillationSize() {
      return 5;
    }
  },
  mounted() {
    const world = this.engine.world;

    world.gravity = this.gravity;

    this.engine.velocityIterations = 20;
    this.engine.constraintIterations = 2;
    this.engine.positionIterations = 20;

    // this.gravity = world.gravity

    const { width, height } = this.$el.getBoundingClientRect();

    this.height = height;

    this.render = Render.create({
      // @ts-ignore
      element: this.$refs.renderer,
      engine: this.engine,
      options: {
        width,
        height,
        showCollision: false,
        showVelocity: true,
        showConstraints: true,
        showPositions: true,
        wireframes: true
      }
    });

    Render.run(this.render);

    // @ts-ignore
    Runner.run(this.runner, this.engine);

    // add bodies
    let group = Body.nextGroup(true);

    this.cf = {
      group
    };

    this.positions = [];

    const ropeB = Composites.stack(
      -(width / this.segments) / 2,
      height / 2,
      this.segments,
      1,
      0,
      0,
      (x, y) => {
        const rect = Bodies.rectangle(x, y, width / this.segments, 5, {
          collisionFilter: {
            group: this.cf.group
          },
          friction: 1,
          density: 0.001,
          // restitution: 0.999,
          frictionAir: 0,

          chamfer: 2,
          label: "water"
        });

        return rect;
      }
    );

    const ropeBConstraintOffset = 0.4;
    this.beginSpring.y = height / 2;

    Composites.chain(
      ropeB,
      ropeBConstraintOffset,
      0,
      -ropeBConstraintOffset,
      0,
      {
        stiffness: 0.105,
        // length:    0,
        damping: 0.9,
        render: { type: "spring" }
      }
    );
    ropeB.constraints.forEach((c, i) => {
      if (i > 0 && i < ropeB.constraints.length - 1) {
        c.length = 0;
        c.damping = 0.01;
        // c.stiffness = 0.07
      } else {
        c.stiffness = 0.05;
        c.length = 0;
        c.render.strokeStyle = "red";
      }
    });
    Composite.add(
      ropeB,
      Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: {
          x: -(width / this.segments) / 2,
          y: 0
        },
        pointA: this.beginSpring,
        // stiffness: 0.9,
        length: 0,
        damping: 0
      })
    );

    // this.beginSpring = ropeB.constraints[0].pointB

    this.endSpring = {
      x: width,
      y: ropeB.bodies[ropeB.bodies.length - 1].position.y
    };

    Composite.add(
      ropeB,
      Constraint.create({
        bodyB: ropeB.bodies[ropeB.bodies.length - 1],
        pointB: { x: (width / this.segments) * 0.5, y: 0 },
        pointA: this.endSpring,
        length: 0,
        stiffness: 0.1,
        damping: 1
      })
    );

    World.add(world, [ropeB]);

    // add mouse control
    const mouse = Mouse.create(this.$el);

    // @ts-ignore
    // const mouseConstraint = MouseConstraint.create(this.engine, {
    //   mouse: mouse,

    //   constraint: {
    //     stiffness: 0.08,
    //     damping:   0.3,
    //     render:    {
    //       visible: true
    //     }
    //   }
    // })

    // World.add(world, mouseConstraint)

    const bb = Bodies.circle(0, 0, 50, {
      density: 0.5,
      // restitution:     0.9,
      friction: 0,
      frictionStatic: 0.5,
      frictionAir: 0.001,
      label: "mouse",
      collisionFilter: {
        group: null
      }
    });

    const mc2 = Constraint.create({
      // bodyA:     world,
      bodyB: bb,
      pointA: this.mp,
      pointB: Vector.create(),
      stiffness: 0.9,
      // length:    0,
      damping: 0.7
    });

    this.bb = bb;
    this.group = group;

    World.add(world, bb);

    World.add(world, mc2);

    // Body.setStatic(ropeB.bodies[0], true)
    // Body.setStatic(ropeB.bodies[ropeB.bodies.length - 1], true)

    // keep the mouse in sync with rendering
    Object.assign(this.render, {
      mouse
    });
    // this.render.mouse = mouse

    // ! We now observe all position objects, and vue will update when they are modified by the engine
    const bodyPos = ropeB.bodies.map(b => b.position);

    // Add the last pivot point
    this.positions = [this.beginSpring, ...bodyPos, this.endSpring];

    window.engine = this.engine;
    window.v = this;
    // window.observedThing = Vue.observable(ropeB)
    this.$once("hook:beforeDestroy", () => {
      delete window.engine;
      // delete window.observedThing
      delete window.v;

      this.kill = true;
    });
    this.enterFrame();
  },
  beforeDestroy() {
    Engine.clear(this.engine);
    Runner.stop(this.runner);
    World.clear(this.engine.world, false);
    if (this.render) Render.stop(this.render);
  },
  methods: {
    /**
     * @param {MouseEvent} ev
     */
    updateMouse(ev) {
      const { layerX: x, layerY: y } = ev;

      if (y > this.height * 0.6 || y < this.height * 0.4) {
        this.bb.collisionFilter.group = this.cf.group;
      } else {
        this.bb.collisionFilter.group = null;
      }

      Object.assign(this.mp, {
        x,
        y
      });
    },
    enterFrame(d = 0) {
      requestAnimationFrame(e => {
        this.endSpring.y =
          this.height * 0.5 + Math.sin(e / 480) * this.oscillationSize;
        this.beginSpring.y =
          this.height * 0.5 +
          Math.sin(e / 350 + Math.PI / 4) * this.oscillationSize;

        if (!this.kill) {
          this.enterFrame(e);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.waves {
  position: relative;

  svg {
    pointer-events: none;
  }
}

path {
  &.water {
    // fill: rgba(27, 203, 253, 0.99);
    fill: url(#grad1);
  }

  &.top {
    fill: none;
    stroke: rgb(8, 150, 245);
    stroke-width: 5;
    // stroke-dasharray: 50;
    // stroke-linecap: round;
  }
}
</style>
