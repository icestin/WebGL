function main(){
    var canvas=document.getElementById('webgl');
    var gl=getWebGLContext(canvas);
    if(!gl){
        alert('渲染WebGL上下文失败');
        return;
    }
    //指定清空<canvas>的颜色
    gl.clearColor(0.0,0.0,0.0,1.0);
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}