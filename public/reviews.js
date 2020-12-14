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
        console.log($('#restaurantId').val());
        let requestConfig = {
          method: 'POST',
          url: '/restaurants/' + $('#restaurantId').val() + '/reviews',
          data: $('#reviewForm').serializeArray()
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