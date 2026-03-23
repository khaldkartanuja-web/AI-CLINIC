const db = require('./backend/db');

async function dump() {
    console.log("==========================================");
    console.log("🏢 REAL BACKEND DATABASE DUMP 🏢");
    console.log("==========================================");

    const getRows = (query) => new Promise((resolve) => {
        db.all(query, (err, rows) => resolve(rows || []));
    });

    const patients = await getRows("SELECT * FROM patients");
    const appts = await getRows("SELECT * FROM appointments");
    const docs = await getRows("SELECT * FROM doctors");
    const messages = await getRows("SELECT * FROM messages ORDER BY id DESC LIMIT 5");

    console.log(`\n🏥 PATIENTS (${patients.length})`);
    console.table(patients);

    console.log(`\n📅 APPOINTMENTS (${appts.length})`);
    console.table(appts);

    console.log(`\n🩺 DOCTORS (${docs.length})`);
    console.table(docs);

    console.log(`\n💬 RECENT MESSAGES (${messages.length})`);
    console.table(messages);

    process.exit(0);
}

dump();
