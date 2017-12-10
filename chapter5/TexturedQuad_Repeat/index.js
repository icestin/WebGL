// 根据片元的位置来确定片元的颜色
//可以证明片元着色器对每个片元都执行了一次
//顶点着色器程序
var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec2 a_TexCoord;\n'+
'varying vec2 v_TexCoord;\n'+
'void main() {\n' +
' gl_Position = a_Position;\n'+ //设置坐标
' v_TexCoord = a_TexCoord;\n'+ 
'}\n';
//片源着色器程序
/**
 * 片元都带有坐标信息，vec4 gl_FragCoord 内置变量的第1个和第2个分量表示片元在
 * <canvas>坐标系统中的坐标值。
 */
var FSHADER_SOURCE=
'precision mediump float;\n'+
'uniform sampler2D u_Sampler;\n'+
'varying vec2 v_TexCoord;\n'+
'void main() {\n'+
' gl_FragColor=texture2D(u_Sampler, v_TexCoord);\n'+ //设置颜色
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
    //设置顶点信息
    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('设置顶点位置失败');
        return;
    }
    //配置纹理
    if(!initTextures(gl, n)) {
      console.log('绘制失败');
      return ;    
    }
    
}


function initVertexBuffers(gl){
    var verticesTexCoords = new Float32Array([
     //顶点坐标，纹理坐标
     -0.5, 0.5,      -0.3, 1.7,
     -0.5, -0.5,     -0.3, -0.2,
     0.5, 0.5,       1.7, 1.7,
     0.5, -0.5,      1.7, -0.2,
    ]);
    var n=4; //顶点数目
    //创建缓充区对象
    var vertexTexCoordBuffer=gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log('创建缓冲区对象失败');
      reuturn -1;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    //向缓充区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    
    // 获取attribute变量的存储位置
    var a_Position =gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
        conosole.log('尝试获取a_Position失败');
        return;
    }
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //将缓冲区对象分配给a_position对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    // 将纹理坐标分配给a_TexCoord并开启它
   var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
   if(a_TexCoord < 0){
       console.log('获取纹理变量失败');
       return;
   }
   gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4,FSIZE * 2); 
   gl.enableVertexAttribArray(a_TexCoord);//开启a_TexCoor
   return n;
}
function initTextures(gl, n){
    var texture = gl.createTexture();// 创建纹理对象
    if (!texture) {
        console.log('创建纹理对象失败');
        return false;
    }
    // 获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler){
        console.log('获取u_Sampler对象失败');
        return false;
    }
    var image = new Image();//创建一个image对象
    if (!image){
        console.log('创建image对象失败');
        return false;
    }
    //注册图像加载事件响应函数
    image.onload = function() {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    //浏览器开始加载图像
    image.src = '../../resources/sky.jpg';
    return true;
}
function loadTexture(gl, n, texture, u_Sampler, image){
    //对纹理图像进行y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,image);
    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);
    

      //指定清空<canvas>的颜色 即设置<canvas>背景色
      gl.clearColor(0.0,0.0,0.0,1.0);//黑色           
      //清空<canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区
      //绘制一个点
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //绘制矩形
}

 