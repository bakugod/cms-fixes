import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Card, Row, Col, Popconfirm, Button, Select } from 'antd';
import { range } from 'lodash';
import { EnumTarget, EnumType, IIcon, IContainer, IFilesList } from 'react-cms';

import { IReducers } from '../../redux';
import { FilesAPI } from './api/files'

import { getFiles } from '../../redux/common/common.selector';
import FakeImg from '../../components/FakeImg/FakeImg';
import EditForm from './components/EditForm';

const { Option } = Select;

interface IProps {
    files?: IFilesList[];
    container?: IContainer;
    updateFile?: (event: IFilesList) => void;
    updateEnum?: (id: number, enumType: EnumType, enumTarget: EnumTarget, data: object, cb?: () => void) => void;
    getData?: () => any;
}

interface IState {
    
}

class Icons extends React.Component<IProps, IState> {
    private static rowsNumber: number = 6;

    constructor(props: IProps) {
        super(props);

        this.state = {
            modalVisible: false,
        };
    }
    
    public componentDidMount() {
        const { getData } = this.props;
        getData().then(res => console.log(res))
    }

    public render(): JSX.Element {
        const { files } = this.props;
        console.log(this.props)
        
        const rows: number = Math.ceil(files.length / Icons.rowsNumber);
        let currentIndex: number = 0;

        return (
            <Card
                style={{ marginLeft: 185, height: '100vh' }}
                title={
                    <Select defaultValue="company" style={{ width: 120 }} >
                        <Option key={'company'}>Компании</Option>
                        <Option key={'people'}>Люди</Option>
                        <Option key={'ico'}>Значки меню</Option>
                        <Option key={'misc'}>Прочее</Option>
                    </Select>  
                }
            >
                <EditForm type={'POST'} />
                {
                    range(0, rows).map(index => (
                        <React.Fragment key={`row_${index}`}>
                            <Row gutter={16}>
                                {
                                    range(0, Icons.rowsNumber).map(columnIndex => {
                                        if (currentIndex === files.length) {
                                            return <React.Fragment key={`no_${columnIndex}`} />;
                                        }

                                        const icon: IIcon = files[currentIndex];
                                        currentIndex += 1;

                                        return (
                                            <Col span={4} key={`column_${columnIndex}`} style={{ background: 'aliceblue' }}>
                                                <Popconfirm
                                                    title={'Вы точно хотите удалить?'}
                                                    //onConfirm={ this.delete(icon.id) }
                                                    okText={'Да'}
                                                    cancelText={'Нет'}
                                                    placement={'bottom'}
                                                >
                                                    {
                                                        icon.url.includes('http')
                                                            ? <img
                                                                src={icon.url}
                                                                style={{ maxWidth: 100, maxHeight: 100, cursor: 'pointer' }}
                                                            />
                                                            : <FakeImg />
                                                    }
                                                </Popconfirm>
                                            </Col>
                                        );
                                    })
                                }
                            </Row>
                            <br />
                        </React.Fragment>
                    ))
                }
            </Card>
        );
    }
}

const mapStateToProps = (state: IReducers) => {
    return {
        files: getFiles(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<IReducers>) => {
    return {
        getData: () => dispatch(FilesAPI.getData()),
        //updateFile: (event: IFilesList) => dispatch(FilesAPI.updateFile(event)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Icons);

