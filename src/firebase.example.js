import firebase from 'firebase/app' // Firebase Core
import 'firebase/database' // Firebase Database

const config = {}

// Initializing it
firebase.initializeApp(config)

// Exporting Firebase Database Instance
export const database = firebase.database()