chrome.storage.sync.get('answerSearch', function(d) {
if(+d.answerSearch) return false;
if(location.pathname.split('/').pop() != "answers") return false;

var _t = $("h2.h4");
_t.after('<div class="answer-search head-search" style="position: absolute;margin-top: -40px;margin-left: 100px;width: 237px;">'+
	'<input type="text" class="form-control text-27 input-search" name="q" autocomplete="off" spellcheck="false" placeholder="搜索回答过的问题" style="display:inline-block;width:80%">'+
    '<button class="btn-search" type="submit" style="margin-left:1%;line-height:30px;">搜索</button>'+
'</div>'+
'<div class="answer-sort btn-group pull-right" role="group" style="margin-top:-25px;">'+
            '<span class="sortby-modified btn btn-default btn-xs active">时间排序</span>'+
            '<span class="sortby-rank btn btn-default btn-xs">评分排序</span>'+
        '</div>');
$(document).on('keydown', '.answer-search input', function(e) {if(e.keyCode == 13) $('.answer-search button').click();})

$('.answer-search button').click(function() {
	var _s = $('.answer-search input').val();
	if(!_s)	{
		alert('Please input keywords!');
		return false;
	}

	var _m = $(this).parent().next().next();
	_m.html('<span class="searching">Searching...</span>');
	_m.next().remove();

    getAnswers(function(answers) {
        var _k = _s.split(' ');
        _k.forEach(function(key) {
            answers = answers.filter(function(answer) {
                return (answer.parent.title+answer.parent.content+answer.content).match(key);
            });
        })
        $('.searching', _m).remove();
        answers.length ? answers.forEach(function(answer) {_m.append(answer.obj);}) : _m.append('<span class="searching">没有搜索结果</span>');
        return false;
    })
});

$('.answer-sort .sortby-modified').click(function(e) {
    e.preventDefault();
    $('.answer-sort .active').removeClass('active');
    $(this).addClass('active');
    var _m = $(this).parent().next();
    _m.html('<span class="sorting">Sorting...</span>');
    _m.next().remove();
    getAnswers(function(answers) {
        $(".sorting", _m).remove();
        answers.length ? answers.forEach(function(answer) {
            _m.append(answer.obj);
        }) : _m.append('<span class="result">该用户暂时没有回答</span>');
    })
    return false;
})

$('.answer-sort .sortby-rank').click(function(e) {
    e.preventDefault();
    $('.answer-sort .active').removeClass('active');
    $(this).addClass('active');
    var _m = $(this).parent().next();
    _m.html('<span class="sorting">Sorting...</span>');
    _m.next().remove();
    getAnswers(function(answers) {
        var answersByRank = JSON.parse( JSON.stringify(answers) );
        answersByRank.sort(function(r,n) {return n.like - r.like});
        $(".sorting", _m).remove();
        answersByRank.length ? answersByRank.forEach(function(answer) {
            _m.append(answer.obj);
        }) : _m.append('<span class="result">该用户暂时没有回答</span>');
    })
    return false;
})

function getAnswers(callback) {
    callback = callback || function() {};
    var baseUrl = "http://segmentfault.com";
    var _t = $("h2.h4"),
        _n = _t.text().match(/\d+/g)[0]/1,
        _o = Math.ceil(_n/20),
        _u = location.pathname.split('/')[1],
        prefixUrl = baseUrl+location.pathname+'?page=';
    var answers = localStorage['AnswersOf'+_u] ? JSON.parse(localStorage['AnswersOf'+_u]) : [];

    (function getAnswersList(page) {
        if(page >_o || answers.length >= _n) {
            localStorage['AnswersOf'+_u] = JSON.stringify(answers);
            callback(answers);
        }

        $.get(prefixUrl+page, function(res) {
            console.log('Load page '+page+' of answers list success!');

            var articles = $('.stream-list section', res);
            if(articles.length == 0) return false;
            (function getAnswer(article) {
                if(article.length==0) {
                    getAnswersList(page+1);
                    return false;
                }
                var answerUrl = baseUrl+$(".title a", article).attr('href');
                $.ajax({
                    url: answerUrl,
                    type: "GET",
                    dataType: "html",
                    success: function(res) {
                        console.log('Load Answer #'+answerUrl+' success!');
                        answers.push({
                            url: answerUrl,
                            obj: article[0].outerHTML,
                            like: $(".widget-answers .count", res).html()/1,
                            content: $(".answer", res).text(),
                            parent: {
                                title: $('.title a', article).text(),
                                url: baseUrl+$(".main .text-center .btn-primary", res).attr('href'),
                                content: $('.question', res).text()
                            },
                        });

                    },
                    error: function() {

                    },
                    complete: function() {
                        getAnswer(article.next());
                    }
                })          
            }($(articles[0])) );
        })
    }(1))
}
})
