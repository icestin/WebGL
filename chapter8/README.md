## 光照
### 明暗、阴影、不同类型的光：点光源、平行光和散射光。
### 物体表面反射光线的方式：漫反射和环境反射。
---
#### 光源
* 平行光： 相互平行具有方向 可以用一个方向和一个颜色来定义

* 点光源 ： 灯泡，火焰等，需要指定光源的位置和颜色 光线的方向根据**光源的位置和被照射位置**计算出来。

* 环境光： 指上述光源发出的光线被物体多次反射，照射到物体表面上的光。环境光从各个角度照射物体，其强度都是一致的。 环境光不需要位置和方向，只需指定颜色即可。

#### 反射类型
物体向哪个方向反射光，反射的光是什么颜色，取决于**入射光和物体表面类型**。
* 入射光 信息包括入射光线的**方向和颜色**,
* 物体表面类型 ： 物体固有颜色（基底色）和反射特性
#### 漫反射(diffuse reflection) 
* 针对平行光或者点光源而言。反射的光的颜色取决于入射光的颜色、表面的基底色、入射光与表面形成的入射角
> <漫反射光颜色> = <入射光颜色> X <表面基底色> X cos0
#### 环境反射(environment/ambient reflection) 
* 针对环境光而言。反射光的方向可以认为就是入射光的反方向。
> <环境反射光颜色> = <入射光颜色> X <表面基底色>  该入射光颜色指环境光的颜色
### 物体被观察到的颜色
> <表面的反射光颜色> = <漫反射光颜色> + <环境反射光颜色>
--- 
### 根据光线和表面的方向计算入射角
#### 根据入射光线的方向和物体表面的朝向（法线方向）来计算入射角。
> cos0 = <光线方向> 点乘 <法线方向>
* 光线方向矢量和表面法线矢量的长度必须为1，否则反射光的颜色就会过暗或者过亮
* 将一个矢量的长度调整为1，同时保持方向不变的过程称之为 **归一化(normalization)**
* **光线方向**实际是指入射方向的反方向，即从入射点指向光源方向，该方向与法线的夹角才是入射角
---
### 法线： 表面的朝向 
> 即垂直于表面的方向又称法线或者法向量 法向量有三个分量（nx, ny, nz）表示从原点（0， 0， 0）指向点 （nx, ny, nz）的方向。 (1,0,0)表示X轴正方向，向量（0,0,1）表示z轴正方向。
* 一个表面具有两个法向量
> 表面的正面和背面取决于绘制表面是的顶点顺序 **法向量的背面顶点逆时针绘制** **正面是顺时针** 
> 平面法向量的唯一  