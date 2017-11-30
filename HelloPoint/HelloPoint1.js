
//顶点着色器程序
var VSHADER_SOURCE=
'void main() {\n' +
' gl_Position = vec4(0.3,0.3,0.9,1.0);\n'+ //设置坐标
' gl_PointSize = 10.0;\n' + //设置尺寸
'}\n';
//片源着色器程序
var FSHADER_SOURCE=
'void main() {\n'+
' gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+ //设置颜色
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
    //指定清空<canvas>的颜色 即设置<canvas>背景色
    gl.clearColor(0.0,0.0,0.0,1.0);//黑色
   
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区
    
    //绘制一个点
    gl.drawArrays(gl.POINTS,0,1);
}