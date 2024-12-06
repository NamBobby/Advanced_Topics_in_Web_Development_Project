import React from 'react';
import '../assets/styles/artist.css'; // Tạo file CSS riêng để định dạng

const Artist = () => {
  const artists = [
    { img: "https://images2.thanhnien.vn/528068263637045248/2023/10/12/bia-dia-co-su-gop-mat-cua-em-trai-obito-the-hien-cau-chuyen-ve-su-truong-thanh-anh-obito-16970846048781054579233.jpg", name: "Obito" },
    { img: "https://i.scdn.co/image/ab6761610000e5eb4371fb198b011bb666a3bfde", name: "Mr.Siro" },
    { img: "https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj", name: "Sơn Tùng M-TP" },
    { img: "https://cdnphoto.dantri.com.vn/vX_7rfUWNrjH5fKdep0v-JMgt9w=/thumb_w/1020/2024/05/29/wren1-edited-1716939718698.jpeg", name: "Wren Evans" },
    { img: "https://media.viez.vn/prod/2023/9/19/large_378119537_859159752234997_8765221549239438092_n_0873281264.jpg", name: "Vũ Cát Tường" },
    { img: "https://vcdn1-giaitri.vnecdn.net/2024/07/13/mck2-6299-1720843087-172084518-4401-4174-1720845590.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=ttvHeCbAZ-Cj2wkxTz416Q", name: "RPT MCK" },
  ];

  return (
    <div className="artist-wrapper">
      {artists.map((artist, index) => (
        <div key={index} className="artist">
          <img src={artist.img} alt={artist.name} className="artist-image" />
          <div className="artist-name">{artist.name}</div>
          <div className="artist-role">Artist</div>
        </div>
      ))}
    </div>
  );
};

export default Artist;
