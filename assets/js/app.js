var a;
var userID;
io.socket.on('connect', function socketConnected() {
	if(window.location.pathname === '/chatroom') {
		var chatroom = getParameterByName('id');
		console.log("Connecting. Should only show up 1ce")
		io.socket.get('/chatroom/connect?id='+chatroom);

	io.socket.on('chatroom', function messageSocket(data) {
		console.log("Received notification: ");
		if(data.verb=='messaged') {
			if(data.data.type === 'message') {
				var html = "<div class='panel panel-success message' style='width:96%; margin:2% 2%' data-author='"+data.data.author+"' data-id='"+data.data.id+"'><div class='panel-heading'>"+data.data.author+"</div><div class='panel-body' data-author='"+data.data.author+"' data-id='"+data.data.id+"'><p>"+data.data.content+"<span class='small rating' style='margin-left: 1%; margin-right:2%; padding-top:5px; float:right;'><span class='glyphicon glyphicon-thumbs-up'></span> 0</span></p><span class='small reply' style='float:right; margin:0 15px 0 5px;''><a href='#''> Reply </a> </span><span class='small like' style='float:right; margin:0 5px'><a href='#''> Like </a> </span></div></div>"
				$('.chatroom').append(html);
				$('.mostliked').append(html)
				//$(html).appendTo('.chatroom').fadeIn(1000);
				if($('.mostliked .message').length < 5) {
					$(html).appendTo('.mostliked').fadeIn(1000);
			}
				$('.chatroom').scrollTop($('.chatroom')[0].scrollHeight)
		}

		else if(data.data.type === 'join') {
			if($('*[data-name="' + data.data.student+'"]').length) {
				$('*[data-name="' + data.data.student+'"]').remove();
			}
			var html = "<li data-name='"+data.data.student+"'>"
			html+=data.data.student
			html += "</li>"
			$('.online').append(html)

		}			
			else if(data.data.type === 'leave') {
				console.log("student left: "+data.data.student);
				$('*[data-name="' + data.data.student+'"]').remove();

			}

		

		else if(data.data.type === 'rating') {
			$('*[data-id="' + data.data.id+'"] .rating')
				.html("<span class='glyphicon glyphicon-thumbs-up'></span> " + data.data.rating.length);
			$('.sort *[data-id="' + data.data.id+'"] .rating')
				.html("<span class='glyphicon glyphicon-thumbs-up'></span>  " + data.data.rating.length);
			$($('*[data-id="' + data.data.id+'"]')[1])
				.attr('data-rating',data.data.rating.length);
			if(data.data.author === userID) {
				var html = '<div class="alert alert-info" role="alert">'
				html+='A user has liked your message!</div>'
				$('#warnings').append(html).fadeOut(10000, function() {
					$('#warnings').empty().css('display', 'block');
				})
			}
			var asc = $('.mostliked .sorted').sort(function(o) {
				return $(o).attr('data-rating')
			});
			asc = asc.toArray();
			$('.mostliked').html(asc.reverse());
			$(window).scrollTop(0);
		}

		else if(data.data.type === 'reply') {
			//we have a reply yo
			b = data.data
			if(userID === data.data.replyee.id) {
				var html = '<div class="alert alert-info" role="alert">'
				html+= data.data.author
				html+=' has replied to you!</div>'
				$('#warnings').append(html).fadeOut(10000, function() {
					$('#warnings').empty().css('display', block);
				})
				$('.chatroom').scrollTop($('.chatroom')[0].scrollHeight)
			}
		}

		else if(data.data.type === 'alert') {
			alert(data.data.message);
		}

		}
	});
	}
	else {
		io.socket.get('/chatroom/disconnect');
	}
	
});
io.socket.on('disconnect', function socketDisconnected() {
	io.socket.get('/chatroom/disconnect');
});

$(document).ready(function() {
	$('#croom').val(getParameterByName('id'));
	$('#post-message').submit(function(event) {
	  console.log("click");
	  /* Act on the event */
	  $.ajax({
	    url: '/ajax/postmessage',
	    type: 'POST',
	    data: $(this).serialize()
	  })
	  .done(function() {
	    console.log("success");
	    $('#message-content').val("");
	  })
	  .fail(function() {
	    console.log("error");
	  })
	  .always(function() {
	    console.log("complete");
	  });

	  return false; //avoid actually submitting.
	});

	$('.content').on('click', '.like', function(event) {
			event.preventDefault();
			var id = $(this).parent().attr('data-id');
			//alert("ID: "+id
			/* Act on the event */
			$.ajax({
				url: '/ajax/likemessage',
				type: 'POST',
				data: {id: id},
			})
			.done(function(data) {
				console.log("success");
				$(this).text('unlike')
					   .attr('status','liked')
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			
		});

	$('.content').on('click', '.reply', function(event) {
		event.preventDefault();
		/* Act on the event */
		var id = $(this).parent().attr('data-id');
		var name = $(this).parent().attr('data-author');
		$('#message-content').val('@'+id+" ");

	});

})

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



