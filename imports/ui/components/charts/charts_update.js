import './charts_update.html';
import Charts from '../../../api/charts/charts_collection.js';
import { moment as momentUtil } from 'meteor/momentjs:moment';
import moment from 'moment-timezone';

ReactiveTemplates.set('collections.charts.update', 'chartsUpdate');

AutoForm.hooks({
  updateChartForm: {
    onSuccess: function() {
      RouterLayer.go(this.collection.indexPath());
    },
    before: {
      update: function(doc) {
        doc.$set.slug = doc.$set.title.toLowerCase().split(' ').join('-');
        var daDate = moment(doc.$set.chartDate, 'Pacific/Honolulu');
        var mo = daDate.month();
        if (daDate.month() < 10) {
          mo = '0' + mo;
        }
        doc.$set.slug += '-' + [daDate.year(), mo, daDate.day()].join('-');
        doc.$set.tracks = [];
        if (Session.get('uploadedData'))
          Session.get('uploadedData').forEach(function(track, i) {
            doc.$set.tracks[i] = {};
            doc.$set.tracks[i].artist = track.Artist;
            doc.$set.tracks[i].release = track.Record;
            doc.$set.tracks[i].label = track.Label;
          });
        this.result(doc);
        this.result(doc);
      }
    },
    onError: function (name, error, template) {
      console.log(name + ' error:', error);
    }
  }
});

Template.chartsUpdate.onCreated(function (){
  var self = this;
  self.subscribe('singleChart',
    location.href.substring(location.href.lastIndexOf('/') + 1));
});

Template.chartsUpdate.helpers({
  collection: () => Charts
});

Template.chartsUpdate.events({
  'click #uploadCsv': function() {
    event.preventDefault();
    $('#hiddenUpload').click();
  },
  'change #hiddenUpload': function(event, templateInstance) {
    var files = event.currentTarget.files;
    if (files.length) {
      var file = files[0];

      if (file.type === 'text/csv') {
        var reader = new FileReader();
        reader.onload = function(e) {
          var csvJson = CSV.parse(
            reader.result.substring(0, reader.result.length - 1), {
              header: true,
              delimiter: ','
            });
          Session.set('uploadedData', csvJson.data);
        }
        reader.onerror = function(e) {
          throw 'Error reading CSV.';
        }
        reader.readAsText(file);
      }
    }
  },
  'click .save-btn': function () {
    $('#updateChartForm').submit();
  }
});
