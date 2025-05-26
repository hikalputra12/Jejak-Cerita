import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AddStoryPage from '../pages/about/add-story/add-story-page';
import StoriesPage from '../pages/about/add-story/stories-page';
import DetailStoryPage from '../pages/about/add-story/detail-story-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/stories': new StoriesPage(),
  '/stories/:id': new DetailStoryPage(),
};

export default routes;