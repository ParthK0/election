const { onRequest, onCall } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

exports.getQuizLeaderboard = onCall(async (request) => {
  try {
    const snapshot = await admin.firestore().collection('quizScores')
      .orderBy('score', 'desc')
      .limit(10)
      .get();
    const leaderboard = snapshot.docs.map(doc => doc.data());
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new admin.https.HttpsError('internal', 'Unable to fetch leaderboard.');
  }
});

exports.onQuizScoreCreated = onDocumentCreated('quizScores/{id}', (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  console.log(`New quiz score: ${data.score} for country ${data.country} by difficulty ${data.difficulty}`);
  return null;
});
