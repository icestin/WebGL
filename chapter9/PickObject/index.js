
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n'+
'uniform mat4 u_MvpMatrix;\n'+
'uniform bool u_Clicked;\n'+ //通过该变量来接收鼠标点击事件
'varying vec4 v_Color;\n'+
'void main() {\n' +
'   gl_Position = u_MvpMatrix * a_Position;\n'+
'   if (u_Clicked) { \n'+
'     v_Color = vec4(1.0, 0.0, 0.0, 1.0);\n'+
' } else {\n'+
'   v_Color = a_Color;\n'+
'  }\n'+
'}\n';
//片源着色器程序
/**
 * 片元都带有坐标信息，vec4 gl_FragCoord 内置变量的第1个和第2个分量表示片元在
 * <canvas>坐标系统中的坐标值。
 */
var FSHADER_SOURCE=
'precision mediump float;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
' gl_FragColor = v_Color;\n'+ //设置颜色
'}\n';

var ANGLE_STEP = 20.0;

function main(){
    var canvas=document.getElementById('webgl');
    //获取 nearFar元素
    var gl=getWebGLContext(canvas);
    if(!gl){
        alert('渲染WebGL上下文失败');
        return;
    }
    //初始化着色器
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log('初始化着色器失败');
        return;
    }
    //设置顶点位置
    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('设置顶点位置失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
    
    if(!u_MvpMatrix || !u_Clicked){
        console.log('获取视图矩阵失败');
        return;
    }

    var viewProMatrix = new Matrix4();
    viewProMatrix.setPerspective(50, 1, 1, 100);
    viewProMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    
    gl.uniform1i(u_Clicked, 0); //传递bool值
    
    var currentAngle = 0.0;
    canvas.onmousedown = function(ev) {
       var x = ev.clientX, y = ev.clientY;
       var rect = ev.target.getBoundingClientRect();
    //    console.log("rect实体",rect);
       if(rect.left <= x && x < rect.right && rect.top <=y && y < rect.bottom) {
        //判断是否在 canvas中
        var x_in_canvas = x - rect.left, 
            y_in_canvas = rect.bottom - y;
        var picked = check(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_Clicked,viewProMatrix, u_MvpMatrix);
        if (picked) alert("The Cube was selected! ");
     }
    }
    var tick = function() { //Start drawing
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, viewProMatrix, u_MvpMatrix);
        requestAnimationFrame(tick, canvas);
    }
    tick();
}



function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
}


function initArrayBuffer(gl, data, num, type, attribute){
    var buffer = gl.createBuffer();//创建缓冲区对象
    if(!buffer){
        console.log('创建缓冲区对象失败');
        return false;
    }
    //将数据写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 将缓冲区对象分配给attribute变量
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_attribute < 0){
        console.log('获取着色器失败');
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    //将缓冲区对象分配给attribute变量
    gl.enableVertexAttribArray(a_attribute);
    return true;
}

function initVertexBuffers(gl){
    // 立方体
    //     v6------ v5
    //    /|       /|
    //   v1-------v0|
    //   | |      | |
    //   | |v7----|-|v4
    //   |/       |/  
    //   v2------v3
    // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
  var vertices = new Float32Array([
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);
  var colors = new Float32Array([   // Colors
    0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
    0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
   ]);
  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);
     //
    
     if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
       return -1;
     if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
       return -1;
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    var indexBuffer = gl.createBuffer();
    if(!indexBuffer){
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function check(gl, n, x, y, currentAngle, u_Clicked, viewProjMatrix, u_MvpMatrix,){
    var picked = false;
    gl.uniform1i(u_Clicked, 1); //鼠标点击
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix); //绘制红色的立方体
    // 读取点击位置处的像素
    var pixels = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    // console.log(pixels);
    if (pixels[0] == 255) //通过颜色来查看是否是点在了立方体上
       picked = true;
    gl.uniform1i(u_Clicked, 0); //让着色器重绘立方体本来的颜色
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
    return picked;
}
var g_MvpMatrix = new Matrix4(); //
function draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix){
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
var last = Date.now(); // 函数执行的最后时刻
function animate(angle) {
    var now = Date.now();
    var elapsed = now -last;
    last = now;
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}


 