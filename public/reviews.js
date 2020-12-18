(function ($) {
  let reviewForm = $('#reviewForm');
  reviewContent = $('#content');
  reviewTitle = $('#title');
  reviewRating = $('#rating');
  reviewList = $('#reviewList');
  error = $('#error');
  let formCounter = 1;
  let commentCounter = 1;
  // commentList = $('#commentList');
  // commentForm = $('#commentForm');
  // commentContent = $('#comment');
  console.log(window.location.href.split("/")[4].split("?")[0]);
  $.ajax({
    url: '/restaurants/' + window.location.href.split("/")[4].split("?")[0] + '/json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    dataType: 'json'
  }).then((restaurant) => {
    for (rev of restaurant.reviews) {
      let newReview = $('<div></div>');
      let a = $('<a></a>').text(rev.user.username);
      a.attr('href', "/users/" + rev.user.username)
      newReview.append(a);
      newReview.append($('<h4></h4>').text(rev.title));
      newReview.append($('<p></p>').text(rev.dateOfReview));
      newReview.append($('<p></p>').text("Rating: " + rev.rating));
      newReview.append($('<p></p>').text("Tags: " + rev.tags));
      newReview.append($('<p></p>').text(rev.content));

      let form = $('<form id="commentForm' + formCounter + '" method="POST"></form>');
      let label = $('<label></label>').text('Post a Comment');
      // let reviewIdInput = $('<input hidden>').attr('id', 'reviewIdInput').attr('value', 'reviewId');
      let commentInput = $('<input>').attr('id', 'comment' + commentCounter);
      commentCounter++;
      commentInput.attr('name', 'comment');
      commentInput.attr('type', 'text');
      commentInput.attr('placeholder', 'Comment');
      label.append(commentInput);

      let commentButton = $('<button class="commentFormSubmit"></button>').text('Post');
      commentButton.attr('type', 'submit');

      form.append(label);
      form.append(commentButton);
      if (restaurant.authenticated) {
        newReview.append(form);
      }
      let commentList = $('<div id="commentList' + formCounter + '"></div>');
      newReview.append(commentList);

      for (const comm of rev.comments) {
        let newComment = $('<div></div>');
        let a = $('<a></a>').text(comm.username);
        a.attr('href', "/users/" + comm.username)
        newComment.append(a);
        newComment.append($('<p></p>').text(comm.date));
        newComment.append($('<p></p>').text(comm.comment));
        commentList.append(newComment);
      }

      // let commentList = $('#commentList' + formCounter);
      form.submit((eve) => {
        eve.preventDefault();
        $.ajax({
          url: '/restaurants/' + restaurant._id + '/reviews/' + rev._id + '/comments',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: form.serializeArray()
        }).then((returnedComment) => {
          let newComment = $('<div></div>');
          let a = $('<a></a>').text(returnedComment.username);
          a.attr('href', "/users/" + returnedComment.username)
          newComment.append(a);
          newComment.append($('<p></p>').text(new Date()));
          newComment.append($('<p></p>').text(returnedComment.comment));

          commentList.append(newComment);
        });
      });
      reviewList.append(newReview);
      formCounter++;
    }
  });

  error.hide();

  reviewForm.submit(function (event) {
    event.preventDefault();

    error.hide();

    let username = $('#username').val();
    let content = reviewContent.val();
    let title = reviewTitle.val();
    let rating = reviewRating.val();
    let tags = $('#tags').val();

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
        a.attr('href', "/users/" + addedReview.username)
        newReview.append(a);
        newReview.append($('<h4></h4>').text(addedReview.title));
        newReview.append($('<p></p>').text(new Date()));
        newReview.append($('<p></p>').text("Rating: " + addedReview.rating));
        newReview.append($('<p></p>').text("Tags: " + addedReview.tags));
        newReview.append($('<p></p>').text(addedReview.content));

        let form = $('<form id="commentForm' + formCounter + '" method="POST"></form>');
        let label = $('<label></label>').text('Post a Comment');
        // let reviewIdInput = $('<input hidden>').attr('id', 'reviewIdInput').attr('value', 'reviewId');
        let commentInput = $('<input>').attr('id', 'comment' + commentCounter);
        commentCounter++;
        commentInput.attr('name', 'comment');
        commentInput.attr('type', 'text');
        commentInput.attr('placeholder', 'Comment');
        label.append(commentInput);

        let commentButton = $('<button class="commentFormSubmit"></button>').text('Post');
        commentButton.attr('type', 'submit');

        form.append(label);
        form.append(commentButton);
        newReview.append(form);
        let commentList = $('<div id="commentList' + formCounter + '"></div>');
        newReview.append(commentList);
        form.submit((eve) => {
          eve.preventDefault();
          $.ajax({
            url: '/restaurants/' + $('#restaurantId').val() + '/reviews/' + addedReview._id + '/comments',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: form.serializeArray()
          }).then((returnedComment) => {
            let newComment = $('<div></div>');
            let a = $('<a></a>').text(returnedComment.username);
            a.attr('href', "/users/" + returnedComment.username)
            newComment.append(a);
            newComment.append($('<p></p>').text(new Date()));
            newComment.append($('<p></p>').text(returnedComment.comment));

            commentList.append(newComment);
          });
        });
        reviewList.append(newReview);
        formCounter++;
      });
    }
  });

  setTimeout(function () {
    alert("Session about to expire");
  }, 800000);

  setTimeout(function () {
    location.href = '/login';
  }, 1000000);

})(window.jQuery);  
