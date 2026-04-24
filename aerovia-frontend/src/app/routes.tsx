import { createBrowserRouter } from 'react-router';
import { Root } from './layout/Root';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Destination } from './pages/Destination';
import { Booking } from './pages/Booking';
import { Dashboard } from './pages/Dashboard';
import { Deals } from './pages/Deals';
import { Flights } from './pages/Flights';
import { Hotels } from './pages/Hotels';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'search', Component: Search },
      { path: 'destination/:id', Component: Destination },
      { path: 'book', Component: Booking },
      { path: 'dashboard', Component: Dashboard },
      { path: 'deals', Component: Deals },
      { path: 'flights', Component: Flights },
      { path: 'hotels', Component: Hotels },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'profile', Component: Profile },
    ],
  },
]);