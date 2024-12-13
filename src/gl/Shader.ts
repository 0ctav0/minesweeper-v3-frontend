export class Shader {
    gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    InitShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
        const vertexShader = this.LoadShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.LoadShader(this.gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = this.gl.createProgram();
        if (!shaderProgram) throw new Error("Shader program is null");

        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            throw new Error(`Unable to initalize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
        }

        return shaderProgram;
    }

    private LoadShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type) as WebGLShader;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            throw new Error(`An error occurred compiling the shader (${type}): ${this.gl.getShaderInfoLog(shader)}`)
        }

        return shader;
    }
}
