if (!window.console) {
  console = {
    error: function () {},
    log: function () {},
    debug: function () {}
  }
}
var api_url = "http://api.yipit.com/v1",
  api_deals_url = api_url + "/deals/",
  api_key = "65Ay6xeamWBJSVep",
  api_limit = "40",
  api_radius = "50",
  tagArray = [];
var App = {
  init: function () {
    var e = this,
      t = "",
      n = "",
      r = [];
    e.addListeners();
    e.locationHandlerInit()
  },
  addListeners: function () {
    var e = this;
    $(window).keydown(function (e) {
      if (!$(".search-current").length) {
        $("#text-input").focus().addClass("search-current")
      }
    });
    $("body").on("click", "span", function () {
      runGroupon($(this).attr("data-tag"))
    });
    $(".search-current").blur(function () {
      alert("Handler for .blur() called.")
    });
    $("#text-input").blur(function () {
      $(this).removeClass("search-current")
    });
    $("#search").click(function () {
      var e = $("#text-input").val();
      runGroupon(e)
    });
    $(".division-list").on("click", "ul li", function () {
      var t = $(this).attr("data-division");
      e.loadDivisionDeals(t);
      e.closeDivisionDrawer()
    });
    $(".category-choice").on("click", "p", function () {
      var t = $(this).attr("data-category");
      e.loadCategories(t);
      e.closeCategoryDrawer()
    });
    $(window).on("scroll", function () {
      if (document.body.scrollHeight - $(this).scrollTop() <= $(this).height()) {
        e.loadMoreDeals()
      }
    });
    $(".by-tag").on("click", "p", function () {
      var t = $(this);
      e.filterByTag(t)
    });
    $(".filters").click(function () {
      e.filtersDrawer()
    });
    $(".current-division").click(function () {
      if ($(this).hasClass("active")) {
        e.closeDivisionDrawer()
      } else {
        e.divisionDrawer()
      }
    });
    $("#filters .by-tag").on("mouseover", "p", function () {
      $(this).animate({
        width: 170
      }, 50)
    });
    $("#filters .by-tag").on("mouseout", "p", function () {
      $(this).animate({
        width: 165
      }, 50)
    });
    $(".category-change").click(function () {
      if ($(this).hasClass("active")) {
        e.closeCategoryDrawer()
      } else {
        e.categoryDrawer()
      }
    });
    $(window).resize(function () {
      t(function () {
        $("#results, .header-inner").width($(window).width() - 218);
        $(".header-inner").width($(window).width() - 198)
      }, 500, "some unique string")
    });
    var t = function () {
      var e = {};
      return function (t, n, r) {
        if (!r) {
          r = "Don't call this twice without a uniqueId"
        }
        if (e[r]) {
          clearTimeout(e[r])
        }
        e[r] = setTimeout(t, n)
      }
    }();
    $("#results").width($(window).width() - 218)
  },
  locationHandlerInit: function () {
    function t(t) {
      var n = t.coords.latitude;
      var r = t.coords.longitude;
      e.runGroupon(n, r)
    }
    var e = this;
    navigator.geolocation.getCurrentPosition(t)
  },
  dealsTemplate: function (e, t, n, r, i, s, o, u, a, f, l, c) {
    var h = new Date;
    var p = new Date(u.replace(/-/g, "/"));
    var d = Math.abs((h - p) / (1e3 * 60 * 60 * 24));
    d = Math.round(d * 10) / 10;
    days = d.toString().split(".")[0];
    hours = d.toString().replace(/^[^\.]+/, "").slice(1);
    if (hours > 1) {
      hours = hours + " hours"
    } else {
      hours = hours + " hour"
    } if (days == 0) {
      days = ""
    } else if (days > 1) {
      days = days + " days"
    } else {
      days = days + " day"
    }
    var v = this,
      m = "<div data-id='" + t + "' data-index='" + e + "' class='deal'>";
    m += "<a target='_blank' href=" + n + "><img src='" + r + "'/></a>";
    m += "<div class='details'><div class='title'><a target='_blank' href=" + n + ">" + i + "</a></div>";
    m += "<div class='deal-info'><span class='price-value'><span class='symbol-left'>$</span>" + s + "</span></span></div>";
    m += "<div class='discount'><span class='discount-amount amount'>" + o + "</span><div class='discount-label'><span class='symbol-right'>%</span><span class='discount-label-text text'>off</span></div></div>";
    m += "<div class='time-info deal-info-50'><strong><span class='text'>" + days + " " + hours + "</span></strong><span class='text'> ago on </span><div class='source'><strong>" + a + "</strong></div></div>";
    m += "<div class='business-info'><a target='_blank' href='" + l + "'>" + f + "</a><span class='business-name'></span><span class='business-address'>" + c + "</span></div>";
    m += "</div>";
    m += "</div>";
    v.populateResults(m)
  },
  populateResults: function (e) {
    $("#results").append(e)
  },
  runGroupon: function (e, t) {
    var n = this;
    tagArray = [];
    n.runLoader();
    $("body").attr("data-count", "0");
    $.ajax({
      url: api_deals_url,
      dataType: "jsonp",
      data: {
        key: api_key,
        limit: api_limit,
        lat: e,
        lon: t,
        radius: api_radius
      },
      success: function (e) {
        var t = e.response.deals.length;
        var r = e.response.deals[0].division.name;
        var i = e.response.deals[0].division.slug;
        var s = e.meta.next,
          o = e.response.deals,
          t = o.length;
        for (var u = 0; u < t; u++) {
          var a = u,
            f = o[u].id,
            l = o[u].url,
            c = o[u].images.image_smart,
            h = o[u].title,
            p = o[u].price.raw,
            d = o[u].discount.raw,
            v = o[u].date_added,
            m = o[u].source.name,
            g = o[u].business.name,
            y = o[u].business.url,
            b = o[u].business.locations[0].address + "," + o[u].business.locations[0].locality;
          if (typeof b === "undefined") {
            b = "sdsd"
          }
          n.dealsTemplate(a, f, l, c, h, p, d, v, m, g, y, b)
        }
        $("body").append('<input id="view-more" value="' + s + '" />');
        $.ajax({
          url: "http://api.yipit.com/v1/divisions/",
          dataType: "jsonp",
          data: {
            key: "65Ay6xeamWBJSVep",
            limit: "119"
          },
          success: function (e) {
            var t = e.response.divisions.length;
            for (var n = 0; n < t; n++) {
              var r = e.response.divisions[n].active;
              var i = e.response.divisions[n].slug;
              var s = e.response.divisions[n].name;
              if (r == 1) {
                $(".division-list").append('<li data-division="' + i + '">' + s + "</li>")
              }
            }
            var o = $("div.division-list > li");
            for (var u = 0; u < o.length; u += 20) {
              o.slice(u, u + 20).wrapAll('<ul class="divisions"></ul>')
            }
          }
        });
        n.runTags(e);
        n.runCurrentDivision(r, i)
      }
    })
  },
  runMore: function (e) {
    var t = this,
      n = "",
      r = "",
      i = "",
      n = e;
    t.runLoader();
    n = e;
    $.ajax({
      url: e,
      dataType: "jsonp",
      success: function (e) {
        var n = e.meta.next,
          r = e.response.deals,
          i = r.length;
        t.nextDataUrl(n);
        console.log(e);
        var s = api_limit * Number($("body").attr("data-count"));
        for (var o = 0; o < i; o++) {
          var u = r[o].id,
            a = r[o].url,
            f = r[o].images.image_smart,
            l = r[o].title,
            c = r[o].price.raw,
            h = r[o].discount.raw,
            p = r[o].date_added,
            d = r[o].source.name,
            v = r[o].business.name,
            m = r[o].business.url,
            g = r[o].business.locations[0].address + "," + r[o].business.locations[0].locality;
          t.dealsTemplate(s, u, a, f, l, c, h, p, d, v, m, g);
          s++
        }
        $("#filters .by-tag").empty();
        t.runTags(e)
      }
    })
  },
  divisionChange: function (e) {
    var t = this,
      n = "";
    n = e;
    t.runLoader();
    $.ajax({
      url: api_deals_url,
      dataType: "jsonp",
      data: {
        key: api_key,
        limit: api_limit,
        division: n
      },
      success: function (e) {
        var n = e.response.deals[0].division.name;
        var r = e.response.deals[0].division.slug;
        var i = e.meta.next,
          s = e.response.deals,
          o = s.length;
        t.nextDataUrl(i);
        for (var u = 0; u < o; u++) {
          var a = u,
            f = s[u].id,
            l = s[u].url,
            c = s[u].images.image_smart,
            h = s[u].title,
            p = s[u].price.raw,
            d = s[u].discount.raw,
            v = s[u].date_added,
            m = s[u].source.name,
            g = s[u].business.name,
            y = s[u].business.url,
            b = "";
          if (s[u].business.locations.length != 0) {
            b = s[u].business.locations[0].address + "," + s[u].business.locations[0].locality
          }
          t.dealsTemplate(a, f, l, c, h, p, d, v, m, g, y, b)
        }
        t.runTags(e);
        t.runCurrentDivision(n, r)
      }
    })
  },
  categoryChange: function (e) {
    var t = this,
      n = "";
    currentDivision = $(".current-division").attr("data-curdivision");
    n = e;
    t.runLoader();
    $.ajax({
      url: api_deals_url,
      dataType: "jsonp",
      data: {
        key: api_key,
        limit: api_limit,
        division: currentDivision,
        tag: n
      },
      success: function (e) {
        var n = e.meta.next,
          r = e.response.deals,
          i = r.length;
        t.nextDataUrl(n);
        console.log(e);
        for (var s = 0; s < i; s++) {
          var o = s,
            u = r[s].id,
            a = r[s].url,
            f = r[s].images.image_smart,
            l = r[s].title,
            c = r[s].price.raw,
            h = r[s].discount.raw,
            p = r[s].date_added,
            d = r[s].source.name,
            v = r[s].business.name,
            m = r[s].business.url,
            g = "";
          if (r[s].business.locations.length != 0) {
            g = r[s].business.locations[0].address + "," + r[s].business.locations[0].locality
          }
          t.dealsTemplate(o, u, a, f, l, c, h, p, d, v, m, g)
        }
        $("#filters .by-tag").empty();
        t.runTags(e)
      }
    })
  },
  runTags: function (e) {
    var t = this;
    var n = e.response.deals.length,
      r = "",
      i = "";
    if (e.response.deals.length < api_limit) {
      t.removeLoader()
    }
    tagArray = [];
    for (var s = 0; s < n; s++) {
      var o = e.response.deals[s].id;
      var u = e.response.deals[s].tags.length;
      for (ti = 0; ti < u; ti++) {
        r = e.response.deals[s].tags[ti].name;
        i += e.response.deals[s].tags[ti].slug + " ";
        var a = r.toLowerCase().replace(/ /g, "-").replace(/'/g, "").split("/").join("");
        $(".deal[data-id=" + o + "]").addClass(a);
        tagArray.push(r)
      }
      i = ""
    }
    counter = [];
    tagArray.forEach(function (e) {
      var t = JSON.stringify(e);
      counter[t] = (counter[t] || 0) + 1
    });
    for (var f in counter) {
      var l = counter[f];
      var c = f.substring(1, f.length - 1);
      var a = c.toLowerCase().replace(/ /g, "-").replace(/'/g, "").split("/").join("");
      $("#filters .by-tag").append('<p data-tagFilter="' + a + '">' + c + "<span> " + l + "</span></p>")
    }
    var h = [];
    for (var p in counter) {
      var d = p.substring(1, p.length - 1);
      h.push(d)
    }
    console.log(h);
    $(".filter-catch p").each(function () {
      var e = $(this).attr("data-on");
      $('.by-tag p[data-tagfilter="' + e + '"]').addClass("show")
    });
    t.autoComplete(h);
    t.removeLoader()
  },
  loadCategories: function (e) {
    var t = this,
      n = e,
      r = "";
    switch (n) {
    case "date_night":
      r = "restaurants,bar-club,treats,museums,wine-tasting,city-tours,comedy-clubs,theatre,concerts,bowling,sporting-events,dance-classes,life-skills-classes";
      break;
    case "pamper_yourself":
      r = "massage,facial,manicure-pedicure,tanning,hair-salon,hair-removal,spa,teeth-whitening,makeup,mens-clothing,womens-clothing,chiropractic,dermatology";
      break;
    case "birthday_fun":
      r = "restaurants,bar-club,wine-tasting,city-tours,comedy-clubs,theatre,concerts,bowling,sporting-events,skydiving";
      break;
    case "be_adventurous":
      r = "skydiving,skiing,travel";
      break;
    case "grab_a_bite":
      r = "restaurants";
      break;
    case "get_away":
      r = "travel";
      break;
    case "move_your_body":
      r = "pilates,yoga,gym,boot-camp,golf,bowling,skiing,dance-classes,martial-arts,fitness-classes,personal-training";
      break;
    case "have_a_drink":
      r = "bar-club";
      break;
    case "girls_night_out":
      r = "restaurants,bar-club,wine-tasting,city-tours,comedy-clubs,theatre,concerts,bowling";
      break;
    case "boys_night_out":
      r = "restaurants,bar-club,wine-tasting,city-tours,comedy-clubs,theatre,concerts,bowling,sporting-events";
      break;
    case "do_something_different":
      r = "museums,wine-tasting,city-tours,comedy-clubs,theatre,concerts,golf,bowling,sporting-events,skydiving,outdoor-adventures,skiing,dance-classes,travel,life-skills-classes";
      break;
    case "explore_the_city":
      r = "restaurants,bar-club,museums,wine-tasting,city-tours,comedy-clubs,theatre,concerts,outdoor-adventures";
      break;
    case "meet_new_people":
      r = "bar-club,yoga,gym,museums,city-tours,concerts,dance-classes,fitness-classes,life-skills-classes";
      break;
    case "give_a_gift":
      r = "restaurants,bar-club,massage,spa,mens-clothing,womens-clothing,wine-tasting,theatre,concerts,sporting-events";
      break
    }
    $("#results").empty();
    $("#view-more").remove();
    t.categoryChange(r)
  },
  loadMoreDeals: function () {
    var e = this;
    e.runMore($("#view-more").val());
    $("#view-more").remove()
  },
  loadDivisionDeals: function (e) {
    var t = this;
    $("#results").empty();
    $("#view-more").remove();
    t.divisionChange(e)
  },
  nextDataUrl: function (e) {
    $("#view-more").val();
    $("body").append('<input id="view-more" value="' + e + '" />')
  },
  runCurrentDivision: function (e, t) {
    $(".current-division").text(e).attr("data-curdivision", t);
    $(".division-list ul li").removeClass("current");
    $('li[data-division="' + t + '"]').addClass("current");
    $(".category-choice").css({
      left: $(".category-change").offset().left
    })
  },
  runLoader: function () {
    if ($(".overlay").length == 0) {
      $("body").append('<div class="overlay"><img class="loading" src="images/loading.gif"/></div>');
      $(".overlay").fadeIn(500)
    }
  },
  removeLoader: function () {
    $(".overlay").fadeOut(500, function () {
      $(".overlay").remove();
      $("body").attr("data-count", Number($("body").attr("data-count")) + 1)
    });
    var e = $(".deal:first").offset().left;
    var t = 0;
    var n = 0;
    $(".deal").each(function () {
      t = $(this).offset().left;
      if (n > 0 && t == e) {
        console.log("Breaks on element: " + n);
        return false
      }
      n++
    });
    if (n >= 4) {
      var r = n * 258 + (n * 20 + 20);
      $(".header-inner").width(r)
    }
  },
  filterByTag: function (e) {
    var t = e.attr("data-tagFilter");
    if (!$(e).hasClass("show")) {
      $(".deal." + t).addClass("show").fadeOut(500);
      $(e).addClass("show");
      $(".filter-catch").append('<p data-on="' + t + '"></p>')
    } else {
      $(".deal." + t).removeClass("show").fadeIn(500);
      $(e).removeClass("show");
      $('.filter-catch p[data-on="' + t + '"]').remove()
    }
  },
  divisionDrawer: function () {
    $(".division-list").animate({
      top: 66
    }, 200);
    $("body").addClass("blur");
    $(".current-division").addClass("active")
  },
  closeDivisionDrawer: function () {
    $(".division-list").animate({
      top: -410
    }, 200);
    $("body").removeClass("blur");
    $(".current-division").removeClass("active")
  },
  categoryDrawer: function () {
    $(".category-choice").animate({
      top: 66
    }, 200);
    $("body").addClass("blur");
    $(".category-change").addClass("active")
  },
  closeCategoryDrawer: function () {
    $(".category-choice").animate({
      top: -420
    }, 200);
    $("body").removeClass("blur");
    $(".category-change").removeClass("active")
  },
  filtersDrawer: function (e) {
    if (!$(".filters").hasClass("show-filters")) {
      $(".filters").addClass("show-filters");
      $("#filters").animate({
        height: 100,
        padding: "20px 0"
      }, 400)
    } else {
      $(".filters").removeClass("show-filters");
      $("#filters").animate({
        height: 0,
        padding: 0
      }, 400)
    }
  },
  autoComplete: function (e) {
    $("#text-input").autocomplete({
      delay: 0,
      source: e
    })
  }
}