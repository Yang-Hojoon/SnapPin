import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import PhotoDetail from './pages/PhotoDetail/PhotoDetail';
import MapPage from './pages/MapPage/MapPage';
import UploadPage from './pages/UploadPage/UploadPage';
import MyPage from './pages/MyPage/MyPage';
import NotificationPage from './pages/NotificationPage/NotificationPage';
import MessagePage from './pages/MessagePage/MessagePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo/:id" element={<PhotoDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
