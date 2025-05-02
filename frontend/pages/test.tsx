import dynamic from 'next/dynamic';

const VideoViewer = dynamic(() => import('@/components/VideoViewer'), {
  ssr: false
});

function HomePage() {
  const videoUrl = "http://localhost:8000/api/video/stream/?path=media/videos/vr1.mp4";

  return (
    <div>
      <VideoViewer videoUrl={videoUrl} />
    </div>
  );
}

export default HomePage;
