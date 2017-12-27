
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Normal;\n'+    //法向量
'uniform mat4 u_MvpMatrix;\n'+   //模型视图投影矩阵
'uniform mat4 u_NormalMatrix;\n'+   //法线矩阵
'uniform vec3 u_LightColor;\n'+   //光线颜色
'uniform vec3 u_LightDirection;\n'+   //归一化的世界坐标
'uniform vec3 u_AmbientLight;\n'+ //环境光颜色
'varying vec4 v_Color;\n'+
'void main() {\n' +
'gl_Position = u_MvpMatrix * a_Position;\n'+ //设置坐标
'vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // 对法向量进行归一化
'float nDotL = max(dot(u_LightDirection, normal), 0.0);\n'+  //计算光线方向和法向量的点积
'vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n'+
'vec3 diffuse = u_LightColor * vec3(color) * nDotL;\n'+  //计算漫反射光的颜色
'vec3 ambient = u_AmbientLight * color.rgb;\n'+ //计算环境光产生的反射光颜色
//将以上两者相加得到物体最终的颜色
'v_Color = vec4(diffuse + ambient, color.a);\n'+
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
  
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    
    if(!u_MvpMatrix || !u_LightColor || !u_LightDirection ||!u_AmbientLight|| !u_NormalMatrix){
        console.log('获取视图矩阵失败');
        return;
    }
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2); //设置环境光亮度
    //设置光线颜色
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);  //设置平行光颜色
    //设置光线方向（世界坐标系下)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();// 归一化
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    var viewProMatrix = new Matrix4();
    viewProMatrix.setPerspective(50, 1, 1, 100);
    viewProMatrix.lookAt(20.0, 10.0, 30.0, 0, 0, 0, 0, 1, 0);   
    
    //gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);//开启隐藏面消除s 
    //注册键盘响应事件
    document.onkeydown = function(ev) {
      keydown(ev, gl, n, viewProMatrix, u_MvpMatrix, u_NormalMatrix);
    }
    draw(gl,n, viewProMatrix, u_MvpMatrix, u_NormalMatrix);

  
 
}
var ANGLE_STEP = 3.0,      // 每次按钮转动的角度
    g_arm1Angle = 90.0,    // arm1的当前角度 
    g_joint1Angle = 20.0,  //joint1 关节的当前角度（即 arm2的角度）
// 坐标变换矩阵
    g_modelMatrix = new Matrix4(),
    g_mvpMatrix = new Matrix4(),
    g_normalMatrix = new Matrix4(); //法线的旋转矩阵

function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    switch(ev.keyCode) {
        case 38: //上 ---> Joint1 绕着Z轴正向转动
        if(g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
        break;
        case 40: //下  ----> Joint1 绕着Z轴负向转动
        if(g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
        break;
        case 39: //右  ----> arm1 绕着Y轴正向转动
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
        case 37: //下  ---->arm1 绕着Y轴负向转动
        g_arm1Angle = (g_arm1Angle- ANGLE_STEP) % 360;
        break;
    default: break;
    }
    draw(gl, n , viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}
function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Arm1
    var arm1Length = 10.0;//arm1的长度
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); //绕Y轴旋转
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); //绘制

    // Arm2 
    g_modelMatrix.translate(0.0, arm1Length, 0.0); //移至joint1处 因为还在绘制arm1的位置，需要返回到原点
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); //绕Z轴旋转
    g_modelMatrix.scale(0.9, 1.1, 0.7); // 上部的机械臂 缩放下
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    
}
function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // 计算模型视图矩阵并传给v_MvpMatrix变量
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // 计算发现变换矩阵并传给u_NormalMatrix变量
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // 绘制
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
   -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
   -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
    1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
  ]);
    // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
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
     if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal'))
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


 