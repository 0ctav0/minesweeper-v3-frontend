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
            textureCoord: this.InitTextureBuffer(),
        }
    }

    InitTextureBuffer() {
        const textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);

        const tr = [1, 0];
        const tl = [0, 0];
        const bl = [0, 1];
        const br = [1, 1];
        const textureCoordinates = [
            tr,
            tl,
            br,
            bl,
        ].flat();

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);

        return textureCoordBuffer;
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