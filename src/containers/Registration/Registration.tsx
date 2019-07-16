import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Select, Button, Layout, Form, Input, Icon, DatePicker, Steps } from 'antd';

import { FormComponentProps } from 'antd/lib/form';

import { DATE_FORMAT } from '../../service/Consts/Consts';

import './Reg.scss'

import { IReducers } from '../../redux';
import { AuthApi } from '../../redux/auth/auth.api';


const { RangePicker } = DatePicker;
const { Option } = Select;
const { Sider } = Layout;
const { Step } = Steps;

interface IProps extends FormComponentProps {
    getStates?: () => IReducers;
    signup?: () => void;
}

interface IState {
    modalVisible: boolean;
    current: number;

    login: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    event_name: string;
    start_date: number;
    end_date: number;
    timezone: number;
}


class Registration extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            modalVisible: false,
            current: 0,
            login: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            event_name: '',
            start_date: 0,
            end_date: 0,
            timezone: 0,
        })
    }

    public render(): JSX.Element {
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form;

        // Creates array [-11, -10, ... ,10, 11]
        const times = Array.from({ length: 23 }, (_, i) => i - 11);

        const steps = [
            {
                title: 'Регистрация',
                content:
                    <Sider className='reg__form' width={420} >
                        <h1 className='reg__label' >Регистрация</h1>
                        <div className='reg__wraper' >
                            <Form onSubmit={this.handleSubmit} className="login-form" >
                                <Form.Item label="Введите ваш номер телефона">
                                    {getFieldDecorator('login', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите номер телефона!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Телефон" size="large"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Введите ваш пароль">
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите пароль!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password" size="large"
                                            placeholder="Пароль"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Введите ваше имя">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите имя!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            size="large"
                                            placeholder="Имя"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Введите вашу фамилию">
                                    {getFieldDecorator('surname', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите фамилию!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            size="large"
                                            placeholder="Фамилия"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Введите ваш почтовый ящик">
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: 'Пожалуйста, введите валидный E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Пожалуйста, введите E-mail!',
                                            },
                                        ],
                                    })(
                                        <Input
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            size="large"
                                            placeholder="E-mail"
                                        />,
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                    </Sider >,
            },
            {
                title: 'Событие',
                content:
                    <Sider className='reg__form'  width={420}>
                        <h1 className='reg__label'>Создание события</h1>
                        <div className='reg__wraper'>
                            <Form onSubmit={this.handleSubmit} className="login-form" style={{ minWidth: 300 }}>
                                <Form.Item label="Название события">
                                    {getFieldDecorator('event_name', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите номер телефона!' }],
                                    })(
                                        <Input
                                            style={{ width: 300 }}
                                            prefix={<Icon type="file-done" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Название" size="large"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Дата проведения события">
                                    {getFieldDecorator('date', {
                                        rules: [{ required: true, message: 'Пожалуйста, введите время события!' }],
                                    })(
                                        <RangePicker 
                                            showTime 
                                            style={{ width: 300 }}
                                            format={DATE_FORMAT} 
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item label="Временная зона">
                                    {getFieldDecorator('timezone', {
                                        initialValue: 0,
                                        rules: [{ required: true, message: 'Пожалуйста, введите временную зону!', }],
                                    })(
                                        <Select placeholder="Временная зона" style={{ width: 300 }}>
                                            {
                                                times.map(item =>{
                                                    return (<Option key={item}>{item}</Option>)
                                                })
                                            }
                                        </Select>,
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                    </Sider>,
            },
            {
                title: 'Готово!',
                content: 
                    <div className='reg__end'>
                        <span style={{ color: '#52c41a'}}>Отлично! </span>
                        <span >Регистрация завершена.</span>
                        <p>Нажмите на кнопку, чтобы войти в аккаунт</p>
                    </div>
            },
        ];

        return (
            <>
                <Steps style={{ width: 600, margin: '15px auto' }} current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current === 0 && (
                        <Button  type="primary" onClick={() => this.next()}>
                            Вперед
                        </Button>
                    )}
                    {current === 1 && (
                        <Button type="primary" onClick={() => this.submit() }>
                            Создать
                        </Button>
                    )}
                    {current === 2 && (
                        <Button type="primary" onClick={this.handleSubmit }>
                            Войти
                        </Button>
                    )}
                </div>
            </>
        );
    }

    private next() {
        this.props.form.validateFields(['login', 'password', 'name', 'surname', 'email'], (err, values) => {
            if (!err) {
                this.setState({ 
                    current: this.state.current + 1,
                    login: values.login,
                    password: values.password,
                    first_name: values.name,
                    last_name: values.surname,
                    email: values.email,
                });
            }
        });
    }

    private submit() {
        this.props.form.validateFields(['event_name', 'date', 'timezone' ], (err, values) => {
            if (!err) {
                this.setState({ 
                    current: this.state.current + 1,
                    event_name: values.event_name,
                    start_date: values.date[0].unix(),
                    end_date: values.date[1].unix(),
                    timezone: values.timezone,
                });
            }
        });
    }

    private handleSubmit = e => {
        const obj = {
            login: this.state.login,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            event_name: this.state.event_name,
            start_date: this.state.start_date,
            end_date: this.state.end_date,
            timezone: this.state.timezone,
        }
        console.log('Received values of form: ', obj);
        //@ts-ignore 
        return this.props.signup(obj)
    };
}


const mapDispatchToProps = {
    signup: AuthApi.signup
}

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
)(Form.create()(Registration));


