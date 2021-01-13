ajax_get('js/data.json', loadData);

function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      //console.log('responseText:' + xmlhttp.responseText);
      try {
        var cardsData = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(cardsData);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function loadData(cardsData) {
  console.log(cardsData);

  let cardsDataMarkup = '';

  for (x in cardsData.root) {
    cardsDataMarkup += '<h2 class="my-4" id="' + cardsData.root[x].genreName + '">' + cardsData.root[x].genreName.toUpperCase() + '</h2>'
    for (y in cardsData.root[x].genreData) {
      let id = cardsData.root[x].genreData[y].id;
      let img = cardsData.root[x].genreData[y].img;
      let productName = cardsData.root[x].genreData[y].productName;
      let recordLabel = cardsData.root[x].genreData[y].recordLabel;
      let productCondition = cardsData.root[x].genreData[y].productCondition;
      let productPrice = cardsData.root[x].genreData[y].productPrice;
      let link = cardsData.root[x].genreData[y].link;

      if (y == 0) {
        cardsDataMarkup += '<div class="row">';
      } else if (y % 4 == 0) {
        cardsDataMarkup += '</div>';
        cardsDataMarkup += '<div class="row">';
      }

      cardsDataMarkup += '<div class="col-lg-3 col-md-6 mb-4">' +
        '<div class="card h-100" data-id="' + id + '">' +
        ' <img class="card-img-top" src="' + img + '" alt="">' +
        '  <div class="card-body">' +
        '   <h6 class="card-title productName">' + productName + '</h6>' +
        '   <p class="card-title recordLabel">' + recordLabel + '<p>' +
        '   <p class="productCondition card-text">' + productCondition + '</p>' +
        ' </div>' +
        ' <div class="card-footer text-center">' +
        '   <h6 class="productPrice"><i class="fas fa-euro-sign"></i>' + productPrice + '</h6>' +
        '   <a class="btn btn-warning" href="' + link + '"' +
        '     target="_blank"><i class="fas fa-headphones"></i> Listen</a>' +
        '   <button type="button" class="btn btn-success addToCart">Add to Cart</button>' +
        ' </div>' +
        '</div>' +
        '</div>'

      if (cardsData.root[x].genreData.length - 1 == y) {
        cardsDataMarkup += '</div>';
      }
    };
  };
  document.getElementById('cardTest').innerHTML = cardsDataMarkup;
  // search
  $(function () {
    $('#searchable-container').searchable({
      searchField: '#container-search',
      selector: '.col-lg-3',
      childSelector: '.card-title',
      show: function (elem) {
        elem.slideDown(100);
      },
      hide: function (elem) {
        elem.slideUp(100);
      }
    })
  });

  $('body').on('click', '.sendOrder', function () {
    if ($("#tableBody").children().length === 0) {
      $("#specialMsg").html('Your cart is empty!');
      $('#shopingCart').modal('toggle');
      $('#specialMsgBlock').modal('show');
      //alert('Your cart is empty.');
      return false;
    }

    if (!validEmail($.trim($("#email").val()))) {
      $("#noneValidEmail").text('Must be a valid email address!');
      return false;
    }

    var tabBodyVal = getTBody();
    var tBodyCSV = getBodyValues(tabBodyVal);
    var b = tBodyCSV + "\n";
    var tabFootVal = getTFoot();
    var tFootCSV = getFootValues(tabFootVal);
    var f = tFootCSV + "\n";
    var ts = Math.round((new Date()).getTime() / 1000);
    var order = 'Order Number: ' + ts + "\n" + b + f;
    $("#message").val(order);
    $("#subject").val('Order no.: ' + ts);
    $("#replyto").val(tabFootVal[3].userEmail);
  });

  $('body').on('click', '.copyToClipboard', function () {
    var tabBodyVal = getTBody();
    var tBodyCSV = getBodyValues(tabBodyVal);
    var b = tBodyCSV + "\n";
    var tabFootVal = getTFoot();
    var tFootCSV = getFootValues(tabFootVal);
    var f = tFootCSV + "\n";
    var $temp = $("<input>");
    $("tbody").append($temp);
    var ts = Math.round((new Date()).getTime() / 1000);
    var order = 'Order Number: ' + ts + "\n" + b + f;
    $temp.val(order).select();
    document.execCommand("copy");
    $temp.remove();
  });

  // smooth scrolling
  $('.nav-link, .navbar-brand, .new-button').click(function () {
    var sectionTo = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(sectionTo).offset().top
    }, 1500);
  });

  // cart
  var itemCounter = 0;
  var priceTotalSum = 0;
  // add to Cart
  $('.addToCart').click(function () {
    itemCounter++;
    var productName = $(this).closest('.card').children('.card-body').children('.productName').text();
    var productId = $(this).closest('.card').attr('data-id');
    var condition = $(this).closest('.card').children('.card-body').children('.productCondition ').text();
    var price = parseFloat($(this).closest('.card').children('.card-footer').children('.productPrice').text().replace(',', '.'));
    var markup = "<tr id=" +
      productId + "><td scope='row' class='itemId'>" +
      itemCounter + "</td><td>" +
      productName + "</td>" +
      "<td class='price'><i class='fas fa-euro-sign'></i>" + price.toFixed(2).toString().replace('.', ',') + "</td>" +
      "<td style='display:none'>" + condition + "</td>" +
      "<td><button type='button' class='close removeItem'><span aria-hidden='true'>×</span></button></td></tr>";
    $('table tbody').append(markup);
    $('.badgeItemCount').text(itemCounter);
    var countryTariff = getRadioValue();
    var shippingTotal = shipping(itemCounter, countryTariff);
    var appShippingTotal = "<td id='cartShipping' colspan='2'><i class='fas fa-euro-sign'></i>" + shippingTotal[0].toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartShipping').replaceWith(appShippingTotal);
    var shippingTariff = "<div id='shippingTariff'>" + shippingTotal[1] + "</div>";
    $('#shippingTariff').replaceWith(shippingTariff);
    priceTotalSum += price;
    var total = calculateTotal(priceTotalSum, shippingTotal[0], 'add');
    var appPriceTotal = "<td id='cartTotal' colspan='2'><i class='fas fa-euro-sign'></i>" + total.toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartTotal').replaceWith(appPriceTotal);
    $(this).attr("disabled", true);
  });

  // delete from Cart
  $('body').on('click', '.removeItem', function () {
    var price = parseFloat($(this).parent().siblings('.price').text().replace(',', '.'));
    var productId = $(this).parent().parent().attr('id');
    $(this).parent().parent().remove();
    itemCounter--;
    $(".itemId").each(function (index) {
      $(this).html(parseInt(index) + 1)
    });
    $('.badgeItemCount').text(itemCounter);
    var countryTariff = getRadioValue();
    var shippingTotal = shipping(itemCounter, countryTariff);
    var appShippingTotal = "<td id='cartShipping' colspan='2'><i class='fas fa-euro-sign'></i>" + shippingTotal[0].toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartShipping').replaceWith(appShippingTotal);
    var shippingTariff = "<div id='shippingTariff'>" + shippingTotal[1] + "</div>";
    $('#shippingTariff').replaceWith(shippingTariff);
    priceTotalSum -= price;
    var total = calculateTotal(priceTotalSum, shippingTotal[0]);
    var appPriceTotal = "<td id='cartTotal' colspan='2'><i class='fas fa-euro-sign'></i>" + total.toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartTotal').replaceWith(appPriceTotal);
    $('[data-id="' + productId + '"]').children('.card-footer').children('.addToCart').attr("disabled", false);
  });

  // recalculate shipping
  $('body').on('click', '[name="shippingTo"]', function () {
    $('.badgeItemCount').text(itemCounter);
    var countryTariff = this.value;
    var shippingTotal = shipping(itemCounter, countryTariff);
    var appShippingTotal = "<td id='cartShipping' colspan='2'><i class='fas fa-euro-sign'></i>" + shippingTotal[0].toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartShipping').replaceWith(appShippingTotal);
    var shippingTariff = "<div id='shippingTariff'>" + shippingTotal[1] + "</div>";
    $('#shippingTariff').replaceWith(shippingTariff);
    var total = calculateTotal(priceTotalSum, shippingTotal[0]);
    var appPriceTotal = "<td id='cartTotal' colspan='2'><i class='fas fa-euro-sign'></i>" + total.toFixed(2).toString().replace('.', ',') + "</td>";
    $('#cartTotal').replaceWith(appPriceTotal);
  });

}

