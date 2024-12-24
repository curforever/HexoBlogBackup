---
title: IDEA使用Tomcat运行Web项目及其常见报错
category: 环境配置
---



@[toc]
# IDEA使用Tomcat运行Web项目及其常见报错

## 一、Project Structure

> 目的：让IDEA知道这是个Web项目

1. **Modules**

   > 目的：加载Web相关的配置和资源

   `右键`目标模块 - `Add` - `Web`

   **Web配置窗口**

   1. 确认`web.xml`路径是否正确，不正确需要手动修改

      > web.xml即Deployment Descripters下的Path

   2. 确认`Web资源目录`是否正确，不正确需要手动修改

      > `web资源目录`即`WEB-INF`上级路径（`JSP`等放置的位置）

      > 应用程序一般默认为`web`文件夹，但是我的项目为`webapp`文件夹，改为正确的`webapp`

2. **Artifacts**

   > 即编译后的Java类，Web资源等的整合，用以测试、部署等工作
   >
   > 白话一点，就是说某个module要如何打包，例如war exploded、war、jar、ear等等这种打包形式
   >
   > 某个module有了 Artifacts 就可以部署到应用服务器中了

   `＋` - `Add` - `Web Application: Exploded` -  `From Modules...` - 选择我们的项目or模块

   ```
   区分：
   （1）jar：Java ARchive，通常聚合Java类文件、相关数据和资源（文本、图片等）到一个文件，以便分发Java平台应用软件或库；
   （2）war：Web application ARchive，一种JAR文件，其中包含用来分发的JSP、Java Servlet、Java类、XML文件、标签库、静态网页（HTML和相关文件），以及构成Web应用程序的其他资源；
   （3）war exploded：展开，不压缩。直接把文件夹、jsp页面 、classes等移到Tomcat 部署文件夹里面
   			因此这种方式支持热部署，建议在开发的时候使用这种模式，便于修改了文件的效果立刻显现出来
   			热部署：对于Java应用程序来说，热部署就是在运行时更新Java类文件。
   ```

   

## 二、Tomcat配置

1. 点击IDEA右上方执行的`Add Configuration...`

2. 弹出的窗口中点击`+`，出现的选项中往下滑，选择`Tomcat Server` - `Local`

   > 这步添加Tomcat配置

3. 点击`Deployement`页签，点击`+`，选择`Artifact...`

   > 这里IDEA会将刚才的`项目`的`artifact`放入窗口中
   >
   > 但也有可能存在其他的`artifact`，选择我们需要的

4. 修改`Application context`，可以只保留一个`/`

   > IDEA会自动为我们生成项目根路径
   >
   > 如果其他配置没问题结果访问404很可能是因为这个没改

5. 点击`Server`页签，检查`URL`处是否与步骤`4`中设置的同步

   > IDEA会自动同步



## 三、Tomcat运行

给我点那个绿色的`Run`！！！！

### 当你点击运行Tomcat时，IDEA在做什么

1. **编译**。

   IDEA在保存后不会做编译，不像Eclipse的保存即编译，

   因此在运行server前会做一次编译，

   编译后class文件存放在指定的项目<u>编译输出目录</u>下；

2. 根据artifact中的设定对目录结构进行**创建**；

3. 拷贝**web资源**的根目录下的所有文件到artifact的目录下（见1.2.3）；

4. 拷贝<u>编译输出目录</u>下的**classes目录**到artifact下的WEB-INF下（见1.2.2）；

5. 拷贝**lib目录**下所需的jar包到artifact下的WEB_INF下；

6. 运行server，运行成功后，如有需要，会自动打开浏览器访问指定url。



## 四、一些报错及解决

### 4.1、org.springframework..xxx不存在

#### 4.1.1、情况一：pom.xml中的maven的dependency没加载好（红色version）

1. **方法一：头铁再试一次**

   `右击项目` - `Maven` - `Reimport`

   > IDEA将通过网络自动下载相关依赖，并存放在Maven的本地仓库中

2. **方法二：换个version罢**

   如果还不行，可能的原因及解决：
       原因一：你的`maven`配置了从`aliyun`镜像下载，而`aliyun仓库`中恰好没有对应`version`
       原因二：`版本号version`暂时用不了（我也不知道是什么缘故），换个`版本号`就好了
       解决：访问`https://mvnrepository.com/`（需要梯子）
           		搜索需要的`artifact`，复制其他`version`的`dependency`并粘贴到`pom.xml`中

