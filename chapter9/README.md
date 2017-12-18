# 层次模型
---
## 由多个简单的部件组成的复杂模型
## 为复杂模型（机器人手臂）建立具有层次化结构的三维模型
## 使用模型矩阵，模拟机器人手臂上的关节运动
## 了解初始化着色器的内部细节
---
---
# 着色器
## webgl原生api如何将GLSL ES代码编译为显卡中运行的着色器程序。主要有以下7个步骤：
1. 创建着色器对象(gl.createShader);
2. 向着色器对象中填充着色器程序的源代码(gl.shaderSource);
3. 编译着色器(gl.compileShader());
4. 创建程序对象(gl.createProgram);
5. 为程序对象分配着色器(gl.attachShader());
6. 连接程序对象(gl.linkProgram());
7. 使用程序对象(gl.useProgram());

## **着色器对象**管理一个顶点着色器或者一个片元着色器，每一个着色器都有一个着色器对象
## **程序对象**管理着色器对象的容器，WebGL中，一个程序对象必须包含一个顶点着色器和一个片元着色器

---
### 创建着色器对象 gl.createShader(type),所有的着色器对象必须通过gl.createShader()来创建。
- type 指定着色器类型, **gl.VERTEX_SHADER**表示顶点着器, **gl.FRAGMENT_SHADER**表示片元着色器
- 如果不再需要这个着色器，可以使用**gl.deleteShader(shader)**函数, shader 指待删除的着色器对象
- 如果着色器还在使用,也就是说经过使用 gl.attachShader()附加到程序对象上,gl.deleteShader()并不会立即删除，而是等到程序不在使用时将其删除。
### 指定着色器对象的代码 gl.shaderSource(shader, source)，将source指定的字符串形式的代码传入shader指定的着色器。如果已经向shader传入过代码，旧代码会被替换掉。 
- **shader**  指定需要传入代码的着色器对象
- **source**  指定字符串形式的代码
### 编译着色器 gl.compileShader(shader), WebGL系统中的使用的旧代码编译出的可执行部分需要手动重新编译才能被替换。
- 当着色器源码中存在错误，会导致编译错误，可以用gl.getShaderParameter(shader, pname)来检查着色器的状态
- shader 指定待获取参数的着色器
- pname 指定获取参数的类型： 
  - gl.SHADER_TYPE 返回时顶点着色器*gl.VERTEX_SHADER* 还是片元着色器 *gl.FRAGMENT_SHADER*
  - gl.DELETE_STATUS 返回着色器是否被删除成功 true || false
  - gl.COMPILE_STATUS 返回着色器是否编译成功 true || false
- 如果编译失败，WebGL系统会把错误的具体内容写入着色器信息日志，可以通过**gl.getShderInfoLog(shader)**来获取

### 创建程序对象 gl.createProgram(),程序对象包含顶点着色器和片元着色器
- 参数 ： 无
- 可以通过**gl.deleteProgram(program)** 来删除程序对象 如果该程序对象正在被使用，则不立即删除，而是等它不在被使用后再删除。

### 为程序对象分配着色器对象 gl.attachShader(program, shader)
-  WebGL系统要运行起来，必须包含两个着色器对象， *顶点着色器*和*片元着色器*
- program  指定程序对象
- shader   指定着色器对象
- 错误 INVALID_OPERATION shader已经被分配给了program
- **着色器附给程序对象之前，并不一定要为其指定代码或者进行编译，即把空的着色器附给程序对象也可以**
- 可以使用 **gl.detachShader(program, shader)**函数来解除分配给程序对象program所指定的着色器shader
#### 程序对象进行着色器连接操作，目的是保证：
1. 顶点着色器和片元着色器的varying变量同名类型，且一一对应；
2. 顶点着色器对每个varying变量赋值
3. 顶点着色器和片元着色器中的同名uniform变量也是同类型(无需一一对应)
4. 着色器中的attribute uniform varying 变量的个数没有超过着色器的上限
#### 着色器连接后，应当检测是否连接成功 gl.getProgramParameter(program, pname)
- pname
  - gl.DELETE_STATUS    程序是否被删除         true || false
  - gl.LINK_STATUS      程序是否成功连接       true || false
  - gl.CALIDATE_STATUS  程序是否通过连接       true || false
  - gl.ATTACHED_SHADERS 已被分配给程序的着色器数量
  - gl.ACTIVE_ATTRIBUTES     顶点着色器中attribute变量的数量
  - gl.AACTIVE_UNIFORMS      程序中uniform变量的数量

**程序连接成功了也有可能运行失败** 在运行阶段进行错误检测的性能开销很大，所以只在调试程序是才这样做。

### 告知WebGL系统所使用的程序对象 gl.useProgram(program),可以在绘制前准备多个程序对象，然后在绘制的时候根据需要切换程序对象。
