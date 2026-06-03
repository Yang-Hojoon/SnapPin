const mockPhotos = [
  // 서울
  { id:  1, title: '성수 소품샵',        city: '서울', likes:  501, imageUrl: '/photos/seongsu_accessory_shop.jpg',                              lat: 37.5447, lng: 127.0557 },
  { id:  2, title: '한강 망원 피크닉',   city: '서울', likes:  218, imageUrl: '/photos/hangang_mangwon_picnic.jpg',                              lat: 37.5543, lng: 126.8984 },
  { id:  3, title: '남산 야경',          city: '서울', likes:  891, imageUrl: '/photos/namsan_night_view.jpg',                                   lat: 37.5512, lng: 126.9882 },
  { id:  4, title: '경복궁 돌담길',      city: '서울', likes:  612, imageUrl: '/photos/gyeongbokgung_stone_wall_road.jpg',                       lat: 37.5796, lng: 126.9710 },
  { id:  5, title: '익선동 골목',        city: '서울', likes:  445, imageUrl: '/photos/ikseondong_alley.jpg',                                    lat: 37.5738, lng: 126.9988 },
  { id:  6, title: '서울숲 산책로',      city: '서울', likes:  389, imageUrl: '/photos/seoul_forest_trail.jpg',                                  lat: 37.5445, lng: 127.0374 },
  { id:  7, title: '을지로 빈티지 골목', city: '서울', likes:  501, imageUrl: '/photos/euljiro_vintage_alley.jpg',                               lat: 37.5666, lng: 126.9895 },
  { id:  8, title: '연남동 경의선 숲길', city: '서울', likes:  677, imageUrl: 'https://picsum.photos/seed/sp022/300/400',                        lat: 37.5622, lng: 126.9245 },
  { id:  9, title: '창덕궁 한옥길',      city: '서울', likes:  432, imageUrl: '/photos/hanok_village_changdeokgung_road.jpg',                    lat: 37.5794, lng: 126.9910 },
  { id: 10, title: '망원시장 브런치',    city: '서울', likes:  298, imageUrl: '/photos/mangwon_market_brunch.jpg',                               lat: 37.5558, lng: 126.9095 },
  { id: 11, title: '북촌 한옥 골목',    city: '서울', likes:  743, imageUrl: '/photos/bukchon_hanok_alley.jpg',                                 lat: 37.5826, lng: 126.9831 },
  { id: 12, title: '홍대 앞 거리',      city: '서울', likes:  556, imageUrl: 'https://picsum.photos/seed/sp026/300/400',                        lat: 37.5558, lng: 126.9237 },
  { id: 37, title: '성수 카페 온도',     city: '서울', likes:  324, imageUrl: '/photos/seongsu_cafe_ondo.jpg',                                   lat: 37.5447, lng: 127.0557 },
  { id: 38, title: '창신 테르트 카페',   city: '서울', likes:  380, imageUrl: '/photos/changsin_tertre_cafe.jpg',                                lat: 37.5780, lng: 127.0140 },
  { id: 39, title: '서울스카이',         city: '서울', likes: 1050, imageUrl: '/photos/seoul_sky_lotte_world_tower.jpg',                         lat: 37.5126, lng: 127.1023 },
  { id: 40, title: '별마당 도서관',      city: '서울', likes:  890, imageUrl: '/photos/seoul_starfield_library.jpg',                             lat: 37.5126, lng: 127.0590 },
  { id: 42, title: '삼청동 뷰 카페',    city: '서울', likes:  460, imageUrl: '/photos/samcheong_budeogi_book_cafe.jpg',                         lat: 37.5820, lng: 126.9812 },
  { id: 43, title: '석촌호수 서호',      city: '서울', likes:  645, imageUrl: '/photos/seokchon_lake_west_lake_trail.jpg',                       lat: 37.5092, lng: 127.0975 },
  { id: 44, title: '인왕산 야경',        city: '서울', likes:  720, imageUrl: '/photos/inwangsan_trail.jpg',                                     lat: 37.5786, lng: 126.9584 },
  { id: 45, title: '서울식물원 온실',    city: '서울', likes:  583, imageUrl: '/photos/seoul_botanic_park_greenhouse.jpg',                       lat: 37.5701, lng: 126.8284 },
  { id: 46, title: '아워베이커리 도산',  city: '서울', likes:  412, imageUrl: '/photos/our_bakery_dosan_flagship.jpg',                           lat: 37.5241, lng: 127.0324 },
  { id: 47, title: '이태원 골목 야경',   city: '서울', likes:  334, imageUrl: '/photos/pexels-walidphotoz-769371.jpg',                           lat: 37.5344, lng: 126.9942 },
  { id: 48, title: '안산 벚꽃길',        city: '서울', likes:  478, imageUrl: '/photos/ansan_cherry_blossom_road_hongjecheon_cafe_waterfall.jpg', lat: 37.5801, lng: 126.9534 },
  { id: 41, title: '석촌호수 야경',      city: '서울', likes:  730, imageUrl: '/photos/seokchon_lake.jpg',                                       lat: 37.5092, lng: 127.1000 },

  // 부산
  { id: 13, title: '감천마을',           city: '부산', likes:  763, imageUrl: '/photos/busan_gamcheon_village.jpg',    lat: 35.0975, lng: 129.0104 },
  { id: 14, title: '광안리 야경',        city: '부산', likes:  877, imageUrl: '/photos/gwangalli_night_view.jpg',      lat: 35.1531, lng: 129.1189 },
  { id: 15, title: '해운대 일몰',        city: '부산', likes: 1100, imageUrl: '/photos/haeundae_sunset.jpg',           lat: 35.1587, lng: 129.1604 },
  { id: 16, title: '흰여울 해안터널',    city: '부산', likes:  654, imageUrl: '/photos/huinnyeoul_coastal_tunnel.jpg', lat: 35.0635, lng: 129.0155 },
  { id: 17, title: '초량 이바구길',      city: '부산', likes:  423, imageUrl: '/photos/choryang_ibagu_gil.jpg',        lat: 35.1082, lng: 129.0394 },

  // 제주
  { id: 18, title: '협재해변',           city: '제주', likes: 1243, imageUrl: '/photos/hyeopjae_beach.jpg',            lat: 33.3942, lng: 126.2396 },
  { id: 19, title: '우도 산호해변',      city: '제주', likes:  987, imageUrl: '/photos/udo_coral_beach.jpg',           lat: 33.5039, lng: 126.9527 },
  { id: 20, title: '사려니숲길',         city: '제주', likes:  812, imageUrl: '/photos/saryeoni_forest_path.jpg',      lat: 33.3738, lng: 126.5958 },
  { id: 21, title: '성산일출봉',         city: '제주', likes: 1450, imageUrl: '/photos/seongsan_ilchulbong.jpg',       lat: 33.4582, lng: 126.9420 },

  // 강원
  { id: 22, title: '속초 청초호',        city: '강원', likes:  389, imageUrl: '/photos/sokcho_cheongchoho.jpg',              lat: 38.2035, lng: 128.5919 },
  { id: 23, title: '강릉 안목 카페거리', city: '강원', likes:  678, imageUrl: '/photos/gangneung_anmok_cafe_street.jpg',     lat: 37.7586, lng: 128.9512 },
  { id: 24, title: '춘천 소양강 댐',     city: '강원', likes:  445, imageUrl: '/photos/chuncheon_soyanggang_dam.jpg',        lat: 37.9001, lng: 127.7296 },
  { id: 25, title: '정동진 해돋이',      city: '강원', likes:  920, imageUrl: '/photos/jeongdongjin_sunris.jpg',             lat: 37.6862, lng: 129.0578 },

  // 기타 국내
  { id: 26, title: '전주 한옥마을',      city: '전주', likes:  445, imageUrl: '/photos/jeonju_hanok_village.jpg',             lat: 35.8144, lng: 127.1533 },
  { id: 27, title: '여수 밤바다',        city: '여수', likes:  521, imageUrl: '/photos/yeosu_night_sea.jpg',                  lat: 34.7604, lng: 127.6622 },
  { id: 28, title: '통영 동피랑마을',    city: '경남', likes:  302, imageUrl: '/photos/tongyeong_dongpirang_village.jpg',     lat: 34.8453, lng: 128.4212 },
  { id: 29, title: '경주 첨성대',        city: '경주', likes:  412, imageUrl: '/photos/gyeongju_cheomseongdae.jpg',           lat: 35.8348, lng: 129.2188 },
  { id: 30, title: '담양 죽녹원',        city: '전남', likes:  534, imageUrl: '/photos/damyang_juknokwon.jpg',                lat: 35.3291, lng: 126.9857 },
  { id: 31, title: '인천 개항로',        city: '인천', likes:  367, imageUrl: '/photos/incheon_gaehangro.jpg',                lat: 37.4742, lng: 126.6260 },
  { id: 32, title: '수원 화성',          city: '수원', likes:  489, imageUrl: '/photos/suwon_hwaseong.jpg',                   lat: 37.2885, lng: 127.0133 },
  { id: 33, title: '성심당 골목',        city: '대전', likes:  623, imageUrl: '/photos/daejeon_sungsimdang_street.jpg',       lat: 36.3308, lng: 127.4289 },
  { id: 34, title: '군산 근대문화거리',  city: '군산', likes:  287, imageUrl: '/photos/gunsan_modern_culture_street.jpg',     lat: 35.9756, lng: 126.7366 },
  { id: 35, title: '포항 호미곶',        city: '경북', likes:  756, imageUrl: '/photos/pohang_homigot.jpg',                   lat: 35.9874, lng: 129.5693 },
  { id: 36, title: '속리산 단풍길',      city: '충북', likes:  398, imageUrl: '/photos/songnisan_autumn_road.jpg',            lat: 36.5400, lng: 127.8669 },
];

