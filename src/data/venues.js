const asset = (name) => new URL(`../assets/original/${name}`, import.meta.url).href

export const venues = {
  song: {
    id: 'song',
    name: '宋治平体育馆',
    address: '吉林省长春市吉林大学',
    phone: '0431-85167701',
    thumb: asset('venue-song.png'),
    banners: [
      asset('song-banner-2.jpg'),
      asset('song-banner-1.jpg'),
      asset('song-banner-3.jpg'),
      asset('song-banner-4.jpg'),
      asset('song-banner-5.jpg'),
    ],
    description: '吉林大学宋治平体育馆项目由中国工程院院士何镜堂教授主持设计。',
    sports: [
      { name: '乒乓球', time: '06:00', image: asset('sport-song-table-tennis.jpg') },
      { name: '网球', time: '06:00', image: asset('sport-tennis.jpg') },
      { name: '排球', time: '06:00', image: asset('sport-volleyball.jpg') },
    ],
  },
  qianwei: {
    id: 'qianwei',
    name: '前卫体育馆',
    address: '吉林省长春市吉林大学',
    phone: '0431-85167701',
    thumb: asset('venue-qianwei.jpg'),
    banners: [asset('qianwei-banner-1.jpg'), asset('qianwei-banner-2.png')],
    description: '吉林大学前卫南校区前卫体育馆位于前进大街2699号。',
    sports: [
      { name: '羽毛球', time: '06:00', image: asset('sport-badminton.png') },
      { name: '乒乓球', time: '06:00', image: asset('sport-qianwei-table-tennis.png') },
      { name: '匹克球', time: '06:00', image: asset('sport-pickleball.png') },
    ],
  },
}

export const profile = {
  name: '李子涵',
  studentId: '87240433',
  sex: '男',
}

export const getVenue = (venueId) => venues[venueId] ?? venues.song
