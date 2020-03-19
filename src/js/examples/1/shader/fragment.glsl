varying vec2 vUv;

void main() {
    vec2 uvn = (vUv - .5)*2.;

    vec4 backbgorund = vec4(vUv.x, vUv.x, 1., 1.);
    vec4 color1 = vec4(1., 1., 1., 1.);
    vec4 color2 = vec4(0.5);
    vec4 color3 = vec4(1., 0., 0., 1.);

    vec4 pixel = backbgorund;

    // line
    float offset = .3;
    float lineWidth = .01;
    if (abs(vUv.x - offset) < lineWidth) {
        pixel = color1;
    }

    // grid
    const float gridLineWidth = 0.1;
    for (float i = 0.; i < 1.0; i += gridLineWidth) {
        if (abs(vUv.x - i) < .001) pixel = color2;
        if (abs(vUv.y - i) < .001) pixel = color2;
    }

    // axes
    float axesXOffset = 0.;
    float axesYOffset = 0.;
    if (abs(uvn.x - axesXOffset) < 0.02) pixel = color3;
    if (abs(uvn.y - axesYOffset) < 0.02) pixel = color3;

    gl_FragColor = pixel;
}