3. **方法三：你是不是装过不止一个maven**

   检查`File` - `Settings` - `Build,Execution,Deployment` - `Maven` 

   `Maven home directory`选择你本次项目要用的maven

   `User settings file`的`settings.xml`里可能配置了从`aliyun`下载（自己权衡要不要改）

4. **方法四：手动下载jar包**

   如果上面的你都尝试过了，还是不行（哦，可怜的人儿）：
   	你需要`baidu.com`搜索对应版本的jar包并下载
   	把`jar包`放到`maven`的`本地repository文件夹`中的对应位置（这个对应位置要<u>点进一个个小文件夹</u>）
   	注意<u>删除</u>最里面那个文件夹里以 .lastUpdated为后缀的文件（下载失败的），然后粘贴
   	<u>刷新</u>一下maven依赖

```
将Maven的刷新设置为自动，配置方法为：
（1）打开File-Settings-Maven
（2）勾选Import Maven projects automatically
```

#### 4.2.2、情况二：pom文件相关的依赖明明都下载好了，但运行还是找不到XXX相关的包

**方法一：**删除`target文件夹`下所有文件，重新编译运行。

**方法二：**`File` - `Settings` - `Build,Execution,Deployment` - `Maven` - `Runner`

				勾选`Delegate IDE build/run actions to Maven`
	
				选择自己安装的`JRE的路径`

------



### 4.2、java.io.FileNotFoundException: class path resource [spring/] cannot be resolve

**描述：**此异常是说找不到`spring`的配置文件。

**原因：**为了防止`mybatis`的`mapper`文件被过滤掉，在`pom.xml`的`build`节点下加入了如下代码

```xml
<!--如果不加如下配置maven打包时不会将mapper文件打包进去-->
<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
    </resource>
</resources>
```

**解决：**`maven`默认扫描`src/main/java`中的文件但并不理会`src/main/resources`中的xml文件，

			因此，添加resource节点，使其扫描`src/main/resources`中的xml文件

```xml
<!--如果不加如下配置maven打包时不会将mapper文件打包进去-->
<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
    </resource>
<！--修改后的文件-->
<!--如果不加此节点，resources文件中的spring配置文件将会找不到-->
    <resource>
        <directory>src/main/resources</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
    </resource>
</resources>
```

------



### 4.3、maven依赖的多个版本依赖冲突

**描述**：当出现下面问题异常的时候，如果clean jar包之后还是无法成功启动项目，可以考虑是这个问题

```
1、NoDefClassException
2、ClassNotFoundException
3、NoSuchMethodError
4、NoSuchFieldError
```

**查看**：在界面右侧可找到`Maven`，点开，小图标里找到`Show Dependencies`，

			点击后即可查看当前`maven模块的依赖结构图`，<u>红色的线</u>即为<u>依赖冲突</u>。

**解决：**

1. `File` - `Settings` - `Plugins` - 搜索 `maven helper` - `install`
2. 打开`pom.xml`，在编辑器下方 控制台上方，点击text旁边的`Dependency Analyzer`
3. 左侧为`冲突的jar包`，挨个点开，把右侧红色的挨个右击`exclude`



## 五、参考博客

1. IDEA使用Tomcat运行web项目教程：http://t.csdn.cn/44qjF
2. idea运行项目 程序包org.springframework..xxx不存在的解决办法：http://t.csdn.cn/kzfyg
3. 解决idea打开的项目中maven依赖下载失败问题：http://t.csdn.cn/6nNLs
4. 如何将下载到本地的JAR包手动添加到Maven仓库：http://t.csdn.cn/82XIn
5. war和war exploded的区别：http://t.csdn.cn/quYCO
6. IDEA项目运行项目报404错误——org.apache.jasper.servlet.TldScanner.scanJars 至少有一个JAR被扫描用于TLD但尚未包含TLD。：http://t.csdn.cn/CY4WI
7. IDEA部署项目到tomcat运行成功但是页面404的两种原因：http://t.csdn.cn/E3IBU
8. java.io.FileNotFoundException: class path resource [spring/] cannot be resolve 《异常信息》：http://t.csdn.cn/5JDz8
9. idea如何解决jar包冲突：http://t.csdn.cn/qyKTp
