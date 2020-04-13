import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import AddContact from './pages/home/addcontact';
import EditContact from './pages/home/editcontact';
import ContactList from './pages/home/contactLists';
import Homepage from './pages/home/homepage';
import firebase from './Firebase'

class navigation extends Component {
    // constructor(props) {
    //     super(props);
    //     this.ref = firebase.firestore().collection('contacts');
    //     this.unsubscribe = null;
    //     this.state = {
    //       contact: {}
    //     };
    //   }

    //   componentDidMount() {
    //     this.contactList();
    //   }

    //   contactList = () => {
    //       console.log(this.props.match.params.id, "Id")
    //     const ref = firebase.firestore().collection('contacts').doc(this.props.match.params.id);
    //     ref.get().then((doc) => {
    //       if (doc.exists) {
    //         this.setState({
    //           contact: doc.data(),
    //           key: doc.id,
    //           isLoading: false
    //         });
    //       } else {
    //         console.log("No such document!");
    //       }
    //     });
    //   }

    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/" render={(props)=><Homepage {...props}/>} />
                    <Route exact path="/addcontact" component={AddContact} />
                    <Route exact path="/editcontact/:id" component={EditContact} />
                    <Route exact path="/show/:id" component={ContactList} />
                </Router> 
            </div>
        );
    }
}

export default navigation;