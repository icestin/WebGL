
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_ModelMatrix;\n'+
'void main() {\n' +
' gl_Position = u_ModelMatrix * a_Position;\n'+ //设置坐标
'}\n';
//片源着色器程序
var FSHADER_SOURCE=
'void main() {\n'+
' gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+ //设置颜色
'}\n';

//旋转速度 度/s
var ANGLE_STEP = 45.0;
function main(){
    var canvas=document.getElementById('webgl');
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
    //指定清空<canvas>的颜色 即设置<canvas>背景色
    gl.clearColor(0.0,0.0,0.0,1.0);//黑色     

    var u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log('获取角度信息设置失败');
        return ;
    }
    // 三角形当前旋转角度
    var  currentAngle = 0.0;

    //模型矩阵 
    var modelMatrix = new  Matrix4();
    // 开始绘制三角形
    var tick = function() {
        currentAngle = animate(currentAngle);//更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick); //请求浏览器调用tick
        //可以用 cancelAnimationFrame(requestID)取消函数 ID是函数返回的值
    };

    tick();
}


function initVertexBuffers(gl){
    var vertices=new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n=3; //点的个数
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

    // 获取attribute变量的存储位置
    var a_Position =gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
        conosole.log('尝试获取a_Position失败');
        return -1;
    }
    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
       //设置旋转矩阵
       modelMatrix.setRotate(currentAngle, 0, 0, 1); //围绕哪个轴旋转
       modelMatrix.translate(0.35, 0, 0); // 平移
       //将旋转矩阵传给顶点着色器
       gl.uniformMatrix4fv( u_ModelMatrix, false, modelMatrix.elements);
       //清除 <canvas>
       gl.clear(gl.COLOR_BUFFER_BIT);
       //绘制三角形
       gl.drawArrays(gl.TRIANGLES, 0, n);
}
//记录上一次调用的时间
var g_last=Date.now();
function animate(angle){
    //计算距离上次调用经过多长时间
    var now=Date.now();
    var elapsed = now - g_last; //毫秒
    g_last = now;
    //根据距离上次调用的时间，更新当前旋转角度
    //函数调用的时间不固定 不能用规定的角度速度更新 
    // 根据本次调用与上次调用之间的时间间隔来决定这一帧的旋转角度比上一帧大出多少
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %=360;
}

 