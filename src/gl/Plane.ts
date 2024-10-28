import { Colors } from "./Colors";

export class Plane {
    gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    InitBuffers() {
        return {
            position: this.InitPositionBuffer(),
            color: this.InitColorBuffers(),
        }
    }

    InitColorBuffers() {
        const colors = [...Colors.White(), ...Colors.Red(), ...Colors.Green(), ...Colors.Blue()];
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        return colorBuffer;
    }

    private InitPositionBuffer() {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        return positionBuffer;
    }
}