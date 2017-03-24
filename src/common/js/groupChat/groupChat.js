/*
 * 网页版群聊	groupChat.js
 * 2016-06-16
 * dengyang
 * 
 * groupChat.Chat.init(groupChatBox,userID,communityID,chatID,joinState,loginState);
 * groupChatBox, //加载群聊的div,css路径形式，如：#qunliaoBox
 * userID,		 //用户ID
 * communityID,  //社群ID
 * chatID,       //群聊ID
 * joinState,	 //用户在社群中的状态
 * loginState    //是否登录
 */

/*
 * 命名空间构建：为了防止命名冲突，因此使用此方式来建立命名空间
 * 2016-06-01
 * dengyang
 */
var ChatNamespace = {
	/*
	 * 注册命名空间的函数（也就是定义一个对象）
	 * 参数strPath，是字符串形式，需要注册命名空间：例如 'groupChat' 或者 'cn.zm518.groupChat'
	 */
	register:function(strPath){
	    var arrTemp = strPath.split('.');
	    var strNamespace='';
	    for(var i=0,length=arrTemp.length;i<length;i++){
	        if(i>0){
	        	strNamespace += '.';
	        }
	        strNamespace += arrTemp[i];
	        eval('if(typeof(' + strNamespace + ') == "undefined")' + strNamespace + ' = {};');
	    }
	}
};
//注册命名空间：groupChat
ChatNamespace.register('groupChat');

//如果浏览器不支持Function.prototype.bind，那么使用此方式
if(!Function.prototype.bind){
	Function.prototype.bind = function(){
		var fn = this;
		var	argus = Array.prototype.slice.call(arguments);
		var	object = argus.shift();//shift:从集合中把第一个元素删除,并返回这个元素的值
		return function(){
			return fn.apply(object, argus.concat(Array.prototype.slice.call(arguments)));
		}
	}
};

/*
 * 各类需要的操作：读取appkey/token，跳转到登录页面，打开掌门app跳转，获取社群名称等
 * 2016-06-16
 * dengyang
 */
groupChat.Util = {
	readAppkeyToken:function() {	//读取appkey/token，该方法返回请求的data
		var appkeyTokenInfo = {};
		/*var appkeyTokenInfo = {
			"code":12001,
			"message":"用户未登录"
		};*/
		/*var appkeyTokenInfo = {
		 	"code":0,
		 	"message":"成功",
		 	"result":{
				"userId":"c3cbf515457822dac-7f7b",
				"password":"e10adc3949ba59abbe56e057f20f883e",
				"yunAppkey":"8095640e42c78b1a8a8f15d694202c4e"
			}
		}*/
		$.ajax({
    		url:"/api/zm/account/login?needPwd=1&needYunxinAppKey=1",
    		type:"GET",
    		dataType:"json",
    		async:false,	//设置为同步请求，没获取到appkey和token不执行下一步操作。
    		success:function(data){
    			//console.log('Appkey Token 获取成功：',data);
    			appkeyTokenInfo = data;
    		},
    		error:function(error){
    			//console.log('Appkey Token 获取失败：',error);
    			appkeyTokenInfo = null;
    		}
    	});
    	return appkeyTokenInfo;
	},
	groupChatMember:function(communityID,userID){	//请求加入群聊，该方法返回请求回调的data。参数：communityID:社群ID，userID：当前用户ID
		var chatMemberInfo={};
		//chatMemberInfo={"code":0,"message":"成功"};
		//chatMemberInfo={"code":50003,"message":"成功"};
		$.ajax({
    		url:"/api/zm/w/circle/chat-member/",
    		type:"POST",
    		data: {
    			circleId:communityID,
    			userId:userID
    		},
    		dataType:"json",
    		async:false,	//设置为同步请求，没执行加入群聊不执行下一步操作。
    		success:function(data){
    			//console.log('chatMemberInfo 获取成功：',data);
    			chatMemberInfo = data;
    		},
    		error:function(error){
    			//console.log('chatMemberInfo 获取失败：',error);
    			chatMemberInfo = null;
    		}
    	});
		return chatMemberInfo;
	},
	openZhangmenAppLink:function(){	//返回下载app的a标签后的链接字符串
		return ' href="javascript:void(0);" onclick="downloadApp();" ';
	},
	jumptoLoginPage:function(){	//调用其他js的方法完成跳转登录操作
		window.circleS.setTabItem("qunliao");	//该方法位于 /js/circle/community_share.js
		window.Community_Live.noLogin();	//该方法位于 /js/circle/community_live.js
	},
	jumptoJoinCommunity:function(){	//调用其他js的方法完成跳转加入社群的操作
		window.circleS.setTabItem("qunliao");	//该方法位于 /js/circle/community_share.js
		window.circleS.joining();	//该方法位于 /js/circle/community_share.js
	},
	getCommunityName:function(_communityNamePath){	//返回社群名称div中的text。参数：_communityNamePath：社群名称div的class
		return $(_communityNamePath).text();
		//return '社群名称';
	},
	getCardInfoLink:function(userID){	//根据userID 返回名片详情的链接，参数：userID：用户ID
		return '/zhangmen/card/info/detail-share-'+userID+'?fromPage='+encodeURIComponent(window.location.href);
	},
	stopBubble:function(e){	//阻止事件冒泡，阻止浏览器默认事件的方法
	    if (e && e.stopPropagation)
	        e.stopPropagation();
	    else{
	    	window.event.cancelBubble=true;
	    }
	},
	
	myEncode:function(_map,_content){
	    _content = ''+_content;
	    if (!_map||!_content){
	        return _content||'';
	    }
	    return _content.replace(_map.r,function($1){
	        var _result = _map[!_map.i?$1.toLowerCase():$1];
	        return _result!=null?_result:$1;
	    });
	},
	myEscape:(function(){	//将html编码转换为文本
	    var _reg = /<br\/?>$/,
	        _map = {
	            r:/\<|\>|\&|\r|\n|\s|\'|\"/g,
	            '<':'&lt;','>':'&gt;','&':'&amp;',' ':'&nbsp;',
	            '"':'&quot;',"'":'&#39;','\n':'<br/>','\r':''
	        };
	    return function(_content){
	        _content = this.myEncode(_map,_content);
	        return _content.replace(_reg,'<br/><br/>');
	    };
	})()
};

/*
 * 格式化消息：将表情从文字变成图片，将文本消息中的链接文本变成可点链接
 * 2016-06-16
 * dengyang
 */
groupChat.Parse = {
	//枚举一下表情文件对应的文字，后面用正则替换
	emoji:{"[大笑]":{file:"emoji_0.png"},"[可爱]":{file:"emoji_01.png"},"[色]":{file:"emoji_02.png"},"[嘘]":{file:"emoji_03.png"},"[亲]":{file:"emoji_04.png"},"[呆]":{file:"emoji_05.png"},"[口水]":{file:"emoji_06.png"},"[汗]":{file:"emoji_145.png"},"[呲牙]":{file:"emoji_07.png"},"[鬼脸]":{file:"emoji_08.png"},"[害羞]":{file:"emoji_09.png"},"[偷笑]":{file:"emoji_10.png"},"[调皮]":{file:"emoji_11.png"},"[可怜]":{file:"emoji_12.png"},"[敲]":{file:"emoji_13.png"},"[惊讶]":{file:"emoji_14.png"},"[流感]":{file:"emoji_15.png"},"[委屈]":{file:"emoji_16.png"},"[流泪]":{file:"emoji_17.png"},"[嚎哭]":{file:"emoji_18.png"},"[惊恐]":{file:"emoji_19.png"},"[怒]":{file:"emoji_20.png"},"[酷]":{file:"emoji_21.png"},"[不说]":{file:"emoji_22.png"},"[鄙视]":{file:"emoji_23.png"},"[阿弥陀佛]":{file:"emoji_24.png"},"[奸笑]":{file:"emoji_25.png"},"[睡着]":{file:"emoji_26.png"},"[口罩]":{file:"emoji_27.png"},"[努力]":{file:"emoji_28.png"},"[抠鼻孔]":{file:"emoji_29.png"},"[疑问]":{file:"emoji_30.png"},"[怒骂]":{file:"emoji_31.png"},"[晕]":{file:"emoji_32.png"},"[呕吐]":{file:"emoji_33.png"},"[拜一拜]":{file:"emoji_160.png"},"[惊喜]":{file:"emoji_161.png"},"[流汗]":{file:"emoji_162.png"},"[卖萌]":{file:"emoji_163.png"},"[默契眨眼]":{file:"emoji_164.png"},"[烧香拜佛]":{file:"emoji_165.png"},"[晚安]":{file:"emoji_166.png"},"[强]":{file:"emoji_34.png"},"[弱]":{file:"emoji_35.png"},"[OK]":{file:"emoji_36.png"},"[拳头]":{file:"emoji_37.png"},"[胜利]":{file:"emoji_38.png"},"[鼓掌]":{file:"emoji_39.png"},"[握手]":{file:"emoji_200.png"},"[发怒]":{file:"emoji_40.png"},"[骷髅]":{file:"emoji_41.png"},"[便便]":{file:"emoji_42.png"},"[火]":{file:"emoji_43.png"},"[溜]":{file:"emoji_44.png"},"[爱心]":{file:"emoji_45.png"},"[心碎]":{file:"emoji_46.png"},"[钟情]":{file:"emoji_47.png"},"[唇]":{file:"emoji_48.png"},"[戒指]":{file:"emoji_49.png"},"[钻石]":{file:"emoji_50.png"},"[太阳]":{file:"emoji_51.png"},"[有时晴]":{file:"emoji_52.png"},"[多云]":{file:"emoji_53.png"},"[雷]":{file:"emoji_54.png"},"[雨]":{file:"emoji_55.png"},"[雪花]":{file:"emoji_56.png"},"[爱人]":{file:"emoji_57.png"},"[帽子]":{file:"emoji_58.png"},"[皇冠]":{file:"emoji_59.png"},"[篮球]":{file:"emoji_60.png"},"[足球]":{file:"emoji_61.png"},"[垒球]":{file:"emoji_62.png"},"[网球]":{file:"emoji_63.png"},"[台球]":{file:"emoji_64.png"},"[咖啡]":{file:"emoji_65.png"},"[啤酒]":{file:"emoji_66.png"},"[干杯]":{file:"emoji_67.png"},"[柠檬汁]":{file:"emoji_68.png"},"[餐具]":{file:"emoji_69.png"},"[汉堡]":{file:"emoji_70.png"},"[鸡腿]":{file:"emoji_71.png"},"[面条]":{file:"emoji_72.png"},"[冰淇淋]":{file:"emoji_73.png"},"[沙冰]":{file:"emoji_74.png"},"[生日蛋糕]":{file:"emoji_75.png"},"[蛋糕]":{file:"emoji_76.png"},"[糖果]":{file:"emoji_77.png"},"[葡萄]":{file:"emoji_78.png"},"[西瓜]":{file:"emoji_79.png"},"[光碟]":{file:"emoji_80.png"},"[手机]":{file:"emoji_81.png"},"[电话]":{file:"emoji_82.png"},"[电视]":{file:"emoji_83.png"},"[声音开启]":{file:"emoji_84.png"},"[声音关闭]":{file:"emoji_85.png"},"[铃铛]":{file:"emoji_86.png"},"[锁头]":{file:"emoji_87.png"},"[放大镜]":{file:"emoji_88.png"},"[灯泡]":{file:"emoji_89.png"},"[锤头]":{file:"emoji_90.png"},"[烟]":{file:"emoji_91.png"},"[炸弹]":{file:"emoji_92.png"},"[枪]":{file:"emoji_93.png"},"[刀]":{file:"emoji_94.png"},"[药]":{file:"emoji_95.png"},"[打针]":{file:"emoji_96.png"},"[钱袋]":{file:"emoji_97.png"},"[钞票]":{file:"emoji_98.png"},"[银行卡]":{file:"emoji_99.png"},"[手柄]":{file:"emoji_100.png"},"[麻将]":{file:"emoji_101.png"},"[调色板]":{file:"emoji_102.png"},"[电影]":{file:"emoji_103.png"},"[麦克风]":{file:"emoji_104.png"},"[耳机]":{file:"emoji_105.png"},"[音乐]":{file:"emoji_106.png"},"[吉他]":{file:"emoji_107.png"},"[火箭]":{file:"emoji_108.png"},"[飞机]":{file:"emoji_109.png"},"[火车]":{file:"emoji_110.png"},"[公交]":{file:"emoji_111.png"},"[轿车]":{file:"emoji_112.png"},"[出租车]":{file:"emoji_113.png"},"[警车]":{file:"emoji_114.png"},"[自行车]":{file:"emoji_115.png"}},
	buildEmoji:function(text,type) {	//正则替换文本消息中的表情，参数：text：文本消息内容，type：消息类型（他人的消息 还是 我的消息）
		var re = /\[([^\]\[]*)\]/g;
		var matches = text.match(re) || [];
		for (var j = 0, len = matches.length; j < len; ++j) {
			if(groupChat.Parse.emoji[matches[j]]){
				if(type=='mymsg'){
					text = text.replace(matches[j], '<img class="dy_gc_sm_mm_mcb_tmc_img" src="/images/groupChat/emoji/' + groupChat.Parse.emoji[matches[j]].file + '" />');
		        }else if(type=='othermsg'){
		        	text = text.replace(matches[j], '<img class="dy_gc_sm_mo_mcb_tmc_img" src="/images/groupChat/emoji/' + groupChat.Parse.emoji[matches[j]].file + '" />');
		        }else{
		        	text = text;
		        }
			}
		}
		return text;
	},
	buildNewlineToBr:function(text){	//正则替换换行为 br，参数：text：文本消息内容
		return text.replace(/\n/g,'<br />');
	},
	buildLink:function(text,type){	//正则替换链接形式文本为 a标签形式，参数：text：文本消息内容，type：消息类型（他人的消息 还是 我的消息）
		var checkLinkReg = /((http|https|ftp):\/\/[\w.\/]+)(?![^<]+>)/gi; // 只可以识别带有http://,https://,ftp://的链接
        if(type=='mymsg'){
        	text = text.replace(checkLinkReg, '<a href="$1" class="dy_gc_sm_mm_mcb_tmc_a">$1</a>');
        }else if(type=='othermsg'){
        	text = text.replace(checkLinkReg, '<a href="$1" class="dy_gc_sm_mo_mcb_tmc_a">$1</a>');
        }else{
        	text = text;
        }
		return text;
	},
	buildTextMsg:function(text,type){	//调用正则替换完成文本消息格式化成html，参数：text：文本消息内容，type：消息类型（他人的消息 还是 我的消息）
		text = groupChat.Util.myEscape(text);
		text = this.buildNewlineToBr(text);
		text = this.buildLink(text,type);
		text = this.buildEmoji(text,type);
		return text;
	}
};

