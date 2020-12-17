(function ($) {
    let reviewForm = $('#reviewForm'),
      reviewContent = $('#content'),
      reviewTitle = $('#title'),
      reviewRating = $('#rating'),
      reviewList = $('#reviewList'),
      error = $('#error'),
      commentList = $('#commentList'),
      commentForm = $('#commentForm'),
      commentContent = $('#comment');
      
    error.hide();
  
    reviewForm.submit(function (event) {
      event.preventDefault();

      error.hide();

      let username = $('#username').val();
      let content = reviewContent.val();
      let title = reviewTitle.val();
      let rating = reviewRating.val();
      let tags = $('#tags').val();
      commentContent = commentContent.val();

      if (!content.trim()) {
        error.text('Review Content Cannot Be Empty');
        error.show();
      }
      if (!title.trim()) {
        error.text('Ttitle Cannot Be Empty');
        error.show();
      }
      if (!rating) {
        error.text('Rating Cannot Be Empty');
        error.show();
      }
      if (rating < 1 || rating > 5) {
        error.text('Rating must be from 1-5');
        error.show();
      }
      else {
        console.log($('#restaurantId').val());
        let requestConfig = {
          method: 'POST',
          url: '/restaurants/' + $('#restaurantId').val() + '/reviews',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $('#reviewForm').serializeArray()
        };
        $.ajax(requestConfig).then(function (addedReview) {
          let newReview = $('<div></div>');
          let a = $('<a></a>').text(addedReview.username);
          a.attr('href', "/users/"+addedReview.username)
          newReview.append(a);
          newReview.append($('<h3></h3>').text(title));
          newReview.append($('<p></p>').text(new Date()));
          newReview.append($('<p></p>').text("Rating: "+rating));
          newReview.append($('<p></p>').text("Tags: "+tags));
          newReview.append($('<p></p>').text(content));
          let form = $('<form></form>').attr('id', 'commentForm');
          let label = $('<label></label>').text('Post a Comment');
          let commentInput = $('<input>').attr('id', 'comment');
          commentInput.attr('name', 'comment');
          commentInput.attr('type', 'text');
          commentInput.attr('placeholder', 'Comment');
          label.append(commentInput);
          let commentButton = $('<button></button>').text('Post');
          commentButton.attr('type', 'submit');
          form.append(label);
          form.append(commentButton);
          newReview.append(form);
          reviewList.append(newReview);
        });
      } 
    });

    commentForm.submit(function (event) {
      event.preventDefault();
      let requestConfig = {
        method: 'POST',
        url: '/restaurants/' + $('#restaurantId').val() + '/reviews/' + $('#reviewId').val() + '/comments',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: commentForm.serializeArray()
      };
      $.ajax(requestConfig).then(function (addedComment) {
        let newComment = $('<div></div>');
        let a = $('<a></a>').text(addedComment.userId);
        a.attr('href', "/users/"+addedComment.userId)
        newComment.append(a);
        newComment.append($('<p></p>').text(new Date()));
        newComment.append($('<p></p>').text(commentContent));
        commentList.append(newComment);
      });
    });

})(window.jQuery);  