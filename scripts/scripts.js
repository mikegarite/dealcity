		navigator.geolocation.getCurrentPosition(locationHandler);
		var tagArray = [];

		function locationHandler(position) {
		  var lat = position.coords.latitude;
		  var lng = position.coords.longitude;
		  runGroupon(lat, lng)
		}

		function runGroupon(lat, lng) {
		  $('span').removeClass('active');
		  $('#results').empty();
		  $('body').attr('data-count','0');
		  $.ajax({
		    url: 'http://api.yipit.com/v1/deals/',
		    dataType: 'jsonp',
		    data: {
		      key: '65Ay6xeamWBJSVep',
		      limit: '40',
		      lat: lat,
		      lon: lng,
		      radius: '50'
		    }, // callback is not necessary
		    success: function (data) {
		      var len = data.response.deals.length;
		      console.log(data);
		      var cur_division = data.response.deals[0].division.name;
		      var cur_division_slug = data.response.deals[0].division.slug;
		      var view_more = data.meta.next;
		      var tags = "";
		      var tags_slug = "";
		      for (var i = 0; i < len; i++) {
		        var ti_len = data.response.deals[i].tags.length;
		        for (ti = 0; ti < ti_len; ti++) {
		          tags = data.response.deals[i].tags[ti].name;
		          tags_slug += data.response.deals[i].tags[ti].slug + ' ';
		          tagArray.push(tags);
		        }
		        //	     			var tagLen = data.deals[i].tags.length;
		        // 	     			for (var x=0; x<tagLen; x++){
		        var results_content = "<div class='deal' class='" + tags_slug + "'>";
		        results_content += "<a target='_blank' href=" + data.response.deals[i].url + "><img src='" + data.response.deals[i].images.image_smart + "'/></a>";
		        results_content += "<div class='details'><div class='title'><a target='_blank' href=" + data.response.deals[i].url + ">" + data.response.deals[i].title + "</a></div></div>";
		        results_content += "<div class='deal-info'><span class='price-value'><span class='symbol-left'>$</span>" + data.response.deals[i].price.raw + "</span></span></div>";
		        results_content += "<div class='discount'><span class='discount-amount amount'>" + data.response.deals[i].discount.raw + "</span><div class='discount-label'><span class='symbol-right'>%</span><span class='discount-label-text text'>off</span></div></div>";
		        results_content += "<div class='time-info deal-info-50'><strong><span class='text'>" + data.response.deals[i].date + "</span></strong><span class='text'> ago on </span><div class='source'><strong>" + data.response.deals[i].source.name + "</strong></div></div>";
		        results_content += "</div>";
		        // 	     			 		results_content += data.deals[i].highlightsHtml+'<br />';
		        //	    			 		results_content += data.response.deals[i].description+'<br />';
		        $('#results').append(results_content);
		        tags_slug = "";
		      }
		      $('body').append('<button id="view-more" data-viewmore="' + view_more + '">View More Results</button>');
		      $.ajax({
		        url: 'http://api.yipit.com/v1/divisions/',
		        dataType: 'jsonp',
		        data: {
		          key: '65Ay6xeamWBJSVep',
		          limit: '119'
		        }, // callback is not necessary
		        success: function (dataDivision) {
		          var len_d = dataDivision.response.divisions.length;
		          $('header').append('<span class="cur-division" data-curdivision="' + cur_division_slug + '">' + cur_division + '</span>');
		          for (var j = 0; j < len_d; j++) {
		            var division_active = dataDivision.response.divisions[j].active;
		            var division_slug = dataDivision.response.divisions[j].slug;
		            var division_name = dataDivision.response.divisions[j].name;
		            if (division_active == 1) {
		              $('select.division-list').append('<option value="' + division_slug + '">' + division_name + '</option>');
		            }
		          }
		          counter = []
		          tagArray.forEach(function (obj) {
		            var key = JSON.stringify(obj)
		            counter[key] = (counter[key] || 0) + 1
		          })
		          for (var name in counter) {
		            var value = counter[name];
		            $('#filters .by-tag').append('<p>' + name.substring(1, name.length - 1) + '<span> ' + value + '</span></p>')
		          }
		          console.log(counter)
		          for (var key in counter) {
		            console.log(key);
		          }
		        }
		      });
		    }
		  });
		}

		function runMore(viewMore) {
		  var viewMore_ = '';
		  viewMore_ = viewMore;
		  $('body').attr('data-count', $('body').attr('data-count') + 1));
		  $.ajax({
		    url: viewMore,
		    dataType: 'jsonp',
		    success: function (dataMore) {
		      var len = dataMore.response.deals.length;
		      console.log(dataMore);
		      var view_more = dataMore.meta.next;
		      $('#view-more').attr('data-viewMore', '');
		      $('#view-more').attr('data-viewMore', dataMore.meta.next);
		      var tags = "";
		      var tags_slug = "";
		      var tagArray_ = [];
		      for (var i = 0; i < len; i++) {
		        var ti_len = dataMore.response.deals[i].tags.length;
		        for (ti = 0; ti < ti_len; ti++) {
		          tags = dataMore.response.deals[i].tags[ti].name;
		          tags_slug += dataMore.response.deals[i].tags[ti].slug + ' ';
		          tagArray_.push(tags);
		        }
		        var results_content = "<div class='deal'>";
		        results_content += "<a target='_blank' href=" + dataMore.response.deals[i].url + "><img src='" + dataMore.response.deals[i].images.image_smart + "'/></a>";
		        results_content += "<div class='details'><div class='title'><a target='_blank' href=" + dataMore.response.deals[i].url + ">" + dataMore.response.deals[i].title + "</a></div></div>";
		        results_content += "<div class='deal-info'><span class='price-value'><span class='symbol-left'>$</span>" + dataMore.response.deals[i].price.raw + "</span></span></div>";
		        results_content += "<div class='discount'><span class='discount-amount amount'>" + dataMore.response.deals[i].discount.raw + "</span><div class='discount-label'><span class='symbol-right'>%</span><span class='discount-label-text text'>off</span></div></div>";
		        results_content += "<div class='time-info deal-info-50'><strong><span class='text'>" + dataMore.response.deals[i].date + "</span></strong><span class='text'> ago on </span><div class='source'><strong>" + dataMore.response.deals[i].source.name + "</strong></div></div>";
		        results_content += "</div>";
		        $('#results').append(results_content);
		      }
		      $('body').append('<button id="view-more" data-viewmore="' + view_more + '">View More Results</button>');
		      $('#filters .by-tag').empty();
		      counter = []
		      tagArray = tagArray.concat(tagArray_)
		      tagArray.forEach(function (obj) {
		        var key = JSON.stringify(obj)
		        counter[key] = (counter[key] || 0) + 1
		      })
		      for (var name in counter) {
		        var value = counter[name];
		        $('#filters .by-tag').append('<p>' + name.substring(1, name.length - 1) + '<span> ' + value + '</span></p>')
		      }
		      //  }
		    }
		  });
		}

		function divisionChange(division_change) {
		  var division_change_ = '';
		  division_change_ = division_change;
		  $.ajax({
		    url: 'http://api.yipit.com/v1/deals/',
		    dataType: 'jsonp',
		    data: {
		      key: '65Ay6xeamWBJSVep',
		      limit: '40',
		      division: division_change_
		    },
		    success: function (divisionChange) {
		      var len = divisionChange.response.deals.length;
		      console.log(divisionChange);
		      var view_more = divisionChange.meta.next;
		      $('#view-more').attr('data-viewMore', '');
		      $('#view-more').attr('data-viewMore', divisionChange.meta.next);
		      for (var i = 0; i < len; i++) {
		        //	     			var tagLen = data.deals[i].tags.length;
		        // 	     			for (var x=0; x<tagLen; x++){
		        var results_content = "<div class='deal'>";
		        results_content += "<a target='_blank' href=" + divisionChange.response.deals[i].url + "><img src='" + divisionChange.response.deals[i].images.image_smart + "'/></a>";
		        results_content += "<div class='details'><div class='title'><a target='_blank' href=" + divisionChange.response.deals[i].url + ">" + divisionChange.response.deals[i].title + "</a></div></div>";
		        results_content += "<div class='deal-info'><span class='price-value'><span class='symbol-left'>$</span>" + divisionChange.response.deals[i].price.raw + "</span></span></div>";
		        results_content += "<div class='discount'><span class='discount-amount amount'>" + divisionChange.response.deals[i].discount.raw + "</span><div class='discount-label'><span class='symbol-right'>%</span><span class='discount-label-text text'>off</span></div></div>";
		        results_content += "<div class='time-info deal-info-50'><strong><span class='text'>" + divisionChange.response.deals[i].date + "</span></strong><span class='text'> ago on </span><div class='source'><strong>" + divisionChange.response.deals[i].source.name + "</strong></div></div>";
		        results_content += "</div>";
		        // 	     			 		results_content += data.deals[i].highlightsHtml+'<br />';
		        //	    			 		results_content += data.response.deals[i].description+'<br />';
		        $('#results').append(results_content);
		      }
		      $('body').append('<button id="view-more" data-viewmore="' + view_more + '">View More Results</button>');
		      //  }
		    }
		  });
		}
		$(function () {
		  $(window).keydown(function (event) {
		    if (!$('.search-current').length) {
		      $('#text-input').focus().addClass('search-current');
		    }
		  });
		  $('body').on('click', 'span', function () {
		    runGroupon($(this).attr('data-tag'))
		  });
		  $('.search-current').blur(function () {
		    alert('Handler for .blur() called.');
		  });
		  $('#text-input').blur(function () {
		    $(this).removeClass("search-current");
		  });
		  $('#search').click(function () {
		    var search_value = $('#text-input').val();
		    runGroupon(search_value);
		  });
		  $('body').on('click', '#view-more', function () {
		    runMore($(this).data('viewmore'));
		    $('#view-more').remove();
		  });
		  $("select.division-list").change(function () {
		    var division_change = $(".division-list option:selected").val();
		    $('#results').empty();
		    $('#view-more').remove();
		    $('.cur-division').text($(".division-list option:selected").text());
		    divisionChange(division_change);
		  });
		  $(window).scroll(function () {
		    if (document.body.scrollHeight - $(this).scrollTop() <= $(this).height()) {
		      $('#view-more').trigger('click');
		    }
		  });
		});