export const formatLikes = (count) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};

export default mockPhotos;

export const mockComments = [
  { id: 1, user: 'min_daily',  initial: 'M', comment: '@jiye 여기 같이 가자!!', time: '1시간 전', color: '#FEF3C7', textColor: '#92400E' },
  { id: 2, user: 'park.s',     initial: 'P', comment: '분위기 너무 좋다 다음달에 갑니다', time: '30분 전', color: '#D1FAE5', textColor: '#065F46' },
  { id: 3, user: 'haneul.log', initial: 'H', comment: '저도 지난주에 다녀왔는데 진짜 좋더라고요', time: '15분 전', color: '#EDE9FE', textColor: '#5B21B6' },
];

export const mockNotifications = [
  { id: 1, type: 'like',    user: 'min_daily',  text: '회원님의 사진을 좋아합니다.', time: '2분 전',   imageUrl: '/photos/seongsu_cafe_ondo.jpg', avatarColor: '#FEF3C7', avatarText: '#92400E' },
  { id: 2, type: 'comment', user: 'park.s',     text: '댓글을 남겼습니다: "분위기 너무 좋다"', time: '15분 전', imageUrl: '/photos/bukchon_hanok_alley.jpg', avatarColor: '#D1FAE5', avatarText: '#065F46' },
  { id: 3, type: 'follow',  user: 'haneul.log', text: '팔로우하기 시작했습니다.', time: '1시간 전', imageUrl: null, avatarColor: '#EDE9FE', avatarText: '#5B21B6' },
  { id: 4, type: 'like',    user: 'j.explore_', text: '회원님의 사진을 좋아합니다.', time: '3시간 전', imageUrl: '/photos/namsan_night_view.jpg', avatarColor: '#FEE2E2', avatarText: '#991B1B' },
  { id: 5, type: 'comment', user: 'soo._.pic',  text: '댓글을 남겼습니다: "거기 어디예요?"', time: '5시간 전', imageUrl: '/photos/haeundae_sunset.jpg', avatarColor: '#DBEAFE', avatarText: '#1E40AF' },
  { id: 6, type: 'like',    user: 'daily_lens', text: '회원님의 사진을 좋아합니다.', time: '어제', imageUrl: '/photos/seongsan_ilchulbong.jpg', avatarColor: '#FCE7F3', avatarText: '#9D174D' },
  { id: 7, type: 'follow',  user: 'trip.note_', text: '팔로우하기 시작했습니다.', time: '어제', imageUrl: null, avatarColor: '#ECFDF5', avatarText: '#065F46' },
];

