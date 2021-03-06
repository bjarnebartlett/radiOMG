import { Meteor } from 'meteor/meteor';

Meteor.methods({
  sendEmailNotification: function(to, subject, body, form) {
    check([to, subject, body], [String]);
    check(form, Boolean);
    var sender =  Meteor.settings.emailUsername;
    var replyTo = form ? Meteor.users.findOne({_id: this.userId}).emails[0].address : undefined;
    this.unblock();
    var sendContents = {};
    sendContents.to = to;
    sendContents.subject = subject;
    sendContents.html = body;
    sendContents.from = sender;
    if (replyTo !== undefined) sendContents.replyTo = replyTo;
    Email.send(sendContents);
  }
});
