// src/firebase/config.js

// 필요한 Firebase SDK 함수들을 import 합니다.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth"; // GoogleAuthProvider 추가

// 제공해주신 Firebase 프로젝트 설정 정보입니다.
const firebaseConfig = {
  apiKey: "AIzaSyCG5NOdSjAzy3J1-KEv_LVjOxo-OvgqlFs",
  authDomain: "sage-of-walk.firebaseapp.com",
  projectId: "sage-of-walk",
  storageBucket: "sage-of-walk.appspot.com", // 'firebasestorage'가 아닌 'appspot.com'을 사용하는 것이 일반적입니다. 혹시 오류가 발생하면 원래대로 돌려놓으세요.
  messagingSenderId: "9083066396",
  appId: "1:9083066396:web:bf06907f4061502b89a7d9",
  measurementId: "G-QC6HM6W4T3"
};
;
// export const db = getFirestore(app);
// Firebase 앱을 초기화합니다. 이 작업은 프로젝트에서 단 한 번만 수행합니다.
const app = initializeApp(firebaseConfig);

// 초기화된 앱을 사용하여 다른 Firebase 서비스를 가져옵니다.
// 우리 프로젝트에서는 '인증' 기능을 사용하므로 getAuth를 호출합니다.
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// '분석' 기능도 초기화합니다.
// 이렇게 초기화만 해두면 기본적인 페이지 뷰 등의 이벤트가 자동으로 수집됩니다.
export const analytics = getAnalytics(app);
export { auth, db }; // db 내보내기

// 나중에 Firestore(데이터베이스)나 Storage(파일 저장소)를 사용하게 되면
// 아래와 같이 추가할 수 있습니다.
// import { getFirestore } from "firebase/firestore"