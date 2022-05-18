import admin from 'firebase-admin';
import { resolve } from 'path';

admin.initializeApp({
  credential: admin.credential.cert(
    require(resolve(__dirname, '../firebase/hyunwoo-bot-5b9111af24ff.json'))
  ),
});

export const firestore = admin.firestore();
