import React, { Component } from 'react';
import { Layout, Menu, Row, Col } from 'antd';
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

const { Header, Sider, Content } = Layout;

class Contactlist extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('contacts');
        this.unsubscribe = null;
        this.state = {
          collapsed: true,
          openSearch: false,
          contact: {},
          key: ''
        };
        const Context = React.createContext(this.state.contact);
      }

    openSearch = () => {
        this.setState({ openSearch: false });
    }

    componentDidMount() {
        this.contactList();
      }

      contactList = () => {
        console.log(this.props.match.params.id, "Id")
        const ref = firebase.firestore().collection('contacts').doc(this.props.match.params.id);
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

      delete(id){
        firebase.firestore().collection('contacts').doc(id).delete().then(() => {
          console.log("Document successfully deleted!");
          this.props.history.push("/")
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      }

    

    render() {
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
                                <Col span={1} className={styles.textRight}><BellOutlined /></Col>
                            </Row>
                        </Header>
                        <Content className={styles.Body}>
                            <h1><ContactsOutlined /> Contacts List</h1>
                            <Row className={`${styles.mt30}`}>
                                <Col span={12} className={styles.profile}>
                                    <div className={styles.textRight}>
                                    <Link to={`/editcontact/${this.state.key}`}><button className={styles.btnThemeCrud}>Edit</button></Link>&nbsp;
                                    <button onClick={this.delete.bind(this, this.state.key)} className={styles.btnThemeCrud}>Delete</button>
                                    <div className={styles.textCenter}>
                                         <img src="https://i.ya-webdesign.com/images/controller-button-png-8.png" className={styles.profilePic} alt="" />
                                         <h3>{this.state.contact.name}</h3>   
                                         <h3>{this.state.contact.desigination}</h3>
                                    </div>
                                    </div>
                                    <table>
                                        <tbody>
                                            <tr>
                                            <td>Name</td>
                                            <td>{this.state.contact.name}</td>
                                            </tr>
                                            <tr>
                                            <td>Desigination</td>
                                            <td>{this.state.contact.desigination}</td>
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

export default Contactlist;