// varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
// out vec4 fragColor;

precision highp float;

void main(void) {
    // float x = vTextureCoord.u;
    float we = 2.0;
    vec2 offset = vec2(we, 0.0);
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    // gl_FragColor = vColor;
}