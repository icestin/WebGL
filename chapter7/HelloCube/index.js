
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n'+
'uniform mat4 u_MvpMatrix;\n'+   //模型视图投影矩阵
'varying vec4 v_Color;\n'+
'void main() {\n' +
' gl_Position = u_MvpMatrix * a_Position;\n'+ //设置坐标
'v_Color = a_Color;\n'+
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
    var nf = document.getElementById('nearFar');
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
    if(!u_MvpMatrix){
        console.log('获取视图矩阵失败');
        return;
    }
    var mvpMatrix = new Matrix4();

    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);   
    
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);//开启隐藏面消除
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
 
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
    var verticesColors=new Float32Array([
        //顶点坐标 和颜色
     1.0,  1.0,  1.0,    1.0,  1.0,  1.0,  //v0 白色
    -1.0,  1.0,  1.0,    1.0,  0.0,  1.0,   //v1 
    -1.0, -1.0,  1.0,    1.0,  0.0,  0.0,   //v2 红色     
     1.0, -1.0,  1.0,    1.0,  1.0,  0.0,   //v3 红色 

     1.0, -1.0, -1.0,    0.0,  1.0,  0.0,   //v4 绿色 
     1.0,  1.0, -1.0,    0.0,  1.0,  1.0,   //v5 色 
    -1.0,  1.0, -1.0,    0.0,  0.0,  1.0,   //v6 蓝色 
    -1.0, -1.0, -1.0,    0.0,  0.0,  0.0,   //v7 黑色 
   ]);
    var indices = new Uint8Array([
        0, 1, 2,     0, 2, 3,    //前
        0, 3, 4,     0, 4, 5,    //右
        0, 5, 6,     0, 6, 1,    //上

        1, 6, 7,     1, 7, 2,    //左
        7, 4, 3,     7, 3, 2,    //下
        4, 7, 6,     4, 6, 5,   //后
    ]);

    //创建缓充区对象
    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    if (! vertexColorBuffer || !indexBuffer) {
      console.log('创建缓冲区对象失败');
      return -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //向缓充区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    
    // 获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        conosole.log('尝试获取a_Position失败');
        return -1;
    }
    //将缓冲区对象分配给a_position对象
    //连接a_Position变量与分配给它的缓冲区对象
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE *6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0){
        console.log('获取颜色失败');
        return -1;
    }
    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    //连接a_Color变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}


 