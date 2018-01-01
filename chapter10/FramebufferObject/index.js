
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec2 a_TexCoord;\n'+
'uniform mat4 u_MvpMatrix;\n'+   //模型视图投影矩阵
'varying vec2 v_TexCoord;\n'+
'void main() {\n' +
'gl_Position = u_MvpMatrix * a_Position;\n'+ //设置坐标
'v_TexCoord = a_TexCoord;\n'+
'}\n';
//片源着色器程序
/**
 * 片元都带有坐标信息，vec4 gl_FragCoord 内置变量的第1个和第2个分量表示片元在
 * <canvas>坐标系统中的坐标值。
 */
var FSHADER_SOURCE=
'#ifdef GL_ES\n' +
'precision mediump float;\n'+
'#endif\n'+
'uniform sampler2D u_Sampler;\n'+
'varying vec2 v_TexCoord;\n'+
'void main() {\n'+
' gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n'+ 
'}\n';

// 定义离屏尺寸
var OFFSCREEN_WIDTH = 256;
var OFFSCREEN_HEIGHT = 256;

function main(){
    var canvas=document.getElementById('webgl');
    //获取 nearFar元素
    var gl=getWebGLContext(canvas);
    if(!gl){
        alert('渲染WebGL上下文失败');
        return;
    }
    //初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('初始化着色器失败');
        return;
    }
    
    var program = gl.program;
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');

    if(program.a_Position < 0 || program.a_TexCoord < 0 || !program.u_MvpMatrix ){
        console.log('获取着色器变量失败');
        return;
    }
    //设置 顶点信息
    var cube = initVertexBuffersForCube(gl);
    var plane = initVertexBuffersForPlane(gl);
    if(!cube || !plane){
        conosle.log('设置顶点信息失败');
        return;
    }
    //设置纹理
    var texture = initTextures(gl);
    if (!texture) {
        console.log('初始化纹理失败');
        return;
    }

    // 初始化帧缓冲区对象
    var fbo = initFramebufferObject(gl);
    if (!fbo) {
        console.log('初始化帧对象失败');
        return;
    }
    
    gl.enable(gl.DEPTH_TEST);
  
    var viewProMatrix = new Matrix4();
    viewProMatrix.setPerspective(30,canvas.width/canvas.height, 1.0, 100);
    viewProMatrix.lookAt(0.0, 0.0, 7.0, 0, 0.0, 0.0, 0.0, 1.0, 0.0);   
    
    var viewProjMatrixFBO = new Matrix4();
    viewProjMatrixFBO.setPerspective(30,OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100);
    viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0, 0.0, 0.0, 0.0, 1.0, 0.0);   
    
    //开始绘制
    var currentAngle = 0.0;
    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, canvas, fbo, plane, cube, currentAngle,texture, viewProMatrix, viewProjMatrixFBO)
    };
    tick();
    
}
function initVertexBuffersForCube(gl){
  // 创建立方体
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // 顶点信息 
  var vertices = new Float32Array([
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
 ]);
 //纹理坐标
  var texCoords = new Float32Array([
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
]);

// 顶点索引
var indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
]);
var o = new Object();

o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if(!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;
o.numIndices = indices.length;
//解除绑定
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForPlane(gl) {
    // 创建面
    //  v1 --------v0
    //   |         |
    //   |         |
    //   |         |
    //   v2--------v3
   
    var vertices = new Float32Array([
        1.0, 1.0, 0.0,     -1.0,1.0,0.0,    -1.0, -1.0, 0.0,     1.0, -1.0, 0,0
    ]);
    var texCoords = new Float32Array([
        1.0, 1.0,  0.0, 1.0,    0.0, 0.0,   1.0, 0.0
        //v0        //v1        //v2         //v3    点位
    ]);
    var indices  = new Uint8Array([0, 1, 2,   0, 2, 3]);

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

    o.numIndices = indices.lenght;
   
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
    // 创建缓冲区对象
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('创建缓冲区对象失败');
        return null;
    }
    //向缓冲区对象中写入数据
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.num = num;
    buffer.type = type;

    return buffer;
}

   function initElementArrayBufferForLaterUse(gl, data, type) {
     //创建缓冲区对象
     var buffer = gl.createBuffer();
     if (!buffer) {
         console.log('创建缓冲区对象失败');
         return null;
     }
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

     buffer.type = type;
     return buffer;
   }
   function initTextures(gl) {
    // 创建纹理   
    var texture = gl.createTexture();
     if (!texture) {
         console.log('创建纹理对象失败');
         return null;
    }
    
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler ) {
        console.log('获取纹理对象失败');
        return null;
    }
    var image = new Image();
    if(!image) {
        console.log('创建图片对象失败');
        return null;
    }
    image.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,  gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    image.src='../../resources/sky_cloud.jpg';
    return texture;
   }
