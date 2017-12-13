
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n'+
'uniform mat4 u_ViewMatrix;\n'+   //视图矩阵
'uniform mat4 u_ProjMatrix;\n'+   //视图矩阵
'varying vec4 v_Color;\n'+
'void main() {\n' +
' gl_Position = u_ProjMatrix * u_ViewMatrix *  a_Position;\n'+ //设置坐标
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
    // 获取u_ViewMatrix变量的存储地址
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix){
        console.log('获取视图矩阵失败');
        return;
    }
   
    // 获取u_ViewMatrix变量的存储地址
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if(!u_ProjMatrix){
        console.log('获取视图矩阵失败');
        return;
    }
   
    
    var viewjMatrix = new Matrix4();    
    viewjMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);   
    var projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewjMatrix.elements);

    document.onkeydown = function(ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewjMatrix);
    }
    
    gl.clearColor(0.0,0.0,0.0,1.0);//黑色    
    gl.clear(gl.COLOR_BUFFER_BIT); //清除<canvas>
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
var g_eyeX = 0.00, g_eyeY = 0.00, g_eyeZ = 10;// 视点
function keydown(ev,gl, n, u_ViewMatrix, viewjMatrix){
   switch(ev.keyCode){
       case 39: g_eyeX += 0.1; break;// 右
       case 37: g_eyeX -= 0.1; break;// 左
       case 38: g_eyeY += 0.1; break;//  上
       case 40: g_eyeY -= 0.1; break;//  下
       default: return;
   }
   draw( gl, n, u_ViewMatrix, viewjMatrix);
}
function draw(gl, n, u_ViewMatrix, viewjMatrix){
    viewjMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    //将视图矩阵传递给u_viewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewjMatrix.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT); //清除<canvas>
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl){
    var vertices=new Float32Array([
         //顶点坐标和颜色 
         // 右侧坐标
    0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // 底部绿色
    0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
    1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // 中间 黄色
    0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
    1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 

    0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // 最前边 蓝色
    0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
    1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 

    // 左侧
   -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // 绿色
   -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
   -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 

   -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
   -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
   -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 

   -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
   -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
   -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
    ]);
    var n=18; //点的个数
    //创建缓充区对象
    var vertexBuffer=gl.createBuffer();
    if (!vertexBuffer) {
      console.log('创建缓冲区对象失败');
      reuturn -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓充区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    
    // 获取attribute变量的存储位置
    var a_Position =gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
        conosole.log('尝试获取a_Position失败');
        return;
    }
    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    if(a_Color < 0){
        console.log('获取颜色失败');
        return;
    }

    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE *6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    return n;
}


 