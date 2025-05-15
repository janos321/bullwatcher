import {
  collection,
  query,
  where,
  getDocs,
  Firestore
} from '@angular/fire/firestore';
import { User } from '../model/user';

// 1. Szűrés szimbólum alapján: pl. beírsz 'BTC' -> csak olyanokat ad vissza, ahol a portfólió kulcsa tartalmazza
export async function queryBySymbolInput(
  firestore: Firestore,
  userId: string,
  symbolFilter: string
): Promise<[string, number][]> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('id', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const user = snapshot.docs[0].data() as User;

  return Object.entries(user.settings.portfolio)
    .filter(([symbol]) =>
      symbol.toLowerCase().includes(symbolFilter.toLowerCase())
    );
}

// 2. ABC szerint rendezés (növekvő/csökkenő) – radio alapján
export async function queryBySymbolABC(
  firestore: Firestore,
  userId: string,
  descending: boolean
): Promise<[string, number][]> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('id', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const user = snapshot.docs[0].data() as User;

  return Object.entries(user.settings.portfolio)
    .sort((a, b) =>
      a[0].localeCompare(b[0]) * (descending ? -1 : 1)
    );
}

// 3. Mennyiség szerinti rendezés (növekvő/csökkenő)
export async function queryBySymbolAmountOrder(
  firestore: Firestore,
  userId: string,
  descending: boolean
): Promise<[string, number][]> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('id', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const user = snapshot.docs[0].data() as User;

  return Object.entries(user.settings.portfolio)
    .sort((a, b) =>
      (a[1] - b[1]) * (descending ? -1 : 1)
    );
}

// 4. Minimum mennyiség szűrés (csak ahol amount >= minAmount)
export async function queryBySymbolMinAmount(
  firestore: Firestore,
  userId: string,
  minAmount: number
): Promise<[string, number][]> {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('id', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const user = snapshot.docs[0].data() as User;

  return Object.entries(user.settings.portfolio)
    .filter(([_, amount]) => amount >= minAmount);
}
