import { Meteor } from 'meteor/meteor';
import Parties from '../parties/parties_collection.js';
import Playlists from '../playlists/playlists_collection.js';
import Posts from '../posts/posts_collection.js';
import Comments from '../comments/comments_collection.js';
import Shows from '../shows/shows_collection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String,
      type: String
    });
    var user = Meteor.user();
    var comment = {
      postId: commentAttributes.postId,
      body: commentAttributes.body,
      userId: user._id,
      author: user.username,
      submitted: moment.utc().utcOffset("-10:00").toDate()
    };
    var to = '';
    var subject = '';
    var body = '';
    var url = Meteor.absoluteUrl()  ;

    if (!(commentAttributes.type === 'partyPage' ||
          commentAttributes.type === 'playlistPage' ||
          commentAttributes.type === 'newsPage')) {
      throwError('Cannot comment on this page!');
      return;
    }

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    if (this.isSimulation)
      return comment._id;

    switch(commentAttributes.type) {
      case 'partyPage':
        var party = Parties.findOne({ _id: commentAttributes.postId});
        var url = url + 'news/' + post.slug;
        var recipient = Meteor.users.findOne({ _id: party.userId });

        to = recipient.emails && recipient.emails[0].address;
        // So we don't email if the party page's author is commenting.
        if (party.userId === comment.userId)
          break;
        subject = 'New Comment on Your Event "' + party.title + '"';
        body = 'Hello,<br><br>You have a new comment on your event, ' + party.title
            + '. User ' + comment.author + ' said: <br><br>"' + comment.body +
            '".<br><br><a target="_blank" href="' + url + '">Click here to view ' +
            'this comment in context.</a>';
        Meteor.call('sendEmailNotification', to, subject, body, false);
        break;
      case 'playlistPage':
        var playlist = Playlists.findOne({ _id: commentAttributes.postId });
        // TODO: Sort out the issue with using FlowRouter.url() to generate the
        // path dynamically. It was failing to substitute the route and params
        // when given a route name. For now, we've hard-coded in the url.
        var url = url + 'playlist/' + playlist.spinPlaylistId;
        var show = Shows.findOne({ showId: playlist.showId });
        var recipient = Meteor.users.findOne({ _id: show.userId });

        to = recipient.emails && recipient.emails[0].address;
        if (comment.userId === show.userId)
          break;
        subject = 'New Comment on Your Playlist';
        body = 'Hello,<br><br>You have a new comment on a playlist for ' + show.showName
            + '. User ' + comment.author + ' said: <br><br>"' + comment.body +
            '".<br><br><a target="_blank" href="' + url + '">Click here to view '
            + 'this comment in context.</a>';
        Meteor.call('sendEmailNotification', to, subject, body, false);
        break;
      case 'newsPage':
        var post = Posts.findOne(commentAttributes);
        var url = url + 'events/' + post.slug;
        var recipient = Meteor.users.findOne({ _id: post.userId });

        to = recipient.emails && recipient.emails[0].address;
        if (post.userId === comment.userId)
          break;
        subject = 'New Comment on Your Post, "' + post.title + '"';
        body = 'Hello,<br><br>You have a new comment on your post, ' + post.title
            + '. User ' + comment.author + ' said: <br><br>"' + comment.body +
            '".<br><br><a target="_blank" href="' + url + '">Click here to view '
            + 'this comment in context.</a>';
        Meteor.call('sendEmailNotification', to, subject, body, false);
        break;
    };

    // createCommentNotification(comment);
    return comment._id;
  }
});
