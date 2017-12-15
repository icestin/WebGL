## gl.drawElements()
- gl.drawElements(mode, count, type, offset) 执行着色器，按照mode参数指定方式，根据绑定到gl.ELEMENT_ARRAY_BUFFER的缓冲区中的顶点索引绘制图形
- mode  指定绘制的方式 gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP 或 gl.TRIANGLE_FAN
- count  指定绘制顶点的个数 （整形数）
- type  指定索引值数据类型： gl.UNSIGNED_BYTE 或 gl.UNSIGNED_SHORT
- offset   指定索引数组中开始绘制的位置，以字节为单位
- 无返回值

## 绘制过程分析 
- 在调用gl.drawElements()时，WebGL首先从绑定到gl.ELEMENT_ARRAY_BUFFER的缓冲区（indexBuffer）中获取顶点的索引值，然后根据该索引值，从绑定到gl.ARRAY_BUFFER的缓冲区（vertexColorBuffer）中获取顶点坐标、颜色等信息，然后传递给attribute变量并执行顶点着色器。对每个索引值都这样做，最后绘制出了立方体，而只调用了一次gl.drawElements().
- 这种方式通过索引来访问顶点数据，从而循环利用顶点信息，控制内存开销，代价是要通过索引来间接的访问顶点。
- 之后需要把每个面的颜色或者纹理信息写入三角形列表、索引和顶点数据中。