export const mockMessages = [
  { id: 1, user: 'min_daily', lastMsg: '형 거기 카페 이름 뭐예요? 저도 가고 싶어요!', time: '방금', unread: 2, avatarColor: '#FEF3C7', avatarText: '#92400E',
    messages: [
      { from: 'other', text: '사진 봤어요! 거기 어디예요?', time: '오후 2:10' },
      { from: 'me',    text: '성수동이요! 카페 온도라는 곳이에요', time: '오후 2:11' },
      { from: 'other', text: '분위기 너무 좋겠다 ㅠㅠ', time: '오후 2:11' },
      { from: 'other', text: '형 거기 카페 이름 뭐예요? 저도 가고 싶어요!', time: '오후 2:12' },
    ]
  },
  { id: 2, user: 'park.s', lastMsg: '사진 진짜 잘 나왔다 ㅋㅋ', time: '10분 전', unread: 0, avatarColor: '#D1FAE5', avatarText: '#065F46',
    messages: [
      { from: 'other', text: '야 사진 진짜 잘 나왔다 ㅋㅋ', time: '오후 1:30' },
      { from: 'me',    text: '감사ㅎㅎ 거기 분위기가 너무 좋아서', time: '오후 1:31' },
      { from: 'other', text: '나도 다음에 같이 가자', time: '오후 1:32' },
      { from: 'me',    text: '좋아! 주말에 가자', time: '오후 1:33' },
    ]
  },
  { id: 3, user: 'haneul.log', lastMsg: '주소 공유해줘! 이번 주말에 가보려고', time: '1시간 전', unread: 1, avatarColor: '#EDE9FE', avatarText: '#5B21B6',
    messages: [
      { from: 'other', text: '방금 피드에서 봤어 거기 어디야?', time: '오전 11:00' },
      { from: 'me',    text: '성수동! 진짜 분위기 좋아', time: '오전 11:01' },
      { from: 'other', text: '주소 공유해줘! 이번 주말에 가보려고', time: '오전 11:02' },
    ]
  },
  { id: 4, user: 'j.explore_', lastMsg: '다음에 같이 가요', time: '어제', unread: 0, avatarColor: '#FEE2E2', avatarText: '#991B1B',
    messages: [
      { from: 'other', text: '피드 잘 보고 있어요', time: '어제 3:00' },
      { from: 'me',    text: '감사해요!', time: '어제 3:05' },
      { from: 'other', text: '다음에 같이 가요', time: '어제 3:06' },
    ]
  },
  { id: 5, user: 'soo._.pic', lastMsg: '감사합니다 :)', time: '3일 전', unread: 0, avatarColor: '#DBEAFE', avatarText: '#1E40AF',
    messages: [
      { from: 'me',    text: '사진 태그 해도 될까요?', time: '3일 전 2:00' },
      { from: 'other', text: '네 물론이죠!', time: '3일 전 2:10' },
      { from: 'me',    text: '감사해요!', time: '3일 전 2:11' },
      { from: 'other', text: '감사합니다 :)', time: '3일 전 2:12' },
    ]
  },
];

