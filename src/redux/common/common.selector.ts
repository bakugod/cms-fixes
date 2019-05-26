import { createSelector } from 'reselect';
import { IReducers } from '../index';
import { EnumTarget, IAppIcon, IContainer, IEvent, IModule, IPeople } from 'react-cms';
import { IMenuReducerType } from './common.reducer';

export const getModules = (state: IReducers): IModule[] => state.common.modules;
export const getIcons = (state: IReducers): IAppIcon[] => state.common.icons;
export const getContainer = (state: IReducers): IContainer => state.common.container;
export const getPeople = (state: IReducers): IPeople[] => state.common.people;
export const getEvents = (state: IReducers): IEvent[] => state.common.events;
export const getMenuData = (state: IReducers, enumTarget: EnumTarget): any[] => state.common.menuData[enumTarget];

export const getMenu = () => createSelector(
  (state: IReducers) => state.common.menu,
  (item: IMenuReducerType) => item,
);
