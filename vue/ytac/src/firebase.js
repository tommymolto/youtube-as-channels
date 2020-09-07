import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
  apiKey: 'AIzaSyD6BkV2XCm82hBsbM4YHx0EMnGc1_lLnoE',
  authDomain: '',
  databaseURL: 'https://ytac-d67db.firebaseio.com/',
  projectId: '729918349272',
  storageBucket: 'gs://ytac-d67db.appspot.com',
  messagingSenderId: '',
  appId: 'ytac-d67db'
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
