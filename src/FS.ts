import * as admin from "firebase-admin";

const serviceAccount = require("../firebase/hyunwoo-bot-5b9111af24ff.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin.firestore();
