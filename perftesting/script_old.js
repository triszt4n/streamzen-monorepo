import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    busy: {
      exec: 'busy_endpoint',
      executor: 'constant-arrival-rate',
      duration: '1m',
      preAllocatedVUs: 200,
      rate: 50 // RPS
    },
  }
};

const basePath = "https://stream.trisz.hu/media-assets";
const videoPath = basePath + "/cmajngfey0005hadzcbli5k2c/2025-05-11T12-48-43.mp4_1080p_";

export function busy_endpoint() { 
  const n = Math.floor(Math.random() * 11) + 1; // 1-11
  const res = http.get(videoPath + String(n).padStart(5, '0') + '.ts');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is loaded': (r) => r.body.length > 0,
    'is cached': (r) => r.headers['X-Cache'] === 'Hit from cloudfront',
  });
}
