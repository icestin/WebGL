
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n'+
'attribute vec4 a_Normal;\n'+    //法向量
'uniform mat4 u_ModelMatrix;\n'+   //模型矩阵
'uniform mat4 u_MvpMatrix;\n'+   //模型视图投影矩阵

'varying vec4 v_Color;\n'+
'varying vec3 v_Normal;\n'+
'varying vec3 v_Position;\n'+
'void main() {\n' +
' gl_Position = u_MvpMatrix * a_Position;\n'+ //设置坐标
'vec3 normal = normalize(vec3(a_Normal));\n'+ // 对法向量进行归一化
// 计算顶点的世界坐标
'v_Position = vec3(u_ModelMatrix * a_Position);\n'+
'v_Normal = normalize(vec3(a_Position));\n'+

'v_Color = a_Color;\n'+
'}\n';
//片源着色器程序
/**
 * 片元都带有坐标信息，vec4 gl_FragCoord 内置变量的第1个和第2个分量表示片元在
 * <canvas>坐标系统中的坐标值。
 */
var FSHADER_SOURCE=
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'uniform vec3 u_LightPosition;\n'+   //点光源位置（世界坐标系）
'uniform vec3 u_LightColor;\n'+   //光线颜色
'uniform vec3 u_AmbientLight;\n'+ //环境光颜色
'varying vec3 v_Normal;\n'+
'varying vec3 v_Position;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
//对法线进行归一化
'vec3 normal = normalize(v_Normal);\n'+
//计算光线方向并归一化
'vec3 lightDirection = normalize(u_LightPosition - v_Position);\n'+
//计算光线方向和法向量的点积
'float nDotL = max(dot(lightDirection, normal), 0.0);\n'+
'vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n'+  //计算漫反射光的颜色
'vec3 ambient = u_AmbientLight * v_Color.rgb;\n'+ //计算环境光产生的反射光颜色
'gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n'+

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
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    if(!u_MvpMatrix || !u_LightColor ||!u_AmbientLight||!u_ModelMatrix ||!u_LightPosition){
        console.log('获取视图矩阵失败');
        return;
    }
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    //设置光线颜色
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightPosition, 3.0, 3.0, 4.0)

    var modelMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);  
    mvpMatrix.multiply(modelMatrix);
    modelMatrix.setRotate(90, 0, 1, 0); //绕Y轴旋转
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);//开启隐藏面消除
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    var vertices=new Float32Array([
        //顶点坐标
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
   ]);
    var colors = new Float32Array([
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);
    var normals = new Float32Array([
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up

       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
    ]);
     //
     var indexBuffer = gl.createBuffer();
     if(!indexBuffer){
         return -1;
     }
     if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
       return -1;
     if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
       return -1;
     if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal'))
       return -1;
    

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}


 