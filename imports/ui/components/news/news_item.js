import './news_item.html';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Posts } from '../../../api/posts/posts_collection.js';
import { Comments } from '../../../api/comments/comments_collection.js';

Template.newsItem.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var slug = FlowRouter.getParam('slug');
    self.subscribe('singlePost', slug, {
      onReady: function () {
        var post = Posts.findOne({ slug: slug });
        self.subscribe('comments', post._id); 
      }
    });
  });
});

Template.newsItem.helpers({
  post: function () {
    var slug = FlowRouter.getParam('slug');
    var post = Posts.findOne({ slug: slug });
  
    return Posts.findOne();
  },
  comments: function () {
    return Comments.find();
  },
  author: function() {
    return Meteor.users.findOne({_id: Posts.findOne().userId}).username;
  }
});
