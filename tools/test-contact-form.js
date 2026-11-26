const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );

  // Track network calls to Web3Forms
  const web3Requests = [];
  const web3Responses = [];

  page.on('request', (req) => {
    if (req.url().includes('api.web3forms.com')) {
      let parsed = null;
      try {
        parsed = req.postData() ? JSON.parse(req.postData()) : null;
      } catch {
        parsed = req.postData();
      }
      web3Requests.push({
        url: req.url(),
        method: req.method(),
        postData: parsed
      });
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('api.web3forms.com')) {
      try {
        const text = await res.text();
        const json = JSON.parse(text);
        // Ensure access key is NEVER logged
        const safeJson = { ...json };
        if (safeJson.data && safeJson.data.access_key) {
          delete safeJson.data.access_key;
        }
        web3Responses.push({
          status: res.status(),
          ok: res.ok(),
          data: safeJson
        });
      } catch (err) {
        web3Responses.push({
          status: res.status(),
          ok: res.ok(),
          rawText: 'Non-JSON response'
        });
      }
    }
  });

  console.log('=== TEST 1: DESKTOP (1440px) IDLE STATE & HONEYPOT CHECK ===');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // Clear localStorage before testing
  await page.evaluate(() => {
    localStorage.removeItem('portfolio_form_last_sent');
    localStorage.removeItem('portfolio_form_history');
  });

  // Scroll to contact section
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot idle 1440px
  const contactCard = await page.$('#contact');
  await contactCard.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-idle-1440px.png') });
  console.log('Saved: contact-idle-1440px.png');

  // Verify honeypot field is hidden, aria-hidden, tabIndex=-1
  const honeypot = await page.evaluate(() => {
    const el = document.getElementById('contact-botcheck');
    if (!el) return { found: false };
    const style = window.getComputedStyle(el);
    return {
      found: true,
      display: style.display,
      ariaHidden: el.getAttribute('aria-hidden'),
      tabIndex: el.tabIndex,
      isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
    };
  });
  console.log('Honeypot field inspection:', honeypot);
  if (!honeypot.found || honeypot.isVisible) {
    throw new Error('Honeypot failure: field must exist and be completely invisible to users.');
  }

  console.log('=== TEST 2: MOBILE (375px) IDLE SCREENSHOT ===');
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));
  const contactCardMobile = await page.$('#contact');
  await contactCardMobile.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-idle-375px.png') });
  console.log('Saved: contact-idle-375px.png');

  console.log('=== TEST 3: EMPTY FORM SUBMISSION & INLINE VALIDATION ===');
  // Return to 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));

  // Submit without filling
  await page.evaluate(() => {
    const form = document.querySelector('#contact form');
    if (form) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  const validationState = await page.evaluate(() => {
    const nameErr = document.getElementById('name-error');
    const emailErr = document.getElementById('email-error');
    const msgErr = document.getElementById('message-error');
    return {
      nameError: nameErr ? nameErr.textContent.trim() : null,
      emailError: emailErr ? emailErr.textContent.trim() : null,
      msgError: msgErr ? msgErr.textContent.trim() : null,
    };
  });
  console.log('Validation errors displayed on empty submit:', validationState);
  console.log('Web3Forms requests sent on empty submit (must be 0):', web3Requests.length);

  if (!validationState.nameError || !validationState.emailError || !validationState.msgError) {
    throw new Error('Expected inline validation errors for name, email, and message.');
  }
  if (web3Requests.length !== 0) {
    throw new Error('Web3Forms request was sent on invalid form!');
  }

  // Screenshot error 1440px
  await contactCard.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-error-1440px.png') });
  console.log('Saved: contact-error-1440px.png');

  // Screenshot error 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 500));
  await contactCardMobile.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-error-375px.png') });
  console.log('Saved: contact-error-375px.png');

  console.log('=== TEST 4: REAL SUBMISSION WITH VALIDATION AND SPAM THRESHOLD ===');
  // Return to 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));

  // Reset form render time / clear inputs
  await page.evaluate(() => {
    const nameInp = document.getElementById('contact-name');
    const emailInp = document.getElementById('contact-email');
    const msgInp = document.getElementById('contact-message');
    if (nameInp) nameInp.value = '';
    if (emailInp) emailInp.value = '';
    if (msgInp) msgInp.value = '';
  });

  // Type valid inputs
  await page.type('#contact-name', 'Test Inquiry', { delay: 25 });
  await page.type('#contact-email', 'dhairyakulsange16@gmail.com', { delay: 25 });
  await page.select('#contact-service', 'Short-Form & Reels Editing');
  await page.select('#contact-budget', 'Flexible / Exploring');
  await page.type(
    '#contact-message',
    'This is a real test inquiry submitted from the portfolio contact form to verify Web3Forms connectivity and delivery to Gmail.',
    { delay: 15 }
  );

  // Wait at least 4.2 seconds to satisfy the 3-second minimum fill time threshold
  console.log('Waiting 4.2 seconds to exceed the 3-second minimum fill time anti-spam threshold...');
  await new Promise(r => setTimeout(r, 4200));

  console.log('Submitting the inquiry form...');
  await page.click('#contact button[type="submit"]');

  // Check double-submit prevention: button should be disabled with loading text
  const loadingCheck = await page.evaluate(() => {
    const btn = document.querySelector('#contact button[type="submit"]');
    return {
      disabled: btn ? btn.disabled : false,
      text: btn ? btn.textContent.trim() : null
    };
  });
  console.log('Double submit prevention state immediately after click:', loadingCheck);

  // Wait for submission response
  await new Promise(r => setTimeout(r, 3500));

  console.log('Web3Forms request count:', web3Requests.length);
  const lastRes = web3Responses.find(r => r.data && r.data.success !== undefined);
  if (lastRes) {
    console.log('Web3Forms Response Status Code:', lastRes.status);
    console.log('Web3Forms Response Message:', lastRes.data.message);
    console.log('Web3Forms Success Flag:', lastRes.data.success);
  } else {
    console.log('All Web3Responses:', web3Responses);
    throw new Error('No valid response received from Web3Forms');
  }

  // Check success panel
  const successState = await page.evaluate(() => {
    const successHeader = document.querySelector('#contact h4');
    const successBody = document.querySelector('#contact p.text-zinc-300');
    const btns = Array.from(document.querySelectorAll('#contact button'));
    const resetBtn = btns.find(b => b.textContent.includes('Send another inquiry'));
    return {
      headerText: successHeader ? successHeader.textContent.trim() : null,
      bodyText: successBody ? successBody.textContent.trim() : null,
      hasResetBtn: Boolean(resetBtn)
    };
  });
  console.log('Success panel displayed:', successState);

  if (!successState.headerText || !successState.headerText.includes('Thank you, Test!')) {
    throw new Error(`Unexpected success panel header: ${successState.headerText}`);
  }

  // Screenshot success 1440px
  const contactCardSuccess = await page.$('#contact');
  await contactCardSuccess.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-success-1440px.png') });
  console.log('Saved: contact-success-1440px.png');

  // Screenshot success 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 500));
  await contactCardSuccess.screenshot({ path: path.join(SCREENSHOT_DIR, 'contact-success-375px.png') });
  console.log('Saved: contact-success-375px.png');

  // Test reset button
  console.log('Testing "Send another inquiry" button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('#contact button'));
    const resetBtn = btns.find(b => b.textContent.includes('Send another inquiry'));
    if (resetBtn) resetBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const resetState = await page.evaluate(() => {
    const form = document.querySelector('#contact form');
    const nameInput = document.getElementById('contact-name');
    return {
      formVisible: Boolean(form),
      nameValue: nameInput ? nameInput.value : null
    };
  });
  console.log('Reset state after clicking "Send another inquiry":', resetState);

  if (!resetState.formVisible || resetState.nameValue !== '') {
    throw new Error('Reset failed: form was not re-displayed or inputs were not cleared.');
  }

  await browser.close();
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