/*
 * 获取各类消息的数据，并返回各类消息的html格式
 * 2016-06-16
 * dengyang
 */
groupChat.Html= {
	/*
	 * 功能：//根据不同的消息类型 组合自定义消息为html，返回消息的html
	 * 参数：
	 * curMsgId:当前消息的消息id
	 * type：消息类型（新人加入、打赏、购买消息等）
	 * title,desc,pic,link：自定义消息数据data中的title,desc,pic,link
	 * 分别是标题，详情，缩略图，相关链接，如果是新人加入消息，link是用户名片详情
	 * title:标题
	 * desc:详情
	 * pic:缩略图
	 * link:相关链接，如果是新人加入消息，link是用户名片详情
	 */
	systemMsgContent:function(curMsgId,type,title,desc,pic,link){
		if(type=='newmember'){	//新人加入系统消息
			var msgHtml = [
					'<div class="dy_gc_sm_msgsystem" data-curmsgid="'+curMsgId+'">',
						'<a class="dy_gc_sm_ms_a" href="'+link+'">',
							'<div class="dy_gc_sm_ms_a_newmember">',
								'<div class="dy_gc_sm_ms_a_nm_useravatar">',
									'<img class="dy_gc_sm_ms_a_nm_ua_img" src="'+pic+'"/>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_nm_msginfo">',
									'<p class="dy_gc_sm_ms_a_nm_mi_p">'+title+'</p>',
									'<span class="dy_gc_sm_ms_a_nm_mi_span">'+desc+'</span>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_nm_entericon">',
									'<img class="dy_gc_sm_ms_a_nm_ei_img" src="/images/groupChat/iconEnterGray.png"/>',
								'</div>',
							'</div>',
						'</a>',
					'</div>'
					        ].join('');
			return msgHtml;
		}else if(type=='rewardinfo'){	//打赏系统消息
			var msgHtml = [
					'<div class="dy_gc_sm_msgsystem" data-curmsgid="'+curMsgId+'">',
						'<a class="dy_gc_sm_ms_a" href="'+link+'">',
							'<div class="dy_gc_sm_ms_a_rewardinfo">',
								'<div class="dy_gc_sm_ms_a_ri_infoicon">',
									'<img class="dy_gc_sm_ms_a_ri_ii_img" src="'+pic+'"/>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_ri_msginfo">',
									'<p class="dy_gc_sm_ms_a_ri_mi_p">'+title+'</p>',
									'<span class="dy_gc_sm_ms_a_ri_mi_span">'+desc+'</span>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_ri_entericon">',
									'<img class="dy_gc_sm_ms_a_ri_ei_img" src="/images/groupChat/iconEnterWhite.png"/>',
								'</div>',
							'</div>',
						'</a>',
					'</div>'
			               ].join('');
			return msgHtml;
		}else if(type=='newbuyinfo'){	//购买系统消息（商品购买、会员购买、分销商购买）
			var msgHtml = [
					'<div class="dy_gc_sm_msgsystem" data-curmsgid="'+curMsgId+'">',
						'<a class="dy_gc_sm_ms_a" href="'+link+'">',
							'<div class="dy_gc_sm_ms_a_newbuyinfo">',
								'<div class="dy_gc_sm_ms_a_nbi_infoicon">',
									'<img class="dy_gc_sm_ms_a_nbi_ii_img" src="'+pic+'"/>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_nbi_msginfo">',
									'<p class="dy_gc_sm_ms_a_nbi_mi_p">'+title+'</p>',
									'<span class="dy_gc_sm_ms_a_nbi_mi_span">'+desc+'</span>',
								'</div>',
								'<div class="dy_gc_sm_ms_a_nbi_entericon">',
									'<img class="dy_gc_sm_ms_a_nbi_ei_img" src="/images/groupChat/iconEnterWhite.png"/>',
								'</div>',
							'</div>',
						'</a>',
					'</div>'
			               ].join('');
			return msgHtml;
		}else if(type=='linkcard'){	//链接卡片消息
			var msgHtml = [
							'<a href="'+link+'">',
							'<p class="dx_gc_link_card_tit_type">链接</p>',
							'<p class="dx_gc_link_card_tit">'+title+'</p>',
							'<div class="dx_gc_link_card_tit_con"><img class="dx_gc_link_card_tit_pic" src="'+pic+'"/><p class="dx_gc_link_card_tit_text">'+desc+'</p></div>',
							'</a>'
					      ].join('');
			return msgHtml;
		}else{
			return '';
		}
	},
	/*
	 * 功能：把自己发送的消息 组合成html
	 * 参数：
	 * curMsgId:当前消息的消息id
	 * type:消息类型。可能的值，textmsg 文本消息、emojimsg 掌门自定义表情消息、imagemsg 图片消息,
	 * link:名片详情
	 * avatar:用户头像
	 * curMsgHtml：消息内容,可能的值，1.图片链接，2.消息文本内容
	 */
	myMsgContent:function(curMsgId,type,link,avatar,curMsgHtml, accountId){
		var dAvatar = groupChat.Data.curUser.defaultAvatar;
		if(type=='textmsg'){	//文本消息
			var msgHtml = [
				'<div class="dy_gc_sm_msgmy" data-curmsgid="'+curMsgId+'">',
					'<div class="dy_gc_sm_mm_useravatar '+accountId+'_id">',
						'<a class="dy_gc_sm_mm_ua_a" href="'+link+'">',
							'<img class="dy_gc_sm_mm_ua_a_img" src="'+avatar+'" onerror="'+dAvatar+'"/>',
						'</a>',
					'</div>',
					'<div class="dy_gc_sm_mm_msgcontbg">',
						'<div class="dy_gc_sm_mm_mcb_bgicon"></div>',
						'<div class="dy_gc_sm_mm_mcb_textmsgcont">',
							curMsgHtml,
						'</div>',
					'</div>',
				'</div>'
			              ].join('');
			return msgHtml;
		}else if(type=='emojimsg'){	//掌门自定义的表情消息
			var msgHtml = [
				'<div class="dy_gc_sm_msgmy" data-curmsgid="'+curMsgId+'">',
					'<div class="dy_gc_sm_mm_useravatar  '+accountId+'_id">',
						'<a class="dy_gc_sm_mm_ua_a" href="'+link+'">',
							'<img class="dy_gc_sm_mm_ua_a_img" src="'+avatar+'" onerror="'+dAvatar+'"/>',
						'</a>',
					'</div>',
					'<div class="dy_gc_sm_mm_imagemsgcont">',
						'<img class="dy_gc_sm_mm_imc_img_emoji" src="'+curMsgHtml+'" />',
					'</div>',
				'</div>'
				          ].join('');
			return msgHtml;
		}else if(type=='imagemsg'){	//图片消息
			var msgHtml = [
				'<div class="dy_gc_sm_msgmy" data-curmsgid="'+curMsgId+'">',
					'<div class="dy_gc_sm_mm_useravatar  '+accountId+'_id">',
						'<a class="dy_gc_sm_mm_ua_a" href="'+link+'">',
							'<img class="dy_gc_sm_mm_ua_a_img" src="'+avatar+'" onerror="'+dAvatar+'"/>',
						'</a>',
					'</div>',
					'<div class="dy_gc_sm_mm_imagemsgcont">',
						'<img class="dy_gc_sm_mm_imc_img" onclick="groupChat.Html.addMyMsgBingPic(\''+curMsgHtml+'\');$(\'.dy_gc_sm_mm_imc_img_bigfixed\').show();" src="'+curMsgHtml+'" />',
					'</div>',
				'</div>',
			].join('');
			return msgHtml;
		}else if(type=='linkcard'){	//图片消息
			var msgHtml = [
							'<div class="dy_gc_sm_msgmy" data-curmsgid="'+curMsgId+'">',
								'<div class="dy_gc_sm_mm_useravatar  '+accountId+'_id">',
									'<a class="dy_gc_sm_mm_ua_a" href="'+link+'">',
										'<img class="dy_gc_sm_mm_ua_a_img" src="'+avatar+'" onerror="'+dAvatar+'"/>',
									'</a>',
								'</div>',
								'<div class="dy_gc_sm_mm_msgcontbg" style="background:#fff;">',
								'<div class="dy_gc_sm_mm_mcb_bgicon dy_gc_sm_mm_mcb_card_bgicon"></div>',
								'<div class="dy_gc_sm_mm_mcb_textmsgcont">',
									curMsgHtml,
								'</div>',
							'</div>',
						'</div>'
				].join('');
			return msgHtml;
		}
		else{
			return '';
		}
	},
	addMyMsgBingPic:function(curMsgHtml){
		$('body').append('<div class="dy_gc_sm_mm_imc_img_bigfixed" style="line-height: '+$(window).height() * 1.5+'px;"><img onclick="$(this).parent().remove();" class="dy_gc_sm_mm_imc_img_bigfixed_img" src="'+curMsgHtml+'" /></div>');
	},
	//获取认证的html
	createAuthStateHtml : function(authState){
		var  authStateHtml = "";//如果没加V 加V图标不显示
		if(authState == 3){	//如果authstate==3,表示此用户已经认证，那么需要显示加V图标
			authStateHtml=[ 
				'<div class="dy_gc_sm_mo_un_authstate" authState="'+authState+'">',
					'<img class="dy_gc_sm_mo_un_as_img" src="/images/groupChat/authStateIcon.png">',
				'</div>' 
			              ].join('');
		}
		return authStateHtml;
	},
	
	createAccountInfoHtml : function(link, avatar, username, company, position,  accountId, authStateHtml, curMsgId){
		var dAvatar = groupChat.Data.curUser.defaultAvatar;
		return ['<div class="dy_gc_sm_msgother" data-curmsgid="'+curMsgId+'">',
		'<div class="dy_gc_sm_mo_useravatar '+accountId+'_id">',
			'<a class="dy_gc_sm_mo_ua_a" href="'+link+'">',
				'<img class="dy_gc_sm_mo_ua_a_img" src="'+avatar+'" onerror="'+dAvatar+'"/>',
			'</a>',
		'</div>',
		'<div class="dy_gc_sm_mo_username  '+accountId+'_info">',
			'<div class="dy_gc_sm_mo_un_name">'+username+'</div>',
				authStateHtml,
			'<div class="dy_gc_sm_mo_un_company">'+company+'</div>',
			'<div class="dy_gc_sm_mo_un_position">'+position+'</div>',
		'</div>'].join('');
	},
	
	/*
	 * 功能：把他人发送的消息 组合成html
	 * 参数：
	 * curMsgId:当前消息的消息id
	 * type:消息类型。可能的值，textmsg 文本消息、emojimsg 掌门自定义表情消息、imagemsg 图片消息,
	 * link:名片详情
	 * avatar:用户头像
	 * username：用户昵称
	 * authstate：认证状态
	 * company：公司
	 * position：职位
	 * curMsgHtml：消息内容,可能的值，1.图片链接，2.消息文本内容
	 */
	otherMsgContent:function(curMsgId,type,link,avatar,username,authState,company,position,curMsgHtml, accountId){
		var authStateHtml= this.createAuthStateHtml(authState);
		var accountInfoHtml = this.createAccountInfoHtml(link, avatar, username, company, position,  accountId, authStateHtml, curMsgId);
		if(type=='textmsg'){	//文本消息
			var msgHtml = [
			            accountInfoHtml,
						'<div class="dy_gc_sm_mo_msgcontbg">',
							'<div class="dy_gc_sm_mo_mcb_bgicon"></div>',
							'<div class="dy_gc_sm_mo_mcb_textmsgcont">',
								curMsgHtml,
							'</div>',
						'</div>',
					'</div>'
			              ].join('');
			return msgHtml;
		}else if(type=='emojimsg'){		//系统自定义表情消息
			
			var msgHtml = [
			             accountInfoHtml,
						'<div class="dy_gc_sm_mo_imagemsgcont">',
							'<img class="dy_gc_sm_mo_imc_img_emoji" src="'+curMsgHtml+'" />',
						'</div>',
					'</div>'
			              ].join('');
			return msgHtml;
		}else if(type=='imagemsg'){		//图片消息
			
			var msgHtml = [
					accountInfoHtml,
						'<div class="dy_gc_sm_mo_imagemsgcont">',
							'<img class="dy_gc_sm_mo_imc_img" onclick="groupChat.Html.addOtherMsgBingPic(\''+curMsgHtml+'\');$(\'.dy_gc_sm_mo_imc_img_bigfixed\').show();" src="'+curMsgHtml+'" />',
						'</div>',
					'</div>'
			              ].join('');
			return msgHtml;
		}else if(type=='linkcard'){		//卡片消息
			
			var msgHtml = [
					accountInfoHtml,
						'<div class="dy_gc_sm_mo_msgcontbg">',
						'<div class="dy_gc_sm_mo_mcb_bgicon"></div>',
						'<div class="dy_gc_sm_mo_mcb_textmsgcont">',
							curMsgHtml,
						'</div>',
					'</div>',
				'</div>'
			    ].join('');
			return msgHtml;
		}else{
			return '';
		}
	},
	addOtherMsgBingPic:function(curMsgHtml){
		$('body').append('<div class="dy_gc_sm_mo_imc_img_bigfixed" style="line-height: '+$(window).height() * 1.5+'px;"><img onclick="$(this).parent().remove();" class="dy_gc_sm_mo_imc_img_bigfixed_img" src="'+curMsgHtml+'" /></div>');
	},
	/*
	 * 解析各种类型的消息，并调用转化消息为html的函数，返回消息的html形式
	 * curData：消息内容的json
	 * curThisData：groupChat.Data，用来传输数据
	 * avatar:用户头像
	 * username：用户昵称
	 * userLink:名片详情
	 * authstate：认证状态
	 * company：公司
	 * position：职位
	 */
	bulidMsgHtml:function(curData,curThisData,avatar,username,userLink,authstate,company,position, accountId){
		var msgHtml ='';	//定义消息变量为空字符串
		if (curData.scene == "team") {	//判断是否为群聊，不是则返回空字符串
			if(curData.to == curThisData.curUser.chatID){	//判断是否为当前群的消息，不是则返回空字符串
				
				var curMsgId = curData.idClient;	//存一下当前消息id，传给组合消息html的函数
				if(!this.checkMsgId(curMsgId)){	//增加一层判断，用来判断该条消息id是否已经显示在showmsg div中
					
					if(curData.type=='custom'){	//判断是否为自定义消息
						var  contentJson = JSON.parse(curData.content);	//把字符串格式的json转化为json对象
						if(contentJson.type==1){//内容卡片消息
							var type='linkcard';
							var title=contentJson.data.title;
							var desc=contentJson.data.desc;
							var pic=contentJson.data.pic;
							if(pic == '' || pic == null || pic == 'null' || pic == undefined || pic == 'undefined'){
								pic=curThisData.curUser.defaultLink;
							}
							var link = '';
							if(contentJson.data.type == 11){//名片链接
								link=contentJson.data.link + contentJson.data.id;
							}else{
								link=contentJson.data.link;
							}
							if(contentJson.data.link == '' && curData.from == curThisData.curUser.userID){	//判断是否是自己发送的消息
								type='textmsg';	//文本消息形式  来显示不支持的聊天格式消息
								var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
								msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
							}else if(contentJson.data.link == '' && curData.from != curThisData.curUser.userID){
								type='textmsg';
								var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
								msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId);
							}else{
								var curMsgHtml = this.systemMsgContent(curMsgId, type, title, desc, pic, link);//调用组合系统消息为html的方法
								if(curData.from== curThisData.curUser.userID){
									msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
								}else{
									msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId);
								}
							}
						}else if(contentJson.type==2){  //提示卡片消息
							if(contentJson.data.type==12){//新人加入 type==12
								var type='newmember';
								var title=contentJson.data.title;
								var desc=contentJson.data.desc;
								var pic=contentJson.data.pic;
								if(pic==''){
									pic=curThisData.curUser.defaultAvatar;
								}
								var link=groupChat.Util.getCardInfoLink(contentJson.data.id);//获得名片详情链接
								msgHtml+=this.systemMsgContent(curMsgId, type, title, desc, pic, link);//调用组合系统消息为html的方法
							}else if(contentJson.data.type==28){//打赏信息 type==28
								var type='rewardinfo';
								var title=contentJson.data.title;
								var desc=contentJson.data.desc;
								var pic=contentJson.data.pic;
								var link=groupChat.Util.getCardInfoLink(contentJson.data.id);
								msgHtml+=this.systemMsgContent(curMsgId, type, title, desc, pic, link);
							}else if(contentJson.data.type==29){//产品购买 type==29
								var type='newbuyinfo';
								var title=contentJson.data.title;
								var desc=contentJson.data.desc;
								var pic=contentJson.data.pic;
								var link=contentJson.data.link;
								msgHtml+=this.systemMsgContent(curMsgId, type, title, desc, pic, link);
							}else if(contentJson.data.type==33){//会员购买 type==33
								var type='newbuyinfo';
								var title=contentJson.data.title;
								var desc=contentJson.data.desc;
								var pic=contentJson.data.pic;
								var link=contentJson.data.link;
								msgHtml+=this.systemMsgContent(curMsgId, type, title, desc, pic, link);
							}else{	//如果不是以上形式的自定义消息，则暂时显示为网页端不支持该条聊天格式
								if(curData.from== curThisData.curUser.userID){	//判断是否是自己发送的消息
									var type='textmsg';	//文本消息形式  来显示不支持的聊天格式消息
									var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
									msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
								}else{
									var type='textmsg';
									var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
									msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId)
								}
							}
						}else if(contentJson.type==3){  //用户禁言相关系统通知消息
							if(curData.from== curThisData.curUser.userID){
								return '';
							}else{	//禁言消息在系统通知消息那里解析，所以这里注释掉
								/*if(contentJson.data.type==6){
									var silenceInfo = contentJson.data.content;
									var silenceNick = silenceInfo.substring(0, silenceInfo.indexOf('被禁言'));
									if(silenceNick==curThisData.curUser.curUserNick){
										groupChat.Chat.silenceStateAction();
									}
								}else if(contentJson.data.type==22){
									var disSilenceInfo = contentJson.data.content;
									var disSilenceNick = disSilenceInfo.substring(0, disSilenceInfo.indexOf('被取消禁言'));
									if(disSilenceNick==curThisData.curUser.curUserNick){
										groupChat.Chat.disSilenceStateAction();
									}
								}*/
							}
						}else if(contentJson.type==4){  //自定义表情消息
							if(curData.from== curThisData.curUser.userID){	//判断是否是自己发送的消息
								var type='emojimsg';	//自定义表情消息标识
								var curMsgHtml='/images/groupChat/'+contentJson.data.catalog+'/'+contentJson.data.chartlet+'.gif';
								msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
							}else{
								var type='emojimsg';
								var curMsgHtml='/images/groupChat/'+contentJson.data.catalog+'/'+contentJson.data.chartlet+'.gif';
								msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId);
							}
						}else{	//如果不是 内容卡片，系统通知，自定义表情消息，则暂时显示为网页端不支持该条聊天格式
							if(curData.from== curThisData.curUser.userID){
								var type='textmsg';
								var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
								msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
							}else{
								var type='textmsg';
								var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
								msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId)
							}
						}
					}else if(curData.type=='text'){	//文本消息
						if(curData.from== curThisData.curUser.userID){	//判断是否是自己发送的消息
							var type='textmsg';	//文本消息标识
							var curMsgHtml=groupChat.Parse.buildTextMsg(curData.text,'mymsg');	//格式化消息（转化表情，转化空格换行，转化链接为a链接）
							msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
						}else{
							var type='textmsg';
							var curMsgHtml=groupChat.Parse.buildTextMsg(curData.text,'othermsg');
							msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId);
						}
					}else if(curData.type=='image'){	//图片消息
						if(curData.from== curThisData.curUser.userID){
							var type='imagemsg';	//图片消息标识
							var curMsgHtml=curData.file.url;
							msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
						}else{
							var type='imagemsg';
							var curMsgHtml=curData.file.url;
							msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId);
						}
					}else if(curData.type=='notification'){  //群通知消息
						if(curData.attach.type=='removeTeamMembers'){	//判断是否是移出群成员的消息
							if(curData.attach.accounts.indexOf(curThisData.curUser.userID)!=-1){	//判断移除群成员中是否有当前用户
								groupChat.Chat.removeTeamAction();	//执行当前用户被移除群的操作
							}
						}else{
							return '';
						}
					}else{	//如果不是自定义消息、群通知消息、文本消息、图片消息。则暂时显示为网页端不支持该条聊天格式
						if(curData.from== curThisData.curUser.userID){
							var type='textmsg';
							var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
							msgHtml+=this.myMsgContent(curMsgId, type, userLink, avatar, curMsgHtml, accountId);
						}else{
							var type='textmsg';
							var curMsgHtml='网页端暂不支持该条聊天格式，请<a class="dy_gc_sm_mm_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>下载掌门app</a>！';
							msgHtml+=this.otherMsgContent(curMsgId, type, userLink, avatar, username, authstate, company, position, curMsgHtml, accountId)
						}
					}
					return msgHtml;
				}else{
					return '';
				}
			}else{
				return '';
			}
		} else {
			return '';
		}
	},
	/*
	 * 把历史消息转化成html，并调用append方法显示出来。
	 * data：groupChat.Data对象，用来传递数据。
	 * mynim：new 的 Sdk对象。传递这个参数是为了调用Sdk原型上的 获取用户名片的方法 getUsers
	 */
	getHistoryMsgsHtml:function(data,mynim){
		var curThis=this;
		var msgHtml ='';
		var curData=data.historyMsgs.msgs;	//存一下历史消息json对象。
		//console.log('当前historyMsg是：',curData);
		var userAccounts=[];	//用一个循环来存储历史消息中所有发送者的用户账号
		for (var i = 0; i < data.historyMsgs.msgs.length; i++) {
			//liujt 2016-07-18 相同的用户id，只取一次，把重复的过滤掉
			if(userAccounts.indexOf(data.historyMsgs.msgs[i].from) <= -1){
				userAccounts.push(data.historyMsgs.msgs[i].from);
			}
		}
	
		function getSenderInfo(error, userInfos){	//获取用户名片的回调函数，根据用户名片和消息的对应关系来显示消息。
			//console.log('获取用户名片' + (!error?'成功':'失败'), error,userInfos);
		    if (!error && userInfos) {
//		    	console.log('用户名片信息：',userInfos);
		    	for(var i=curData.length-1;i>=0;i--){	//逆向显示消息，保证最新的最后一条消息最后显示出来。
		    		for(var j=0;j<userInfos.length;j++){
		    			var accountId = curData[i].from;
			    		if(accountId == userInfos[j].account){	//判断当前消息和用户名片信息的对应关系
			    			//console.log(curData[i].from,userInfos[j].account);
			    			
				    		var avatar=userInfos[j].avatar;	//用户头像
//				    		console.log(avatar);
				    		if(avatar==''){	//检查用户头像链接是否存在
				    			avatar=data.curUser.defaultAvatar;
							}
				    		
							var username=userInfos[j].nick;	//用户昵称
							var userLink=groupChat.Util.getCardInfoLink(userInfos[j].account);	//用户名片详情
							var authstate = 0;	//认证状态
							var company=' ';	//企业信息
							var position=' ';	//职位信息
							//liujt 2016-06-22	解决自己发的聊天记录看不到，也看不到历史记录的问题
							if(userInfos[j].custom){
								var uInfo =JSON.parse(userInfos[j].custom);
								authstate=uInfo.authState;//userInfos.custom是一个字符串，所以需要转化成json obj
								company= uInfo.company;
								position= uInfo.position;
							}
							//console.log('company:',company);
							//console.log('authstate:',authstate);
							//console.log('position:',position);
			    		}
		    		}
		    		//获得消息的html形式
		    		msgHtml+= curThis.bulidMsgHtml(curData[i], data, avatar, username, userLink, authstate, company, position, accountId);
		    	}
		    	groupChat.Chat.showMsgToBox(msgHtml);	//调用方法来显示消息到showmsg div中
		    }
		}
		
		if(userAccounts.length==0){
			return;
		}else{
			mynim.getUsers(userAccounts, getSenderInfo);	//调用Sdk上的方法来获取一组用户的名片
		}
		
	    return msgHtml;
	},
	/*
	 * 把回话更新后的当前消息转化为html，并调用append方法显示出来。
	 * data：groupChat.Data对象，用来传递数据。
	 * mynim：new 的 Sdk对象。传递这个参数是为了调用Sdk原型上的 获取用户名片的方法 getUser
	 */
	getCurMsgHtml:function(data,mynim){
		var curThis=this;
		var msgHtml ='';
		for (var i = 0; i < data.sessions.length; i++) {
			var curData=data.sessions[i].lastMsg;
			if (curData.scene == "team") {	//先判断是否是群聊，不是的话则放弃解析显示操作
				var accountId = curData.from;
				if(curData.to == data.curUser.chatID){	//判断是否是当前群的消息，不是的话则放弃解析显示操作
//					mynim.getUser(curData.from, getSenderInfo);	//获取当前消息发送者的名片详情
					function getSenderInfo(error, userInfo){	//getUser的回调函数，调用方法获取消息html并显示到showmsg div中
						//console.log('用户名片信息：',userInfo);
						var avatar=userInfo.avatar;
						var dAvatar = data.curUser.defaultAvatar;
						
						var username=userInfo.nick;
//						var userLink=groupChat.Util.getCardInfoLink(userInfo.account);
						var authstate = 0;
						var company=' ';
						var position=' ';
						//liujt 2016-06-22	解决自己发的聊天记录看不到，也看不到历史记录的问题
						if(userInfo.custom){
							var uInfo =JSON.parse(userInfo.custom);
							authstate=uInfo.authState;		//userInfo.custom是一个字符串，所以需要转化成json obj
							company= uInfo.company;
							position= uInfo.position;
						}
						if(accountId == groupChat.Data.curUser.userID){
							$("."+accountId+"_id  .dy_gc_sm_mm_ua_a_img").attr("src",avatar).attr("onerror", dAvatar);
							$("."+accountId+"_info  .dy_gc_sm_mm_un_name").text(username);
							$("."+accountId+"_info .dy_gc_sm_mm_un_authstate").attr("authState", authstate);//认证需要考虑一下
							$("."+accountId+"_info .dy_gc_sm_mm_un_company").text(company);
							$("."+accountId+"_info .dy_gc_sm_mm_un_position").text(position);	
						}else{
							$("."+accountId+"_id  .dy_gc_sm_mo_ua_a_img").attr("src",avatar).attr("onerror", dAvatar);
							$("."+accountId+"_info  .dy_gc_sm_mo_un_name").text(username);
							$("."+accountId+"_info .dy_gc_sm_mo_un_authstate").attr("authState", authstate);//认证需要考虑一下
							$("."+accountId+"_info .dy_gc_sm_mo_un_company").text(company);
							$("."+accountId+"_info .dy_gc_sm_mo_un_position").text(position);	
						}
						
//						msgHtml+=curThis.bulidMsgHtml(curData,data,avatar,username,userLink,authstate,company,position);
//						groupChat.Chat.showMsgToBox(msgHtml);
					}
					
					var avatar  = "";
					if(accountId == groupChat.Data.curUser.userID){
						avatar  = $("."+accountId+"_id .dy_gc_sm_mm_ua_a_img").attr("src");
					}else{
						avatar  = $("."+accountId+"_id .dy_gc_sm_mo_ua_a_img").attr("src");
					}
					var username = "";
					var userLink = groupChat.Util.getCardInfoLink(accountId);
					var authstate = 0;
					var company = ' ';
					var position = ' ';
					if(avatar != "" && avatar != undefined){
						if(accountId == groupChat.Data.curUser.userID){
							username = $("."+accountId+"_info  .dy_gc_sm_mm_un_name").eq(0).text();
							authstate = $("."+accountId+"_info  .dy_gc_sm_mm_un_authstate").eq(0).attr("authState");
							company =$("."+accountId+"_info  .dy_gc_sm_mm_un_company").eq(0).text();
							position = $("."+accountId+"_info  .dy_gc_sm_mm_un_position").eq(0).text();
						}else{
							username = $("."+accountId+"_info  .dy_gc_sm_mo_un_name").eq(0).text();
							authstate = $("."+accountId+"_info  .dy_gc_sm_mo_un_authstate").eq(0).attr("authState");
							company =$("."+accountId+"_info  .dy_gc_sm_mo_un_company").eq(0).text();
							position = $("."+accountId+"_info  .dy_gc_sm_mo_un_position").eq(0).text();
						}
					}else{
						avatar = data.curUser.defaultAvatar;
						mynim.getUser(curData.from, getSenderInfo);	//获取当前消息发送者的名片详情
					}
					msgHtml += curThis.bulidMsgHtml(curData, data, avatar, username, userLink, authstate, company, position, accountId);
					groupChat.Chat.showMsgToBox(msgHtml);
				}
			}
		}
		return msgHtml;
	},
	//根据消息id来检测网页中是否已经显示了当前消息
	checkMsgId:function(curMsgId){
		var showedMsgId = [];	//存储取出来的页面上显示的消息id
		var $systemMsg = $('.dy_gc_sm_msgsystem');
		var $myMsg = $('.dy_gc_sm_msgmy');
		var $otherMsg = $('.dy_gc_sm_msgother');
		for(var i=0;i<$systemMsg.length;i++){
			var msgId = $systemMsg.eq(i).attr('data-curmsgid');
			showedMsgId.push(msgId);
		}
		for(var i=0;i<$myMsg.length;i++){
			var msgId = $myMsg.eq(i).attr('data-curmsgid');
			showedMsgId.push(msgId);
		}
		for(var i=0;i<$otherMsg.length;i++){
			var msgId = $otherMsg.eq(i).attr('data-curmsgid');
			showedMsgId.push(msgId);
		}
		if(showedMsgId.indexOf(curMsgId)!=-1){
			return true;
		}else{
			return false;
		}
	}
};

