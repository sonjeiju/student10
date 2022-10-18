/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 대,중,소,하위분류까지 출력 - 확장형
 * 210804 서정환 수정
 */

$(document).ready(function(){

    var methods = {
        aCategory    : [],
        aSubCategory : {},

        get: function()
        {
             $.ajax({
                url : '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function(aData) {

                    if (aData == null || aData == 'undefined') return;
                    for (var i=0; i<aData.length; i++)
                    {
                        var sParentCateNo = aData[i].parent_cate_no;

                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }

                        methods.aSubCategory[sParentCateNo].push( aData[i] );
                    }
                }
            });
        },

        getParam: function(sUrl, sKey) {

            var aUrl         = sUrl.split('?');
            var sQueryString = aUrl[1];
            var aParam       = {};

            if (sQueryString) {
                var aFields = sQueryString.split("&");
                var aField  = [];
                for (var i=0; i<aFields.length; i++) {
                    aField = aFields[i].split('=');
                    aParam[aField[0]] = aField[1];
                }
            }
            return sKey ? aParam[sKey] : aParam;
        },

        getParamSeo: function(sUrl) {
            var aUrl         = sUrl.split('/');
            return aUrl[3] ? aUrl[3] : null;
        },

        show: function(overNode, iCateNo) {
             var oParentNode = overNode;
            var aHtml = [];
            var sMyCateList = localStorage.getItem("myCateList");
            if (methods.aSubCategory[iCateNo] != undefined) {
                aHtml.push('<div class="sub-category-box"><ul class="sub-category">');
                $(methods.aSubCategory[iCateNo]).each(function() {
                    var sNextParentNo = this.cate_no;
                    var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                    if (methods.aSubCategory[sNextParentNo] == undefined) {
                        aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                        var sHref = '/product/list.html'+this.param;
                    } else {
                        aHtml.push('<li id="cate'+this.cate_no+'">');
                        var sHref = '#none';
                    }
                    aHtml.push('<a href="/product/list.html'+this.param+'" class="view" cate="'+this.param+'" data-i18n="LIST.PRD_CATE_NO_'+this.cate_no+'" data-i18n-new>'+this.name+'</a>');

                    if (methods.aSubCategory[sNextParentNo] != undefined) {
                        aHtml.push('<ul>');
                        $(methods.aSubCategory[sNextParentNo]).each(function() {
                            var sNextParentNo2 = this.cate_no;
                            var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                            if (methods.aSubCategory[sNextParentNo2] == undefined) {
                                aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                var sHref = '/product/list.html'+this.param;
                            } else {
                                aHtml.push('<li id="cate'+this.cate_no+'">');
                                var sHref = '#none';
                            }
                            aHtml.push('<a href="/product/list.html'+this.param+'" class="view" cate="'+this.param+'" data-i18n="LIST.PRD_CATE_NO_'+this.cate_no+'" data-i18n-new>'+this.name+'</a>');

                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
                                aHtml.push('<ul class="sub-category-child">');

                                $(methods.aSubCategory[sNextParentNo2]).each(function() {
                                    aHtml.push('<li class="noChild" id="cate'+this.cate_no+'">');
                                    var sCateSelected = (checkInArray(sMyCateList, this.cate_no) == true) ? ' selected' : '';
                                    aHtml.push('<a href="/product/list.html'+this.param+'" class="view" cate="'+this.param+'" onclick="subMenuEvent(this);" data-i18n="LIST.PRD_CATE_NO_'+this.cate_no+'" data-i18n-new>'+this.name+'</a>');
                                    aHtml.push('</li>');
                                });
                                aHtml.push('</ul>');
                            }

                            aHtml.push('</li>');
                        });
                        aHtml.push('</ul>');
                    }
                    aHtml.push('</li>');
                });
                aHtml.push('</ul></div>');
            }
            $(oParentNode).append(aHtml.join(''));
            if (window.i18nextCafe24) {
            	i18nextCafe24.translate('data-i18n-new');
            }
        },
        close: function() {
            $('.sub-category').remove();
			$('.sub-category-box').remove();
        }
    };

    methods.get();

    $('.xans-layout-category > ul > li').mouseenter(function(e) {
        var $this = $(this).addClass('on'),
        iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));

		if (!iCateNo) {
            iCateNo = Number(methods.getParamSeo($this.find('a').attr('href')));
        }

        if (!iCateNo) {
           return;
        }

        methods.show($this, iCateNo);
		jQuery(".xans-layout-searchheader").css('display', 'none');

		$('#header .inner .top_nav_box .top_category .sub-category li').mouseenter(function() { // 카테고리 오버시 클래스 추가 - 서정환
			jQuery(this).addClass('on');
		}).mouseleave(function() {
			jQuery(this).removeClass('on');
		});
		jQuery("#layer_shadow").addClass('on');
     }).mouseleave(function(e) {
        $(this).removeClass('on');

          methods.close();
		  jQuery("#layer_shadow").removeClass('on');
		  jQuery("#layer_shadow_search").removeClass('on');
     });

	/* morenvy.com 상단 하드코딩 카테고리 */
	jQuery('.xans-layout-category > ul > li').mouseenter(function(){
		jQuery(".add_category_box", this).css('display', 'block');
		jQuery("#layer_shadow").addClass('on');
		jQuery(".xans-layout-searchheader").css('display', 'none');
		jQuery("#layer_shadow_search").removeClass('on');
	}).mouseleave(function(){
		jQuery(".add_category_box", this).css('display', 'none');
		jQuery("#layer_shadow").removeClass('on');
		jQuery('body').removeClass('not_scroll').unbind('scroll touchmove mousewheel'); // 브라우저 스크롤풀기
	});
});