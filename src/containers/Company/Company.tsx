import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Modal, Button, Row, Col, Icon, Input } from 'antd';
import ReactTable, { Column, RowInfo } from 'react-table';
import { EnumTarget, ICompany } from 'react-cms';
import { get } from 'lodash';

import { IReducers } from '../../redux';
import { getMenuData } from '../../redux/common/common.selector';

import { MenuEditListApi } from '../../components/MenuEditList/api/menuEditList';
import FakeImg from '../../components/FakeImg/FakeImg';
import EditForm from './components/EditForm';
import * as moment from 'moment';
import { DATE_FORMAT } from '../../service/Consts/Consts';

interface IProps {
  company?: ICompany[];
  getMenuData?: (enumTarget: EnumTarget) => void;
}

interface IState {
  modalVisible: boolean;
  isAdd: boolean;
  currentEntity: ICompany | null;
}

class Company extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    company: [],
  };
  private static columns: Column[] = [
    {
      Header: 'Название',
      accessor: 'name',
      Cell: (cellInfo: RowInfo) => (
        <div style={ {height: 80} }>
          <Row gutter={ 24 }>
            <Col span={ 2 }>
              <React.Fragment>
                {
                  get(cellInfo, 'original.img').includes('http')
                    ? <img
                      src={ get(cellInfo, 'original.img') }
                      style={ {maxWidth: 50, maxHeight: 50} }
                    />
                    : <FakeImg />
                }
              </React.Fragment>
            </Col>

            <Col span={ 19 } offset={ 1 }>
              <p>{ cellInfo.original.name }</p>
              <span>{ cellInfo.original.announce }</span>
            </Col>
          </Row>
        </div>
      ),
      width: 600,
    },
    {
      Header: 'Группа',
      accessor: 'category',
      width: 150,
    },
    {
      Header: 'Обновлено',
      accessor: 'updated',
      width: 150,
    },
  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      modalVisible: false,
      isAdd: false,
      currentEntity: null,
    };
  }

  public componentDidMount() {
    const {getMenuData} = this.props;
    getMenuData('company');
  }

  public render(): JSX.Element {
    const {company} = this.props;
    const {isAdd, modalVisible, currentEntity} = this.state;

    return (
      <Card
        style={ {marginLeft: 185, height: '100vh'} }
        title={ (
          <Row>
            <Col span={ 6 }>
              <Button icon={ 'plus' } onClick={ this.onOpenAddModal } type={ 'primary' }>Добавить компанию</Button>
              <Button icon={ 'setting' } style={ {left: 10} } disabled />
            </Col>

            <Col span={ 5 } offset={ 13 }>
              <Input addonBefore={ <Icon type={ 'search' } /> } placeholder={ 'Поиск' } disabled />
            </Col>
          </Row>
        ) }
      >
        <ReactTable
          data={ company.map(item => ({
            ...item,
            category: 'Нет категории',
            updated: moment.unix(item.updated_at).format(DATE_FORMAT),
          })) }
          columns={ Company.columns }
          noDataText={ 'Нет информации' }
          loadingText={ 'Загрузка...' }
          className={ '-striped -highlight' }
          getTrProps={ this.onRowClick }
          showPagination
          resizable={ false }
          style={ {color: '#000000'} }
        />

        <Modal visible={ modalVisible } footer={ null } onCancel={ this.onCloseModal } width={ 782 }>
          <EditForm
            people={ currentEntity }
            closeModal={ this.onCloseModal }
            isAdd={ isAdd }
            type={ isAdd ? 'POST' : 'PUT' }
          />
        </Modal>
      </Card>
    );
  }

  private onRowClick = (state: any, rowInfo: RowInfo, column: any) => ({
    onClick: () => this.setState({currentEntity: rowInfo.original, modalVisible: true, isAdd: false}),
    style: { cursor: 'pointer' },
  });

  private onCloseModal = () => this.setState({modalVisible: false});

  private onOpenAddModal = () => this.setState({isAdd: true, modalVisible: true});
}

const mapStateToProps = (state: IReducers) => {
  return {
    company: getMenuData(state, 'company'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
  return {
    getMenuData: (enumTarget: EnumTarget) => dispatch(MenuEditListApi.getMenuData(enumTarget)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