function validEmail(email) {
  var testResp;
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  testResp = re.test(email);
  return testResp;
}

function getFootValues(tabBodyVal) {
  var str = "";
  $.each(tabBodyVal, function (k, v) {
    $.each(v, function (key, val) {
      console.log(k + "-" + key + ":" + val);
      if (key === "shippingCost") {
        str += " €" + val + ";";
      } else if (key === "shippingTariff") {
        str += " " + val + ",";
      } else if (key === "priceTotal") {
        str += " Total: €" + val + ";";
      } else if (key === "userName") {
        str += " User Name: " + val + ";";
      } else if (key === "userEmail") {
        str += " User Email: " + val + ";";
      }
    });
    str += '\n';
  });
  return str;
}

function getBodyValues(tabFootVal) {
  var str = "";
  $.each(tabFootVal, function (k, v) {
    $.each(v, function (key, val) {
      if (key === "rowNo") {
        str += val + ".";
      } else if (key === "dataId") {
        str += "";
      } else if (key === "productName") {
        str += val;
      } else if (key === "productCondition") {
        str += "(" + val + "):";
      } else if (key === "price") {
        str += " €" + val + ";";
      }
    });
    str += '\n';
  });
  return str;
}

function getTBody() {
  var tableBodyData = new Array();
  $('#cartTable tbody tr').each(function (row, tr) {
    tableBodyData[row] = {
      "rowNo": $(tr).find('td:eq(0)').text(),
      "dataId": $(tr).attr('id'),
      "productName": $(tr).find('td:eq(1)').text(),
      "productCondition": $(tr).find('td:eq(3)').text(),
      "price": $(tr).find('td:eq(2)').text()
    }
  });
  return tableBodyData;
}

