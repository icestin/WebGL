
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
    
    
    var modelMatrix = new Matrix4();   
    var viewjMatrix = new Matrix4();    
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    //modelMatrix.setTranslate(0.75, 0, 0); //平移0.75单位
    viewjMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    viewjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);   
    //计算模型视图矩阵
   // mvpMatrix.set(projMatrix).multiply(viewjMatrix).multiply(modelMatrix);
    
    gl.uniformMatrix4fv(u_MvpMatrix, false, viewjMatrix.elements);
    
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.enable(gl.DEPTH_TEST);
   
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n/2);

    //  深度冲突问题解决方式
    gl.enable(gl.POLYGON_OFFSET_FILL); //启用多边形偏移
    gl.polygonOffset(1.0, 1.0);
    
    gl.uniformMatrix4fv(u_MvpMatrix, false, viewjMatrix.elements);    
    gl.drawArrays(gl.TRIANGLES, n/2, n/2); //绘制黄色三角形 
}


function initVertexBuffers(gl){
    var vertices=new Float32Array([
         //顶点坐标和颜色 
         // 右侧坐标
    0.0,  2.5,   -5.0,  0.0,  1.0,  1.0,  // 最前边 蓝色
    -2.5, -2.5,   -5.0,  0.0,  1.0,  0.0,
    2.5, -2.50,  -5.0,  1.0,  0.0,  0.0, 

 

    0.0,  3.0,   -5.0,  1.0,  0.0,  0.0, // 黄色
    -3.0, -3.0,  -5.0,  1.0,  1.0,  0.0,
    3.0, -3.0,  -5.0,  1.0,  1.0,  0.0,  
  
   ]);
    var n = 6; //点的个数
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


 