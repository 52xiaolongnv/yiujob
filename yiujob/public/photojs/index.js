var app = angular.module('app',['ui.router','angular-iscroll','sticky','ngAnimate']);
// 初始化
app.run(function ($rootScope,$location,$http,myswiper,$timeout,quyu_json,region_json,all_work,remenfenlei_data,xinzi) {
	

	//根据路由变化,包含重新刷新幻灯片
	$rootScope.$on('$locationChangeStart',function(){
		if ($location.search().city!=undefined) {
			

			console.log('read')
			region_json(function (callback) {
				$rootScope.my_city_name = callback[$location.search().zimu].list[$location.search().city];
				quyu_json(callback[$location.search().zimu].list[$location.search().city].code,function (callback) {
	            	$rootScope.two_quyu = callback
	            	$location.search().quyu=='null'?$rootScope.quyu='': $rootScope.quyu=callback[$location.search().quyu].name;
	            })
			})
			$location.search().jobcontent=='null'?$rootScope.jobcontent='':$rootScope.jobcontent=remenfenlei_data[$location.search().job].industry_list[$location.search().jobcontent];
			$location.search().xinzi=='null'?$rootScope.pay='':$rootScope.pay=xinzi[$location.search().xinzi];
			
			if ($rootScope.oldzimu!=$location.search().zimu||$rootScope.oldcity!=$location.search().city) {
				$rootScope.oldzimu = $location.search().zimu;
				$rootScope.oldcity = $location.search().city;
				//更换城市后重新拉数据
				all_work(function (callback) {
					$rootScope.all_work = callback;
				})

			}    
		}else{
				$rootScope.oldzimu = 16;
				$rootScope.oldcity = 2;
				$location.search({zimu:16,city:2,job:'null',jobcontent:'null',quyu:'null',xinzi:'null'})
				region_json(function (callback) {
					$rootScope.my_city_name = callback[16].list[2];
					$rootScope.my_city_number = callback[16].list[2].code;
				})
				//初始化城市的区域栏，默认深圳
				quyu_json(4403,function (callback) {
					
					$rootScope.two_quyu = callback;
					$location.search().quyu=='null'?$rootScope.quyu='': $rootScope.quyu=callback[$location.search().quyu].name;
				})
				$location.search().jobcontent=='null'?$rootScope.jobcontent='':$rootScope.jobcontent=remenfenlei_data()[$location.search().job].industry_list[$location.search().jobcontent];
				$location.search().xinzi=='null'?$rootScope.pay='':$rootScope.pay=xinzi[$location.search().xinzi];
				all_work(function (callback) {
					$rootScope.all_work = callback;
				})
		}
		// alert('变化了')
/*	$rootScope.$on('$locationChangeSuccess',function () { 
		if ($location.search().city!=undefined) {
			console.log('yes')
		}else{console.log('no')}
	})*/
	if ($location.path()=='/home'||'/recruit' ) {
	    	setTimeout(function () {
				myswiper();
			},500)
			$location.path()  =='/recruit'?$rootScope.Upper = true:$rootScope.Upper = false;
    	}


	})

	$rootScope.Auto_Location = '重新定位'//如果客户端不支持，则显示手动选择位置
	$rootScope.menu_state = false;//菜单显示控制
	$rootScope.sousuo_state = false;//搜索框伸缩显示
	//热门分类三角方向以及显示隐藏的部分(根据数字显示)
	$rootScope.show_remenfenlei = null;
	//热门分类-查看更多或收起全部的按键中文显示
	$rootScope.remenfenlei_show_hidden = '查看更多';
	//热门分类-点击查看更多或收起全部按钮后的事件
	$rootScope.remenfenlei_show_hidden_box = false;
	//选择城市
	$rootScope.City_Selection=false;
	//我的城市
	// $rootScope.my_city_name = {"zip":"0755","name":"深圳"};
	$rootScope.mytop_city_name = {"name":"选择城市"};
	//显示返回上一级三角符号
	$rootScope.Upper = false;
	//渲染后加载幻灯片等
/*	window.onload = function() {
		setTimeout(function () {
			myswiper();	
		},200)
		
	}*/

	window.addEventListener( "load", function() {
	    FastClick.attach( document.body );
	}, false );

	//招聘板块的导航栏在滚动到一定位置时开启fixed模式
	$rootScope.nav_fixed=false;

	 

	
	
	
	
})
// 滚动条
app.config(function(iScrollServiceProvider) {
    // Supply a default configuration object, eg:
    iScrollServiceProvider.configureDefaults({
        iScroll: {
            // Passed through to the iScroll library
            scrollbars: true,
            fadeScrollbars: true,
            // click:true,//启用允许默认点击
            taps:true//启用允许标签a点击
        },
        directive: {
            // Interpreted by the directive
            refreshInterval: 500,
            onScrollEnd:function () {
            	console.log(this.x)
            	console.log(this.y)
            }
        }
    });
});

