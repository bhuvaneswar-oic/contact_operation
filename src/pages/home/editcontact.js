import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Dropdown, Button, Input } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import {
    UserOutlined,
    BellOutlined,
    DownOutlined
} from '@ant-design/icons';
import firebase from '../../Firebase';

const { Header, Sider, Content } = Layout;

class editcontact extends Component {
    constructor(){
        super();
        this.ref = firebase.firestore().collection('contacts');
        this.state = {
            collapsed: true,
            openSearch: false,
            key: '',
            name: '',
            desigination: '',
            email: '',
            phone: '',
            company: '',
            address: ''
        };
    }
    
    componentDidMount() {
        const ref = firebase.firestore().collection('contacts').doc(this.props.match.params.id);
        ref.get().then((doc) => {
          if (doc.exists) {
            const contact = doc.data();
            this.setState({
              key: doc.id,
              name: contact.name,
              desigination: contact.desigination,
              email: contact.email,
              phone: contact.phone,
              company: contact.company,
              address: contact.address
            });
          } else {
            console.log("No such document!");
          }
        });
      }

    openSearch = () => {
        this.setState({ openSearch: false });
    }

    handleChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {key, name, desigination, email, phone, company, address} = this.state;
        console.log(name, desigination, email, phone, company, address, "daata")
        const updateRef = firebase.firestore().collection('contacts').doc(key);
            updateRef.set({
                name, 
                desigination, 
                email, 
                phone, 
                company, 
                address
            }).then((docRef) => {
            this.setState({
                key: '',
                name: '',
                desigination: '',
                email: '',
                phone: '',
                company: '',
                address: '',
            });
            this.props.history.push("/show/"+this.props.match.params.id)
            })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      }

    render() {
        const {key, name, desigination, email, phone, company, address} = this.state;
        return (
            <div>
                <Layout>
                    <Sider trigger={null} collapsed={this.state.collapsed}>
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="1">
                                    <Link to="/"><UserOutlined /><span>Home</span></Link>
                                </Menu.Item>
                            </Menu>
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
                                <Col span={1} className={styles.textRight}><BellOutlined /></Col>
                            </Row>
                        </Header>
                        <Content className={styles.Body}>
                            <h1>Edit Contacts</h1>
                            <Row className={styles.mt30}>
                                <Col xs={24} sm={24} lg={12}>
                                    <div className={styles.textRight}><Link to={`/show/${key}`}><button className={styles.btnThemeCrud}>Contacts List</button></Link></div>
                                    <form>
                                        <div>
                                            <label className={styles.mt20}>Name</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="name" value={name} type="text" placeholder="Name text...." />
                                            <label className={styles.mt20}>Desigination</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="desigination" value={desigination} type="text" placeholder="Desigination text...." />
                                            <label className={styles.mt20}>Email</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="email" value={email} type="email" placeholder="Email text...." />
                                            <label className={styles.mt20}>Phone</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="phone" value={phone} type="number" placeholder="Phone text...." />
                                            <label className={styles.mt20}>Company</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="company" value={company} type="text" placeholder="Company text...." />
                                            <label className={styles.mt20}>Address</label>
                                            <Input className={styles.mt10} onChange={this.handleChange} name="address" value={address} type="text" placeholder="Address text...." />
                                            <Button onClick={this.handleSubmit} type="submit">Submit</Button>
                                        </div>
                                    </form>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default editcontact;