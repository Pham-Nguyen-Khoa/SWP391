const moment = require('moment'); 
require('moment/locale/vi');
module.exports.addSosanhTime = (time) => {
    moment.locale('vi'); 
    const createdAt = moment(time);
  const now = moment();
  const duration = moment.duration(now.diff(createdAt));

  // Format the duration to a human-readable string
  const sosanhTime = duration.humanize(); // e.g., "a few seconds ago", "3 hours ago", "2 days ago"
  
  // Add the `sosanhTime` key to the notification object
  return sosanhTime
};

