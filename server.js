const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const PRICE_SCIP = process.env.STRIPE_PRICE_SCIP_ONE || '';
const PRICE_PRO  = process.env.STRIPE_PRICE_PRO_MONTH || '';

// Raw body for webhooks BEFORE json parser
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/pricing', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pricing.html')));

app.get('/stripe/config', (req, res) => res.json({ publishableKey: STRIPE_PUBLISHABLE_KEY }));

app.post('/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceType, email, successUrl, cancelUrl } = req.body;
    let priceId, mode;
    if (priceType === 'scip_one') { priceId = PRICE_SCIP; mode = 'payment'; }
    else if (priceType === 'pro_monthly') { priceId = PRICE_PRO; mode = 'subscription'; }
    else return res.status(400).json({ error: 'Invalid price type' });
    if (!priceId) return res.status(500).json({ error: 'Price not configured in Railway env vars' });
    const params = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl || (req.headers.origin + '/app?scip_paid=1'),
      cancel_url: cancelUrl || (req.headers.origin + '/pricing'),
      metadata: { priceType }
    };
    if (email) params.customer_email = email;
    const session = await stripe.checkout.sessions.create(params);
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/stripe/webhook', (req, res) => {
  let event;
  try {
    event = WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], WEBHOOK_SECRET)
      : JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).send('Webhook Error: ' + err.message);
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    console.log('Payment complete:', s.metadata && s.metadata.priceType, s.customer_email);
  }
  res.json({ received: true });
});

app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.listen(PORT, () => console.log('SkyWave SARF Maps running on port ' + PORT));
