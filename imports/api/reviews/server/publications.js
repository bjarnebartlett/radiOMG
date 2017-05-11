import { Meteor } from 'meteor/meteor';
import { Reviews } from '../reviews_collection.js';

Meteor.publish('reviews', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Reviews.find({}, options);
});

Meteor.publish('singleReview', function(selector) {
  check(selector, String);
  var reviews = Reviews.find({ slug: selector });
  return reviews.count() > 0 ? reviews : Reviews.find({_id: selector});
});
