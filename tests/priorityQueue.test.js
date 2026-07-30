// ============================================================
// WeatherIQ — Member 4: Smart Weather Alerts
// File: tests/priorityQueue.test.js
// ============================================================
// PURPOSE:
//   Unit tests for the MinHeapPriorityQueue implementation.
//   Run with:  node tests/priorityQueue.test.js
//
// TESTS COVERED:
//   1. Insertion     — push() increases size; items are stored correctly
//   2. Extraction    — pop() returns the highest-priority item first
//   3. Priority Order— mixed-order insertions produce correct pop() sequence
//   4. Empty Heap    — pop() and peek() on empty heap return null safely
//   5. Duplicate Priorities — same-priority items are both retained and returned
//
// NOTE: This file uses Node.js's built-in assert module (no
//       third-party testing library required).
// ============================================================

'use strict';

const assert = require('assert');
const MinHeapPriorityQueue = require('../src/utils/priorityQueue');

// ============================================================
// HELPER — Creates a mock alert object
// ============================================================
/**
 * @param {string} severity   - 'Critical' | 'High' | 'Medium' | 'Low'
 * @param {number} priority   - Numeric: 1=Critical, 2=High, 3=Medium, 4=Low
 * @param {string} [label]    - Optional label for easy identification in output
 * @param {number} [msOffset] - Millisecond offset from epoch for created_at tie-breaking
 */
function makeAlert(severity, priority, label = '', msOffset = 0) {
    return {
        alert_id    : Math.floor(Math.random() * 10000),
        alert_type  : label || severity,
        severity,
        priority,
        title       : `${severity} Alert — ${label}`,
        created_at  : new Date(Date.now() + msOffset).toISOString(),
        location_id : 1,
    };
}

// ============================================================
// TEST RUNNER — lightweight test harness using assert
// ============================================================
let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`  ✅  PASS — ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ❌  FAIL — ${name}`);
        console.error(`          Expected: ${err.expected}`);
        console.error(`          Actual  : ${err.actual}`);
        console.error(`          ${err.message}`);
        failed++;
    }
}

// ============================================================
// TEST SUITE 1: Insertion
// Verifies that push() correctly stores items and updates size().
// ============================================================
console.log('\n🧪  TEST SUITE 1: Insertion\n');

runTest('Empty heap has size 0', () => {
    const pq = new MinHeapPriorityQueue();
    assert.strictEqual(pq.size(), 0);
});

runTest('isEmpty() returns true on empty heap', () => {
    const pq = new MinHeapPriorityQueue();
    assert.strictEqual(pq.isEmpty(), true);
});

runTest('After pushing 1 item, size is 1 and isEmpty is false', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('High', 2, 'A'));
    assert.strictEqual(pq.size(), 1);
    assert.strictEqual(pq.isEmpty(), false);
});

runTest('After pushing 3 items, size is 3', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Low',    4, 'A'));
    pq.push(makeAlert('High',   2, 'B'));
    pq.push(makeAlert('Medium', 3, 'C'));
    assert.strictEqual(pq.size(), 3);
});

runTest('peek() returns the root without removing it', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('High',     2, 'A'));
    pq.push(makeAlert('Critical', 1, 'B'));
    const root = pq.peek();
    assert.strictEqual(root.priority, 1,         'Root should be Critical (priority 1)');
    assert.strictEqual(pq.size(),     2,         'Size should still be 2 after peek()');
});

// ============================================================
// TEST SUITE 2: Extraction
// Verifies that pop() returns the root and restores heap order.
// ============================================================
console.log('\n🧪  TEST SUITE 2: Extraction\n');

runTest('pop() on heap with 1 element returns that element', () => {
    const pq   = new MinHeapPriorityQueue();
    const item = makeAlert('Medium', 3, 'Solo');
    pq.push(item);
    const popped = pq.pop();
    assert.strictEqual(popped.alert_type, 'Solo');
    assert.strictEqual(pq.size(),         0);
});

runTest('pop() on heap with 2 elements returns higher-priority first', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Low',  4, 'Second'));  // pushed first
    pq.push(makeAlert('High', 2, 'First'));   // pushed second
    const first  = pq.pop();
    const second = pq.pop();
    assert.strictEqual(first.priority,  2, 'First pop should be High (priority 2)');
    assert.strictEqual(second.priority, 4, 'Second pop should be Low (priority 4)');
});

runTest('pop() decrements size correctly', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('High',   2, 'A'));
    pq.push(makeAlert('Medium', 3, 'B'));
    pq.push(makeAlert('Low',    4, 'C'));
    pq.pop();
    assert.strictEqual(pq.size(), 2);
    pq.pop();
    assert.strictEqual(pq.size(), 1);
    pq.pop();
    assert.strictEqual(pq.size(), 0);
});

// ============================================================
// TEST SUITE 3: Priority Ordering
// Pushes alerts in non-priority order; verifies correct pop sequence.
// ============================================================
console.log('\n🧪  TEST SUITE 3: Priority Ordering\n');

