function main(){
    var canvas=document.getElementById('webgl');
    var gl=getWebGLContext(canvas);
    if(!gl){
        alert('渲染WebGL上下文失败');
        return;
    }
    //指定清空<canvas>的颜色
    //gl.clearColor(0.0,0.0,0.0,1.0);//黑色
    //gl.clearColor(0.0,1.0,0.0,1.0);//绿色
    //gl.clearColor(0.0,1.0,1.0,1.0);//青色
    gl.clearColor(1.0,1.0,0.9,1.0);//黑色
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);//其实是清空颜色缓存区 ，除了颜色缓冲区，还有深度缓冲区及模板缓冲区
    
}