// 추가 사진 (2차 업로드)
const extraPhotos = [
  { id: 49, title: '청수당',           city: '서울', likes: 634, imageUrl: '/photos/cheongsudang_ikseondong.jpg',                            lat: 37.5738, lng: 126.9988 },
  { id: 50, title: '경복궁 근정전',    city: '서울', likes: 891, imageUrl: '/photos/gyeongbokgung_geunjeongjeon_courtyard.jpg',              lat: 37.5795, lng: 126.9769 },
  { id: 51, title: '용산역 육교',      city: '서울', likes: 412, imageUrl: '/photos/yongsan_station_pedestrian_overpass.jpg',                lat: 37.5298, lng: 126.9645 },
  { id: 52, title: '평창동 루프탑 카페', city: '서울', likes: 523, imageUrl: '/photos/pyeongchangdong_cafe_gallery_rooftop.jpg',             lat: 37.6074, lng: 126.9709 },
  { id: 53, title: '항저우 서호',      city: '중국', likes: 748, imageUrl: '/photos/hangzhou_west_lake.jpg',                                lat: 30.2592, lng: 120.1535 },
  { id: 54, title: '응봉산 팔각정',    city: '서울', likes: 567, imageUrl: '/photos/eungbongsan_palgakjeong_observation_deck.jpg',           lat: 37.5431, lng: 127.0381 },
  { id: 55, title: '뚝섬 청담대교 일몰', city: '서울', likes: 782, imageUrl: '/photos/ttukseom_hangang_park_cheongdam_bridge_trail.jpg',    lat: 37.5283, lng: 127.0668 },
  { id: 56, title: '북촌 한옥마을',    city: '서울', likes: 834, imageUrl: '/photos/bukchon_hanok_village.jpg',                             lat: 37.5826, lng: 126.9831 },
  { id: 57, title: '광안리 오션뷰',    city: '부산', likes: 921, imageUrl: '/photos/gwangalli_ocean_view_room.jpg',                         lat: 35.1531, lng: 129.1189 },
  { id: 58, title: '여의도한강공원',   city: '서울', likes: 456, imageUrl: '/photos/yeouido_hangang_park_lawn_plaza.jpg',                   lat: 37.5283, lng: 126.9339 },
  { id: 59, title: '뚝섬한강공원',     city: '서울', likes: 345, imageUrl: '/photos/ttukseom_hangang_park.jpg',                             lat: 37.5283, lng: 127.0668 },
  { id: 60, title: '뚝섬 잔디광장',    city: '서울', likes: 398, imageUrl: '/photos/ttukseom_hangang_park_riverside_lawn.jpg',              lat: 37.5290, lng: 127.0675 },
  { id: 61, title: '밀락더마켓',       city: '부산', likes: 612, imageUrl: '/photos/millak_pojangmacha_street.jpg',                         lat: 35.1489, lng: 129.1182 },
  { id: 62, title: '청계천',           city: '서울', likes: 723, imageUrl: '/photos/cheonggyecheon_stream.jpg',                             lat: 37.5696, lng: 126.9930 },
  { id: 63, title: '홍대 와우산로',    city: '서울', likes: 534, imageUrl: '/photos/hongdae_wausanro21gil_alley.jpg',                       lat: 37.5502, lng: 126.9220 },
  { id: 64, title: '영종도 월미도',    city: '인천', likes: 289, imageUrl: '/photos/yeongjongdo_wolmido_ferry_deck.jpg',                    lat: 37.4739, lng: 126.5922 },
  { id: 65, title: '하늘공원',         city: '서울', likes: 678, imageUrl: '/photos/haneul_park_main_trail.jpg',                            lat: 37.5700, lng: 126.8977 },
  { id: 66, title: '인왕산 범바위',    city: '서울', likes: 456, imageUrl: '/photos/inwangsan_beombawi_observatory.jpg',                    lat: 37.5805, lng: 126.9550 },
  { id: 67, title: '해동용궁사',       city: '부산', likes: 834, imageUrl: '/photos/haedong_yonggungsa_coastal_trail.jpg',                  lat: 35.1850, lng: 129.2233 },
  { id: 68, title: '공항교 벚꽃길',    city: '서울', likes: 567, imageUrl: '/photos/gonghanggyo_riverside_park_cherry_blossom_road.jpg',   lat: 37.5742, lng: 126.8123 },
  { id: 69, title: '성수역 3번 출구',  city: '서울', likes: 312, imageUrl: '/photos/seongsu_station_exit3_street.jpg',                     lat: 37.5444, lng: 127.0561 },
];