function getTFoot() {
  var tableFootData = new Array();
  $('#cartTable tfoot tr').each(function (row, tr) {
    if (row === 0) {
      tableFootData[row] = {
        "shippingTariff": $(tr).find('#shippingTariff').text(),
        "shippingCost": $(tr).find('#cartShipping').text()
      }
    } else if (row === 1) {
      tableFootData[row] = {
        "priceTotal": $(tr).find('#cartTotal').text()
      }
    } else if (row === 2) {
      tableFootData[row] = {
        "userName": $(tr).find('#name').val()
      }
    } else if (row === 3) {
      tableFootData[row] = {
        "userEmail": $(tr).find('#email').val()
      }
    }
  });
  return tableFootData;
}

function calculateTotal(a, b) {
  return a + b;
}

function getRadioValue() {
  var radioValue;
  var radios = document.getElementsByName('shippingTo');
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      radioValue = radios[i].value;
      break;
    }
  }
  return radioValue;
}

function shipping(itemCount, countryTariff) {
  var shippingArray;
  if (countryTariff === 'DE') {
    if (itemCount > 0 && itemCount <= 30) {
      shippingArray = [5, 'Shipping 1 to 30 x 12" in DE'];
    } else if (itemCount > 30 && itemCount <= 80) {
      shippingArray = [6, 'Shipping 31 to 80 x 12" in DE'];
    } else if (itemCount > 80) {
      shippingArray = [0, 'Shipping 80 and more x 12 in DE", individual pricing'];
    } else {
      shippingArray = [0, ''];
    }
  } else if (countryTariff === 'EU') {
    if (itemCount > 0 && itemCount <= 30) {
      shippingArray = [14, 'Shipping 1 to 30 x 12" in EU'];
    } else if (itemCount > 30 && itemCount <= 80) {
      shippingArray = [19, 'Shipping 31 to 80 x 12 " in EU'];
    } else if (itemCount > 80) {
      shippingArray = [0, 'Shipping 80 and more x 12 in EU", individual pricing'];
    } else {
      shippingArray = [0, ''];
    }
  }
  return shippingArray;
}
