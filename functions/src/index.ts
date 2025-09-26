import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const syncHistory = functions.https.onRequest(async (req, res): Promise<void> => {
  try {
    if (req.method !== "POST") {
      res.status(405).send({ error: "Method not allowed" });
      return;
    }

    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).send({ error: "Missing or invalid Authorization header" });
      return;
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const historyItems = req.body?.history;
    if (!Array.isArray(historyItems)) {
      res.status(400).send({ error: "Invalid payload: history must be array" });
      return;
    }

    const db = admin.firestore();
    const batch = db.batch();

    historyItems.forEach((item: any) => {
      const docRef = db.collection("users").doc(uid).collection("history").doc();
      batch.set(docRef, {
        url: item.url,
        title: item.title || null,
        visitTime: item.visitTime ? new Date(item.visitTime) : null,
        fetchedAt: admin.firestore.FieldValue.serverTimestamp(),
        syncedByExtensionVersion: item.syncedByExtensionVersion || "dev",
        category: null,
      });
    });

    await batch.commit();

    res.status(200).send({
      success: true,
      count: historyItems.length,
    });
    return;
  } catch (err: any) {
    console.error("Error in /syncHistory:", err);
    res.status(500).send({ error: err.message });
    return;
  }
});
