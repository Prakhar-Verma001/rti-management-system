process.env.PORT = process.env.PORT || '4001';
const fetch = global.fetch || (await import('node-fetch')).default;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  try {
    // start the server (imports and runs startServer in index.js)
    await import('./index.js');

    const base = `http://localhost:${process.env.PORT}/api/rti`;

    // wait for server to be ready
    await delay(1500);

    console.log('Running smoke tests against', base);

    // 1. GET list
    let res = await fetch(base);
    console.log('GET /api/rti status', res.status);
    let list = await res.json();
    console.log('List length:', Array.isArray(list) ? list.length : typeof list);

    // 2. POST create
    const payload = {
      applicantName: 'Smoke Test Applicant',
      applicantMobile: '0000000000',
      applicantEmail: 'smoke@example.com',
      rtiNo: 'SMOKE001',
      subject: 'Smoke test',
      dateOfReceipt: new Date().toISOString(),
      status: 'Open',
      departmentName: 'QA Department',
      assignedOfficer: 'Officer A',
      timeline: [],
      uploads: []
    };

    res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('POST /api/rti status', res.status);
    const created = await res.json();
    console.log('Created:', created && created.id ? created.id : created);

    const id = created && created.id;
    if (!id) {
      console.error('Create failed; aborting smoke test');
      process.exit(2);
    }

    // 3. GET by id
    res = await fetch(`${base}/${id}`);
    console.log(`GET /api/rti/${id} status`, res.status);
    const item = await res.json();
    console.log('Fetched item rtiNo:', item.rtiNo || item);

    // 4. PUT update
    const updatedPayload = { ...item, status: 'Closed', subject: 'Updated by smoke' };
    res = await fetch(`${base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });
    console.log(`PUT /api/rti/${id} status`, res.status);
    const updated = await res.json();
    console.log('Updated status:', updated.status || updated);

    // 5. DELETE
    res = await fetch(`${base}/${id}`, { method: 'DELETE' });
    console.log(`DELETE /api/rti/${id} status`, res.status);
    const del = await res.json();
    console.log('Delete response:', del);

    console.log('Smoke tests completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exit(1);
  }
})();
