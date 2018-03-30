(function($){
	$.fn.paging = function (option) { //通过$.fn定义分页函数paging，在需要分页的地方直接调用
		var defaultOptions = {//默认项设置
			pageNo:1,//默认当前页
			pageSize:10,//默认每页显示条数
			count:0,//默认数据总条数
			showNum:6,//默认显示页码数
			jumpTo:true,//默认显示跳转指定页模块
			jumpBtnName:'确定',//默认跳转按钮的名称
			fontSize:16,//跳转按钮字体大小
		};

		var self = this;
		var pagingCount = 0;//共计页码
		var Settings = $.extend( {}, defaultOptions, option );/*将defaultOptions对象和option
			随想相应的属性合并，并将新的对象赋值给Setting对象本身*/
		$(this).empty();//清空当前$作用域

		var checkDigit = function () {/*校验数据条数count,每页显示条数pageSize,当前页pageNo,
			显示页码数showNum是否非法输入*/
			if( Settings.pagNo < 0 || Settings.pageSize < 0 || Settings.count < 0){
				console.error( "请检查 pagNo,pageSize,count这个三个参数是否存在非法输入" );
				return false;
			}
			//如果showNum为非法数值，那么设置为默认值
			if( Settings.showNum < 0 ){
				Setting.showNum = 6;
				return true;
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
				data = '{"jsonData":[{"text":"上一页","num":0,"state":"disabled"},';
			}
			else{
				data = '{"jsonData":[{"text":"上一页","num":"'+ ( pageNo - 1 ) +'",'+
				'"state":"abled"},';
			}
			/*
				判断分页类型，有两种情况，第一：pageCount > showNum；第二：pageCount <= 
				showNum；
				在第一种情况下还会出现如下三种情况;
				1、pageNo <= showNum + 2;
				2、showNum + 2 < pageNo <= pageCount - showNum + 3;
				3、pageCount - showNum + 3 < pageNo <= pageCount;
				在1的情况下又分为两种情况：
				（1）、pageNo <= showNum;
				（2）、showNum < pageNo <= showNum + 2;
				在（2）中情况下面要考虑
			*/
			if( pageCount > showNum ) {
				if( pageNo <= showNum + 2 ) {
					if( pageNo <= showNum ) {
						for(var i= 1 ;i <= showNum ; i++ ){
							if( pageNo == i ) {
								data += '{"text":"'+ i +'","num":"'+ i +'","state":"active"},';
							}
							else{
								data += '{"text":"'+ i +'","num":"'+ i +'","state":"abled"},';
							}
						}
						if( pageNo == showNum ) {
						//显示页面后面在刷新出一个，
						//此时i = showNum + 1,这边之所以能够访问到i，是因为js在声明变量
						//的时候提升申明了，提升到最前面声明
							data += '{"text":"'+ i +'","num":"'+ i +'","state":"abled"},';
						}
					}
					else{
						for (var j = 1; j <= pageNo; j++) {
							if( pageNo == j ) {
								data += '{"text":"'+ j +'","num":"'+ j +'","state":"active"},';
							}
							else{
								data += '{"text":"'+ j +'","num":"'+ j +'","state":"abled"},';
							}
						}
						if(pageNo != pageCount){
							data += '{"text":"'+ j +'","num":"'+ j +'","state":"abled"},';
						}
					}
					//如果总页数pageCount <= showNum + 2,则隐藏...
					if(pageNo != pageCount){
						if(pageNo != (pageCount - 1)){
							data+='{"text":"...","num":"more","state":"disabled"},';
						}
					}
				}
				else if(pageNo <= pageCount - showNum + 3){
					data += '{"text":"1","num":"1","state":"abled"},';
					data += '{"text":"2","num":"2","state":"abled"},';
					data += '{"text":"...","num":"more","state":"disabled"},';
					for (var m = pageNo - 2; m <= pageNo + 2; m++) {
						if(pageNo == m){
							data += '{"text":"'+ m +'","num":"'+ m +'","state":"active"},';
						}
						else{
							data += '{"text":"'+ m +'","num":"'+ m +'","state":"abled"},';
						}
					}
					data += '{"text":"...","num":"more","state":"disabled"},';
				}
				else{
					data += '{"text":"1","num":"1","state":"abled"},';
					data += '{"text":"2","num":"2","state":"abled"},';
					data += '{"text":"...","num":"more","state":"disabled"},';
					for (var n = pageCount - showNum + 1; n <= pageCount; n++) {
						if(pageNo == n){
							data += '{"text":"'+ n +'","num":"'+ n +'","state":"active"},';
						}
						else{
							data += '{"text":"'+ n +'","num":"'+ n +'","state":"abled"},';
						}
					}
				}
			}
			if(pageNo == pageCount){
				data += '{"text":"下一页","num":"'+ (pageNo + 1) +'","state":"disabled"}]}';
			}else{
				data += '{"text":"下一页","num":"'+ (pageNo + 1) +'","state":"abled"}]}';
			}
			var json_return = JSON.parse(data);
			return json_return;
		}

		/*
			将分页结果显示到页面的相应的位置
		*/
		function PagingJson(json){
			
			if(parseInt(Settings.count)>0){
				var html = '<ul class="pagination" style="display:flex;list-style:none;">';
				for(var a in json.jsonData){
					if(json.jsonData[a].state == "disabled"){
						html +='<li id="pageNum'+ json.jsonData[a].num +'" class="disabled" num="'+ json.jsonData[a].num +'" ><a href="javascript:;">'+ json.jsonData[a].text +'</a></li>';
					}
					else if(json.jsonData[a].state == "active"){
						html +='<li id="pageNum'+ json.jsonData[a].num +'" class="active" num="'+ json.jsonData[a].num +'" ><a href="javascript:;">'+ json.jsonData[a].text +'</a></li>';
						
					}else{
						html +='<li id="pageNum'+ json.jsonData[a].num +'" num="'+ json.jsonData[a].num +'" ><a href="javascript:;">'+ json.jsonData[a].text +'</a></li>';
					}
				}
				$(self).html(html);
				if(Settings.jumpTo == true){
					$(self).find(".pagination").append('<span class="text-muted" style="margin:5px;margin-left:10px;display:inline-block;font-size:18px;font-size:'+ Settings.fontSize +'px">共有'+ pagingCount +'页/'+ Settings.count +'个</span><div style="display:inline-block" name="changePage"><span class="text-muted" style="margin:5px;margin-left:0px;display:inline-block;font-size:'+ Settings.fontSize +'px">,到第</span> <input type="number" min="1" max="'+ pagingCount +'"class="pagination_change_page" style="width:45px;border-color:#ddd"> <span class="text-muted" style="margin:5px;margin-left:10px;display:inline-block;font-size:font-size:'+ Settings.fontSize +'px">页</span> <button class="btn btn-default btn-sm pagination_search">'+ Settings.jumpBtnName +'</button></div>');
				}
			}else{

			}
		}


		

		var main = function () {//主函数
			var check = checkDigit();
			if( check == false ){
				return false;
			}
			var pageNo = parseInt( Settings.pageNo );
			var pageSize = parseInt( Settings.pageSize );
			var count = parseInt( Settings.count );
			if( count % pageSize == 0){
				pagingCount = count / pageSize;
			}
			else{
				pagingCount = parseInt( count / pageSize ) + 1;
			}
			var showNum = parseInt( Settings.showNum );
			var pageJson = JsonPageConstruct(pageNo,pagingCount,pageSize,showNum);
			PagingJson(pageJson);
			$(self).off();
		};
		main();

		
	};
})(jQuery)