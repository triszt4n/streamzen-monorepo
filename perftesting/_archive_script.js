import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  iterations: 100,
  duration: '30s',
};

const basePath = "https://stream.trisz.hu/media-assets";
const videoPath = basePath + "/cmajngfey0005hadzcbli5k2c/2025-05-11T12-48-43.mp4_1080p_";

export default function() { // What the VU does:
  for (let i = 1; i <= 5; i++) {
    const res = http.get(videoPath + String(i).padStart(5, '0') + '.ts');
    check(res, {
      'is status 200': (r) => r.status === 200,
      'is video chunk loaded': (r) => r.body.length > 0,
      'is video chunk cached': (r) => r.headers['X-Cache'] === 'Hit from cloudfront',
    });
  }
  for (let i = 6; i <= 11; i++) {
    sleep(3);
    const res = http.get(videoPath + String(i).padStart(5, '0') + '.ts');
    check(res, {
      'is status 200': (r) => r.status === 200,
      'is video chunk loaded': (r) => r.body.length > 0,
      'is video chunk cached': (r) => r.headers['X-Cache'] === 'Hit from cloudfront',
    });
  }
}