/*
 * 数据对象，存储和传递所需要用到的数据
 * 2016-06-03
 * dengyang
 */
groupChat.Data = {};

/*
 * 云信SDK初始化，SDK收发消息操作，SDK的API操作
 * 2016-06-16
 * dengyang
 */
groupChat.Sdk = (function(){
	//定义构造函数，初始化云信SDK
	var Sdk = function(curThis){
		this.curThis = curThis;	//用来传递this对象
		this.data = curThis.data;		//数据对象，存放所有数据
		
		this.appKey = this.data.curOptions.appKey;	//云信appKey
		this.account = this.data.curOptions.userID;	//用户ID
		this.token = this.data.curOptions.userToken;	//用户登录云信的token
		
		/*
		 * NIM.getInstance(options)
		 * 此接口为单例模式, 对于同一个账号, 永远返回同一份实例, 即只有第一次调用会初始化一个实例
		 * 后续调用此接口会直接返回初始化过的实例, 同时也会调用接口setOptions更新传入的配置
		 * 后续调用此接口时, 如果连接已断开, 会自动建立连接
		 * 当发生掉线时，SDK会自动进行重连
		 */
		this.nim = window.nim = NIM.getInstance({	//初始化SDK,NIM.getInstance(options)
		//	debug: true,			//是否开启调试模式,默认false
			appKey: this.appKey,	//云信appKey
			account: this.account,	//用户ID
			token: this.token,		//用户token, 用于建立连接
			
			/*
			 * 连接建立后的回调, 会传入一个对象, 包含登录的信息, 有以下字段
			 * 		connectionId: 本次登录的连接号
			 * 		ip: 客户端IP
			 * 		port: 客户端端口
			 * 		country: 本次登录的国家
			 */
			onconnect: onConnect.bind(this),				//连接建立后的回调
			/*
			 * 即将重连的回调
			 * 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
			 * 此回调会收到一个对象, 包含额外的信息, 有以下字段
			 * 		duration: 距离下次重连的时间
			 * 		retryCount: 重连尝试的次数
			 */
			onwillreconnect: onWillReconnect.bind(this),	//即将重连的回调
			/*
			 * 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
			 * 此回调会收到一个对象, 包含错误的信息, 有以下字段
			 * 		code: 出错时的错误码, 可能为空
			 * 				302: 账号或者密码错误
			 * 				'kicked': 被踢
			 * 当code为'kicked'的时候, 此对象会有以下字段
			 * 		reason: 被踢的原因
			 * 			samePlatformKick: 不允许同一个帐号在多个地方同时登录
			 * 			serverKick: 被服务器踢了
			 * 			otherPlatformKick: 被其它端踢了
			 * 		message: 文字描述的被踢的原因
			 */
			ondisconnect: onDisconnect.bind(this),			//断开连接后的回调
			/*
			 * 错误对象, 有以下字段
			 * 		message 错误消息
			 * 		code 错误码
			 * 		错误码信息参照:http://dev.netease.im/doc/web/NIMError.html
			 */
			onerror: onError.bind(this),		//发生错误的回调, 会传入错误对象
			/*
			 * 多端登录状态变化的回调, 会收到登录端列表, 以下情况会收到此回调
			 * 		登录时其它端在线
			 * 		登录后其它端上线或者下线
			 * 登录端列表参考:http://dev.netease.im/doc/web/LoginPort.html
			 */
			onloginportschange: onLoginPortsChange.bind(this),  //多端登录状态变化的回调
			
			syncRelations:false,		//是否同步黑名单和静音列表, 默认true
			//onblacklist:onBlacklist.bind(this), 	//同步黑名单的回调, 会传入黑名单列表blacklist
			//onsyncmarkinblacklist: onMarkInBlacklist.bind(this),	//当前登录用户在其它端加入黑名单/从黑名单移除后的回调
    		//onmutelist: onMutelist.bind(this),					//同步静音列表的回调, 会传入静音列表mutelist
    		//onsyncmarkinmutelist: onMarkInMutelist.bind(this),	//当前登录用户在其它端加入静音列表/从静音列表移除后的回调
			
			syncFriends:false,		//是否同步好友列表, 默认true
			//onfriends: onFriends.bind(this),	//同步好友列表的回调, 会传入好友列表
   		 	//onsyncfriendaction: onSyncFriendAction.bind(this),	//当前登录用户在其它端进行好友相关的操作后的回调
   		 	
			onmyinfo: onMyInfo.bind(this),				//同步登录用户名片的回调, 会传入用户名片:http://dev.netease.im/doc/web/User.html
			onupdatemyinfo: onUpdateMyInfo.bind(this),	//当前登录用户在其它端修改自己的个人名片之后的回调, 会传入用户名片
			syncFriendUsers:false,			//是否同步好友对应的用户名片列表, 默认true
			//onusers: onUsers.bind(this),				//同步好友用户名片的回调, 会传入用户名片数组
			onupdateuser: onUpdateUser.bind(this),		//用户名片更新后的回调, 会传入用户名片
			
			syncTeams:false,		//是否同步群列表, 默认true
			//onteams: onTeams.bind(this),		//同步群列表的回调, 会传入群数组teams:http://dev.netease.im/doc/web/Team.html
			//onsynccreateteam: onCreateTeam.bind(this),	//当前登录用户在其它端创建群后的回调, 会传入群对象:http://dev.netease.im/doc/web/Team.html
			syncTeamMembers:false,			//是否同步群成员, 默认true
			//onteammembers: onTeamMembers.bind(this),	//同步群成员的回调, 一个群对应一个回调, 会传入群成员数组:http://dev.netease.im/doc/web/TeamMember.html
			//onsyncteammembersdone: onSyncTeamMembersDone.bind(this),	//当syncTeams和syncTeamMembers同时为true时, 会同步所有群的群成员, 当所有群的群成员同步结束时, 会调用此回调
			onupdateteammember: onUpdateTeamMember.bind(this),			//群成员信息更新后的回调, 会传入群成员对象, 不过此时的信息是不完整的, 只会包括被更新的字段。当前登录帐号在其它端修改自己在群里面的昵称时也会收到此回调。
			
			onsessions: onSessions.bind(this),			 //同步最近会话列表回调, 会传入会话列表, 按时间正序排列, 即最近聊过天的放在列表的最后面。:http://dev.netease.im/doc/web/Session.html
			onupdatesession: onUpdateSession.bind(this),//更新会话的回调, 会传入会话, 以下情况会收到此回调:收到消息,发送消息,设置当前会话,重置会话未读数

			syncRoamingMsgs:false,			//是否同步漫游消息, 默认true
		    //onroamingmsgs: onRoamingMsgs.bind(this),	//同步漫游消息的回调, 每个会话对应一个回调, 会传入消息数组:http://dev.netease.im/doc/web/IMMessage.html
		    onofflinemsgs: onOfflineMsgs.bind(this),	//同步离线消息的回调, 每个会话对应一个回调, 会传入消息数组
		    onmsg: onMsg.bind(this),	//收到消息的回调, 会传入消息对象,当前登录帐号在其它端发送消息之后也会收到此回调, 注意此时消息对象的from字段就是当前登录的帐号
		    
		    syncMsgReceipts:true,	//是否同步已读回执时间戳, 默认true
			onofflinesysmsgs: onOfflineSysMsgs.bind(this),	//同步离线系统通知的回调, 会传入系统通知:http://dev.netease.im/doc/web/SystemMessage.html
			onsysmsg: onSysMsg.bind(this),		//收到系统通知的回调, 会传入系统通知
			onupdatesysmsg: onUpdateSysMsg.bind(this),	//更新系统通知后的回调, 会传入系统通知
			onsysmsgunread: onSysMsgUnread.bind(this),	//收到系统通知未读数的回调
			onupdatesysmsgunread: onUpdateSysMsgUnread.bind(this),		//更新系统通知未读数的回调
			onofflinecustomsysmsgs: onOfflineCustomSysMsgs.bind(this),	//同步离线自定义系统通知的回调, 会传入系统通知
			oncustomsysmsg: onCustomSysMsg.bind(this),	//收到自定义系统通知的回调, 会传入系统通知
			
			onsyncdone: onSyncDone.bind(this),	//当上面各个同步（不包括下面的同步群成员）完成后, 会调用此回调
			
			//以下两项具体参考：http://dev.netease.im/doc/web/NIM.html#.getInstance
			autoMarkRead: true,	//是否自动标记消息为已收到 ，默认情况下SDK在收到服务器推送过来的消息后, 会在将消息推给开发者时将消息标记为已读状态, 下次登录后就不会收到标记为已读的消息。
			db:	true	//是否使用数据库,默认为true，在支持数据库的浏览器上 SDK 会将数据缓存到数据库中, 后续同步都是增量更新, 加快初始化速度
		});
		
		//以下是初始化SDK的回调函数的定义
		function onConnect() {	//连接建立后的回调
			//console.log('连接成功');
			this.getHistoryMsgs('team',this.data.curUser.chatID,false,getHistoryMsgsDone.bind(this));
		}
		function getHistoryMsgsDone(error, historyMsgs){
			//console.log('获取云端历史记录' + (!error?'成功':'失败'), error, historyMsgs);
			if(error){
				if(error.code==804||error.code==802){
					this.curThis.joinGroupChat(); //触发一次加入群聊的动作
				}
			}
			this.data.historyMsgs=historyMsgs;
			var msgHtml = groupChat.Html.getHistoryMsgsHtml(this.data,this.curThis.mynim);
		}
		function onWillReconnect(retryInfo) {	//即将重连的回调
			//console.log('正在准备重连',retryInfo);
		}
		function onDisconnect(error) {	//断开连接后的回调
			//console.log('连接已经断开',error);
		}
		function onError(error) {	//发生错误的回调
			//console.log('SDK发生错误',error);
		}
		function onLoginPortsChange(loginPorts) {	//多端登录状态变化的回调
			//console.log('当前登录帐号在其它端的【登录状态】发生改变', loginPorts);
		}
		
		/*注释黑名单和静音列表同步相关回调
		function onBlacklist(blacklist) {	//同步黑名单的回调
		    //console.log('收到黑名单', blacklist);
		}
		function onMarkInBlacklist(blacklistChangeInfo) {	//当前登录用户在其它端加入黑名单/从黑名单移除后的回调
		    //console.log('当前登录用户在其它端进行了【黑名单】相关操作',blacklistChangeInfo);
		}
		function onMutelist(mutelist) {		//同步静音列表的回调
		    //console.log('收到静音列表', mutelist);
		}
		function onMarkInMutelist(mutelistChangeInfo) {   	//当前登录用户在其它端加入静音列表/从静音列表移除后的回调
		    //console.log('当前登录用户在其它端进行了【静音列表】相关操作',mutelistChangeInfo);
		}
		*/
		
		/*注释好友列表同步相关回调
		function onFriends(friends) {  //同步好友列表的回调
		    //console.log('收到好友列表', friends);
		}
		function onSyncFriendAction(friendChangeInfo) {  //当前登录用户在其它端进行好友相关的操作后的回调
		    //console.log('当前登录用户在其它端进行了【好友】相关操作',friendChangeInfo);
		}
		*/
		
		function onMyInfo(userInfo) {	//同步登录用户名片的回调
			//console.log('收到我的名片信息', userInfo);
			this.data.curUser.curUserNick=userInfo.nick;
		}
		function onUpdateMyInfo(userChangeInfo) {	//当前登录用户在其它端修改自己的个人名片之后的回调
			//console.log('我的名片更新了', userChangeInfo);
		}
		/*注释同步好友用户名片的回调
		function onUsers(usersInfo) {	//收到用户名片后的处理函数，以及 同步好友用户名片的回调
		    //console.log('收到用户名片列表', usersInfo);
		    this.data.users = this.nim.mergeUsers(this.data.users, usersInfo);
		}
		*/
		function onUpdateUser(userInfo) {	//用户名片更新后的回调
			//console.log('用户名片更新了', userInfo);
			this.data.users = this.nim.mergeUsers(this.data.users, userInfo);
		}
		
		/*注释同步群列表和群成员的回调
		function onTeams(teams) {	//同步群列表的回调
			//console.log('收到群列表', teams);
		}
		function onCreateTeam(team) {	//当前登录用户在其它端创建群后的回调
			//console.log('你创建了一个群', team);
		}
		function onTeamMembers(teamId, members) {	//同步群成员的回调
			//console.log('群id', teamId, '群成员', members);
		}
		function onSyncTeamMembersDone() {	//当所有群的群成员同步结束时, 会调用此回调
			//console.log('同步群列表完成');
		}
		*/
		function onUpdateTeamMember(teamMember) {	//群成员信息更新后的回调
			//console.log('群成员信息更新了', teamMember);
		}
		
		
		function onSessions(sessions) {		//同步最近会话列表回调
			//console.log('收到会话列表', sessions);
			//this.data.sessions = this.nim.mergeSessions(this.data.sessions, sessions);
			//this.curThis.showCurMsgDom();
		}
		function onUpdateSession(session) {		//更新会话后的回调
			//console.log('会话更新了', session);
			this.data.sessions = this.nim.mergeSessions(this.data.sessions, session);
			this.curThis.showCurMsgDom();
		}
		
		/*注释漫游消息同步回调
		function onRoamingMsgs(roamingMsgs) {	//同步漫游消息的回调
			//console.log('收到漫游消息', roamingMsgs);
		}
		*/
		function onOfflineMsgs(offlineMsgs) {	//同步离线消息的回调
			//console.log('收到离线消息', offlineMsgs);
		}
		function onMsg(msg) {	//收到消息的回调
			//console.log('收到消息', msg.scene, msg.type, msg);
		}
	
	
		function onOfflineSysMsgs(sysMsgsOffline) {	//同步离线系统通知的回调
			//console.log('收到离线系统通知', sysMsgsOffline);
		}
		function onSysMsg(sysMsg) {		//收到系统通知的回调
			//console.log('收到系统通知', sysMsg);
		}
		function onUpdateSysMsg(sysMsg) {	//更新系统通知后的回调
			//console.log('收到系统通知', sysMsg);
		}
		function onSysMsgUnread(sysMsgNumber) {		//收到系统通知未读数的回调
			//console.log('收到系统通知未读数', sysMsgNumber);
		}
		function onUpdateSysMsgUnread(obj) {	//更新系统通知未读数的回调
			//console.log('系统通知未读数更新了', obj);
		}
		
		
		function onOfflineCustomSysMsgs(sysMsgsCustomOffline) {	//同步离线自定义系统通知的回调
			//console.log('收到离线自定义系统通知', sysMsgsCustomOffline);
		}
		function onCustomSysMsg(sysMsgCustom) {		//收到自定义系统通知的回调
			//console.log('收到自定义系统通知', sysMsgCustom);
			this.curThis.showCurCustomMsgDom(sysMsgCustom);
		}
	
		function onSyncDone() {		//当所有同步全部都完成同步后的回调
			//console.log('所有数据同步完成');
		}
	};
	
	//构造函数Sdk的原型上添加方法
	Sdk.prototype = {
		//发送普通文本消息,scene默认为team
		sendTextMessage:function(scene,to,text,pushPayload,isPushable,callback){
		    this.nim.sendText({
		        scene: scene || 'team',
		        to: to,
		        text: text,
		        pushPayload:pushPayload,
		        isPushable:isPushable,
		        done: callback
		    });
		},
		//发送发送自定义消息,scene默认为team,消息体用json构造
		sendCustomMessage:function(scene,to,content,callback){
		  	this.nim.sendCustomMsg({
		        scene: scene || 'team',
		        to: to,
		        content: JSON.stringify(content),
		        done: callback
		    });
		},
		//设置当前会话，设置后当前会话未读数会被置为 0, 同时会收到回调 onupdatesession
		setCurrSession:function(scene,to){
			this.nim.setCurrSession(scene+"-"+to);
		},
		//获取云记录历史消息,默认获取20条消息，默认查找所有类型的消息，默认查询所有云历史消息
		getHistoryMsgs:function(scene,to,lastMsgId,done){
			if(lastMsgId){
				//getHistoryMsgs(options)  options参考:http://dev.netease.im/doc/web/NIM.html#getHistoryMsgs
				this.nim.getHistoryMsgs ({
					scene:scene || 'team',
					to:to,
					lastMsgId:lastMsgId,
					limit:100,
					done:done
				});
			}else{
				this.nim.getHistoryMsgs ({
					scene:scene || 'team',
					to:to,
					limit:100,
					done:done
				});
			}
		},
		//获取本地历史记录消息,默认获取20条消息，默认查找所有类型的消息
		getLocalMsgs:function(scene,to,lastMsgId,done){
			if(lastMsgId){
				//getLocalMsgs(options)  options参考:http://dev.netease.im/doc/web/NIM.html#getLocalMsgs
				this.nim.getLocalMsgs ({
					scene:scene || 'team',
					to:to,
					lastMsgIdClient:lastMsgId,
					limit:100,
					done:done
				});
			}else{
				this.nim.getLocalMsgs ({
					scene:scene || 'team',
					to:to,
					limit:100,
					done:done
				});
			}
		},
		//获取所有的本地系统消息记录,每次最多100条
		getLocalSysMsgs:function(lastIdServer,done){
			this.nim.getLocalSysMsgs({
				lastIdServer: lastIdServer,
				done:done
			});
		},
		//删除所有本地系统通知
		deleteAllLocalSysMsgs:function(done){
			this.nim.deleteAllLocalSysMsgs({
		        done: done
		    });
		},
		//获取一组账号的用户信息，accounts Array.<String> 账号数组 ['account1', 'account2']
		getUsers:function(accounts,callback){
			this.nim.getUsers({
				accounts: accounts,
				done: callback
			});
		},
		//获取单个账号获取用户名片 account  String  账号   'account'
		getUser:function(account,callback){
			this.nim.getUser({
				account: account,
				done: callback
			});
		},
		//更新我的名片信息,所有参数都是String ——	nick:昵称,avatar:头像,sign:签名,gender:性别,email:邮箱,birth:生日,tel:手机号,custom:扩展字段
		updateMyInfo:function(nick,gender,birth,tel,email,sign,custom,callback){
			this.nim.updateMyInfo({
				nick:nick,
				gender:gender,
				birth:birth,
				tel:tel,
				email:email,
				sign:sign,
				custom:custom,
				done: callback
			});
		}
	};
	
	return Sdk;		//把定义好的构造函数Sdk返回给 groupChat.Sdk
})();

