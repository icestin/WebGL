## 透视投影
- setPerspective(fov,apsect, near, far)
  - fov 指定垂直视角, 即可视空间顶面与底面之间的夹角，必须大于0
  - aspect 指定近裁剪面的宽高比 （宽度/高度）
  - near, far  指定近裁剪面和远裁剪面的位置 即可视空间的近边界和远边界 必须大于0

- 透视投影矩阵对三角形进行了两次变换：
  - 根据三角形与视点的距离，按比例对三角形进行了缩小变换；
  - 对三角形进行了平移变换，使其贴近实现 
- 经过两次变换后 产生了示例效果

- 该示例主要使用投影矩阵定义可视空间，使用视图矩阵定义观察者 下一示例中_mvp程序添加模型矩阵，用来对三角形进行变换