// 기존 배열에 합치기
mockPhotos.push(...extraPhotos);

// 추가 사진 (3차 업로드)
const extraPhotos3 = [
  { id: 70, title: '이촌한강공원 일몰',      city: '서울', likes: 724, imageUrl: '/photos/ichon_hangang_park_trail.jpg',                    lat: 37.5173, lng: 126.9710 },
  { id: 71, title: '신촌 연세로 벚꽃',       city: '서울', likes: 856, imageUrl: '/photos/sinchon_yonseiro_cherry_blossom_trail.jpg',        lat: 37.5596, lng: 126.9369 },
  { id: 72, title: '만선호프 을지로',         city: '서울', likes: 612, imageUrl: '/photos/manseon_hof_euljiro.jpg',                         lat: 37.5666, lng: 126.9895 },
  { id: 73, title: '소하 익선동',             city: '서울', likes: 543, imageUrl: '/photos/soha_salt_pond_ikseondong.jpg',                   lat: 37.5738, lng: 126.9988 },
  { id: 74, title: '종로3가 포장마차',        city: '서울', likes: 489, imageUrl: '/photos/jongno3ga_pojangmacha_street.jpg',                lat: 37.5707, lng: 126.9918 },
];
mockPhotos.push(...extraPhotos3);

// 추가 사진 (4차 업로드)
const extraPhotos4 = [
  { id: 75, title: '어글렛 연남',      city: '서울', likes: 478, imageUrl: '/photos/aufglet_yeonnam_seongmisanro31gil11.jpg', lat: 37.5615, lng: 126.9255 },
  { id: 76, title: '강원 유러피안 펜션', city: '강원', likes: 392, imageUrl: '/photos/gangwon_european_pension.jpg',           lat: 37.6800, lng: 128.3900 },
  { id: 77, title: '사계 검은모래 해변', city: '제주', likes: 645, imageUrl: '/photos/sagye_coastal_geology.jpg',              lat: 33.2280, lng: 126.3130 },
  { id: 78, title: '그라운드시소 성수', city: '서울', likes: 712, imageUrl: '/photos/seongsu_groundseesaw.jpg',               lat: 37.5445, lng: 127.0560 },
  { id: 79, title: '광안리 오션뷰 카페', city: '부산', likes: 834, imageUrl: '/photos/gwangalli_ocean_view_cafe.jpg',          lat: 35.1531, lng: 129.1189 },
];
mockPhotos.push(...extraPhotos4);