runTest('Pushing Low → High → Critical → Medium; pops in Critical → High → Medium → Low order', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Low',      4, 'D-Low'));
    pq.push(makeAlert('High',     2, 'B-High'));
    pq.push(makeAlert('Critical', 1, 'A-Critical'));
    pq.push(makeAlert('Medium',   3, 'C-Medium'));

    const order = pq.popAll().map(a => a.severity);
    assert.deepStrictEqual(order, ['Critical', 'High', 'Medium', 'Low'],
        `Expected [Critical, High, Medium, Low] but got [${order.join(', ')}]`);
});

runTest('Pushing all 4 levels in reverse order still produces correct sort', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Low',      4, 'Low'));
    pq.push(makeAlert('Medium',   3, 'Medium'));
    pq.push(makeAlert('High',     2, 'High'));
    pq.push(makeAlert('Critical', 1, 'Critical'));

    const pops = [];
    while (!pq.isEmpty()) pops.push(pq.pop().severity);
    assert.deepStrictEqual(pops, ['Critical', 'High', 'Medium', 'Low']);
});

runTest('popAll() returns sorted array and leaves heap empty', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Medium',   3, 'C'));
    pq.push(makeAlert('Critical', 1, 'A'));
    pq.push(makeAlert('Low',      4, 'D'));
    pq.push(makeAlert('High',     2, 'B'));

    const sorted = pq.popAll();
    assert.strictEqual(sorted.length, 4,   'popAll() should return 4 items');
    assert.strictEqual(pq.isEmpty(), true,  'Heap should be empty after popAll()');
    assert.strictEqual(sorted[0].severity, 'Critical');
    assert.strictEqual(sorted[3].severity, 'Low');
});

// ============================================================
// TEST SUITE 4: Empty Heap Handling
// ============================================================
console.log('\n🧪  TEST SUITE 4: Empty Heap Handling\n');

runTest('pop() on empty heap returns null (does not throw)', () => {
    const pq = new MinHeapPriorityQueue();
    const result = pq.pop();
    assert.strictEqual(result, null);
});

runTest('peek() on empty heap returns null (does not throw)', () => {
    const pq = new MinHeapPriorityQueue();
    const result = pq.peek();
    assert.strictEqual(result, null);
});

runTest('popAll() on empty heap returns empty array', () => {
    const pq = new MinHeapPriorityQueue();
    const result = pq.popAll();
    assert.deepStrictEqual(result, []);
});

runTest('Multiple pop() calls on empty heap never throw', () => {
    const pq = new MinHeapPriorityQueue();
    assert.doesNotThrow(() => { pq.pop(); pq.pop(); pq.pop(); });
});

// ============================================================
// TEST SUITE 5: Duplicate Priorities
// Two or more alerts with the same priority — heap must retain all
// and return them without data loss (tie-broken by created_at).
// ============================================================
console.log('\n🧪  TEST SUITE 5: Duplicate Priorities\n');

runTest('Two alerts with the same priority — both are returned', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('High', 2, 'High-A', 0));
    pq.push(makeAlert('High', 2, 'High-B', 1000)); // 1 second later
    assert.strictEqual(pq.size(), 2);

    const first  = pq.pop();
    const second = pq.pop();

    // Both should be returned (neither is lost)
    assert.ok(first  !== null, 'First pop should not be null');
    assert.ok(second !== null, 'Second pop should not be null');

    // Both should have priority 2
    assert.strictEqual(first.priority,  2);
    assert.strictEqual(second.priority, 2);

    // The EARLIER timestamp should come first (tie-breaker)
    assert.strictEqual(first.alert_type, 'High-A', 'Earlier High-A should pop first');
    assert.strictEqual(second.alert_type, 'High-B');
});

runTest('Three alerts: 2 Critical + 1 High — both Criticals surface before High', () => {
    const pq = new MinHeapPriorityQueue();
    pq.push(makeAlert('Critical', 1, 'Crit-A', 0));
    pq.push(makeAlert('High',     2, 'High-X', 500));
    pq.push(makeAlert('Critical', 1, 'Crit-B', 1000));

    const first  = pq.pop();
    const second = pq.pop();
    const third  = pq.pop();

    assert.strictEqual(first.priority,  1, '1st pop must be Critical');
    assert.strictEqual(second.priority, 1, '2nd pop must be Critical');
    assert.strictEqual(third.priority,  2, '3rd pop must be High');
});

runTest('All same-priority alerts — all returned, none lost', () => {
    const pq = new MinHeapPriorityQueue();
    const count = 5;
    for (let i = 0; i < count; i++) {
        pq.push(makeAlert('Medium', 3, `Alert-${i}`, i * 100));
    }
    const all = pq.popAll();
    assert.strictEqual(all.length, count, `All ${count} alerts should be returned`);
    // All should have priority 3
    for (const a of all) {
        assert.strictEqual(a.priority, 3);
    }
});

// ============================================================
// RESULTS SUMMARY
// ============================================================
console.log('\n' + '='.repeat(50));
console.log(`  Results: ${passed} passed, ${failed} failed  (${passed + failed} total)`);
console.log('='.repeat(50) + '\n');

if (failed > 0) {
    console.error('❌  Some tests failed. Review errors above.');
    process.exit(1);
} else {
    console.log('✅  All tests passed!\n');
    process.exit(0);
}
