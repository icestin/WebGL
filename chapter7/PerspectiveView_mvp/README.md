## 融合投影矩阵 视图矩阵以及模型矩阵
- <投影矩阵> X <视图矩阵> X <模型矩阵>

- 通过修改模型矩阵来实现三角形的绘制 左侧三角形通过中心线往左平移0.75个单位，之后右侧三角形将中间三角形直接往右平移0.75个单位
- 但会增加 gl.drawArrays()函数调用的次数

-  u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position 直接在着色器中进行的计算，会使每个顶点都会计算一遍，我们可以在JavaScript中将这三个矩阵相乘的结果传递给着色器，该矩阵可以称为 模型视图投影矩阵 