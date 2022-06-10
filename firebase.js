// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    query,
    where,
} from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbAYrjDDMKoPZdOD4ZgczI2-oPB9qxEwA",
    authDomain: "nirasdragon.firebaseapp.com",
    projectId: "nirasdragon",
    storageBucket: "nirasdragon.appspot.com",
    messagingSenderId: "1094588203168",
    appId: "1:1094588203168:web:e0906edbd42dc0d32749c5",
    measurementId: "G-JC2RYNE9W3"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Get a list of cities from your database
export async function getUsers() {
    const usersCol = collection(db, 'users')
    const usersSnapshot = await getDocs(usersCol)
    const userList = citySnapshot.docs.map(doc => doc.data());
    return userList;
}

export async function setUser(user) {
    return await setDoc(doc(db, "users", 'profiles'), user, { merge: true });
}

export async function setUserWisdomCount(userId, count) {
    return await setDoc(doc(db, "users", `${userId}`), { count });
}

export async function getUserWisdomCount(userId) {
    const docSnap = await getDoc(doc(db, "users", `${userId}`));
    if (docSnap.exists()) {
        return docSnap.data()
        console.log("Got wisdom count for :", userId, docSnap.data());
    } else {
        // doc.data() will be undefined in this case
        return { count: 0 }
        console.log("No such wisdom count for", userId);
    }
}

export async function setGrate(grate, userId) {
    return await addDoc(collection(db, "grates"), grate);
}

export async function getGrate(userId) {
    const q = query(collection(db, "grates"), where("userId", "==", userId));

    const qSnap = await getDocs(q)

    console.log('qSnap', qSnap);
    let docs = [];
    qSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        docs.push(doc.data());
    });
    return docs;
}

export async function getGratesCount(userId) {
    const grates = await getGrate(userId)
    return grates.length
}