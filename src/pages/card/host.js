const data = [
  {
    birthday: 941155200000,
    countryId: 16,
    relation: 2,
    onlineStatus: 2,
    id: 1,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host1.jpg',
    interestLabels: ['1', '7', '9', '11', '15'],
    userName: 'Luna Jaber 🌙',
  },
  {
    birthday: 907718400000,
    countryId: 13,
    relation: 2,
    onlineStatus: 2,
    id: 2,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host2.jpg',
    interestLabels: [
      '1',
      '6',
      '7',
      '10',
      '16'
    ],
    userName: '🦄Libili🦄',
  }, {
    birthday: 1021420800000,
    countryId: 18,
    relation: 2,
    onlineStatus: 2,
    id: 3,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host3.jpg',
    interestLabels: ['1', '2', '6', '10', '11'],
    userName: '🧸Catalina🧸',
  }, {
    birthday: 928972800000,
    countryId: 37,
    relation: 2,
    onlineStatus: 2,
    id: 4,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host4.jpg',
    interestLabels: [
      '1',
      '6',
      '7',
      '10',
      '16'
    ],
    userName: '🍥Lisa🍥',
  }, {
    birthday: 873590400000,
    countryId: 77,
    relation: 2,
    onlineStatus: 2,
    id: 5,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host5.jpg',
    interestLabels: ['2', '5', '7', '10'],
    userName: 'Alena',
  }, {
    birthday: 855964800000,
    countryId: 177,
    relation: 2,
    onlineStatus: 2,
    id: 6,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host6.jpg',
    interestLabels: ['3', '10', '12', '13'],
    userName: 'tam.Ma❤️❤️❤️',
  }, {
    birthday: 815788800000,
    countryId: 192,
    relation: 2,
    onlineStatus: 2,
    id: 7,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host7.jpg',
    userName: 'Anna♥️',
  }, {
    birthday: 1042502400000,
    countryId: 30,
    relation: 2,
    onlineStatus: 2,
    id: 8,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host8.jpg',
    interestLabels: ['2', '10', '14', '17', '20'],
    userName: 'Olivia Dio✌️🙈',
  }, {
    birthday: 928972800000,
    countryId: 182,
    relation: 2,
    onlineStatus: 2,
    id: 9,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host9.jpg',
    interestLabels: ['1', '5', '7', '10', '16'],
    userName: 'Dilara',
  }, {
    birthday: 873590400000,
    countryId: 23,
    relation: 2,
    onlineStatus: 2,
    id: 10,
    headImg: 'https://h5.livuchat.com/static/images/web/likeornot/host10.jpg',
    interestLabels: ['1', '11', '12'],
    userName: 'Ayşe kozan',
  },
];

export default () => {
  const rn = Math.floor(Math.random() * 10);
  return data[rn];
};
