import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Dropdown, Radio, Modal } from 'antd';
import 'antd/dist/antd.css';
import styles from './main.module.css';
import { Link } from 'react-router-dom';
import {
    UserOutlined,
    BellOutlined,
    DownOutlined,
    ContactsOutlined
} from '@ant-design/icons';
import firebase from '../../Firebase'
import ContactList from './contactLists'

const { Header, Sider, Content } = Layout;

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('contacts');
        this.unsubscribe = null;
        this.state = {
            collapsed: true,
            openSearch: false,
            contacts: [],
            contact: {},
            value: 'sVqkgvrKlZvBExOQ4mBG',
            visible: false
        };
    }

    openSearch = () => {
        this.setState({ openSearch: false });
    }

    onCollectionUpdate = (querySnapshot) => {
        const contacts = [];
        querySnapshot.forEach((doc) => {
            const { name, desigination, email, phone, company, address } = doc.data();
            contacts.push({
                key: doc.id,
                doc, // DocumentSnapshot
                name,
                desigination,
                email,
                phone,
                company,
                address
            });
        });
        this.setState({
            contacts
        }, () => {
            console.log(contacts, "contacts")
        });
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    componentDidUpdate() {
        const ref = firebase.firestore().collection('contacts').doc(this.state.value);
        ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    contact: doc.data(),
                    key: doc.id,
                    isLoading: false
                });
            } else {
                console.log("No such document!");
            }
        });
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
            key: e.target.value
        });
    };

    showModal = () => {
        this.setState({
          visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const menu = (
            <Menu>
                {this.state.contacts.map(contact =>
                    <Menu.Item>
                        <Link to={`/show/${contact.key}`}>
                            {contact.name}
                        </Link>
                    </Menu.Item>
                )}
            </Menu>
        );
        return (
            <div>
                <Layout>
                    <Sider trigger={null} collapsed={this.state.collapsed}>
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/"><UserOutlined /><span>Home</span></Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background" style={{ padding: "0px 10px", borderBottom: "1px solid #e2e2e2" }}>
                            <Row>
                                <Col span={18}>
                                    {
                                        this.state.openSearch ? (<div className={styles.searchBox}>
                                            <input type="text" placeholder="Search" />
                                            <img alt="" src={require('../../images/closeIcon.png')} className={styles.closeSearch} onClick={() => this.openSearch()} />
                                        </div>) : (<div className={styles.search} onClick={() => this.setState({ openSearch: true })}>
                                            <img alt="" width="20" src={require('../../images/search.png')} />
                                        </div>
                                            )}
                                </Col>
                                <Col span={3} className={styles.textRight}>+ Add</Col>
                                <Col span={2} className={styles.textRight}><Dropdown overlay={menu}>
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        Edit User <DownOutlined />
                                    </a>
                                </Dropdown></Col>
                                <Col span={1} className={styles.textRight}><BellOutlined /></Col>
                            </Row>
                        </Header>
                        <Content className={styles.Body}>
                            <h1><ContactsOutlined /> Contacts</h1>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.searchContact}>
                                        <input type="text" placeholder="Search" />
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className={styles.textRight}>
                                        <Link to="/addcontact"><button className={styles.btnTheme}> + Add Contact</button></Link>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={styles.mt30}>
                                <Col span={11}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>+</th>
                                                <th>Basic info</th>
                                                <th>Company</th>
                                                <th>Chat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.contacts.map((contact, i) =>
                                                <tr key={i}>
                                                    <td>
                                                        <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                            <Radio name={i} value={contact.key}></Radio>
                                                        </Radio.Group></td>
                                                    <td>{contact.name}<br />{contact.email}</td>
                                                    <td>{contact.company}</td>
                                                    <td><a target="_blank" href={`https://wa.me/91${contact.phone}`}><img src="https://i.pinimg.com/originals/99/0b/7d/990b7d2c2904f8cd9bc884d3eed6d003.png" width="20px" alt="" /></a></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Modal
                                        title="Send Message"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                    </Modal>
                                </Col>
                                <Col span={1} />
                                <Col span={11} className={styles.profile}>
                                    <div className={`${styles.pad30} ${styles.textCenter}`}>
                                        <img src="https://i.ya-webdesign.com/images/controller-button-png-8.png" className={styles.profilePic} alt="" />
                                        <h3>{this.state.contact.name}</h3>
                                        <h3>{this.state.contact.desigination}</h3>
                                    </div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td width="30%">Full Name</td>
                                                <td width="70%">{this.state.contact.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{this.state.contact.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone</td>
                                                <td>{this.state.contact.phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Company</td>
                                                <td>{this.state.contact.company}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td>{this.state.contact.address}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Homepage;