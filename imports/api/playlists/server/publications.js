import { Meteor } from 'meteor/meteor';
import { Playlists } from '../playlists_collection.js';
import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { NowPlaying } from '../now_playing.js';

Meteor.publish('playlist', function (id) {
  check(id, Number);
  return Playlists.find({ spinPlaylistId: id });
});

Meteor.publish('playlists', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Playlists.find({}, options);
});

Meteor.publish('nowPlaying', function() {
  return NowPlaying.find({});
});

Meteor.publish('showPlaylists', function(id) {
  check(id, Number);
  return Playlists.find({ showId: id });
});