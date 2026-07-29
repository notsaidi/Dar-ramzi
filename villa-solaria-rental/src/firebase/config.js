import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  query, 
  orderBy, 
  serverTimestamp,
  where
} from 'firebase/firestore';

// ===================================================
// YOUR REAL DAR RAMZI FIREBASE PROJECT CREDENTIALS
// Project: dar-ramzi (Firebase Console)
// ===================================================
export const firebaseConfig = {
  apiKey: "AIzaSyDkgcOW2przepoZgmJmiBE6oEunfxUpjMQ",
  authDomain: "dar-ramzi.firebaseapp.com",
  projectId: "dar-ramzi",
  storageBucket: "dar-ramzi.firebasestorage.app",
  messagingSenderId: "403661695022",
  appId: "1:403661695022:web:953b01deacfb8a0ae717bf",
  measurementId: "G-T75W6F1B7S"
};

// Initialize Firebase App (safe multi-call guard)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const isLiveFirebase = true;

const LOCAL_BOOKINGS_KEY = 'dar_ramzi_reservations_v4';
export const OWNER_EMAIL = 'saidi.anas0806@gmail.com';

// ===================================================
// DATE HELPERS — Today to 1 Month Ahead Window
// ===================================================
export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const getOneMonthAheadStr = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
};

export const isDateInBookingWindow = (dateStr) => {
  const today = getTodayStr();
  const limit = getOneMonthAheadStr();
  return dateStr >= today && dateStr <= limit;
};

// ===================================================
// EMAIL DISPATCH to saidi.anas0806@gmail.com
// ===================================================
export const sendEmailToOwner = (bookingData) => {
  try {
    const formData = new FormData();
    formData.append('email', bookingData.guestEmail);
    formData.append('_replyto', bookingData.guestEmail);
    formData.append('subject', `🏠 New Reservation Request – Dar Ramzi (${bookingData.villaName})`);
    formData.append('message', `
NEW RESERVATION REQUEST — DAR RAMZI ESTATE
==============================================
House Requested : ${bookingData.villaName}
Booking Ref     : ${bookingData.id}

GUEST DETAILS:
  Name    : ${bookingData.guestName}
  Email   : ${bookingData.guestEmail}
  Phone   : ${bookingData.guestPhone || 'Not provided'}

STAY DATES (12:00 PM Midday → 12:00 PM Midday):
  Check-in  : ${bookingData.checkInDate} at 12:00 PM
  Check-out : ${bookingData.checkOutDate} at 12:00 PM
  Nights    : ${bookingData.nights} Night(s)
  Total     : ${bookingData.totalPrice} DT

SPECIAL REQUESTS:
  ${bookingData.specialNotes || 'None'}

----------------------------------------------
→ Log in to your Host Admin Panel to ACCEPT or DECLINE:
  http://localhost:5174/admin
    `);

    fetch('https://formspree.io/f/xovjqaqz', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).catch(() => {});
  } catch (err) {
    console.warn('Email dispatch error:', err);
  }
};

// ===================================================
// SAVE BOOKING → Firestore (primary) + LocalStorage (fallback)
// ===================================================
export const saveBooking = async (bookingData) => {
  const payload = {
    ...bookingData,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    checkInTime: '12:00 PM (Midday)',
    checkOutTime: '12:00 PM (Midday)',
    ownerEmailNotified: OWNER_EMAIL
  };

  let resultBookingId = 'DR-' + Math.floor(100000 + Math.random() * 900000);
  let savedToFirestore = false;

  // Try Firestore first (with 4s timeout so UI never hangs)
  try {
    const firestorePromise = addDoc(collection(db, 'bookings'), {
      ...payload,
      timestamp: serverTimestamp()
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 4000)
    );
    const docRef = await Promise.race([firestorePromise, timeoutPromise]);
    resultBookingId = docRef.id;
    savedToFirestore = true;
    console.log('✅ Booking saved to Firestore:', resultBookingId);
  } catch (err) {
    console.warn('⚠️ Firestore save failed, using local fallback:', err.message);
  }

  // Always also save locally for instant Admin Panel reactivity
  const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  const newBooking = { ...payload, id: resultBookingId, isFirestore: savedToFirestore };
  existing.unshift(newBooking);
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(existing));

  // Fire email notification
  sendEmailToOwner(newBooking);

  return { success: true, bookingId: resultBookingId, booking: newBooking };
};

// ===================================================
// FETCH BOOKINGS — From today to 1 month ahead only
// ===================================================
export const fetchBookings = async () => {
  const today = getTodayStr();
  const oneMonthAhead = getOneMonthAheadStr();

  // Try Firestore — query bookings where checkInDate is within the window
  try {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const bookingsList = [];
    querySnapshot.forEach((d) => {
      const data = d.data();
      // Filter to only show bookings with check-in dates from today → 1 month ahead
      if (data.checkInDate && data.checkInDate >= today && data.checkInDate <= oneMonthAhead) {
        bookingsList.push({ id: d.id, ...data });
      }
    });
    
    // Sync Firestore data to local storage
    if (bookingsList.length > 0) {
      const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
      const firestoreIds = new Set(bookingsList.map(b => b.id));
      const localOnly = existing.filter(b => !firestoreIds.has(b.id));
      const merged = [...bookingsList, ...localOnly];
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('⚠️ Firestore read error, using local store:', err.message);
  }

  // LocalStorage fallback — also filter by date window
  const local = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  return local.filter(b => !b.checkInDate || (b.checkInDate >= today && b.checkInDate <= oneMonthAhead));
};

// ===================================================
// ADMIN: Accept or Decline a Booking
// ===================================================
export const updateBookingStatus = async (bookingId, newStatus) => {
  const updatedAt = new Date().toISOString();

  // Update in Firestore
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { status: newStatus, updatedAt });
    console.log(`✅ Booking ${bookingId} status updated to "${newStatus}" in Firestore.`);
  } catch (err) {
    console.warn('⚠️ Firestore status update failed, updating local only:', err.message);
  }

  // Always update in localStorage too
  const existing = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  const updated = existing.map(item =>
    item.id === bookingId ? { ...item, status: newStatus, updatedAt } : item
  );
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));

  return { success: true };
};

// ===================================================
// CALENDAR: Get Booked Date Ranges for a House
// ===================================================
export const getBookedDateRanges = async (houseId = null) => {
  const allBookings = await fetchBookings();
  const activeBookings = allBookings.filter(b => b.status === 'Accepted' || b.status === 'Confirmed');
  if (houseId) {
    return activeBookings.filter(b => b.villaId === houseId);
  }
  return activeBookings;
};
