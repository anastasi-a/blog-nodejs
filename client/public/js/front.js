/*global $, document, Chart, LINECHART, data, options, window, setTimeout*/
$(document).ready(function () {

    'use strict';

    // ------------------------------------------------------- //
    // For demo purposes only
    // ------------------------------------------------------ //

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });


    // ------------------------------------------------------- //
    // Equalixe height
    // ------------------------------------------------------ //
    function equalizeHeight(x, y) {
        var textHeight = $(x).height();
        $(y).css('min-height', textHeight);
    }

    equalizeHeight('.featured-posts .text', '.featured-posts .image');

    $(window).resize(function () {
        equalizeHeight('.featured-posts .text', '.featured-posts .image');
    });


    // ---------------------------------------------- //
    // Preventing URL update on navigation link click
    // ---------------------------------------------- //
    $('.link-scroll').bind('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top + 2
        }, 700);
        e.preventDefault();
    });


    // ---------------------------------------------- //
    // FancyBox
    // ---------------------------------------------- //
    $("[data-fancybox]").fancybox();


    // ---------------------------------------------- //
    // Divider Section Parallax Background
    // ---------------------------------------------- //
    $(window).on('scroll', function () {

        var scroll = $(this).scrollTop();

        if ($(window).width() > 1250) {
            $('section.divider').css({
                'background-position': 'left -' + scroll / 8 + 'px'
            });
        } else {
            $('section.divider').css({
                'background-position': 'center bottom'
            });
        }
    });


    // ---------------------------------------------- //
    // Search Bar
    // ---------------------------------------------- //
    $('.search-btn').on('click', function (e) {
        e.preventDefault();
        $('.search-area').fadeIn();
    });
    $('.search-area .close-btn').on('click', function () {
        $('.search-area').fadeOut();
    });


    // ---------------------------------------------- //
    // Navbar Toggle Button
    // ---------------------------------------------- //
    $('.navbar-toggler').on('click', function () {
        $('.navbar-toggler').toggleClass('active');
    });


    // ---------------------------------------------- //
    // Get form for changing user role
    // ---------------------------------------------- //
    $('.user-list').delegate('.role', "click", (event) => {
        event.preventDefault();
        if ($('#saveRole').length > 0) {
            alert('You are changing user role already!')
        } else {
            const id = $(event.target).attr('id');
            console.log(id);
            $("#" + id).replaceWith(` <form action="/users/" method="put" class="commenting-form" data-user="${id}"  id="saveRole">
                <select id="select" name="newRole" class="form-control form-control-sm form-control-role">
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
                <button type="submit" class="btn btn-outline-secondary btn-sm">Save</button></form>`);
        }
    });

    // ---------------------------------------------- //
    // Get form for changing comment status
    // ---------------------------------------------- //
    $('.comment-list').delegate('.status', "click", (event) => {
        event.preventDefault();
        if ($('#saveStatus').length > 0) {
            alert('You are changing comment status already!')
        } else {
            const id = $(event.target).attr('id');
            console.log(id);
            $("#" + id).replaceWith(` <form action="/comments/" method="put" class="commenting-form" data-comment="${id}"  id="saveStatus">
                <select id="select" name="newStatus" class="form-control form-control-sm form-control-role">
                  <option value="true">enable</option>
                  <option value="false">disable</option>
                </select>
                <button type="submit" class="btn btn-outline-secondary btn-sm">Save</button></form>`);
        }
    });


    // ---------------------------------------------- //
    // Get form for changing post status
    // ---------------------------------------------- //
    $('.post-list').delegate('.status', "click", (event) => {
        event.preventDefault();
        if ($('#saveStatus').length > 0) {
            alert('You are changing post status already!')
        } else {
            const id = $(event.target).attr('id');
            console.log(id);
            $("#" + id).replaceWith(` <form action="/posts/" method="put" class="commenting-form" data-post="${id}"  id="saveStatus">
                <select id="select" name="newStatus" class="form-control form-control-sm form-control-role">
                  <option value="true">enable</option>
                  <option value="false">disable</option>
                </select>
                <button type="submit" class="btn btn-outline-secondary btn-sm">Save</button></form>`);
        }
    });
});

