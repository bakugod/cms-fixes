import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Modal } from 'antd';
import { IContainer, INews } from 'react-cms';
import { get } from 'lodash';
import { Column, RowInfo } from 'react-table';
import ReactTable from 'react-table';
import * as moment from 'moment';

import { DATE_FORMAT } from '../../../service/Consts/Consts';
import { IReducers } from '../../../redux';
import { ContentAPI } from '../api/content';
import { getContainer } from '../../../redux/common/common.selector';

import FakeImg from '../../../components/FakeImg/FakeImg';
import EditNews from './EditNews';

interface IProps {
  container?: IContainer;
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentEntity: INews | null;
  currentIndex: number;
}

class ModuleNews extends React.Component<IProps, IState> {
  private static columns: Column[] = [
    {
      Header: 'Дата',
      accessor: 'time',
      width: 150,
    },
    {
      Header: 'Заголовок',
      accessor: 'title',
    },
    {
      Header: 'Анонс',
      accessor: 'announceShort',
    },
    {
      Header: 'Содержание',
      accessor: 'bodyShort',
    },
    {
      Header: 'Картинка',
      accessor: 'img',
      Cell: (cellInfo: RowInfo) => {
        const image: string = get(cellInfo, 'original.img');

        return (
          <React.Fragment>
            {
              image.includes('http')
                ? <img
                  src={ image }
                  style={ {maxWidth: 100, maxHeight: 100} }
                />
                : <FakeImg />
            }
          </React.Fragment>
        );
      },
    },
    {
      Header: 'Видимость',
      accessor: 'visible',
      width: 100,
    },
  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: false,
      isAdd: false,
      currentEntity: null,
      currentIndex: 0,
    };
  }

  public render(): JSX.Element {
    const {container: {data, isLoading}} = this.props;
    const {isAdd, modalVisible, currentEntity} = this.state;

    return (
      <Card
        title={ <Button icon={ 'plus' } onClick={ this.onOpenAddModal }>Добавить новость</Button> }
      >
        <ReactTable
          data={ data.map((item: INews) => ({
            ...item,
            time: moment.unix(item.time).format(DATE_FORMAT),
            announceShort: item.announce.slice(0, 200),
            bodyShort: item.body.slice(0, 200),
            visible: Boolean(item.visible) ? 'Да' : 'Нет',
          })) }
          columns={ ModuleNews.columns }
          noDataText={ 'Нет информации' }
          loadingText={ 'Загрузка...' }
          loading={ isLoading }
          className={ '-striped -highlight' }
          getTrProps={ this.onRowClick }
          showPagination
          resizable={ false }
          style={ {color: '#000000'} }
        />

        <Modal visible={ modalVisible } footer={ null } onCancel={ this.onCloseModal } width={ 782 }>
          <EditNews
            index={ 0 }
            data={ currentEntity }
            closeModal={ this.onCloseModal }
            isAdd={ isAdd }
          />
        </Modal>
      </Card>
    );
  }

  private onCloseModal = () => this.setState({modalVisible: false});

  private onOpenAddModal = () => this.setState({isAdd: true, modalVisible: true});

  private onRowClick = (state: any, rowInfo: RowInfo, column: any) => ({
    onClick: () => this.setState({
      currentIndex: rowInfo.index,
      currentEntity: rowInfo.original,
      modalVisible: true,
      isAdd: false,
    }),
    style: { cursor: 'pointer' },
  });
}

const mapStateToProps = (state: IReducers) => {
  return {
    container: getContainer(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    updateContainer: (id: number, action: string, data: object, cb?: () => void) => dispatch(ContentAPI.updateContainer(id, action, data, cb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleNews);
