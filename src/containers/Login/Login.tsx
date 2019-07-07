import * as React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Select, Button, Layout } from 'antd';


import Input from '../../components/Input/Input';

import { IReducers } from '../../redux';
import { AuthApi } from '../../redux/auth/auth.api';

const { Sider } = Layout;
const { Option } = Select;

interface IProps {
    getStates: () => IReducers;
    login?: () => void;
}

interface IState {
    login: string;
    password: string;
}

const SelectBefore = () => (
    <Select defaultValue="язык" style={{ width: 80 }}>
        <Option value="ru">ru</Option>
        <Option value="en">en</Option>
        <Option value="es">es</Option>
    </Select>
);

class Login extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            login: '',
            password: '',
        };
    }

    public render(): JSX.Element {
        return (
            <Sider width={650} style={{ display: 'block', background: '#fff', margin: '0 auto', borderRadius: 30, height: 300 }}>
                <h1>Вход</h1>
                <div style={{ width: 312, display: 'inline-block' }}>
                    <Input
                        value={this.state.login}
                        onChange={this.onChangeText}
                        placeholder="телефон" />
                    <Input 
                        type='password'
                        value={this.state.password}
                        onChange={this.onChangeText2}
                        placeholder="пароль" />
                    <SelectBefore></SelectBefore>
                    <Button >Зарегестрироваться</Button>
                    <Button type="primary" onClick={this.handleLogin}>Войти</Button>
                </div>
            </Sider >
        );
    }

    private handleLogin = () => {
        const obj = { login: this.state.login, password: this.state.password }
        //@ts-ignore
        return this.props.login(obj)
     }

    private onChangeText = (ev: any) => this.setState({ login: ev });

    private onChangeText2 = (ev: any) => this.setState({ password: ev });
}


const mapDispatchToProps = {
    login: AuthApi.login
}

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
)(Login);