/**
 *  创建帧缓冲区对象  fbo 传递给draw()函数
 * @param {*} gl 
 */
function initFramebufferObject(gl) {
    var framebuffer, texture, depthBuffer;
    // 定义错误处理函数
    var error = function() {
        if (framebuffer) gl.deleteFramebuffer(framebuffer);
        if (textrue)     gl.deleteTexture(texture);
        if (depthBuffer) g_modelMatrix.deleteRenderbuffer();
        return null;
    }

    // 创建帧缓冲区对象      [1]
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        console.log('创建帧缓冲区对象失败');
        return error();
    }
    // 创建纹理对象     关联帧缓冲区的颜色关联对象    [2]
    texture = gl.createTexture();
    if (!texture) {
        console.log('创建纹理对象失败');
        return error();
    }
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 可以为纹理对象分配一块存储纹理图像的区域，供WebGL在其中进行绘制， 调用texImage2D时，最后一个参数设置为null,就可以创建一块空白的区域
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    framebuffer.texture = texture;  // 存储纹理对象
    
    //创建渲染对象 并设置尺寸及参数       [3]
    depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
        console.log('创建渲染对象失败');
        return error();
    }
    // 在使用渲染缓冲区之前，需要将其绑定到目标上，通过对目标做一些额外的操作来这是渲染缓冲区的尺寸等参数
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);
    // 将纹理对象关联到帧缓冲区对象
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    // 将渲染缓冲区对象关联到帧缓冲区对象（渲染缓冲区对象的作用是帮助进行隐藏面消除，所以关联到深度对象中）
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // 检查帧对象是否配置正确
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !==e) {
        console.log('帧缓冲对象未完成 ：' ,e);
        return error();
    }
    //
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
}
/**
 * 首先把绘制目标切换为帧缓冲对象 fbo,在颜色关联对象中绘制立方体，
 * 然后把绘制目标切回<canvas>调用drawTexturedPlane函数绘制矩形
 * 并把上一步绘制的纹理对象中的图像贴到矩形表面.
 * @param {*} gl 
 * @param {*} canvas 
 * @param {*} fbo 
 * @param {*} plane 
 * @param {*} cube 
 * @param {*} angle 
 * @param {*} texture 
 * @param {*} viewProjMatrix 
 * @param {*} viewProjMatrixFBO 
 */
function draw(gl, canvas, fbo, plane, cube, angle, texture, viewProjMatrix, viewProjMatrixFBO){
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);//为帧缓冲区准备

    gl.clearColor(0.2, 0.2, 0.4, 1.0); //改变颜色
    //清除 FBO对象
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //绘制立方体
    drawTexturedCube(gl, gl.program, cube, angle, texture, viewProjMatrixFBO);
    // 切换绘制目标为颜色缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // 将视窗设置回 <canvas>的尺寸
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // 绘制平面
    drawTexturedPlane(gl, gl.program, plane, angle, fbo.texture, viewProjMatrix);
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

function drawTexturedCube(gl, program, o, angle, texture, viewProjMatrixFBO){
    // 计算模型矩阵
    g_modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

    g_mvpMatrix.set(viewProjMatrixFBO);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    drawTexturedObject(gl, program, o, texture);
}

function drawTexturedPlane(gl, program, o, angle, texture, viewProjMatrix) {
    g_modelMatrix.setTranslate(0, 0, 1);
    g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    drawTexturedObject(gl, program, o, texture);
}

function drawTexturedObject(gl, program, o, texture){
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //绘制 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

}


function initAttributeVariable(gl, a_attribute, buffer){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

var ANGLE_STEP = 30;

var last = Date.now();

function animate(angle){
    var now = Date.now();
    var elapsed = now - last;
    last = now;
    // 更新旋转角度
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}