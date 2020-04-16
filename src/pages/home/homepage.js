import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Dropdown, Radio, Pagination } from 'antd';
import 'antd/dist/antd.css';
import styles from './main.module.css';
import { Link } from 'react-router-dom';
import {
    UserOutlined,
    BellOutlined,
    DownOutlined,
    ContactsOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import firebase from '../../Firebase';
import _ from "lodash";

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
            value: "Qu69ZXhgjSOK5CtOuSe3",
            search: null,
            sortType: "",
            shown: true,
            PageNumber: 1,
            NumberOfPages: 0,
            contactsPerPage: 5,
            contactsInCurrentPage: []
        };
    }

    openSearch = () => {
        this.setState({ openSearch: false });
    }

    onCollectionUpdate = (querySnapshot) => {
        let contacts = [];
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
        });
        this.paginate();
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

    onChange = (e) => {
        console.log('checked', e);
        this.setState({
            value: e.target.value
        });
    };

    handleSearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    delete(id) {
        firebase.firestore().collection('contacts').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.props.history.push("/")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    toggle() {
        let mobile = window.matchMedia("(max-width: 767px)");
        if (mobile.matches) {
            this.setState({
                shown: !this.state.shown
            });
        } else {
            this.setState({
                shown: this.state.shown
            });
        }
    }

    closeSideBar = () => {
        this.setState({ shown: false });
    };

    sortBy = () => {
        let sort = this.state.contacts.reverse();
    }

    paginate = (PageNumber = 1) => {
        try {
            let NumberOfPages = this.state.contacts.length / this.state.contactsPerPage;
        const startIndex = this.state.contactsPerPage * (PageNumber - 1);
        const endIndex = this.state.contactsPerPage * PageNumber;
        let contactsInCurrentPage = this.state.contacts.slice(startIndex , endIndex);
        this.setState({
            contactsInCurrentPage,
            NumberOfPages,
            PageNumber
        })
        } catch (error) {
            console.log(error);
        }
        
    }

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

        const sortby = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.sortBy}>
                        Company
                    </div>
                </Menu.Item>
            </Menu>
        );

        const contactsList = this.state.contactsInCurrentPage.filter((data) => {
            if (this.state.search == null)
                return data
            else if (data.name.toLowerCase().includes(this.state.search.toLowerCase()) || data.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                return data
            }
        }).map((contact, i) => {
            return (
                <React.Fragment>
                    {<tr key={i}>
                        <td>
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio key={i} value={contact.key}></Radio>
                            </Radio.Group></td>
                        <td>{contact.name}<br />{contact.email}</td>
                        <td>{contact.company}</td>
                        <td><a target="_blank" href={`https://wa.me/91${contact.phone}`}><img src="https://i.pinimg.com/originals/99/0b/7d/990b7d2c2904f8cd9bc884d3eed6d003.png" width="20px" alt="" /></a></td>
                        <td> <p className={styles.deleteIcon} onClick={this.delete.bind(this, this.state.key)}><DeleteOutlined /></p> </td>
                    </tr>}
                </React.Fragment>
            )
        })


        // const name = [...this.state.contact.name.toString()];
        // const Myname = name.substring(0,1);
        // console.log(name[0], "name")
        // console.log(this.state.contact.name, "name")

        // let Myname = _.split(this.state.contact.name, '');
        // console.log(Myname[0], "name")

        let shown = {
            display: this.state.shown ? "block" : "none"
        };

        return (
            <div>
                <Layout>
                    {this.state.shown ? <div className={styles.xsoverlay} onClick={this.closeSideBar} /> : null}
                    <Sider trigger={null} collapsed={this.state.collapsed} style={shown}>
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
                                <Col xs={0} sm={16} lg={18}>
                                    {
                                        this.state.openSearch ? (<div className={styles.searchBox}>
                                            <input type="text" placeholder="Search" onChange={(e) => this.handleSearch(e)} />
                                            <img alt="" src={require('../../images/closeIcon.png')} className={styles.closeSearch} onClick={() => this.openSearch()} />
                                        </div>) : (<div className={styles.search} onClick={() => this.setState({ openSearch: true })}>
                                            <img alt="" width="20" src={require('../../images/search.png')} />
                                        </div>
                                            )}
                                </Col>
                                <Col xs={0} sm={3} lg={3} className={`${styles.textRight}`}>+ Add</Col>
                                <Col xs={24} sm={4} lg={2} className={`${styles.textRight} ${styles.mar40}`}>
                                    <div className={styles.menuBar}><button className={styles.xsMenuBar} onClick={this.toggle.bind(this)}>Menu</button></div>
                                    <Dropdown overlay={menu}>
                                        <a onClick={e => e.preventDefault()}>
                                            Edit User <DownOutlined />
                                        </a>
                                    </Dropdown></Col>
                                <Col xs={0} sm={1} lg={1} span={1} className={styles.textRight}><BellOutlined /></Col>
                            </Row>
                        </Header>
                        <Content className={styles.Body}>
                            <Row>
                                <Col xs={18} lg={8}>
                                    <h1><ContactsOutlined /> Contacts</h1>
                                </Col>
                                <Col xs={6} lg={4}>
                                    <div className={styles.textRight}>
                                        <Dropdown overlay={sortby}>
                                            <p style={{ marginTop: '15px' }} onClick={e => e.preventDefault()}>
                                                Sort By <DownOutlined />
                                            </p>
                                        </Dropdown>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={16} lg={8}>
                                    <div className={styles.searchContact}>
                                        <input type="text" placeholder="Search" onChange={(e) => this.handleSearch(e)} />
                                    </div>
                                </Col>
                                <Col xs={24} sm={8} lg={4}>
                                    <div className={styles.textRight}>
                                        <Link to="/addcontact"><button className={styles.btnTheme}> + Add Contact</button></Link>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={styles.mt30}>
                                <Col xs={24} sm={24} lg={11}>
                                    <div className={styles.textRight}>
                                        {this.state.contacts.length}
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>+</th>
                                                <th>Basic info</th>
                                                <th>Company</th>
                                                <th>Chat</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactsList}
                                        </tbody>
                                    </table>
                                    <Pagination pageSize={this.state.contactsPerPage} defaultCurrent={this.state.PageNumber} total={this.state.contacts.length} onChange={this.paginate} />
                                </Col>
                                <Col xs={1} sm={1} lg={1} />
                                <Col xs={24} sm={24} lg={11} className={styles.profile}>
                                    <div className={`${styles.pad30} ${styles.textCenter}`}>
                                        {/* {Myname[0]} */}
                                        {/* <h1>{this.state.contact.name[0]}</h1> */}
                                        <div className={styles.textCenter}><span className={styles.TitleText}>{this.state.contact && this.state.contact.name ? this.state.contact.name[0] : ''}</span></div>
                                        <br />
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