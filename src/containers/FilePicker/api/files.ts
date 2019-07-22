import { IEvent, IUser, IFilesList } from 'react-cms';
import { ThunkAction } from 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { notification } from 'antd';

import Transport from '../../../service/Transport/Transport';
import { IReducers } from '../../../redux';
import { GET_FILES } from '../../../redux/common/common.constants';
import { setContainerData, setEvents, setFiles } from '../../../redux/common/common.reducer';
import { IEventData, updateEvent } from '../../../redux/auth/auth.reducer';

export class FilesAPI {
  public static getData = (): ThunkAction<Promise<void>, IReducers, Action> => {
    return async (dispatch: Dispatch<IReducers>, getStates: () => IReducers): Promise<any> => {
      try {
        dispatch(setContainerData({isLoading: true}));
        const token: string = getStates().auth.token;
        const user: IUser = getStates().auth.user;

        const headers: Headers = new Headers({
          authorization: `Bearer ${token}`,
          event: user.appdata.eventID.toString(),
        });

        const body: object = {
          "action":"list",
          "target" : "company"
        }
          

        const response: Response = await Transport.post(GET_FILES, headers, body);
        const json: { code: number; data: IFilesList[] } = await response.json();
        console.log(json)

        dispatch(setFiles({data: json.data}));
        return json;
      } catch (e) {
        notification.error({message: 'Не удалось получить никого', description: e});
      }
    };
  };

  public static updateEvent = (event: IEventData): ThunkAction<void, IReducers, Action> => {
    return async (dispatch: Dispatch<IReducers>) => {
      dispatch(updateEvent({name: event.name, id: event.id, timeShift: event.timeShift}));
      notification.success({message: 'Событие успешно изменено', description: ''});
    };
  };
}
