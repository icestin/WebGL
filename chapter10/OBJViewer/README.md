# Obj对象读取解析

## 需要准备从模型文件读取数据，并保存在对象中
 - Float32Array 类型的数组 vertices 保存模型顶点坐标数据
 - Float32Array 类型的数组 colors   保存模型顶点颜色数据
 - Float32Array 类型的数组 normals  保存模型顶点法线数据
 - Uint16Array or Uint8Array 类型的数组 indices 保存模型顶点索引数据
 ## 将获取的数据写入缓冲区，调用drawElements()绘制整个立方体

 # Obj文件格式
 - (#)开头表示注释
 - mtllib <外部材质文件名>
 - <模型名称>
 - v x y z [w] 定义了顶点坐标，其中w是可选的 没有则默认为1.0
 - usemtl <材质名称>  改材质定义在引用的<外部材质文件名>中
 - f v1 v2 v3 v4 ……定义了使用这个材质的表面 v1 v2 v3 v4是之前定义的顶点的索引值，这里的顶点的索引值从1开始而不是从0开始。
 - f v1//vn1 v2//vn2 v3//vn3 包含法向量的格式。 其中 vn1  vn2 是法向量的索引值
 - usemtl <材质名称2> 引用的其他材质表面

 # MTL 文件格式
 - (#)注释文件
 - newmtl <材质名> 用newmtl定义一个新材质
 - Ka Kd Ks定义了表面的环境色、漫射色和高光色 颜色使用RGB格式定义，每个分量区间[0.0, 1.0]
 - Ns 指定了高光色的权重 
 - Ni 指定了表面光学密度
 - d 指定了透明度
 - illnm 指定了光照模型
 - newmtl <材质名>定义了另外一种材质