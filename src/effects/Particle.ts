type ParticleType = {
    x: number;
    y: number;
    vector: { x: number, y: number };
    width: number;
    height: number;
    color: string;
    rotation: number;
}

export class Particle {
    p: ParticleType;

    constructor(particle: ParticleType) {
        this.p = particle;
    }

    RotateAndDraw = (ctx: CanvasRenderingContext2D) => {
        const { x, y, width, height, color, rotation } = this.p;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
}