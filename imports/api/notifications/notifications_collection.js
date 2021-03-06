import { Mongo } from 'meteor/mongo';
import { scorpius } from 'meteor/scorpiusjs:core';

export default Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: (userId, doc, fieldNames) => {
    return doc && doc.userId === userId
        && fieldNames.length === 1
        && fieldNames[0] === 'read';
  }
});

export const createCommentNotification = (comment) => {
  Notifications.insert({
    userId: comment.userId,
    postId: comment.postId,
    commentId: comment._id,
    commenterName: comment.author,
    read: false
  });
};
