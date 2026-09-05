const fs = require('fs');
const path = require('path');

async function testRandomModules() {
  console.log('=== STATSKILL AI: 10 RANDOM MODULE SELECTION & SEARCH QA ===\n');

  const catalogPath = path.join(__dirname, 'backend/src/data/courses_catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  console.log(`Total verified courses in database: ${catalog.length}`);

  // Pick 10 random indices spread evenly across the catalog
  const step = Math.floor(catalog.length / 10);
  const sampleIndices = Array.from({ length: 10 }, (_, i) => (i * step + Math.floor(Math.random() * (step - 5))) % catalog.length);
  const selectedSamples = sampleIndices.map((idx) => catalog[idx]);

  const results = [];

  for (let i = 0; i < selectedSamples.length; i++) {
    const course = selectedSamples[i];
    console.log(`\n[Test ${i + 1}/10] Testing: "${course.title}"`);
    console.log(`  -> Domain: ${course.domain || 'General'}`);
    console.log(`  -> Provider: ${course.provider || 'iGOT / Government of India'}`);

    // Create a meaningful search token from the course title (first 2-3 significant words)
    const searchTokens = course.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['Course', 'Module', 'Training', 'Part'].includes(w));
    
    const query = searchTokens.length > 0 ? searchTokens[0] : course.title.slice(0, 15);

    try {
      // 1. Search Query Test
      const searchRes = await fetch(`http://localhost:5000/api/courses/search?q=${encodeURIComponent(query)}`);
      if (!searchRes.ok) throw new Error(`Search HTTP ${searchRes.status}`);
      const searchData = await searchRes.json();

      const foundInSearch = searchData.courses?.some((c) => c.id === course.id || c.title.toLowerCase().includes(query.toLowerCase()));

      // 2. Selection & Assessment Context Test
      const quizInitRes = await fetch(`http://localhost:5000/api/quiz/generate-async?mode=POTATO_DEVICE`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.title,
          numQuestions: 2,
          difficulty: 'intermediate',
        }),
      });

      if (!quizInitRes.ok) throw new Error(`Quiz Init HTTP ${quizInitRes.status}`);
      const initData = await quizInitRes.json();

      let quizReady = false;
      let questionsCount = 0;
      for (let p = 0; p < 8; p++) {
        await new Promise((r) => setTimeout(r, 400));
        const statusRes = await fetch(`http://localhost:5000/api/quiz/status/${initData.jobId}`);
        const statusData = await statusRes.json();
        if (statusData.status === 'complete') {
          quizReady = true;
          questionsCount = statusData.result?.questions?.length || 0;
          break;
        }
      }

      const passed = foundInSearch && quizReady && questionsCount > 0;
      console.log(`  -> Search Results Found: ${searchData.courses?.length || 0}`);
      console.log(`  -> Quiz Generation with Course Context: ${quizReady ? 'SUCCESS (' + questionsCount + ' items)' : 'FAILED'}`);
      console.log(`  -> Status: ${passed ? 'PASSED' : 'FLAGGED'}`);

      results.push({
        testNum: i + 1,
        title: course.title,
        domain: course.domain,
        queryUsed: query,
        searchCount: searchData.courses?.length || 0,
        quizReady,
        passed,
      });
    } catch (err) {
      console.error(`  -> ERROR: ${err.message}`);
      results.push({
        testNum: i + 1,
        title: course.title,
        domain: course.domain,
        queryUsed: query,
        searchCount: 0,
        quizReady: false,
        passed: false,
        error: err.message,
      });
    }
  }

  console.log('\n========================================================================================');
  console.log('                            10 RANDOM MODULE SELECTION RESULTS                          ');
  console.log('========================================================================================');
  console.table(
    results.map((r) => ({
      '#': r.testNum,
      'Course Title': r.title.length > 35 ? r.title.slice(0, 32) + '...' : r.title,
      'Search Token': r.queryUsed,
      'Hits': r.searchCount,
      'Quiz Bind': r.quizReady ? 'Yes' : 'No',
      'Result': r.passed ? 'PASS' : 'FAIL',
    }))
  );

  const allPassed = results.filter((r) => r.passed).length;
  console.log(`\nOverall Summary: ${allPassed}/10 random course modules successfully searched, selected, and bound to assessment engine.`);
}

testRandomModules();
