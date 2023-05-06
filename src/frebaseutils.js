import store from './store'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, onSnapshot, collection, doc, deleteDoc, setDoc, addDoc, orderBy, query, getDoc, getDocs} from "firebase/firestore"
import {getAuth,signInWithEmailAndPassword} from "firebase/auth"

import { getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkXb8LpG3IbPR0RvVdo-_bG7616I43GXo",
  authDomain: "nesesexpenses.firebaseapp.com",
  projectId: "nesesexpenses",
  storageBucket: "nesesexpenses.appspot.com",
  messagingSenderId: "686432319765",
  appId: "1:686432319765:web:3d3b7a8c45d3c0a325511c",
  measurementId: "G-2VDGZPQPV5"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);

const db = getFirestore(firebaseapp)
const auth = getAuth(firebaseapp)
const storage = getStorage();

export const frebaseutils = {
methods:{
  getFileExtension(filename)
  {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
  },
  async uploadFileToStorage(file)
  {
    var filename = file.name
    let fileid = await this.generateId()
    const storageRef = await ref(storage, fileid+filename);
    let snapshot = await uploadBytes(storageRef, file)
    console.log("snapshot")
    console.log(snapshot.metadata.fullPath)
    return await snapshot.metadata.fullPath
  },
  async getDownloadUrl(id)
  {
      const pathReference = ref(storage, id); 
      const gsReference = ref(storage, 'gs://bucket/'+id);
      console.log("pathReference") 
      console.log(pathReference) 
      console.log(gsReference) 

  },
  async getAuth()
  {
    return auth
  },
  async login(email,password)
  {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      localStorage.setItem("nesesauth", user);
      await store.dispatch('setUser',user) 
      await this.$router.push({ name: 'ExpenseCollections' })
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  },
  async getExpenseCollections()
  {
    let items = []
    let results = await getDocs(query(collection(db,"expensecollections")))
    results.forEach((item)=>{
      let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    return await items
  },

  async getTags()
  {
    let items = []
    let results = await getDocs(query(collection(db,"tags")))
    results.forEach((item)=>{
      let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    return await items
  },

  async getExpenseItems()
  {
    let items = []
    let results = await getDocs(query(collection(db,"expenseitems"),orderBy("order")))
    results.forEach((item)=>{
        let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    return await items
  },

  async getExpenses()
  {
    let items = []
    let results = await getDocs(query(collection(db,"expenses"),orderBy("order")))
    results.forEach((item)=>{
        let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    return await items
  },

  async getFirebaseItems(the_coll)
  {
    let items = []
    let results = await getDocs(query(collection(db,the_coll)))
    results.forEach((item)=>{
        let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    await store.dispatch('SetAppInitiated',true) 
    return await items
  },
  async getFirebaseItemsOrdered(the_coll,order)
  {
    let items = []
    let results = await getDocs(query(collection(db,the_coll),orderBy(order)))
    results.forEach((item)=>{
        let data = item.data()
        data.id = item.id
        items.push(data)
    })    
    await store.dispatch('SetAppInitiated',true) 
    return await items
  },

  async addItem(collection_name,data)
  {
    console.log(data)
    await setDoc(doc(db, collection_name, this.generateId()), data);
  },
  async updateItem(collection_name,id,data)
  {
    console.log(data)
    await setDoc(doc(db, collection_name, id), data);
    return "ok"
  },
  async deleteItem(collection_name,id)
  {
    console.log("deleteItem")
    console.log(id)
    await deleteDoc(doc(db, collection_name, id));
  },
  generateId()
  {
      return (Math.floor(Date.now() / 10)+Math.floor(Math.random() * 100)).toString()

  },
  showNotification(severity,message,detail=null)
  {
    console.log("showNotification")
    this.$toast.add({ severity: severity, summary: message, detail:detail, life: 3000 });
  },
  sanitizeArray(arr)
  {
      return  JSON.parse(JSON.stringify(arr))
  },
}

}