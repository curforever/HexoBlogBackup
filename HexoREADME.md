# HexoNext博客搭建



## 教程&官网

教程一：https://www.bilibili.com/video/BV1Lt411R78H/?spm_id_from=333.1387.favlist.content.click&vd_source=75b9d3d5f06effdeeedd4346aa855634

教程二：https://www.bilibili.com/video/BV1ot421G7D9/?spm_id_from=333.1387.top_right_bar_window_custom_collection.content.click&vd_source=75b9d3d5f06effdeeedd4346aa855634

教程二博客版：https://dayuzy.com/2024%E4%BF%9D%E5%A7%86%E7%BA%A7Hexo.html

教程三：https://zhuanlan.zhihu.com/p/138500516



Hexo官网：https://hexo.io/zh-cn/index.html

阿里iconfont：https://www.iconfont.cn/

fontawesome



## 原理

通过nodejs和npm本地install了hexo相关库，实现通过yml配置文件自定义博客主题和布局。



## 命令

`hexo -s`将网页发布在本地

`hexo g`根据配置生成html

`hexo d`部署到github.io仓库中



## 注意

github.io仓库只保存了生成后的文件

因此我创建了这个HexoBlogBackup保存本地配置文件