//路由
app.config(function($stateProvider,$urlRouterProvider){
	
	$stateProvider
		.state('home', {
	    	url:"/home?city&job&jobcontent ",
	    	templateUrl:'photo-view/home.html',
	    	controller:'homepage'
    	})
		.state('Recruit', {
	    	url:"/recruit?zimu&city&job&jobcontent&quyu&xinzi&jingyan&xueli",
	    	
			templateUrl:'photo-view/Full-time.html',
			controller:'full_time'
	    						
    	})
    	$urlRouterProvider.otherwise('/home');
})

//城市版块用的ISCROLL
app.factory('city_iscroll',function ($rootScope) {


	function updatePosition () {
		console.log(this.y>>0)
		if (this.y>100) {alert('刷新哦');$rootScope.city_onebox_Scroll.refresh()}
	}

	return function() {

		$rootScope.city_onebox_Scroll = new IScroll('#city_onebox', { 
					probeType: 1, mouseWheel: true,
		            // click:true,//启用允许默认点击
		            taps:true//启用允许标签a点击
	             });

		$rootScope.city_onebox_Scroll.on('scroll', updatePosition);
		// $rootScope.city_onebox_Scroll.on('scrollEnd', updatePosition);
	}

/*	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
		capture: false,
		passive: false
	} : false);*/

})

//所有工作的数据
app.factory('all_work',function ($http) {
	return function (callback) {
		$http.post('/all_work').then(function (response) {
			callback(response.data)
		})
	}
})



//定位用的
app.factory('Location',function ($http,$rootScope) {
	return function(callback) {  
		if (navigator.geolocation) {  
			navigator.geolocation.getCurrentPosition(
				//获取位置信息成功  
				function(position) { 

				$rootScope.latitude = position.coords.latitude;  
				$rootScope.longitude = position.coords.longitude;
				callback($rootScope.latitude+$rootScope.longitude)  
				// var myGeo = new BMap.Geocoder();  
				//根据坐标得到地址描述      
				$rootScope.getGeo();  
				},
				//获取位置信息失败  
				function(error) { 
					switch (error.code) {  
					case error.PERMISSION_DENIED:  
					console.log("请打开设备定位功能！");
					$rootScope.Auto_Location = '定位失败,手动选择'; 
					break;  
					case error.POSITION_UNAVAILABLE:  
					console.log("定位信息不可用！"); 
					$rootScope.Auto_Location = '定位失败,手动选择'; 
					break;  
					case error.TIMEOUT:  
					console.log("定位请求超时！");
					$rootScope.Auto_Location = '定位失败,手动选择';  
					break;  
					case error.UNKNOWN_ERROR:  
					console.log("未知错误！"); 
					$rootScope.Auto_Location = '定位失败,手动选择'; 
					break;  
					}  
				},
					{  
					        // 指示浏览器获取高精度的位置，默认为false  
					        enableHighAccuracy: true,  
					        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
					        timeout: 5000,  
					        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
					        maximumAge: 3000  
					    });  
					} else {  
					$rootScope.showAlert("您的设备不支持GPS定位！");  
					}  
					};
	


})

