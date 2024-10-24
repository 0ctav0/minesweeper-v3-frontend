import { COLOR_NUMBERS } from "../constants";
import { random, randomSigned } from "../helpers";
import { IEffect } from "./IEffect";
import { Particle } from "./Particle";

const PARTICLE_NUMBER = 100;

const GRAVITY = 0.0098;

export class ConfettiEffect implements IEffect {
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private playing: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.playing = false;
        this.particles = [];
    }

    private Init() {
        this.particles = [];
        for (let i = 0; i < PARTICLE_NUMBER; i++) {
            const size = random(2, 10);
            this.particles.push(new Particle({
                x: this.ctx.canvas.width / 2,
                y: this.ctx.canvas.height,
                vector: { x: randomSigned() * 2, y: -random(6, 12) + Math.random() },
                width: size,
                height: size,
                color: COLOR_NUMBERS[random(0, COLOR_NUMBERS.length)],
                rotation: random(0, 91),
            }))
        }
    }

    Play(turnOffAfter: number) {
        this.playing = true;
        this.Init();
        this.EffectUpdateLoop();
        setTimeout(() => this.Stop(), turnOffAfter);
    }

    Stop() {
        this.playing = false;
    }

    private EffectUpdateLoop = () => {
        if (!this.playing) return;
        const FPS = 1000 / 60;
        this.Update();
        setTimeout(this.EffectUpdateLoop, FPS);
    }

    private EffectRenderLoop = () => {
        if (!this.playing) return;
        this.Draw();
        setTimeout(() => requestAnimationFrame(this.EffectRenderLoop), 5);
    }

    private Update() {
        for (let i = 0; i < this.particles.length; i++) {
            const { p } = this.particles[i];
            p.rotation += 2;
            p.vector.y += GRAVITY;
            p.x += p.vector.x;
            p.y += p.vector.y;
            if (p.y < 0) {
                p.vector.y = -p.vector.y;
            }
            if (p.x < 0 || p.x > this.ctx.canvas.width) {
                p.vector.x = -p.vector.x;
            }
        }
    }

    Draw() {
        if (!this.playing) return;
        for (let i = 0; i < this.particles.length; i++) {
            const { RotateAndDraw } = this.particles[i];
            RotateAndDraw(this.ctx);
        }
    }
}