// ---------------------------------------------- //
// Change and save user role
// ---------------------------------------------- //
$(() => {
    $('.user-list').delegate('#saveRole', "submit", (e) => {
        e.preventDefault();
        const userId = $('#saveRole').data('user');
        const newRole = $("#select").val();
        $.ajax({
            type: "PUT",
            url: "/users/" + userId,
            data: {
                newRole: newRole
            },
            error: function (e) {
                console.log(e);
            },
            success: function (user) {
                $("#saveRole").replaceWith(`
                <a href="#" id="${user.id}" class="role th btn-outline-secondary btn-sm">${user.role}</a>`);
            }
        });
    });
});

// ---------------------------------------------- //
// Create new comment
// ---------------------------------------------- //
$(() => {
    $('#sendComment').submit((e) => {
        e.preventDefault();
        const url = window.location.pathname;
        const postId = url.substring(url.lastIndexOf('/') + 1);
        console.log(postId);
        $.ajax({
            type: "POST",
            url: "/comments/" + postId,
            data: {
                text: $('#text').val()
            },
            error: function (e) {
                console.log(e);
            },
            success: function (user) {
                $('#text').val('');
                $(".post-comments").append(`
                <div class="comment">
                    <div class="comment-header d-flex justify-content-between">
                            <div class="user d-flex align-items-center">
                                <div class="image"><img src="${user.image}"  class="img-fluid rounded-circle"></div>
                                <div class="title"><strong>${user.username}</strong><span class="date">Just added</span></div>
                            </div>
                        </div>
                    <div class="comment-body">
                        <p>${user.comment.text}</p>
                    </div>
                </div>
                 `);
            }
        });
    });
});


// ---------------------------------------------- //
// Change and save comment status
// ---------------------------------------------- //
$(() => {
    $('.comment-list').delegate('#saveStatus', "submit", (e) => {
        e.preventDefault();
        const commentId = $('#saveStatus').data('comment');
        const newStatus = $("#select").val();
        $.ajax({
            type: "PUT",
            url: "/comments/" + commentId,
            data: {
                newStatus: newStatus
            },
            error: function (e) {
                console.log(e);
            },
            success: function (comment) {
                if (comment.status === true) {
                    $("#saveStatus").replaceWith(`
                <a href="#" id="${comment.id}" class="status bth btn-outline-secondary btn-sm">enable</a>`);
                } else {
                    $("#saveStatus").replaceWith(`
                <a href="#" id="${comment.id}" class="status bth btn-outline-secondary btn-sm">disable</a>`);
                }
            }
        });
    });
});

// ---------------------------------------------- //
// Change and save post status
// ---------------------------------------------- //
$(() => {
    $('.post-list').delegate('#saveStatus', "submit", (e) => {
        e.preventDefault();
        const postId = $('#saveStatus').data('post');
        console.log(postId);
        const newStatus = $("#select").val();
        $.ajax({
            type: "PUT",
            url: "/posts/" + postId,
            data: {
                newStatus: newStatus
            },
            error: function (e) {
                console.log(e);
            },
            success: function (post) {
                if (post.status === true) {
                    $("#saveStatus").replaceWith(`
                    <a href="#" id="${post.id}" class="status bth btn-outline-secondary btn-sm">enable</a>`);
                } else {
                    $("#saveStatus").replaceWith(`
                    <a href="#" id="${post.id}" class="status bth btn-outline-secondary btn-sm">disable</a>`);
                }
            }
        });
    });
});

// ---------------------------------------------- //
// Delete comment
// ---------------------------------------------- //
$(() => {
    $('.post-comments').delegate('.del', "click", (e) => {
        e.preventDefault();
        console.log('event');
        const commentId = $(e.target).data('id');
        $.ajax({
            type: "DELETE",
            url: "/comments/" + commentId,
            error: function (e) {
                console.log(e);
            },
            success: function (id) {
                $('#' + id).remove();
                console.log('Comment deleted');
            }
        });
    });
});

// ---------------------------------------------- //
// Delete post
// ---------------------------------------------- //
$(() => {
    $('.post-list').delegate('.del', "click", (e) => {
        e.preventDefault();
        console.log('event');
        const postId = $(e.target).data('id');
        $.ajax({
            type: "DELETE",
            url: "/posts/" + postId,
            error: function (e) {
                console.log(e);
            },
            success: function (id) {
                $('.' + id).replaceWith(`<span class="btn btn-outline-danger btn-sm" role="alert">Deleted!</span>`)
                console.log('post deleted');
            }
        });
    });
});