//轮播用的
app.factory('myswiper',function () {
	return function () {
		new Swiper('.slide_onebox', {
				// 如果需要分页器
			pagination: '.slide_pagination',
			// 如果需要前进后退按钮
			// nextButton: '.swiper-button-next',
			// prevButton: '.swiper-button-prev',

			slidesPerView: 1,
			spaceBetween: 0,
			// paginationClickable: true,//分页点击：真实，
			centeredSlides: true,//居中幻灯片：真实，
			loop: true,//循环：真的，
			autoplay: 3000,//设置轮播间隔
			autoplayDisableOnInteraction: false,//自动播放禁用交互：假，当滑动过后仍然会自动播放
			observer:true,//修改swiper自己或子元素时，自动初始化swiper
	    	observeParents:true//修改swiper的父元素时，自动初始化swiper
			})

	
		new Swiper('.nav_onebox', {
	        pagination: '.nav_pagination',
	        slidesPerView: 4,
	        slidesPerColumn: 2,
	        slidesPerGroup: 4,
	        paginationClickable: true,
	        spaceBetween: 30
	    	});

		new Swiper('.enterprise_list_onebox', {
	        pagination: '.nav_pagination',
	        slidesPerView: 4,
	        slidesPerColumn: 2,
	        slidesPerGroup: 4,
	        paginationClickable: true,
	        spaceBetween: 30
	    	});
	}
})
//热门分类数据
app.factory('remenfenlei_data',function () {
	var data = [
				{"id":0,"industry":"销售","industry_list":["销售代表","电话销售","销售经理","销售总监","汽车销售","医药销售","器械销售","网络销售","区域销售","客户经理","销售顾问"]},
				{"id":1,"industry":"司机","industry_list":["商务司机","客车司机","货车司机","出租车司机","班车司机","驾校教练","带车司机"]},
				{"id":2,"industry":"客服","industry_list":["客服专员","电话客服","客服经理","售后服务","客户关系","客服总监"]},
				{"id":3,"industry":"餐饮类","industry_list":["厨师","服务员","传菜员","面点师","洗碗工","后厨","杂工","学徒","咖啡师","茶艺师","迎宾"]},
				{"id":4,"industry":"互联网","industry_list":["产品经理","程序员","产品运营","页面设计","技术专员","软件工程师","游戏设计vv","测试工程师","项目经理","运维工程师","技术支持","硬件工程师","系统工程师","通信工程师","数据工程师"]},
				{"id":5,"industry":"技工/工人","industry_list":["普工","电工","木工","钳工","焊工","钣金工","锅炉工","油漆工","缝纫工","维修工","水暖工","车工","叉车工","手机维修","电梯工","操作工","包装工","水泥工","钢筋工","纺织工","管道工","样衣工","装卸工"]},
				{"id":6,"industry":"超市/销售","industry_list":["促销导购","营业员","收银员","理货员","食品加工","品类管理","店长"]},
				{"id":7,"industry":"贸易/采购","industry_list":["外贸专员","外贸经理","采购员","采购经理","商务专员","报关员","买手"]},
				{"id":8,"industry":"市场/公关","industry_list":["市场专员","市场经理","公关员","市场拓展","市场调研","市场策划","公关经理","媒介专员","媒介经理","策划经理","会展专员"]},
				{"id":9,"industry":"淘宝/网店","industry_list":["淘宝客服","淘宝美工","淘宝店长","店铺编辑","淘宝推广","淘宝装修","淘宝策划"]},
				{"id":10,"industry":"保险/理赔","industry_list":["保险销售","保险顾问","核保理赔","保险经纪人","保险精算师","契约管理","保险内勤"]},
				{"id":11,"industry":"房地产","industry_list":["房产销售","置业顾问","房产客服","房产策划","房产店员","房产内勤","房产评估师"]},
				{"id":12,"industry":"酒店/旅游","industry_list":["酒店前台","酒店服务员","行李员","大堂经理","酒店管理","酒店管家","试睡师","导游","旅游顾问","签证专员","订票员"]},
				{"id":13,"industry":"酒店/旅游","industry_list":["酒店前台","酒店服务员","行李员","大堂经理","酒店管理","酒店管家","试睡师","导游","旅游顾问","签证专员","订票员","车工","叉车工","手机维修","电梯工","操作工","包装工","水泥工","钢筋工","纺织工","管道工","样衣工","装卸工"]},
				]
	return data
})
//薪资
app.factory('xinzi',function () {
	var data = ['面议','1000-2000','2000-3000','3000-5000','5000-10000']
	return data
})

//招聘导航-更多的列表
app.factory('more',function () {
	var more = [
				// {"id":0,"name":"发布时间","name_content":["不限","一天内","三天内","一周内","十天内"]},
				{"id":0,"name":"学历选择","name_content":["初中","中专","高中","大专","本科","硕士","博士","MBA/EMBA"]},
				{"id":1,"name":"经验选择","name_content":["不限","1年以下","1-3年","3-5年","5-10年"]},
				// {"id":1,"name":"福利标签","name_content":["不限","五险一金","包吃","包住","年度旅游","餐补","房补","通讯补贴","年底双薪","年终分红","加班补助","带薪年假","全勤奖","股票期权","交通补助","高温补助","采暖补助","弹性工作","医疗保险","定期体检","免费班车"]}
				]
	return more
})

