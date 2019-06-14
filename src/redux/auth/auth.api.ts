import { IUser } from 'react-cms';
import { ThunkAction } from 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { notification } from 'antd';

import { IReducers } from '../index';
import Transport from '../../service/Transport/Transport';
import { logout, setTokenToLS, setUser, toggleLoader } from './auth.reducer';
import { AUTH, LOGOUT } from './auth.constants';
import history from '../../service/Utils/history';
import { PATHS } from '../../routes';
import LocalStorage from '../../service/LocalStorage/LocalStorage';
import { TOKEN_KEY } from '../../service/Consts/Consts';

export class AuthApi {
  public static checkAuth = (token: string | undefined): ThunkAction<Promise<void>, IReducers, Action> => {
    return async (dispatch: Dispatch<IReducers>): Promise<void> => {
      dispatch(toggleLoader(true));
      try {
        const lsToken: string | undefined = LocalStorage.getData(TOKEN_KEY);
        if (!lsToken && !token) {
          throw new Error('No token');
        }

        const response: Response = await Transport.get(`${AUTH}?token=${token || lsToken}`);
        if (!response.ok) {
          if (!token && !!lsToken) {
            LocalStorage.setToken('');
          }

          throw new Error('No valid token');
        }
  
        const user: IUser = await response.json();
        dispatch(setUser({user, token: token || lsToken}));
        dispatch(setTokenToLS());
        if (!!token) {
          LocalStorage.setToken(token);
        }

        if (user.code !== 503 &&
          !Object
            .keys(PATHS)
            .map(item => PATHS[item])
            .slice(1)
            .some(path => path === window.location.pathname)
        ) {
          history.push(PATHS.CONTENT);
        }
      } catch (e) {
        AuthApi.errorAuthMessage();
      }
  
      dispatch(toggleLoader(false));
    };
  };
  
  public static logout = (): ThunkAction<Promise<void>, IReducers, Action> => {
    return async (dispatch: Dispatch<IReducers>, getStates: () => IReducers): Promise<void> => {
      try {
        const token: string = getStates().auth.token;
        const headers: Headers = new Headers({authorization: `Bearer ${token}`});
        await Transport.post(LOGOUT, headers);

        dispatch(logout());
        dispatch(setTokenToLS());

        LocalStorage.setToken('');
        notification.success({message: 'Вы успешно вышли', description: '', duration: 0});
      } catch (e) {
        notification.error({message: 'Не удалось выйти', description: 'Попробуйте еще раз'});
      }
    };
  };
  
  protected static errorAuthMessage = () => notification.error({message: 'Ошибка входа', description: 'Неверный токен', duration: 6});
}