// 추가 사진 (5차 업로드)
const extraPhotos5 = [
  { id: 80, title: '제주 람다하우스',           city: '제주', likes: 587, imageUrl: '/photos/jeju_ramda_house.jpg',                          lat: 33.5189, lng: 126.5132 },
  { id: 81, title: '교토 이네노후나야',          city: '일본', likes: 743, imageUrl: '/photos/kyoto_ine_no_funaya.jpg',                       lat: 35.6902, lng: 135.3094 },
  { id: 82, title: '행원 방파제',                city: '제주', likes: 512, imageUrl: '/photos/conan_beach_haengwon_breakwater.jpg',           lat: 33.5621, lng: 126.8697 },
  { id: 83, title: '태종대 자갈마당',            city: '부산', likes: 634, imageUrl: '/photos/busan_dongsamdong_taejongdae_jagalmadang.jpg',  lat: 35.0512, lng: 129.0848 },
  { id: 84, title: '김녕해수욕장 방파제',         city: '제주', likes: 468, imageUrl: '/photos/conan_gimnyeong_beach_breakwater.jpg',         lat: 33.5538, lng: 126.7623 },
  { id: 85, title: '흰여울문화마을',             city: '부산', likes: 756, imageUrl: '/photos/huinnyeoul_culture_village.jpg',               lat: 35.0620, lng: 129.0156 },
  { id: 86, title: '중랑장미공원',               city: '서울', likes: 823, imageUrl: '/photos/seoul_mukdong_jungnang_rose_park.jpg',          lat: 37.6176, lng: 127.0877 },
  { id: 87, title: '소백산 비로봉 대피소',        city: '경북', likes: 398, imageUrl: '/photos/sobaeksan_birobong_yeonhwabong_shelter.jpg',   lat: 36.9645, lng: 128.4880 },
  { id: 88, title: '돈내코 원앙폭포',            city: '제주', likes: 541, imageUrl: '/photos/donnaeko_wonyang_falls_trail.jpg',             lat: 33.3210, lng: 126.6231 },
  { id: 89, title: '강릉 교동 장미담벼락',        city: '강원', likes: 692, imageUrl: '/photos/gangneung_gyodong874_rose_wall.jpg',           lat: 37.7492, lng: 128.8786 },
  { id: 90, title: '청옥산 육백마지기',           city: '강원', likes: 876, imageUrl: '/photos/cheongoksan_yukbaekmajigi.jpg',               lat: 37.0956, lng: 128.9498 },
  { id: 91, title: '쌍산재 한옥카페',            city: '전남', likes: 634, imageUrl: '/photos/ssangsanjae_hanok_cafe.jpg',                   lat: 35.2271, lng: 127.2871 },
];
mockPhotos.push(...extraPhotos5);
