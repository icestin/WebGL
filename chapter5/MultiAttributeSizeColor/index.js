
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute float a_PointSize;\n'+
'attribute vec4 a_Color;\n'+
'varying vec4 v_Color; \n'+ //定义varying变量 可以为每个顶点赋值
//该变量负责将颜色值传递给片元着色器
'void main() {\n' +
' gl_Position = a_Position;\n'+ //设置坐标
' gl_PointSize = a_PointSize;\n'+ //
' v_Color = a_Color; \n'+ //
'}\n';
//片源着色器程序
var FSHADER_SOURCE=
'precision mediump float; \n'+
'varying vec4 v_Color;\n'+ //片元着色器通过声明与顶点着色器中同名的varying变量就可以接收
// 顶点着色器中的数据 同名同类型时 会自动赋值
'void main() {\n'+
' gl_FragColor = v_Color;\n'+ //设置颜色
'}\n';

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
    
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区

    //绘制一个点
    gl.drawArrays(gl.POINTS, 0, n);
}


function initVertexBuffers(gl){
    var verticesSizesColors=new Float32Array([
        //顶点坐标和点的尺寸 颜色
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0,
    ]);
    var n=3; //点的个数
 
    //创建缓充区对象
    var vertexSizeBuffer = gl.createBuffer();
    if (!vertexSizeBuffer) {
      console.log('创建缓冲区对象失败');
      reuturn -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    //向缓充区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizesColors, gl.STATIC_DRAW);
   
    var FSIZE = verticesSizesColors.BYTES_PER_ELEMENT;
    // 获取attribute变量的存储位置
    var a_Position =gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
        conosole.log('尝试获取a_Position失败');
        return;
    }
    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);    
    
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if(a_PointSize < 0){
        console.log('编译着色器程序失败');
        return;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);
    
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0){
        console.log('编译着色器程序失败');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    return n;
}


 