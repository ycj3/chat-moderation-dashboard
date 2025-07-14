import { Meteor } from 'meteor/meteor';

// Import server startup through a single index entry point
import '../imports/startup/server/index';

Meteor.startup(async () => {
  console.log('Server is starting up...');
});
