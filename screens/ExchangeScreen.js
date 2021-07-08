import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class ExchangeScreen extends React.Component {
    constructor() {
        super();
        this.state ={
            userId: firebase.auth().currentUser.email,
            itemName: '',
            description: '',
            requestId: '',
            requestStatus: '',
            docId: '',
            isExchangeRequestActive: ''

        }
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7)
    }

    getExchangeRequest = () =>{
        var exchangeRequest = db.collection('exchange_requests')
        .where('username','==',this.state.userId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().request_status !== "received"){
                    this.setState({
                        requestId: doc.data().request_id,
                        itemName: doc.data().item_name,
                        requestStatus: doc.data().request_status,
                        docId: doc.id
                    })
                }
            })
        })
    }

    getIsExchangeRequestActive() {
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    isExchangeRequestActive: doc.data().isExchangeRequestActive,
                    userDocId: doc.id
                })
            })
        })
    }

    componentDidMount() {
        this.getExchangeRequest();
        this.getIsExchangeRequestActive();
    }

    updateRequestStatus=()=>{
        db.collection('exchange_requests').doc(this.state.docId)
        .update({
            request_status: 'received'
        })
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc) => {
            db.collection('users').doc(doc.id).update({
                isExchangeRequestActive: false
            })
            })
        })
    }

    addItem = async(itemName, description) =>{
        var userName = this.state.userId
        var randomRequestId = this.createUniqueId()

        db.collection("exchange_requests").add({
            username: userName,
            item_name: itemName,
            description: description,
            request_id: randomRequestId,
            request_status: 'requested',
            date: firebase.firestore.FieldValue.serverTimestamp()
        })

        await this.getExchangeRequest()

        db.collection('users').where('email_id', '==', userName).get()
        .then()
        .then(snapshot =>{
            snapshot.forEach((doc) =>{
                db.collection('users').doc(doc.id).update({
                    isExchangeRequestActive: true
                })
            })
        })

        this.setState({
            itemName: '',
            description: ''
        })

        return alert(
            'Item ready to exchange',
            '',
            [
                {text: 'OK', onPress: () => {
                    this.props.navigation.navigate('HomeScreen')
                }}
            ]
        );
    }

    receivedItems = (itemName) =>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('received_item').add({
            "user_id": userId,
            "item_name":itemName,
            "request_id" : requestId,
            "request_status" : "received"
        })
    }

    render() {
        if(this.state.isExchangeRequestActive === true) {
            return(
                <View style = {{flex:1, backgroundColor: '#FFE0B2'}}>
                    <MyHeader title = "Requested Item" navigation = {this.props.navigation}/>
                    <View style={{borderWidth: 0.3, borderColor: '#5C5127', justifyContent: 'center', alignItems: 'center', padding: 20, margin: 20, backgroundColor: '#FFEDA6', marginTop: 100}}>
                        <Text style = {{color: '#5C5127', fontSize: 20}}>Item Name: {this.state.itemName}</Text>
                        </View>
                        <View style={{borderWidth: 0.3, justifyContent: 'center', alignItems: 'center', padding: 20, margin: 20, backgroundColor: '#FFEDA6', marginTop: 50}}>
                        <Text style = {{color: '#5C5127', fontSize: 20}}>Exchange Status: {this.state.requestStatus}</Text>
                    </View>
                    <TouchableOpacity
                    style={{
                        width:300,
                        height:50,
                        marginTop: 50,
                        justifyContent:'center',
                        alignItems:'center',
                        alignSelf: 'center',
                        borderRadius:25,
                        backgroundColor:"#DEAC35",
                        shadowColor: "#000",
                        shadowOffset: {
                           width: 0,
                           height: 8,
                        },
                        shadowOpacity: 0.30,
                        shadowRadius: 10.32,
                        elevation: 16
                    }}
                    onPress={()=>{
                        this.sendNotification();
                        this.updateRequestStatus();
                        this.receivedItems(this.state.itemName)
                    }}>
                        <Text style = {{color:'#fff', fontWeight:'200', fontSize:20}}>I received the item</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View style = {{
                    flex: 1
                }}>
                    <MyHeader title = "Add Item" navigation = {this.props.navigation}/>
                    <KeyboardAvoidingView style = {styles.keyboard}>
                       <TextInput
                style ={styles.formTextInput}
                placeholder={"Item Name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Description"}
                onChangeText={(text)=>{
                    this.setState({
                        description:text
                    })
                }}
                value ={this.state.description}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addItem(this.state.itemName,this.state.description)}}
                >
                            <Text style = {{color: '#fff', fontSize: 20}}>Add Item</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}


  const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:"#6666FF",
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#6666FF",
    },
  }
)

