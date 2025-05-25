import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page'; // Halaman baru
import AddStoryPage from '../pages/about/add-story/add-story-page'; // Halaman baru
import StoriesPage from '../pages/about/add-story/stories-page'; // Halaman baru
import DetailStoryPage from '../pages/about/add-story/detail-story-page'; // Halaman baru

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(), // Tambahkan route ini
  '/add-story': new AddStoryPage(), // Tambahkan route ini
  '/stories': new StoriesPage(), // Tambahkan route ini
  '/stories/:id': new DetailStoryPage(), // Tambahkan route ini untuk detail
};

export default routes;