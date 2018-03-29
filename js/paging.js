(function($){
	$.fn.paging = function (option) { //通过$.fn定义分页函数paging，在需要分页的地方直接调用
		var defaultOptions = {//默认项设置
			pageNo:1,//默认当前页
			pageSize:10,//默认每页显示条数
			count:0,//默认数据总条数
			showNum:6,//默认显示页码数
			activeBackColor:'#5cb85c',//默认选中页码的背景色
			jumpTo:true,//默认显示跳转指定页模块
			jumpBtnName:'确定',//默认跳转按钮的名称
			color:'#fff',//默认字体颜色
			backColor:'#EFF2F7',//未被选中的页码的背景色
			disabledColor:'#fff',//disabled的的背景色
			disabledBorColor:'#ddd',//disabled的的边框色
		}；
		var self = this;
		var pagingCount = 0;//共计页码
		var Settings = $.extend( {}, defaultOptions, option );/*将defaultOptions对象和option
			随想相应的属性合并，并将新的对象赋值给Setting对象本身*/
		$(this).empty();//清空当前$作用域

		var main = function () {//主函数
			var check = checkDigit();
			if( check == false ){
				return false;
			}
			var pageNo = parseInt( Settings.pageNo );
			var pageSize = parseInt( Settings.pageSize );
			var count = parseInt( Settings.count );
			if( count % pageSize == 0){
				pageCount = count / pageSize;
			}
			else{
				pageCount = parseInt( count / pageSize ) + 1;
			}
			var showNum = parseInt( settings.showNum );
		}

		var checkDigit = function () {/*校验数据条数count,每页显示条数pageSize,当前页pageNo,
			显示页码数showNum是否非法输入*/
			if( Settings.pagNo < 0 || Settings.pageSize < 0 || Settings.count < 0){
				console.error( "请检查 pagNo,pageSize,count这个三个参数是否存在非法输入" );
				return false;
			}
			//如果showNum为为非法数值，那么设置为默认值
			if( Settings.showNum < 0 ){
				Setting.showNum = 6;
			}
		}

		var JsonPageConstruct = function (pageNo,pageCount,pageSize,showNum) {
		//构建分页页码的变现形式，返回json字符串
		//pageNo当前页码
		//pageCount总页码数
		//pageSize每页显示条数
		//showNum显示几条页码在页面上
			var data = '';
			if(pageNo == 1){
				data = '{jsonData:[{"text":"上一页","num":0,"state":"disabled"},';
			}
			else{
				data = '{jsonData:[{"text":"上一页","num":"'+ ( pageNo - 1 ) +'",'+
				'"state":"disabled"},';
			}
			/*
				判断分页类型，有两种情况，第一：pageCount > showNum；第二：pageCount <= 
				showNum；
				在第一种情况下还会出现如下三种情况;
				1、pageNo <= showNum + 2;
				2、showNum + 2 < pageNo <= pageCount - showNum + 3;
				3、pageCount - showNum + 3 < pageNo <= pageCount;
				在1的情况下有分为两种情况：
				（1）、pageNo <= showNum;
				（1）、showNum < pageNo <= showNum + 2;
			*/
			if( pageCount > showNum ) {
				if( pageNo <= showNum + 2 ) {
					if( pageNo <= showNum ) {
						for(var i= 1 ;i <= showNum ; i ++ ){
							if( pageNo == i ) {
								data += '{"text":"'+i+'","num":"'+i+'","state":"avtive"},';
							}
							else{
								data += '{"text":"'+i+'","num":"'+i+'","state":"abled"},';
							}
						}
						if( pageNo == showNum ) {
						//显示页面后面在刷新出一个，
						//此时i = showNum + 1,这边之所以能够访问到i，是因为js在声明变量
						//的时候提升申明了，提升到最前面声明
							data += '{"text":"'+i+'","num":"'+i+'","state":"abled"},';
						}
					}
					else{
						
					}
				}
			}
		}
		
	}
})(jQuery)