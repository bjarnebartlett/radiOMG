import './news_list.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Posts } from '../../../api/posts/posts_collection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.newsList.onCreated(function () {
  var self = this;
  self.pagination = new Meteor.Pagination(Posts, { sort: { showDate: -1 }, perPage: 8 });
});

Template.newsList.onRendered(function () {
  Session.set('documentTitle', 'KTUH Honolulu | Radio For The People');
  $('.news-list').imagesLoaded(function() {
    $('.news-list').masonry({
      itemSelector: '.news-list__post',
      transitionDuration: 0,
      isResizeBound: true
    });
  });
  window.setTimeout(function() {
    $('.news-list').masonry('reloadItems').masonry('layout');
  }, 1500);
});

Template.newsList.helpers({
  newsPagePath: (slug) => FlowRouter.path('news/:slug', { slug: slug }),
  excerpt: (body) => body.replace(/(([^\s]+\s\s*){100})(.*)/,"$1…"),
  posts: () => Template.instance().pagination.getPage(),
  templatePagination: () => Template.instance().pagination,
  clickEvent: () => {
    window.setTimeout(function() {
      $('.news-list').masonry('reloadItems').masonry('layout');
    }, 1000);
  }
});
