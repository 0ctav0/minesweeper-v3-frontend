import { Shader } from "./Shader";
import vsSource from "./vertex-shader.glsl?raw"
import fsSource from "./fragment-shader.glsl?raw"
import { degToRad } from "../helpers";
import { mat4 } from "gl-matrix";
import { Plane } from "./Plane";


export class GLCanvas {
    gl: WebGLRenderingContext;
    programInfo;
    buffers;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        const shader = new Shader(this.gl);
        this.buffers = new Plane(this.gl).InitBuffers();
        const shaderProgram = shader.InitShaderProgram(vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            }
        }
    }

    Draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0.5);
        this.gl.clearDepth(1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const fov = degToRad(45);
        const aspect = this.gl.canvas.width / this.gl.canvas.height;
        const zNear = 0.1;
        const zFar = 100;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

        this.SetPositionAttribute();
        this.SetColorAttribute();

        this.gl.useProgram(this.programInfo.program);

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    SetColorAttribute() {
        const numComponents = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
    }

    SetPositionAttribute() {
        const numComponents = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    }
}