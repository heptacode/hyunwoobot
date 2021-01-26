import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(require("../../firebase/hyunwoo-bot-5b9111af24ff.json")),
});

export const firestore = admin.firestore();
