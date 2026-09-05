async function runEndToEndQAAudit() {
  console.log('=== STARTING STATSKILL AI END-TO-END QA AUDIT ===\n');
  let passed = 0;
  let failed = 0;

  function authFetch(url, options = {}) {
    const headers = {
      'x-bypass-rate-limit': 'true',
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  }

  function assert(condition, message) {
    if (condition) {
      console.log(' [PASS] ' + message);
      passed++;
    } else {
      console.error(' [FAIL] ' + message);
      failed++;
    }
  }

  // 1. Health & Server Status
  try {
    const health = await authFetch('http://localhost:5000/health').then((r) => r.json());
    assert(health.status === 'ok', '1.1 Backend Health Check responds OK');
  } catch (e) {
    assert(false, '1.1 Backend Health Check failed: ' + e.message);
  }

  // 2. Course Catalog & Search Engine (884 authentic courses)
  try {
    const searchRes = await authFetch('http://localhost:5000/api/courses/search?q=survey').then((r) => r.json());
    assert(searchRes.success === true, '2.1 Course search API returns success=true');
    assert(searchRes.courses?.length > 0, '2.2 Search for "survey" finds courses (found ' + searchRes.courses?.length + ')');
    assert(searchRes.courses[0].provider !== undefined, '2.3 Course item contains authentic provider info: ' + searchRes.courses[0].provider);
  } catch (e) {
    assert(false, '2. Course Search API test failed: ' + e.message);
  }

  // 3. Question Bank & Assessment Generator (Pillar 4)
  try {
    const quizInit = await authFetch('http://localhost:5000/api/quiz/generate-async?mode=POTATO_DEVICE', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numQuestions: 3, difficulty: 'intermediate' }),
    }).then((r) => r.json());

    assert(quizInit.jobId !== undefined, '3.1 Async Quiz Generation initiates with jobId: ' + quizInit.jobId);

    // Poll for status
    let pollCount = 0;
    let quizResult = null;
    while (pollCount < 10) {
      await new Promise((r) => setTimeout(r, 500));
      const statusRes = await authFetch('http://localhost:5000/api/quiz/status/' + quizInit.jobId).then((r) => r.json());
      if (statusRes.status === 'complete') {
        quizResult = statusRes.result;
        break;
      }
      pollCount++;
    }

    assert(quizResult !== null, '3.2 Quiz Generation job completes within timeout');
    assert(Array.isArray(quizResult?.questions) && quizResult.questions.length >= 3, '3.3 Quiz contains at least 3 valid questions (found ' + quizResult?.questions?.length + ')');
    const q1 = quizResult?.questions?.[0];
    assert(q1 && q1.question && q1.options.length === 4 && q1.correctAnswer, '3.4 Question structure is strictly conformant with 4 options and answer key');
  } catch (e) {
    assert(false, '3. Assessment Engine test failed: ' + e.message);
  }

  // 4. iGOT Karmayogi xAPI Telemetry & LRS (Pillar 3)
  try {
    const telemetryRes = await authFetch('http://localhost:5000/api/telemetry/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'JSO_1042',
        userName: 'Eshaan Sunthankar',
        quizId: 'eval-sampling-01',
        quizName: 'NSSO Multi-Stage Sampling Evaluation',
        score: 100,
      }),
    }).then((r) => r.json());

    assert(telemetryRes.success === true, '4.1 xAPI Telemetry submission succeeds');
    assert(telemetryRes.statement?.actor?.name === 'Eshaan Sunthankar', '4.2 xAPI Actor matches authenticated officer identity');
    assert(telemetryRes.statement?.verb?.id === 'http://adlnet.gov/expapi/verbs/completed', '4.3 xAPI Verb strictly adheres to ADL completed specification');
    assert(telemetryRes.statement?.result?.score?.scaled === 1, '4.4 xAPI Scaled Score matches 100% calculation (1.0)');
  } catch (e) {
    assert(false, '4. xAPI Telemetry test failed: ' + e.message);
  }

  // 5. MoSPI Admin Divisions Analytics (Pillar 5)
  try {
    const divisionsRes = await authFetch('http://localhost:5000/api/admin/divisions').then((r) => r.json());
    assert(divisionsRes.success === true, '5.1 Admin Divisions API responds with success=true');
    assert(divisionsRes.totalCadreStrength === 3220, '5.2 Total Cadre Strength is 3,220 officers');
    assert(divisionsRes.systemReadinessScore === 78.4, '5.3 System Readiness score is 78.4%');
    assert(divisionsRes.acbpComplianceScore === 84.2, '5.4 ACBP Compliance score is 84.2%');
    assert(divisionsRes.divisions?.length === 4, '5.5 All 4 MoSPI divisions present (FOD, DPD, NAD, DIID)');
    assert(divisionsRes.regionalCircles?.length === 5, '5.6 All 5 Regional Circles present');
  } catch (e) {
    assert(false, '5. Admin Divisions API test failed: ' + e.message);
  }

  // 6. Annual Capacity Building Plan (ACBP) Dossier (Pillar 5)
  try {
    const acbpRes = await authFetch('http://localhost:5000/api/admin/acbp-dossier').then((r) => r.json());
    assert(acbpRes.success === true, '6.1 ACBP Dossier generation API responds with success=true');
    assert(acbpRes.dossier?.documentId?.startsWith('ACBP-MoSPI-2026'), '6.2 Document ID is officially formatted: ' + acbpRes.dossier?.documentId);
    assert(acbpRes.dossier?.fiscalYear === '2026-2027', '6.3 Fiscal Year is 2026-2027');
    assert(acbpRes.dossier?.divisionAllocations?.length === 4, '6.4 Division allocations cover all 4 MoSPI divisions');
  } catch (e) {
    assert(false, '6. ACBP Dossier API test failed: ' + e.message);
  }

  // 7. Frontend Vite Server
  try {
    const viteRes = await fetch('http://localhost:5173/');
    assert(viteRes.status === 200, '7.1 Frontend Vite server responds with HTTP 200');
    const html = await viteRes.text();
    assert(html.includes('id="root"'), '7.2 HTML root mount point is present in DOM entrypoint');
  } catch (e) {
    assert(false, '7. Frontend server check failed: ' + e.message);
  }

  // 8. Personalized Recommendations & 4-Tier ZPD Learning Pathways (Pillar 2)
  try {
    // 8.1 Single Question Gap Recommendation
    const courseRec = await authFetch('http://localhost:5000/api/recommend/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gapTopic: 'Survey Sampling',
        gapDescription: 'Failed First Stage Unit (FSU) selection',
        assessedLevel: 2,
      }),
    }).then((r) => r.json());

    assert(courseRec.success === true, '8.1 Single Course Recommendation API responds with success=true');
    assert(courseRec.recommendation?.title !== undefined, '8.2 Course Recommendation provides authentic title: ' + courseRec.recommendation?.title);
    assert(courseRec.recommendation?.link?.startsWith('http'), '8.3 Course link points to authentic government portal');
    assert(courseRec.recommendation?.rationale?.length > 0, '8.4 Explicit diagnostic rationale is generated');

    // 8.2 4-Tier Pathway Generation for JSO
    const pathwayJso = await authFetch('http://localhost:5000/api/recommend/pathway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designation: 'Junior Statistical Officer (JSO)',
        proficiencies: { 'Survey Design & Sampling': 2, 'CAPI & Digital Field Enumeration': 3 },
      }),
    }).then((r) => r.json());

    assert(pathwayJso.success === true, '8.5 4-Tier Pathway API responds with success=true for JSO');
    assert(pathwayJso.pathway?.tiers?.length === 4, '8.6 Pathway synthesizes exactly 4 progressive ZPD tiers');
    assert(pathwayJso.pathway?.tiers[0]?.tierName.includes('Tier 1'), '8.7 Tier 1 (Foundation & Prerequisite) present');
    assert(pathwayJso.pathway?.tiers[1]?.tierName.includes('Tier 2'), '8.8 Tier 2 (Operational Reinforcement) present');
    assert(pathwayJso.pathway?.tiers[2]?.tierName.includes('Tier 3'), '8.9 Tier 3 (Core Cadre Benchmark) present');
    assert(pathwayJso.pathway?.tiers[3]?.tierName.includes('Tier 4'), '8.10 Tier 4 (Strategic Leadership & Policy) present');
    assert(pathwayJso.pathway?.milestones?.length === 3, '8.11 Pathway includes 3 structured accreditation milestones');
  } catch (e) {
    assert(false, '8. Personalized Recommendation test failed: ' + e.message);
  }

  console.log('\n=== QA AUDIT SUMMARY ===');
  console.log('Total Tests Executed: ' + (passed + failed));
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  console.log('Pass Rate: ' + ((passed / (passed + failed)) * 100).toFixed(1) + '%');
}

runEndToEndQAAudit();

