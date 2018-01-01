# 帧缓冲区对象和渲染缓冲区对象
### 默认情况下，WebGL在颜色缓冲区中进行绘图，在开启隐藏面消除功能时，还会用到深度缓冲区。绘制的结果图像是存储在颜色缓冲区中。

## 帧缓冲区对象（framebuffer object）可以用来替代颜色缓冲区或者深度缓冲区，绘制在帧缓冲区中的对象并不会直接显示在<canvas>上，可以对帧缓冲区中的对象进行一些处理在显示，或者直接用其中的内容作为纹理图像，在帧缓冲区绘制的过程又叫做离屏绘制。

## 绘制操作不是直接发生在帧缓冲区对象中，而是发生在帧缓冲区对象所关联的对象上。一个帧缓冲区右三个关联对象：
- 颜色关联对象（Color attachment）
- 深度关联对象（Depth attachment）
- 模板关联对象（stencil attachment）
## 分别用来替代颜色缓冲区、深度缓冲区和模板缓冲区。

### 经过一些设置，WebGL就可以向帧缓冲区的关联对象中写入数据。每个关联对象又可以是两种类型的：
- 纹理对象 存储了纹理图像，将纹理对象作为颜色关联对象关联到帧缓冲区对象后，WebGL就可以在纹理对象中绘图。
- 渲染缓冲区对象 表示一种更加通用的绘图区域，可以向其中写入多种类型的数据。

## 如何实现渲染到纹理
- 把WebGL渲染出的图像作为纹理，需要将纹理对象作为**颜色关联对象**关联到帧缓冲区对象上，然后在帧缓冲区中进行绘制，
- 隐藏面消除，需要再创建一个缓冲区对象来作为帧缓冲区的**深度关联对象**以代替深度缓冲区。
## 配置步骤
1. 创建帧缓冲区对象 (gl.createFramebuffer()).
2. 创建纹理对象并设置其尺寸和参数(gl.createTexture()、gl.bindTexture()、gl.texImage2D(),gl.Parameteri()).
3. 创建渲染缓冲区对象(gl.createRenderbuffer()).
4. 绑定缓冲区对象并设置其尺寸(gl.bindRenderbuffer(),gl.renderbufferStorage())
5. 将帧缓冲区的颜色关联对象制定一个纹理对象（gl.framebufferTexture2D()）.
6. 将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象（gl.framebufferRenderbuffer()）
7. 检查帧缓冲是否正确配置(gl.checkFramebufferStatus())
8. 在帧缓冲区中进行绘制(gl.bindFramebuffer())

### gl.createFramebuffer()创建帧缓冲区对象，gl.deleteFramebuffer(framebuffer)来删除帧缓冲区对象。创建出帧缓冲区对象后，需要将其**颜色关联对象**指制定未一个*纹理对象*，将其**深度关联对象**指定为一个*渲染缓冲区对象*
- 创建纹理对象 并设置尺寸参数信息
- 创建渲染缓冲区对象  gl.createRenderbuffer(); gl.deleteRenderbuffer(); 并指定为帧缓冲区的深度关联对象
  - bindRenderbuffer(target, renderbuffer)  将renderbuffer指定的渲染缓冲区对象绑定在target目标上，如果renderbuffer为null，则解除已绑定的渲染缓冲区对象
  - renderbufferStorage(target, internalformat, width, heigth)
    - target 必须为 gl.RENDERBUFFER 
    - internalformat 指定渲染缓冲区的数据格式 gl.DEPTH_COMPONENT16 替代深度缓冲区，gl.STENCIL_INDEX8 替代模板缓冲区 gl.RGBA4 替代颜色缓冲区
  - width和heigth 指定渲染缓冲区的宽度和高度，以像素为单位