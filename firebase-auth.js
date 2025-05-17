import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1spNFnTnxRio9jfmJY6uuIXP3T_PrjIA",
  authDomain: "project-3530121166088789122.firebaseapp.com",
  projectId: "project-3530121166088789122",
  storageBucket: "project-3530121166088789122.firebasestorage.app",
  messagingSenderId: "1054087041587",
  appId: "1:1054087041587:web:663ec31408992d5a25c946"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signUp = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("회원가입 성공!");
  } catch (e) {
    alert(e.message);
  }
};

window.signUpAdmin = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  if (!email || !password) {
    alert("이메일과 비밀번호를 입력하세요.");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "admins", email), { createdAt: serverTimestamp() });
    alert("어드민 계정 생성 성공!");
  } catch (e) {
    alert("어드민 계정 생성 실패: " + e.message);
  }
};

window.logIn = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
};

window.logOut = async function () {
  await signOut(auth);
};

async function logVisitTime(email) {
  try {
    await addDoc(collection(db, "visits"), {
      email,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error(e);
  }
}

onAuthStateChanged(auth, async (user) => {
  const userInfo = document.getElementById("user-info");
  const logoutBtn = document.getElementById("logout-btn");
  if (user) {
    if (userInfo) userInfo.textContent = `로그인 성공: ${user.email}`;
    if (logoutBtn) logoutBtn.classList.remove("d-none");
    await logVisitTime(user.email);
  } else {
    if (userInfo) userInfo.textContent = "";
    if (logoutBtn) logoutBtn.classList.add("d-none");
  }
});
