import * as React from 'react';
import { Route, Switch } from 'react-router';

import Info from './components/Info/Info';
import Main from './containers/Main/Main';
import Menu from './containers/Menu/Menu';
import Content from './containers/Content/Content';
import People from './containers/People/People';
import Events from './containers/Events/Events';
import Icons from './containers/Icons/Icons';
import Locations from './containers/Locations/Locations';
import Company from './containers/Company/Company';

export const PATHS: { [key: string]: string; } = {
  MAIN: '/',
  MENU_EDIT: '/menu',
  CONTENT: '/content',
  PEOPLE: '/people',
  COMPANY: '/company',
  EVENTS: '/events',
  PEOPLE_SECTION: '/people-section',
  COMPANY_SECTION: '/company-section',
  ICONS: '/icons',
  LOCATIONS: '/locations',
};

const NotFoundRender = () => <Info type='NotFound' />;
const DevelopmentRender = () => <Info type='Development' />;

export const routes: JSX.Element = (
  <Switch>
    <Route exact path={ PATHS.MAIN } component={ Main } />
    <Route exact path={ PATHS.MENU_EDIT } component={ Menu } />
    <Route exact path={ PATHS.CONTENT } component={ Content } />
    <Route exact path={ PATHS.PEOPLE } component={ People } />
    <Route exact path={ PATHS.COMPANY } component={ Company } />
    <Route exact path={ PATHS.EVENTS } component={ Events } />
    <Route exact path={ PATHS.ICONS } component={ Icons } />
    <Route exact path={ PATHS.LOCATIONS } component={ Locations } />
    <Route exact path={ PATHS.PEOPLE_SECTION } render={ DevelopmentRender } />
    <Route exact path={ PATHS.COMPANY_SECTION } render={ DevelopmentRender } />
    <Route render={ NotFoundRender } />
  </Switch>
);
