import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AtmoCraft | IMD Learning Portal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f1f33',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e3a5f 0%, #0f1f33 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120" fill="none">
            <path d="M 28 55 A 12 12 0 0 1 42 42 A 18 18 0 0 1 73 52 A 12 12 0 0 1 73 76 L 28 76 A 12 12 0 0 1 28 55 Z" fill="#5b9bd5"/>
            <circle cx="36" cy="62" r="4" fill="#e8943a" />
            <circle cx="53" cy="53" r="5" fill="#e8943a" />
            <circle cx="68" cy="65" r="4" fill="#e8943a" />
            <path d="M 36 62 L 53 53 L 68 65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ fontSize: '80px', fontWeight: 'bold', margin: 0 }}>AtmoCraft</h1>
        </div>
        <p style={{ fontSize: '32px', color: '#98cbff', margin: 0, textAlign: 'center', maxWidth: '800px' }}>
          Official Digital Capacity Building & LMS Portal for the India Meteorological Department
        </p>
      </div>
    ),
    { ...size }
  );
}
