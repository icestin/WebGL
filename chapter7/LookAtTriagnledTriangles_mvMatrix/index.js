
//模型视图矩阵
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;\n'+
'uniform mat4 u_ModelViewMatrix;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n' +
' gl_Position = u_ModelViewMatrix * a_Position;\n'+ //设置坐标
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
    var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    if(!u_ModelViewMatrix){
        console.log('获取视图矩阵失败');
        return;
    }
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.75, 0, 0, 0,  0, 1, 0);
    
    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(-10, 0, 0, 1);
   
    var  modelViewMatrix = viewMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_ModelViewMatrix, false,viewMatrix.elements);
      //指定清空<canvas>的颜色 即设置<canvas>背景色
    gl.clearColor(0.0,0.0,0.0,1.0);//黑色     
    
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区

    //绘制一个点
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffers(gl){
    var vertices=new Float32Array([
       //顶点坐标和颜色
       0.0, 0.5, -0.4,  0.4, 1.0, 0.4, //绿色三角形在最后
       -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
       0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

       0.5, 0.4, -0.2, 1.0, 0.4, 0.4,  //黄色三角形在中间
       -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
       0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
       
       0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  //蓝色三角形在最前面
       -0.5, -0,5, 0.0, 0.4, 0.4, 1.0,
       0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    var n=9; //点的个数
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
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE *6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Color, 2, gl.FLOAT, false, FSIZE * 6, FSIZE * 4);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    
    // var u_Width = gl.getUniformLocation(gl.program,'u_Width');
    // var u_Height = gl.getUniformLocation(gl.program,'u_Height');
    // if(!u_Width||!u_Height){
    //     console.log('获取角度信息设置失败');
    //     return ;
    // }

    // gl.uniform1f(u_Width, gl.drawingBufferWidth);
    // gl.uniform1f(u_Height, gl.drawingBufferHeight);
    return n;
}


 