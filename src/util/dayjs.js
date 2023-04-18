
import * as dayjs from 'dayjs';
import * as calendar from 'dayjs/plugin/calendar';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(calendar);

const timeFormat = function (val, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(val).format(format);
};

const chatTime = function (val) {
  return dayjs(val).calendar(null, {
    sameDay: 'HH:mm',
    nextDay: 'MM-DD HH:mm',
    nextWeek: 'MM-DD HH:mm',
    lastDay: '[Yesterday] HH:mm',
    lastWeek: 'MM-DD HH:mm',
    sameElse: 'MM-DD HH:mm'
  });
};

const durationTime = function (val) {
  return dayjs.duration(val).format('mm:ss');
};

export { dayjs, timeFormat, chatTime, durationTime };
