// firebase-user.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {
  constructor(private firestore: Firestore) {}

  async getUserById(uid: string): Promise<User | null> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      const snapshot = await getDoc(userDoc);
      return snapshot.exists() ? (snapshot.data() as User) : null;
    } catch (error) {
      console.error('Hiba a user lekérésekor:', error);
      return null;
    }
  }

  async createUser(user: User): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', user.id);
      await setDoc(userDoc, user);
    } catch (error) {
      console.error('Hiba a user létrehozásakor:', error);
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', user.id);
      await updateDoc(userDoc, user as any);
    } catch (error) {
      console.error('Hiba a user frissítésekor:', error);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Hiba a user törlésekor:', error);
    }
  }
}
