// varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform mediump vec2 aspect;
uniform mediump float t;
uniform mediump vec2 start_pos;

const mediump float maxRadius = 0.25;

precision highp float;

void main(void) {
    float x = sin(vTextureCoord.y * 12.56) * 0.05;
    float y = sin(vTextureCoord.x * 12.56) * 0.05;
    vec2 offset = vec2(x, y);
    vec2 dir = start_pos - vTextureCoord;

    float d = length(dir/aspect) - t * maxRadius;
    d *= 1. - smoothstep(0., 0.05, abs(d));

    dir = normalize(dir);

    gl_FragColor = texture2D(uSampler, vTextureCoord + dir * d);
}