//热门地区数据
app.factory('hot_region',function () {
	var data = [
				{"id":1,"pingyin":"beijin","name":"北京","code":"1101","city":0},
				{"id":16,"pingyin":"shanghai","name":"上海","code":"3101","city":0},
				{"id":6,"pingyin":"guangzhou","name":"广州","code":"4401","city":0},
				{"id":16,"pingyin":"shenzhen","name":"深圳","code":"4403","city":2},
				{"id":16,"pingyin":"suzhou","name":"苏州","code":"3205","city":4},
				{"id":7,"pingyin":"hangzho","name":"杭州","code":"3301","city":3},
				{"id":12,"pingyin":"nanjing","name":"南京","code":"3201","city":1},
				{"id":14,"pingyin":"qingdao","name":"青岛","code":"3702","city":0},
				{"id":3,"pingyin":"dalian","name":"大连","code":"2102","city":0},
				{"id":2,"pingyin":"chengdu","name":"成都","code":"5101","city":4},
				{"id":2,"pingyin":"chongqing","name":"重庆","code":"5001","city":0},
				{"id":17,"pingyin":"tianjin","name":"天津","code":"1201","city":0}
				]
	return data
})

//地区json文件
app.factory('region_json',function ($http) {
	return function (callback) {
		$http.get('newcity.json').then(function (data) {
			callback(data.data)

		})
	}
})
//区域json文件
app.factory('quyu_json',function ($http) {
	return function (a,callback) {

		$http.get('numcity/'+a+'.json').then(function (data) {
			console.log(data.data)
			callback(data.data)

		})
	}
})

app.controller('homepage',function ($rootScope,$scope,$interval,$timeout,$state,remenfenlei_data,region_json,iScrollService,hot_region,Location,city_iscroll,quyu_json,$location) {
	
	Location(function (callback) {
		alert(callback)
	});
	
	// console.log(iScrollService)
	region_json(function (callback) {
		$scope.city_json = callback;
	})
	$scope.open_menu = function () {
		$rootScope.menu_state = !$rootScope.menu_state;
	}
	//点击搜索框并判断搜索栏是否出现,从而post数据
	$scope.go_seach = function () {
		if (!$rootScope.sousuo_state) {$rootScope.sousuo_state=true;return;}
		else{
			// alert('搜索成功');
			$rootScope.sousuo_state=false;
		}
	}
	//点击取消隐藏搜索框
	$scope.cancel_seach = function () {
		$rootScope.sousuo_state=false;
	}
	//热门分类隐藏部分开关
	$scope.remenfenlei_switch = function (a) {
		if ($rootScope.show_remenfenlei==a) {
			$rootScope.show_remenfenlei=null;
		}else{
			$rootScope.show_remenfenlei=a;
		}
	}
	//热门分类-查看更多或收起全部开关
	$scope.remenfenlei_show_hidden_button = function () {
		if (!$rootScope.remenfenlei_show_hidden_box) {
			$rootScope.remenfenlei_show_hidden = '收起全部'
			$rootScope.remenfenlei_show_hidden_box = true;
		}
		else{
			$rootScope.remenfenlei_show_hidden = '查看更多'
			$rootScope.remenfenlei_show_hidden_box = false;
		}
	}
	//热门分类数据
	$scope.remenfenlei_data = remenfenlei_data;
	//热门地区数据
	$scope.hot_region = hot_region;
	//定位热门字母
	$scope.location_hot = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z']
	//点击定位热门字母事件
	$scope.show_letter = false;//字母框初始化隐藏
	//选择城市-打开
	$scope.Choose_the_city=function () {
		$rootScope.City_Selection = true;
		setTimeout(function() {
	    // initScroll();
	    /*$rootScope.city_onebox_Scroll=new IScroll('#city_onebox',{
	    	mouseWheel:true,
    		scrollbars:true,
            click:true,//启用允许默认点击
            taps:true//启用允许标签a点击
	    });*/

		city_iscroll();
		}, 200);
	}
	//选择城市-关闭
	$scope.off_Choose_the_city=function () {
		$rootScope.City_Selection = false;
	}
	
	$scope.location_letter = function (a) {
		$rootScope.city_onebox_Scroll.scrollToElement('#'+a,0,false,-120)
		$scope.letter = a;
		$scope.show_letter = true;
		$timeout(function () {
		 	$scope.show_letter = false;
		 },1000)

	}
	// $scope.$watch('instance',function(newValue,oldValue, scope){ console.log(newValue);});
	$scope.city_name = function (a,index) {
		$rootScope.my_city_name = a;
		// $rootScope.mytop_city_name = a;
		console.log(a)
		console.log(a.id)
		console.log(index)
/*		quyu_json(a.code,function (callback) {
			$rootScope.quyu = callback;
		})*/

		$scope.$broadcast('to-child',a.code);//把点击事件传给full_time 
		$location.search('zimu',a.id)
		$location.search('city',index)
		$rootScope.City_Selection = false;
	}

	//导航栏a标签的点击
	$scope.nav_a_click = function () {
		$state.go('Recruit',{zimu:$location.search().zimu,city:$location.search().city,job:'null',jobcontent:'null',quyu:'null',xinzi:'null',jingyan:'null',xueli:'null'})
	}
})


