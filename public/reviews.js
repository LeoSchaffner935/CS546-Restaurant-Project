(function ($) {
    let reviewForm = $('#reviewForm'),
      reviewContent = $('#content'),
      reviewTitle = $('#title'),
      reviewRating = $('#rating'),
      reviewList = $('#reviewList'),
      error = $('#error');
      
    error.hide();
  
    reviewForm.submit(function (event) {
      event.preventDefault();

      error.hide();

      let username = $('#username').val();
      let content = reviewContent.val();
      let title = reviewTitle.val();
      let rating = reviewRating.val();

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
          data: $('#reviewForm').serializeArray()
        };
        $.ajax(requestConfig).then(function (responseMessage) {
          let newReview = $('<div></div>');
          let a = $('<a></a>').text(username);
          a.attr('href', "/users/"+username)
          newReview.append(a);
          newReview.append($('<h2></h2>').text(title));
          newReview.append($('<p></p>').text(rating));
          newReview.append($('<p></p>').text(content));
          reviewList.append(newReview);
        });
      } 
    });

})(window.jQuery);  