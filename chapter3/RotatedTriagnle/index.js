
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform float u_CosB, u_SinB;\n'+
'void main() {\n' +
' gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n'+ //设置坐标
' gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n'+ //设置坐标
' gl_Position.z = a_Position.z;\n'+
' gl_Position.w = 1.0 ;\n'+
'}\n';
//片源着色器程序
var FSHADER_SOURCE=
'void main() {\n'+
' gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+ //设置颜色
'}\n';
var ANGLE = 90.0;
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
    //将旋转 指定点顶点着色器
    var radian = Math.PI * ANGLE /180.0;  //转为弧度制
    var cosB=Math.cos(radian);
    var sinB=Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program,'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program,'u_SinB');
    if(!u_CosB||!u_SinB){
        console.log('获取角度信息设置失败');
        return ;
    }

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);
      //指定清空<canvas>的颜色 即设置<canvas>背景色
    gl.clearColor(0.0,0.0,0.0,1.0);//黑色     
    
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区

    //绘制一个点
    gl.drawArrays(gl.TRIANGLES, 0, n);
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
        return;
    }
    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    return n;
}


 