app.controller('full_time',function ($rootScope,$scope,$timeout,remenfenlei_data,more,$location,$state,$stateParams,xinzi) {
		/*$rootScope.one_nav = new IScroll('#nav_content_one',{
									mouseWheel:true,
									scrollbars:true,
							        click:true,//启用允许默认点击
							        taps:true//启用允许标签a点击
						   		 });
		$rootScope.www_nav = new IScroll('#nav_content_two',{
									mouseWheel:true,
									scrollbars:true,
							        click:true,//启用允许默认点击
							        taps:true//启用允许标签a点击
						   		 });*/
	
	// animate动画
/*	$scope.uiview_animate = full_time_animate;
	*/
	

	//接收homepage的点击事件
	$scope.$on('to-child', function(d,data) { 
			console.log(data) 
                
    });

	document.documentElement.scrollTop = document.body.scrollTop =0;//点击后返回顶部					   		 
	//控制导航三角符号的方向以及列表内容是否显示的开关
	$scope.nav_switch = null;
	//导航目录
	$scope.nav_list =['职位','区域','薪资','更多'];
	$stateParams.job!="null"?$scope.nav_list[0]=remenfenlei_data[$stateParams.job].industry_list[$stateParams.jobcontent]:null;
	//职业列表
	$scope.nav_all_content = remenfenlei_data;
	//更多列表
	$scope.more = more;
	//点击导航显示列表内容
	$scope.show_nav_list_content = function (a) {
		// $timeout(function () {$scope.nav_all_content = remenfenlei_data},0)
		$scope.nav_switch==a?$scope.nav_switch = null:$scope.nav_switch = a;
		$scope.nav_switch==a?$timeout(function(){$rootScope.nav_fixed=true;},0):$timeout(function(){$rootScope.nav_fixed=false;},0);

		

	}
	//点击遮罩
	$scope.nav_zhezhao = function () {
		$scope.nav_switch = null;
		$rootScope.nav_fixed=false;
	}
	//根据职业导航点击显示不同的列表
	$scope.nav_show= 0;
	$stateParams.job=="null"?$scope.nav_show= 0:$scope.nav_show=$stateParams.job;
	
	//点击职业后出现的勾
	$scope.nav_show_gou = $stateParams.jobcontent;
	//根据不同列表判断勾的位置
	$scope.panduan_gou = $stateParams.job;
	//点击职业导航的列表的函数
	$scope.onclick_nav_list = function (a) {
		
		$scope.nav_show= a;
	}
	//点击职业后的函数
	$scope.onclick_nav_list_gou = function (x,a,b) {
		$scope.nav_list[0] = x;
		if ($scope.nav_show_gou==a&&$scope.panduan_gou==b) {
			return
		}else{
			$timeout(function(){$rootScope.nav_fixed=false;},0)
			$state.go('Recruit',{zimu:$location.search().zimu,city:$location.search().city,job:b,jobcontent:a})

		}
		/*$location.search({id:'55',name:'shab'})
		console.log($location.url())
		console.log($location.search())
		$timeout(function () {
			$scope.lo = $location.search().name
		})*/
		// $timeout(function(){$rootScope.nav_fixed=false;},100);
	} 
	//根据更多导航点击显示不同的列表
	$scope.nav_more_show= 0;
	//点击更多导航的列表的函数
	$scope.onclick_nav_more_list = function (a) {
		$scope.nav_more_show= a;
	}
	//测试
	$scope.lo = $location.search().job;
	
	//具体区域显示
	$scope.specific_quyu = $location.search().quyu;
	console.log($scope.specific_quyu)
	//具体区域点击显示
	$scope.click_quyu = function (index) {
		$scope.specific_quyu = index;
		$location.search('quyu',index);
		$rootScope.nav_fixed=false;
	}

	//薪资
	$scope.xinzi = xinzi;
	//薪资显示
	$scope.show_xinzi = $location.search().xinzi;
	//点击薪资
	$scope.click_xinzi = function (index) {
		$scope.show_xinzi = index;
		$location.search('xinzi',index);
		$rootScope.nav_fixed=false;

	}

	//学历
	$scope.show_xueli = $location.search().xueli;
	//点击学历
	$scope.click_xueli = function (index) {
		$scope.show_xueli = index
	}


})