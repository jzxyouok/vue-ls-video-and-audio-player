# gaiay
前端开发新框架使用说明

概述：
该框架基于Vue+webpack 搭建,目前将项目临时存放在一个个人github账号上，以方便前端使用git进行协作开发。

准备：
1.本地安装node (v-6.2以上)
2.本地安装git 客户端 
3.webstorm编辑器 （视个人喜好，编辑器的选择非必须）

步骤：
1.确定安装了node 和 git 
2.为了快速下载项目依赖包，推荐全局安装淘宝镜像，使用cnpm 命令去安装依赖
 命令：npm install -g cnpm
3.打开git 命令窗口 设置 git 的账户信息，并生成公钥，将此公钥 发送相关人员进行配置。
 命令： $git config --global user.name "your name"
	     $git config --global user.email "your email"

 配置完账户后 使用 如下git 命令：
  $ ssh-keygen -t rsa -C "your email@.cn"

将会在用户主目录里找到.ssh目录，里面有id_rsa和id_rsa.pub两个文件，其中有一个 id_rsa.pub文件（公钥），用记事本打开复制给相关人员进行github 的SSH keys的配置。

4.github上配置了SSH keys 以后 就可以从远程克隆项目了,
我们的项目地址是：git@github.com:StarWords/gaiay.git
项目名称：gaiay
命令：git clone git@github.com:StarWords/gaiay.git

5.项目克隆到本地后默认的git 分支是master，我们的开发分支 在dev上，所以需要创建本地dev分支 并关联到 远程的dev 分支上
命令： $ git checkout -b dev origin/dev
此时本地的代码便与远程的dev 分支同步了。

6. 如果你使用的是webstorm 建议 在克隆完项目之后 立刻在 项目根目录下 新建一个node_modules 空文件夹，以防止编辑器 首次加载项目索引时需要等待的漫长时间。

7.开始 安装 项目依赖 项目根目录下打开命令行窗口
 npm install 或者 cnpm install （推荐）


8.依赖包安装完以后 开发环境下运行项目
命令：npm run dev

9.项目的结构 目前分为三部分:
 common:项目中必须引入的一些公用js 和 css ,非老项目历史遗留原因不推荐在这里使用过多的 js 和 css
  components:使用最多的目录，因为使用了组件化的Vue 大部分开发是在开发组件，我们可以分门别类的建立 与组件功能相关 子目录，在里面定义相关组件。

module：每新开发一个新页面 要求 在该目录下 新建一个相关的子目录，里面有该页面使用的图片目录，和一个 Vue 入口文件 App.vue 还有与目录必须同名的html 和js 文件。开发时我们多数在使用App.vue，而html 和 js  格式基本固定。 运行某个页面时只需将默认打开的页面名称替换为对应的文件名即可正确跳转。

10. 项目具有热部署功能，每次修改 都会自动刷新页面，省去了F5的步骤。协作开发时建议 时刻使用git status 检查当前版本的状态。团队协作时一般常用的几个命令按步骤为：
  git  status: 查看当前版本状态如有修改
  git  add . （或者指定文件路径） 将修改添加到暂存区
  git  commit -m "这里必须写注释" 提交到本地仓库
  git pull 每次 将本地提交 同步到远程仓库前 要先 pull 别人的代码，若有冲突解决冲突
  git push 确定 pull 下来的代码合并运行没问题后，将代码提交到远程仓库。

11.构建项目，在项目会生成一个dist目录， 
命令：npm run build 
发布新版本时 将dist 目录打包 打上版本号发给负责部署的同事。

附：
git 学习资料：
http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/
vue 学习资料：
http://cn.vuejs.org/v2/guide/
es6 学习资料：
http://es6.ruanyifeng.com/

