import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    contacts: {
      executor: 'per-vu-iterations',
      vus: 100,
      iterations: 20,
      maxDuration: '2m',
    },
  },
};
const basePath = "https://stream.trisz.hu/media-assets";
const videoPath = basePath + "/cmajngfey0005hadzcbli5k2c/2025-05-11T12-48-43.mp4_1080p_";

export default function() {
  const n = Math.floor(Math.random() * 11) + 1; // 1-11
  const res = http.get(videoPath + String(n).padStart(5, '0') + '.ts');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is loaded': (r) => r.body.length > 0,
    'is cached': (r) => r.headers['X-Cache'] === 'Hit from cloudfront',
  });
}
