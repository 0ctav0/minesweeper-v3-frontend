import { Shader } from "./Shader";
import vsSource from "./vertex-shader.glsl?raw"
import fsSource from "./fragment-shader.glsl?raw"
import { mat4 } from "gl-matrix";
import { Plane } from "./Plane";
import { Texture } from "./Texture";

export class GLCanvas {
    gl: WebGLRenderingContext;
    texture;
    programInfo;
    buffers;
    start_pos = [0, 0];
    started_time = 0;
    playing = false;
    stop_timer = 0;

    constructor() {
        const webglCanvas = document.getElementById("webgl") as HTMLCanvasElement;
        const gl = webglCanvas.getContext("webgl");
        if (!gl) throw new Error("Unable to initialize WebGL");
        this.gl = gl;

        const shader = new Shader(this.gl);
        this.buffers = new Plane(this.gl).InitBuffers();
        this.texture = Texture.LoadTexture(this.gl);
        const shaderProgram = shader.InitShaderProgram(vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor"),
                textureCoord: this.gl.getAttribLocation(shaderProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                uSampler: this.gl.getUniformLocation(shaderProgram, "uSampler"),
                aspect: this.gl.getUniformLocation(shaderProgram, "aspect"),
                start_pos: this.gl.getUniformLocation(shaderProgram, "start_pos"),
                t: this.gl.getUniformLocation(shaderProgram, "t"),
            }
        }
    }

    SetTexture(imgData: string) {
        this.texture = Texture.LoadTexture(this.gl, imgData);
    }

    Play(position: [number, number], stopDelay: number) {
        this.playing = true;
        this.started_time = performance.now() / 1000;
        this.start_pos = position;
        this.stop_timer = setTimeout(() => this.Stop(), stopDelay);
    }

    Stop() {
        clearTimeout(this.stop_timer);
        this.playing = false;
    }

    Draw() {
        if (!this.playing) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            return;
        }

        const width = this.gl.canvas.width;
        const height = this.gl.canvas.height;
        this.gl.viewport(0, 0, width, height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clearDepth(1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();

        this.SetPositionAttribute();
        this.SetTextureAttribute();

        this.gl.useProgram(this.programInfo.program);

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

        this.gl.uniform2fv(this.programInfo.uniformLocations.aspect, [1, width / height]);
        this.gl.uniform2fv(this.programInfo.uniformLocations.start_pos, this.start_pos);
        this.gl.uniform1f(this.programInfo.uniformLocations.t, performance.now() / 1000 - this.started_time);

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    private SetPositionAttribute() {
        const num = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, num, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    }

    private SetTextureAttribute() {
        const num = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
    }
}