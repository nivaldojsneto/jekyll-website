//= require libs/jquery-3.3.1.min.js
//= require libs/owl.carousel.min.js
//= require libs/jquery.validate.min.js
//= require libs/jquery.mask.min.js
//= require libs/sweetalert.min.js

$(function () {
  function menuBackground() {
    var scroll = $(window).scrollTop();

    if (scroll > $('#header').height()) {
      $('#header').addClass('with-background');
    } else {
      $('#header').removeClass('with-background');
    }
  }

  menuBackground();

  $(window).scroll(function () {
    menuBackground();
  });

  $('#banner .banners').owlCarousel({
    loop: true,
    dots: true,
    autoplay: true,
    responsive: {
      0: { items: 1 },
    }
  });
   

  var hashTagActive = "";
  $("#menu li a").on("click touchstart", function (event) {
    if (hashTagActive != this.hash) {
      var dest = 0;
      if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
        dest = $(document).height() - $(window).height();
      } else {
        dest = $(this.hash).offset().top;
      }
      //go to destination
      $('html, body').animate({
        scrollTop: dest - 85
      }, 500, 'swing');
      hashTagActive = this.hash;
    }

    // $(".navbar-collapse").collapse('hide');
  });

  // Contact Form Validation
  $("#contact-form").validate({
    rules: {
      name: "required",
      email: {
        required: true,
        email: true
      },
      phone: "required",
      message: "required",
    },
    messages: {
      name: "Preencha o campo nome.",
      email: "Preencha um e-mail válido.",
      phone: "Preencha o campo telefone.",
      message: "Preencha o campo mensagem.",
    },
  });

  // Phone input mask
  var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  }, spOptions = {
    onKeyPress: function (val, e, field, options) {
      field.mask(SPMaskBehavior.apply({}, arguments), options);
    }
  };

  $('.phone').mask(SPMaskBehavior, spOptions);

  // Contact Form Submit
  $(document).on('submit', '#contact-form', function (e) {
    e.preventDefault();

    var name = $(this).find("input[name='name']").val();
    var email = $(this).find("input[name='email']").val();
    var phone = $(this).find("input[name='phone']").val();
    var message = $(this).find("textarea[name='message']").val();

    var button = $(this).find("button[type='submit']");
    var buttonText = button.text();

    button.prop("disabled", true);
    button.html("Aguarde...");
    // Returns successful data submission message when the entered information is stored in database.
    $.ajax("https://89poc32quj.execute-api.us-west-2.amazonaws.com/prod/sendMail", {
      type: "POST",
      data: JSON.stringify({ name, email, phone, message }),
      headers: { "Content-Type": "application/json", },
      crossDomain: true,
    }).done(function (data) {
      $(this).trigger('reset');
      swal("Mensagem Enviada!", data, "success");
      button.prop("disabled", false);
      button.html(buttonText);
    }).fail(function (xhr, status, error) {
      swal("Ops!", error, "error");
      button.prop("disabled", false);
      button.html(buttonText);
    });
  });
});