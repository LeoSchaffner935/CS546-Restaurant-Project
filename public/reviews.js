(function ($) {
    let reviewForm = $('#reviewForm'),
      reviewContent = $('#reviewContent'),
      reviewList = $('#reviewList'),
      error = $('#error');

    error.hide();
  
    reviewForm.submit(function (event) {
      event.preventDefault();

      let content = reviewContent.val();

      if (!content.trim()) {
        error.text('Review Content Cannot Be Empty');
        error.show();
      }
      else {
        let requestConfig = {
          method: 'POST',
          url: '/restaurant/' + restaurantId + '/reviews' // How to get restaurantId?
        };
        $.ajax(requestConfig).then(function (responseMessage) {
          let newReview = $('<div></div>');
          newReview.append($('<p></p>').text("Review by user:"));
          newReview.append($('<p></p>').text("Title:"))
          newReview.append($('<p></p>').text("Content:"));
          reviewList.append(newReview);
        });
      } 
    });

})(window.jQuery);  