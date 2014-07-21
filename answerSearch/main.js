chrome.storage.sync.get('answerSearch', function(d) {
if(+d.answerSearch) return false;
$('.user-data').each(function() {
	if(/个回答/.test($('.user-data-title', $(this)).text()))
		_t = $(this);
})
_t.prepend('<div class="answer-search head-search" style="float:right;margin:0;">'+
	'<input type="text" class="form-control text-27 input-search" name="q" autocomplete="off" spellcheck="false" placeholder="搜索回答过的问题" style="z-index: 10;">'+
    '<button class="btn-search" type="submit">搜索</button>'+
'</div>');
$(document).on('keydown', '.answer-search input', function(e) {if(e.keyCode == 13) $('.answer-search button').click();})

$('.answer-search button').click(function() {
	var _s = $('.answer-search input').val();
	if(!_s)	{
		alert('Please input keywords!');
		return false;
	}

	var _m = $(this).parent().parent();
	$('article', _m).remove();
	_m.append('<span class="searching">Searching...</span>');

	var _a = $('.user-data-title a', _t),
		_n = _a.text(),
		_o = Math.ceil(_n/10),
		_u = _a.attr('href').split('segmentfault.com/u/')[1].split('/')[0],
		prefixUrl = _a.attr('href')+'?page=';
	var answers = localStorage['AnswersOf'+_u] ? JSON.parse(localStorage['AnswersOf'+_u]) : [];

	(function getAnswersList(page) {
		if(page >_o || answers.length >= _n) {
			localStorage['AnswersOf'+_u] = JSON.stringify(answers);
			var _k = _s.split(' ');
			_k.forEach(function(key) {
				answers = answers.filter(function(answer) {
					return (answer.parent.title+answer.parent.content+answer.content).match(key);
				});
			})
			$('.searching', _m).remove();
			answers.length ? answers.forEach(function(answer) {_m.append(answer.obj);}) : _m.append('<span class="searching">没有搜索结果</span>');
			return false;
		}

		$.get(prefixUrl+page, function(res) {
			console.log('Load page '+page+' of answers list success!');

			var articles = $('#main article', res);
			if(/暂时没有回答/.test(articles[0].innerText))	return false;
			(function getAnswer(article) {
				if(article.attr('class') == 'page-nav' || answers.length >= _n) {
					getAnswersList(page+1);
					return false;
				}

				var answerId = article.attr('id'), answerUrl = $('.profile-post-excerpt', article).attr('href'), answerHtml = article[0].outerHTML;
				$.get(answerUrl, function(res) {
					console.log('Load Answer #'+answerId+' success!');
					answers.push({
						id: answerId,
						url: answerUrl,
						obj: answerHtml,
						content: $('#'+answerId, res).text(),
						parent: {
							title: $('h2 a', article).text(),
							url: $('h2 a', article).attr('href'),
							content: $('#question .post-content', res).text()
						},
					});

					getAnswer(article.next());
				})				
			}($($('#main article', res)[0])));
		})
	}(1))
});
})