/*
 * 群聊主要逻辑，登录状态判断，加群状态判断，调用sdk操作，初始化html，绑定事件，操作html显示消息等
 * 2016-06-16
 * dengyang
 * 
 * groupChat.Chat.init(groupChatBox,userID,communityID,chatID,joinState,loginState);
 * groupChatBox, //加载群聊的div,css路径形式，如：#qunliaoBox
 * userID,		 //用户ID
 * communityID,  //社群ID
 * chatID,       //群聊ID
 * joinState,	 //用户在社群中的状态
 * loginState    //是否登录
 */
groupChat.Chat={
	init:function(groupChatBox,userID,communityID,chatID,joinState,loginState){
		this._groupChatBox=groupChatBox;  //加载群聊的div,css路径形式，如：#qunliaoBox
		this.userID=userID;  //用户ID
		this.communityID=communityID;  //社群ID
		this.chatID=chatID;  //群聊ID	
		this.joinState=joinState;  //用户在社群中的状态
		this.loginState=loginState;  //是否登录
		this.creatorID=creator;  //群主ID
		
		this._communityName='.community_name';  //社群名称div
		this.defaultAvatar='/images/groupChat/defaultAvatar.png';
		this.defaultLink='/images/groupChat/defaultLink.png';
		this.appKey='';  //云信appKey
		this.userToken='';  //用户登录云信的token
		this.communityName=groupChat.Util.getCommunityName(this._communityName);//获取社群名称
		
		this.data = groupChat.Data;  //存储和传递所有数据
		this.data.curUser={  //传递本次初始化用到的基本数据
			groupChatBox: this._groupChatBox,
			userID: this.userID,
			communityID: this.communityID,
			chatID: this.chatID,
			joinState :this.joinState,
			loginState: this.loginState,
			communityName: this.communityName,
			defaultAvatar:this.defaultAvatar,
			defaultLink:this.defaultLink,
			creatorID:this.creatorID
		};
		
		this.initDomNode();  //初始化各类需要用的dom节点
		this.initBaseHtml();  //初始化各类需要加载的静态html
		this.loadBaseHtml();  //加载各个区域的静态html
		this.initSdkLoadChat();  //判断是否登录，是则获取appkey和token，判断是否加入社群，是则初始化云信sdk
		this.addEvent();  //初始化添加绑定dom事件
		//如果是已经加入社群了的话，就需要去掉
		if(this.joinState==2){
			$(this._sendMsgTextarea).removeAttr('readonly');
		}
	},
	initDomNode:function(){
		this._groupChat='.dy_groupchat';  //群聊最外层div
		this._showMsgBox='.dy_gc_showmsg';  //显示消息div
		this._blankMsg='.dy_gc_sm_msgblank'; //空消息一条用来占位
		this._sendMsgBox='.dy_gc_msgsend';  //发送消息div
		this._sendMsgTextarea='#dy_gc_ms_msgtextarea';  //填写消息的文本区域
		this._sendBigMsgTextarea='#dx_gc_big_msgtextarea';  //弹窗填写消息的文本区域
		this._sendMsgBtn='#dx_gc_fs_btn';  //发送消息的按钮
		this._cancelMsgBtn='#dx_gc_qx_btn';  //取消消息的按钮
		this._popLoginTips='#dy_gc_poptips_logintips';  //弹窗跳转登录div
		this._popJoinTips='#dy_gc_poptips_jointips';  //弹窗加入社群div
		
		this._popEntryTips='#dx_gc_entry_tips';  //弹窗聊天输入div
		this._popLoginTipsClose='#dy_gc_pt_bt_iconclose_login';  //关闭跳转登录弹窗的图标
		this._popJoinTipsClose='#dy_gc_pt_bt_iconclose_join';  //关闭加入社群弹窗图标
		this._popLoginTipsBtn='#dy_gc_pt_bt_btn_login';  //弹窗中触发跳转登录的按钮
		this._popJoinTipsBtn='#dy_gc_pt_bt_btn_join';  //弹窗中触发加入社群的按钮
	},
	initBaseHtml:function(){
		//网页版群聊所需要加载的css文件
		this.groupChatLinkCss = '<link rel="stylesheet" type="text/css" href="/css/groupChat/groupChat.css"/>';
		//群聊最外层div
		this.groupChatHtml = '<div class="dy_groupchat"></div>';
		//群聊消息显示区域最上方打开app的提示条
		this.topTipsOpenAppHtml = [
				'<div class="dy_gc_topopenapp">',
					'<div class="dy_gc_toa_tipstext">',
						'<p class="dy_gc_toa_tt_p">欢迎来到【'+this.communityName+'】，打开掌门APP，聊天互动更流畅</p>',
					'</div>',
					'<a class="dy_gc_toa_a" '+groupChat.Util.openZhangmenAppLink+'>',
						'<div class="dy_gc_toa_a_openbtn">立即打开</div>',
					'</a>',
				'</div>'
		          			  ].join('');
		//显示消息区域
		this.showMsgHtml = '<div class="dy_gc_showmsg"><div class="dy_gc_showmsg_blanktopopenapp"></div><div class="dy_gc_sm_msgblank"></div></div>';
		
		var tip = "我也来聊两句吧";
		if(this.joinState == 4){
			tip = "已申请待审核，审核通过即可聊天";
		}
		//发送消息区域
		this.sendMsgHtml = [
				'<div class="dy_gc_showmsg_blankmsgsend"></div>',
				'<div class="dy_gc_msgsend">',
					'<textarea class="dy_gc_ms_msgtextarea" id="dy_gc_ms_msgtextarea" name="" rows="1" maxlength="130" placeholder="'+tip+'" readonly="readonly" contenteditable="true"></textarea>',
					'<div class="dy_gc_ms_msgsendbtn" id="dy_gc_ms_msgsendbtn" disabled="disabled">发送</div>',
				'</div>'
					     ].join('');
		//获取群主信息，并组合出进入群聊后看到的第一条默认消息的html
		this.defaultMsgHtml='';
		//跳转到登录的弹窗
		this.gotoLoginHtml =[
				'<div class="dy_gc_poptips" id="dy_gc_poptips_logintips">',
					'<div class="dy_gc_pt_bottomtips">',
						'<p class="dy_gc_pt_bt_text">登录后即可加群聊天哦</p>',
						'<img class="dy_gc_pt_bt_iconclose" id="dy_gc_pt_bt_iconclose_login" src="/images/groupChat/iconClose.png"/>',
						'<div class="dy_gc_pt_bt_btn" id="dy_gc_pt_bt_btn_login">掌门账号登录</div>',
					'</div>',
				'</div>'
		       		       ].join('');
		//跳转加入社群的弹窗
		this.joinCommunityHtml =[
				'<div class="dy_gc_poptips" id="dy_gc_poptips_jointips">',
					'<div class="dy_gc_pt_bottomtips">',
						'<p class="dy_gc_pt_bt_text">加入社群即可聊天</p>',
						'<img class="dy_gc_pt_bt_iconclose" id="dy_gc_pt_bt_iconclose_join" src="/images/groupChat/iconClose.png"/>',
						'<div class="dy_gc_pt_bt_btn" id="dy_gc_pt_bt_btn_join">加入社群</div>',
					'</div>',
				'</div>'
		           		       ].join('');
		//聊天输入的弹窗
		this.groupChatEntryHtml =[
				'<div class="dx_gc_entry_tips" id="dx_gc_entry_tips">',
					'<div class="dx_gc_fs_tips">',
						'<textarea class="dx_gc_big_msgtextarea" id="dx_gc_big_msgtextarea" name="" rows="1" maxlength="130" placeholder="'+tip+'" contenteditable="true"></textarea>',
						'<div class="dx_gc_btns" id="dx_gc_btns">',
						'<a id="dx_gc_qx_btn">取消</a><a id="dx_gc_fs_btn">发送</a>',
						'</div>',
					'</div>',
				'</div>'
		           		       ].join('');
	},
	loadBaseHtml:function(){
		if(!$(this._groupChat).length){	//如果已经有_groupChat这个div，则不再加载，只运行一下计算div高度的方法resetShowMsgBoxCss
			this.loadGroupChatCss();	//加载群聊css
			this.loadGroupChatBox();	//加载群聊最外层div
			this.loadTopTipsOpenApp();	//加载顶部提示下载的小条
			this.loadShowMsgBox();	//加载显示消息div
			this.loadSendMsgBox();	//加载发送区域html
			var curThis = this;
			setTimeout(function(){
				curThis.resetShowMsgBoxCss();	//计算div的高度，并赋值
			},100);
			this.loadDefaultMsg();	//加载第一条默认消息
			this.loadGotoLoginDiv();	//加载跳转登录的弹窗
			this.loadJoinCommunityDiv();	//加载加入社群的弹窗
			this.loadGroupChatEntryDiv();   //加载群聊输入窗口
		}else{
			this.resetShowMsgBoxCss();
		}
	},
	loadGroupChatCss:function(){
		$('head').append(this.groupChatLinkCss);
	},
	loadGroupChatBox:function(){
		$(this._groupChatBox).html(this.groupChatHtml);
	},
	loadTopTipsOpenApp:function(){
		$(this._groupChat).append(this.topTipsOpenAppHtml);
	},
	loadShowMsgBox:function(){
		$(this._groupChat).append(this.showMsgHtml);
		/**2016-9-13 duxin  社群名称过长时重置高度**/
		//分享的群主也第一次点进去群聊天的时候，第一条信息部分被上面的下载App的提示div遮盖住 lixiaohe 2016-9-20 setTimeout
		setTimeout(function(){
			$('.dy_gc_showmsg_blanktopopenapp').css({'height':$('.dy_gc_topopenapp').outerHeight(true)+'px',"min-height":"1.2267rem"});
		},1000);
	},
	loadSendMsgBox:function(){
		$(this._groupChat).append(this.sendMsgHtml);
	},
	resetShowMsgBoxCss:function(){	//计算div的高度，并赋值的方法
		var gBox = $(this._groupChat);
		var windowHeight = $(window).height();
		var groupChatOffsetTop =gBox.offset().top;
		var groupChatHeight = windowHeight - groupChatOffsetTop;
		gBox.attr("data-height",groupChatHeight);
		gBox.height(groupChatHeight);
		
		//console.log('window 的高度是：', windowHeight);
		//console.log('groupChatBox 距离页面顶部的距离：', groupChatOffsetTop);
		//console.log('groupChatBox 的高度应该是：', groupChatHeight);
		
		var sBox = $(this._sendMsgBox);
		var mBox = $(this._showMsgBox);
		//var showMsgBoxOffsetTop = mBox.offset().top;
		var sendMsgBoxHeight = sBox.height();
		var showMsgBoxHeight = groupChatHeight -sendMsgBoxHeight;
		mBox.attr("data-height",showMsgBoxHeight);
		mBox.height(showMsgBoxHeight);
		
		//console.log('');
		//console.log('window 的高度是：', windowHeight);
		//console.log('showMsgBox 距离页面顶部的距离：', showMsgBoxOffsetTop);
		//console.log('sendMsgBox 的高度是：', sendMsgBoxHeight);
		//console.log('showMsgBox 的高度应该是：', showMsgBoxHeight);
	},
	loadDefaultMsg:function(){	//组合第一条默认消息并显示到showmsg div中
		/*
		var type='textmsg';
		var curMsgId = 'gaiay-'+new Date();	//创造一个当前消息id，传给组合消息html的函数
		var link='#';
		var avatar=this.defaultAvatar;
		var username='群主昵称';
		var authstate=3;
		var company='该亚中国';
		var position='程序员';
		var curMsgHtml='欢迎来到'+this.communityName+'，<a class="dy_gc_sm_mo_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>打开掌门app</a>，有更多新鲜又好玩的彩蛋等着你发现哦！^_^';
		this.defaultMsgHtml+=groupChat.Html.otherMsgContent(curMsgId,type,link,avatar,username,authstate,company,position,curMsgHtml);
		$(this._blankMsg).before(this.defaultMsgHtml);
		$(this._showMsgBox).scrollTop(999999999);
		*/
		var liveState=0;
		var curThis = this;
		//调用其他js方法获取群主名片信息，//该方法位于 /js/circle/community_share.js
		window.circleS.shareErInfo(this.creatorID, liveState, function(data, liveState){
			var type='textmsg';	//文本消息标识
			var curMsgId = 'gaiay-'+new Date();	//创造一个当前消息id，传给组合消息html的函数
			var link=groupChat.Util.getCardInfoLink(data.accountDetail.id);
			var avatar=data.accountProfile.logo;
			if(avatar==''){
				avatar=curThis.defaultAvatar;
			}
			var username = data.accountProfile.name;
			var authstate = data.accountProfile.authState;
			var company = data.accountProfile.company;
			var accountId = data.accountProfile.id;
			if(!company){
				company=' ';
			}
			var position=data.accountProfile.position;
			if(!position){
				position=' ';
			}
			var curMsgHtml='欢迎来到'+curThis.communityName+'，<a class="dy_gc_sm_mo_mcb_tmc_a" '+groupChat.Util.openZhangmenAppLink+'>打开掌门app</a>，有更多新鲜又好玩的彩蛋等着你发现哦！^_^';
			curThis.defaultMsgHtml+=groupChat.Html.otherMsgContent(curMsgId,type,link,avatar,username,authstate,company,position,curMsgHtml, accountId);
			$(curThis._blankMsg).before(curThis.defaultMsgHtml);	//使用在默认的空白消息之前加入消息的 brfore
			$(curThis._showMsgBox).scrollTop(999999999);	//加载消息后，让消息div滚动到最底部
		});
	},
	loadGotoLoginDiv:function(){
		$('body').append(this.gotoLoginHtml);
	},
	loadJoinCommunityDiv:function(){
		$('body').append(this.joinCommunityHtml);
	},
	loadGroupChatEntryDiv:function(){
		$('body').append(this.groupChatEntryHtml);
	},
	joinGroupChat:function(){	//加入群聊的方法
		var groupChatMemberInfo=groupChat.Util.groupChatMember(this.communityID,this.userID);
		//console.log('groupChatMemberInfo是：',groupChatMemberInfo);
		if(groupChatMemberInfo && groupChatMemberInfo.code==0){	//如果data.code==0，则加入群聊成功
			return true;
		}else if(groupChatMemberInfo.code==50003){	//如果data.code==50003，代表用户不是该社群的成员
			if(this.loginState && this.userID){
				this.showJoinCommunityDiv();
			}else{
				this.showLoginTipsDiv();
			}
		}else{
			return false;
		}
	},
	initSdkLoadChat:function(){		//初始化群聊后，第一次判断用户状态，如果判断通过则初始化群聊的操作。
		if(this.loginState && this.userID){
			var appkeyTokenInfo = groupChat.Util.readAppkeyToken();
			if(appkeyTokenInfo && appkeyTokenInfo.code==0){
				this.appKey = appkeyTokenInfo.result.yunAppkey;
				this.userToken = appkeyTokenInfo.result.password;
				this.data.curOptions={
					appKey: this.appKey,
					userID: this.userID,
					userToken: this.userToken,
				};
				if(this.appKey&&this.userID&&(this.joinState==2||this.joinState==3)){
					this.mynim = new groupChat.Sdk(this);
				}
			}
		}
	},
	gotoConfirmLogin:function(){	//用户点击输入框后，判断用户状态进行相应操作：去登陆，去加入社群
		if(!this.loginState){
			//console.log('用户登录状态为：用户未登录！');
			this.showLoginTipsDiv();
		}else{
			if(!this.userID){
				//console.log('没有userID，用户未登录！');
				this.showLoginTipsDiv();
			}else{
				var appkeyTokenInfo = groupChat.Util.readAppkeyToken();
				if(appkeyTokenInfo==null){
					//console.log('Appkey Token 接口获取失败！');
					this.showLoginTipsDiv();
				}else if(appkeyTokenInfo.code==12001){
					//console.log('Appkey Token 接口获取用户未登录！');
					this.showLoginTipsDiv();
				}else if(appkeyTokenInfo.code==0){
					if(this.joinState==1){
						this.showJoinCommunityDiv();
					}else if(this.joinState==2){
						//$(this._sendMsgTextarea).removeAttr('readonly');
						//$(this._sendMsgTextarea).focus();
					}else if(this.joinState==3){
						this.silenceStateAction();
					}else if(this.joinState==4){
						this.auditingStateAction();
					}else{
						return false;
					}
				}
			}
		}
	},
	showLoginTipsDiv:function(){
		$(this._popLoginTips).show();
	},
	showJoinCommunityDiv:function(){
		$(this._popJoinTips).show();
	},
	hideLoginTipsDiv:function(){
		$(this._popLoginTips).hide();
	},
	hideJoinCommunityDiv:function(){
		$(this._popJoinTips).hide();
	},
	jumptoLoginPage:function(){
		groupChat.Util.jumptoLoginPage();
		$(this._popLoginTips).hide();
	},
	jumptoJoinCommunity:function(){
		groupChat.Util.jumptoJoinCommunity();
		$(this._popJoinTips).hide();
	},
	checkJoinCommunity:function(joinState){	//检查用户是否加入社群，如果加入社群则执行再次初始化群聊js 的操作。该方法会在 /js/circle/community_share.js中的加入社群的ajax请求中调用。
		if(joinState == 2){
			this.disSilenceStateAction();
			this.init(this._groupChatBox,this.userID,this.communityID,this.chatID,joinState,this.loginState);
		}else if(joinState == 4){
			this.auditingStateAction();
		}
	},
	silenceStateAction:function(){	//用户被禁言操作
		alert('你已经被禁言，暂时不能发消息');
		this.joinState=3;
		$(this._sendMsgTextarea).val('');
		$(this._sendMsgTextarea).attr('readonly','readonly');
		$(this._sendMsgTextarea).attr('placeholder','你已被禁言');
	},
	disSilenceStateAction:function(){	//用户被解除禁言的操作
		//alert('你已经解除禁言，可以正常发消息!');
		this.joinState=2;
		$(this._sendMsgTextarea).val('');
		$(this._sendMsgTextarea).removeAttr('readonly');
		$(this._sendMsgTextarea).attr('placeholder','我也来聊两句吧');
	},
	removeTeamAction:function(){	//用户被移除群的操作
		//alert('你已被群主移出群!');
		this.joinState=1;
		$(this._sendMsgTextarea).val('');
		$(this._sendMsgTextarea).attr('readonly','readonly');
		$(this._sendMsgTextarea).attr('placeholder','你已被群主移出群');
	},
	auditingStateAction:function(){
		//alert('你已经申请加入此社群，审核通过即可聊天!');
		this.joinState=4;
		$(this._sendMsgTextarea).val('');
		$(this._sendMsgTextarea).attr('readonly','readonly');
		$(this._sendMsgTextarea).attr('placeholder','已申请待审核，审核通过即可聊天');
	},
	btnSendMsgEvent:function(e){	//发送按钮来发送消息的操作
		if(!e){
			e = window.event;
		}
		
		$(this._sendBigMsgTextarea).focus().select();
		if(this.joinState==2){
			this.sendTextMessage();
		}else if(this.joinState==3){
			this.silenceStateAction();
		}
		
		//发送按钮增加阻止事件冒泡
		groupChat.Util.stopBubble(e);
		return false;
	},
	enterSendMsgEvent:function(e) {	//回车按钮发送消息
		if(!e){
			e = window.event;
		}
		if (e.keyCode == 13){
			this.btnSendMsgEvent();	
			//这里是阻止回车默认事件，设置按回车不换行
			groupChat.Util.stopBubble(e);
			return false;
		}
	},
	closeBtnSendMsgEvent:function(e){//取消关闭聊天输入窗口
		$(this._sendBigMsgTextarea).val('');
		$(this._popEntryTips).hide();
	},
//	sendMsgBtnActive:function(e) {	//输入后，发送按钮改变状态，文本框改变颜色
//		if ($(this._sendMsgTextarea).val() == '') {
//			$(this._sendMsgTextarea).css('color','rgb(160,160,160)');
//			$(this._sendMsgBtn).removeClass('isactive').attr('disabled', 'disabled');
//		} else {
//			$(this._sendMsgTextarea).css('color','rgb(32,32,32)');
//			$(this._sendMsgBtn).addClass('isactive').removeAttr('disabled');
//		}
//	},
	showCurCustomMsgDom:function(customMsg){	//自定义系统消息解析并执行相关操作。
		//alert("自定义消息接收：customMsgType="+customMsg.type);
		if(customMsg.type=='custom'){
			var content = JSON.parse(customMsg.content);
			var systemType = content.type.toString().substring(0,3);
			if(systemType == 120){// 社群业务
	        	if(content.type == 1201){// 禁言
	        		if(content.data.circleId == this.communityID && content.data.userId == this.userID){
	        			this.silenceStateAction();
	        		}
	        	}else if(content.type == 1202){// 取消禁言
	        		if(content.data.circleId == this.communityID && content.data.userId == this.userID){
	        			this.disSilenceStateAction();
	        		}
	        	}
	        }else if(systemType == 130){// 商城业务
	        	//alert("商品推送消息接收成功：cirlceId="+content.data.circleId);
	        	if(content.data.circleId && content.data.circleId == this.communityID){
		        	//小banner商品推送消息调用其他js的方法，该方法位于 /js/mall/pushMallNews.js
	        		window.pushBanner.mallMessageListenner(content.type, content.data);
	        	}
	        }
	    }
	},
	showCurMsgDom:function(){
		var msgHtml = groupChat.Html.getCurMsgHtml(this.data,this.mynim);
	},
	showMsgToBox:function(msgHtml){
		//console.log('收到的消息是:',msgHtml);
		$(this._blankMsg).before(msgHtml);
		$(this._showMsgBox).scrollTop(999999999);
	},
	sendTextMessage:function(){		//调用Sdk上的方法来发送消息
		var msgtext = $(this._sendBigMsgTextarea).val();
		if (msgtext == '') {
			return;
		}
		var pushPayloadJson = {'type':1,'from':this.data.curUser.chatID};	//因ios需求，需要增加发送消息的推送标识
		var pushPayload = JSON.stringify(pushPayloadJson);//转化成字符串，因为需要发送的格式是字符串
		var isPushable = true;
		//console.log('发送消息中，pushPayload的值是：',pushPayload,isPushable);
		this.mynim.sendTextMessage('team',this.chatID,msgtext,pushPayload,isPushable,this.sendMsgDone.bind(this));
	},
	sendMsgDone:function(error, msg) {	//发送完成后的回调，改变文本框内容为空，改变发送按钮为灰色状态
		//console.log('发送消息的错误：',error);
		//console.log('发送的消息对象',msg);
		//console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
		$(this._sendBigMsgTextarea).val('');
		$(this._sendBigMsgTextarea).blur();
		$(this._popEntryTips).hide();
		//$(this._sendMsgBtn).removeClass('isactive').attr('disabled', 'disabled');
	},	
	textareaOnfocus:function(){	//点击文本框弹起输入框后，改变群聊显示样式
		if(this.joinState == 2){
			var gBox = $(this._groupChat);
			var mBox = $(this._showMsgBox);
			var sBox = $(this._sendMsgBox);
			$(this._popEntryTips).show();
			$(this._sendBigMsgTextarea).focus().select();
			
			if($.os.ios){	//判断是否是 iPhone或者ipad，该方法位于/js/twoC-Plug.js
				//触发焦点事件时，需要重新计算一下群聊的高度
				//var wHeight = $(window).height();
//				var sBoxHeight = sBox.height();
//				
//				gBox.height(wHeight);
//				mBox.height(wHeight - sBoxHeight);
				
				//gBox.css({'position':'fixed','top':'0px','bottom':'1.1733rem','z-index':'9999999','background':'rgba(235,235,235,0.8)'});
				//尝试解决iPhone搜狗输入法顶不起来群聊div的问题
				//gBox.css({'position':'fixed','bottom':'0px','z-index':'9999999','background':'rgba(235,235,235,0.8)'});
				//ios弹起群聊内容时，再绑定blur事件，为了用户点击键盘上完成按钮时，可以触发失去焦点的动作
				//$(this._sendMsgTextarea).off('blur').on('blur', this.textareaOnblur.bind(this));
				
			}else{
				//sBox.css({'position':'fixed','bottom':'0px','z-index':'9999999'});
				//mBox.css({'position':'fixed','bottom':'1.1733rem','z-index':'9999999','background':'rgba(235,235,235,0.8)'});
				
				$('#video').css('display','none');//安卓上隐藏视频
				
				//$('#myVideo').css('display','none');
				
			}
			
			//当触发输入框的焦点事件时需要把tab导航和引导下载的文案隐藏掉,不需要隐藏，隐藏后如果无法触发再显示出来会出问题。
			//$("#circle_contentNav").hide();
			//$(".dy_gc_topopenapp").hide();
		}else{
			 this.gotoConfirmLogin();	//验证用户登录加入社群的状态
		}
	},
	textareaOnblur:function(){	//收起键盘后，恢复群聊显示样式
		var gBox = $(this._groupChat);
		var mBox = $(this._showMsgBox);
		var sBox = $(this._sendMsgBox);
		
		if($.os.ios){
			//设置群聊容器的高度
//			var gChatHeight = gBox.attr("data-height");
//			gBox.height(gChatHeight);
//			//设置群聊聊天信息的高度
//			var mHeight = mBox.attr("data-height");
//			mBox.height(mHeight);
//			
//			//gBox.css({'position':'relative','bottom':'0px','z-index':'','background':'rgb(235,235,235)'});
//			//ios收起群聊div时，取消绑定blur事件
//			$(this._sendMsgTextarea).off('blur');
			
		}else{
			//sBox.css({'position':'absolute','bottom':'0px','z-index':''});
			//mBox.css({'position':'relative','bottom':'0px','z-index':'','background':'rgb(235,235,235)'});
			
			$('#video').css('display','inline');//安卓上显示视频，开始播放
			$('#video').play();
//			$(this._sendMsgTextarea).blur();
			
			//$('#myVideo').css('display','block');
			//$('#myVideo').play();
		}
		
		//当触发滑动事件时需要把tab导航和引导下载的文案显示出来,没隐藏不需要显示
		//$("#circle_contentNav").show();
		//$(".dy_gc_topopenapp").show();
		//当触发滑动事件时需要收起键盘，所以把焦点给打赏按钮了
		$(this._sendMsgTextarea).blur();
		$(".daShangBtn").focus().select();
	},
	addEvent:function(){
		//点击事件和滑动事件都可以收起消息遮罩层,取消点击事件触发，点击、触摸事件会在ios造成页面跳动。2016-6-28
//		if($.os.ios){	//如果是ios，则增加滑动收起群聊，否则改为文本框失去焦点收起群聊
//			$(this._showMsgBox).off('touchmove').on('touchmove', this.textareaOnblur.bind(this));
//			//解决IOS收键盘（点击键盘  完成 ）时，下载app提示条消失，消息显示区域空白
//			//这行代码写到this.textareaOnfocus函数中$.os.ios判断中
//			//$(this._sendMsgTextarea).off('blur').on('blur', this.textareaOnblur.bind(this));
//		}else{
//			//$(this._showMsgBox).off('click').on('click', this.textareaOnblur.bind(this));
//			$(this._sendMsgTextarea).off('blur').on('blur', this.textareaOnblur.bind(this));
//		}
		$(this._sendMsgBox).off('click').on('click', this.textareaOnfocus.bind(this));	//点击文本框时，执行弹起群聊区域的动作
		$(this._sendBigMsgTextarea).off('keydown').on('keydown', this.enterSendMsgEvent.bind(this));	//按回车换行键时，执行发送消息操作
		//$(this._sendMsgTextarea).off('keyup').on('keyup', this.sendMsgBtnActive.bind(this));	//文本框有内容时，键盘按键，则改变按钮和文本框状态
		//$(this._sendMsgTextarea).off('input').on('input', this.sendMsgBtnActive.bind(this));   //文本框输入内容时，则改变按钮和文本框状态
		//不需要绑定click事件，直接在获取焦点的时候判断一下走那个分支即可
		//$(this._sendMsgTextarea).off('click').on('click', this.gotoConfirmLogin.bind(this));	//点击文本框则验证用户登录加入社群的状态
		$(this._sendMsgBtn).off('touchend click').on('touchend click', this.btnSendMsgEvent.bind(this));	//点击发送按钮后执行发送消息操作
		$(this._cancelMsgBtn).off('click').on('click', this.closeBtnSendMsgEvent.bind(this));	//点击取消按钮消失聊天输入窗口
		$(this._popJoinTipsClose).off('click').on('click', this.hideJoinCommunityDiv.bind(this));	//点击加入社群弹层的关闭图标，则关闭加入社群弹层
		$(this._popLoginTipsClose).off('click').on('click', this.hideLoginTipsDiv.bind(this));	//点击跳转登录弹层的关闭图标，则关闭跳转登录弹层
		$(this._popLoginTipsBtn).off('click').on('click', this.jumptoLoginPage.bind(this));	//点击跳转登录弹层上的按钮，则执行跳转登录操作
		$(this._popJoinTipsBtn).off('click').on('click', this.jumptoJoinCommunity.bind(this));	//点击加入社群弹层上的按钮，则执行加入社群操作
	}
};
